// Updated for TypeScript migration
import { User } from "firebase/auth";
import { UserProfile, SubscriptionPlan, PLAN_LIMITS } from "../types/user";

// In a real app, this would interact with your backend API
// For demo purposes, we'll use localStorage with the user's UID as key

export class UserService {
  private static STORAGE_PREFIX = "optimize_user_";

  // Create a new user profile when they first sign up
  static async createUserProfile(
    user: User,
    plan: SubscriptionPlan = "free",
  ): Promise<UserProfile> {
    const now = new Date();

    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || undefined,
      emailVerified: user.emailVerified,
      createdAt: now,
      lastLoginAt: now,

      subscription: {
        plan,
        status: "active",
        startDate: now,
        renewalDate:
          plan !== "free"
            ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
            : undefined, // 30 days
        cancelAtPeriodEnd: false,
        trialEndsAt:
          plan !== "free"
            ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
            : undefined, // 7 day trial
      },

      usage: {
        optimizationsToday: 0,
        totalOptimizations: 0,
        lastOptimizationDate: undefined,
        currentDayStart: now,
      },

      limits: PLAN_LIMITS[plan],
    };

    await this.saveUserProfile(userProfile);
    return userProfile;
  }

  // Get user profile by UID
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_PREFIX}${uid}`);
      if (!stored) return null;

      const profile = JSON.parse(stored);

      // Convert date strings back to Date objects
      profile.createdAt = new Date(profile.createdAt);
      profile.lastLoginAt = new Date(profile.lastLoginAt);
      profile.subscription.startDate = new Date(profile.subscription.startDate);
      if (profile.subscription.renewalDate) {
        profile.subscription.renewalDate = new Date(
          profile.subscription.renewalDate,
        );
      }
      if (profile.subscription.trialEndsAt) {
        profile.subscription.trialEndsAt = new Date(
          profile.subscription.trialEndsAt,
        );
      }
      profile.usage.currentDayStart = new Date(profile.usage.currentDayStart);
      if (profile.usage.lastOptimizationDate) {
        profile.usage.lastOptimizationDate = new Date(
          profile.usage.lastOptimizationDate,
        );
      }

      return profile;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  }

  // Save user profile
  static async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      localStorage.setItem(
        `${this.STORAGE_PREFIX}${profile.uid}`,
        JSON.stringify(profile),
      );
    } catch (error) {
      console.error("Error saving user profile:", error);
      throw error;
    }
  }

  // Update user's last login time
  static async updateLastLogin(uid: string): Promise<void> {
    const profile = await this.getUserProfile(uid);
    if (profile) {
      profile.lastLoginAt = new Date();
      await this.saveUserProfile(profile);
    }
  }

  // Change user's subscription plan
  static async changePlan(
    uid: string,
    newPlan: SubscriptionPlan,
  ): Promise<UserProfile | null> {
    const profile = await this.getUserProfile(uid);
    if (!profile) return null;

    const now = new Date();

    profile.subscription.plan = newPlan;
    profile.subscription.startDate = now;
    profile.subscription.renewalDate =
      newPlan !== "free"
        ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        : undefined;
    profile.subscription.cancelAtPeriodEnd = false;
    profile.limits = PLAN_LIMITS[newPlan];

    await this.saveUserProfile(profile);
    return profile;
  }

  // Cancel subscription (remains active until period end)
  static async cancelSubscription(uid: string): Promise<UserProfile | null> {
    const profile = await this.getUserProfile(uid);
    if (!profile) return null;

    profile.subscription.cancelAtPeriodEnd = true;

    await this.saveUserProfile(profile);
    return profile;
  }

  // Track optimization usage
  static async trackUsage(
    uid: string,
  ): Promise<{
    success: boolean;
    remainingOptimizations: number;
    error?: string;
  }> {
    const profile = await this.getUserProfile(uid);
    if (!profile) {
      return {
        success: false,
        remainingOptimizations: 0,
        error: "User profile not found",
      };
    }

    // Check if user has reached their daily limit
    const { optimizationsPerDay } = profile.limits;
    if (
      optimizationsPerDay !== -1 &&
      profile.usage.optimizationsToday >= optimizationsPerDay
    ) {
      return {
        success: false,
        remainingOptimizations: 0,
        error: `You've reached your daily limit of ${optimizationsPerDay} optimizations. Upgrade your plan for more optimizations.`,
      };
    }

    // Reset daily usage if we're in a new day
    const now = new Date();
    const lastDayStart = profile.usage.currentDayStart;
    const isNewDay = now.toDateString() !== lastDayStart.toDateString();

    if (isNewDay) {
      profile.usage.optimizationsToday = 0;
      profile.usage.currentDayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
    }

    // Increment usage
    profile.usage.optimizationsToday += 1;
    profile.usage.totalOptimizations += 1;
    profile.usage.lastOptimizationDate = now;

    await this.saveUserProfile(profile);

    const remainingOptimizations =
      optimizationsPerDay === -1
        ? -1 // unlimited
        : optimizationsPerDay - profile.usage.optimizationsToday;

    return { success: true, remainingOptimizations };
  }

  // Get user's current usage and limits
  static async getUsageInfo(uid: string): Promise<{
    optimizationsUsed: number;
    optimizationsRemaining: number;
    totalOptimizations: number;
    planName: string;
    isUnlimited: boolean;
  } | null> {
    const profile = await this.getUserProfile(uid);
    if (!profile) return null;

    const { optimizationsPerDay } = profile.limits;
    const { optimizationsToday } = profile.usage;

    return {
      optimizationsUsed: optimizationsToday,
      optimizationsRemaining:
        optimizationsPerDay === -1
          ? -1
          : Math.max(0, optimizationsPerDay - optimizationsToday),
      totalOptimizations: profile.usage.totalOptimizations,
      planName: profile.subscription.plan,
      isUnlimited: optimizationsPerDay === -1,
    };
  }

  // Check if user can perform an action based on their plan
  static async canPerformAction(
    uid: string,
    action: "optimize" | "download" | "analytics",
  ): Promise<boolean> {
    const profile = await this.getUserProfile(uid);
    if (!profile) return false;

    switch (action) {
      case "optimize":
        const { optimizationsPerDay } = profile.limits;
        return (
          optimizationsPerDay === -1 ||
          profile.usage.optimizationsToday < optimizationsPerDay
        );

      case "download":
      case "analytics":
        return profile.limits.advancedFeatures;

      default:
        return false;
    }
  }

  // Demo method to create some sample users
  static async createDemoUsers(): Promise<void> {
    const demoUsers = [
      {
        uid: "demo-free-user",
        email: "free@demo.com",
        displayName: "Free User",
        plan: "free" as SubscriptionPlan,
      },
      {
        uid: "demo-pro-user",
        email: "pro@demo.com",
        displayName: "Pro User",
        plan: "pro" as SubscriptionPlan,
      },
      {
        uid: "demo-unleashed-user",
        email: "unleashed@demo.com",
        displayName: "Unleashed User",
        plan: "unleashed" as SubscriptionPlan,
      },
    ];

    for (const demoUser of demoUsers) {
      const mockUser = {
        uid: demoUser.uid,
        email: demoUser.email,
        displayName: demoUser.displayName,
        photoURL: null,
        emailVerified: true,
      } as User;

      await this.createUserProfile(mockUser, demoUser.plan);
    }
  }
}
