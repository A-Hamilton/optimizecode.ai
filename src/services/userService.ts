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
        filesOptimizedThisMonth: 0,
        totalFilesOptimized: 0,
        lastOptimizationDate: undefined,
        currentPeriodStart: now,
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
      profile.usage.currentPeriodStart = new Date(
        profile.usage.currentPeriodStart,
      );
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

  // Track file optimization usage
  static async trackUsage(
    uid: string,
  ): Promise<{ success: boolean; remainingFiles: number; error?: string }> {
    const profile = await this.getUserProfile(uid);
    if (!profile) {
      return {
        success: false,
        remainingFiles: 0,
        error: "User profile not found",
      };
    }

    // Check if user has reached their monthly limit
    const { filesPerMonth } = profile.limits;
    if (
      filesPerMonth !== -1 &&
      profile.usage.filesOptimizedThisMonth >= filesPerMonth
    ) {
      return {
        success: false,
        remainingFiles: 0,
        error: `You've reached your monthly limit of ${filesPerMonth} files. Upgrade your plan for more files.`,
      };
    }

    // Reset monthly usage if we're in a new month
    const now = new Date();
    const lastPeriodStart = profile.usage.currentPeriodStart;
    const isNewMonth =
      now.getMonth() !== lastPeriodStart.getMonth() ||
      now.getFullYear() !== lastPeriodStart.getFullYear();

    if (isNewMonth) {
      profile.usage.filesOptimizedThisMonth = 0;
      profile.usage.currentPeriodStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      );
    }

    // Increment usage
    profile.usage.filesOptimizedThisMonth += 1;
    profile.usage.totalFilesOptimized += 1;
    profile.usage.lastOptimizationDate = now;

    await this.saveUserProfile(profile);

    const remainingFiles =
      filesPerMonth === -1
        ? -1 // unlimited
        : filesPerMonth - profile.usage.filesOptimizedThisMonth;

    return { success: true, remainingFiles };
  }

  // Get user's current usage and limits
  static async getUsageInfo(uid: string): Promise<{
    filesUsed: number;
    filesRemaining: number;
    totalFiles: number;
    planName: string;
    isUnlimited: boolean;
  } | null> {
    const profile = await this.getUserProfile(uid);
    if (!profile) return null;

    const { filesPerMonth } = profile.limits;
    const { filesOptimizedThisMonth } = profile.usage;

    return {
      filesUsed: filesOptimizedThisMonth,
      filesRemaining:
        filesPerMonth === -1
          ? -1
          : Math.max(0, filesPerMonth - filesOptimizedThisMonth),
      totalFiles: profile.usage.totalFilesOptimized,
      planName: profile.subscription.plan,
      isUnlimited: filesPerMonth === -1,
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
        const { filesPerMonth } = profile.limits;
        return (
          filesPerMonth === -1 ||
          profile.usage.filesOptimizedThisMonth < filesPerMonth
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
