// Updated for TypeScript migration
export type SubscriptionPlan = "free" | "pro" | "unleashed";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;

  // Subscription Information
  subscription: {
    plan: SubscriptionPlan;
    status: "active" | "cancelled" | "past_due" | "trialing";
    startDate: Date;
    renewalDate?: Date;
    cancelAtPeriodEnd: boolean;
    trialEndsAt?: Date;
  };

  // Usage Tracking
  usage: {
    filesOptimizedThisMonth: number;
    totalFilesOptimized: number;
    lastOptimizationDate?: Date;
    currentPeriodStart: Date;
  };

  // Plan Limits
  limits: {
    filesPerMonth: number;
    maxFileSize: number; // in MB
    prioritySupport: boolean;
    advancedFeatures: boolean;
  };
}

export const PLAN_LIMITS: Record<SubscriptionPlan, UserProfile["limits"]> = {
  free: {
    filesPerMonth: 2,
    maxFileSize: 1, // 1MB
    prioritySupport: false,
    advancedFeatures: false,
  },
  pro: {
    filesPerMonth: 50,
    maxFileSize: 10, // 10MB
    prioritySupport: true,
    advancedFeatures: true,
  },
  unleashed: {
    filesPerMonth: -1, // unlimited
    maxFileSize: 100, // 100MB
    prioritySupport: true,
    advancedFeatures: true,
  },
};

export const PLAN_DETAILS = {
  free: {
    name: "Free",
    price: 0,
    interval: "monthly" as const,
    description: "Perfect for trying out our service",
  },
  pro: {
    name: "Pro",
    price: 29,
    interval: "monthly" as const,
    description: "Best for individual developers",
  },
  unleashed: {
    name: "Unleashed",
    price: 200,
    interval: "monthly" as const,
    description: "For teams and power users",
  },
} as const;
