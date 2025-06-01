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
    optimizationsToday: number;
    totalOptimizations: number;
    lastOptimizationDate?: Date;
    currentDayStart: Date;
  };

  // Plan Limits
  limits: {
    optimizationsPerDay: number;
    maxFileUploads: number;
    maxPasteCharacters: number;
    maxFileSize: number; // in MB
    prioritySupport: boolean;
    advancedFeatures: boolean;
  };
}

// Get configuration from environment variables
const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

export const PLAN_LIMITS: Record<SubscriptionPlan, UserProfile["limits"]> = {
  free: {
    optimizationsPerDay: getEnvNumber("VITE_FREE_OPTIMIZATIONS_PER_DAY", 10),
    maxFileUploads: getEnvNumber("VITE_FREE_MAX_FILE_UPLOADS", 2),
    maxPasteCharacters: getEnvNumber("VITE_FREE_MAX_PASTE_CHARACTERS", 10000),
    maxFileSize: getEnvNumber("VITE_FREE_MAX_FILE_SIZE_MB", 1),
    prioritySupport: false,
    advancedFeatures: false,
  },
  pro: {
    optimizationsPerDay: getEnvNumber("VITE_PRO_OPTIMIZATIONS_PER_DAY", 300),
    maxFileUploads: getEnvNumber("VITE_PRO_MAX_FILE_UPLOADS", 50),
    maxPasteCharacters: getEnvNumber("VITE_PRO_MAX_PASTE_CHARACTERS", 100000),
    maxFileSize: getEnvNumber("VITE_PRO_MAX_FILE_SIZE_MB", 10),
    prioritySupport: true,
    advancedFeatures: true,
  },
  unleashed: {
    optimizationsPerDay: getEnvNumber(
      "VITE_UNLEASHED_OPTIMIZATIONS_PER_DAY",
      -1,
    ), // unlimited
    maxFileUploads: getEnvNumber("VITE_UNLEASHED_MAX_FILE_UPLOADS", -1), // unlimited
    maxPasteCharacters: getEnvNumber("VITE_UNLEASHED_MAX_PASTE_CHARACTERS", -1), // unlimited
    maxFileSize: getEnvNumber("VITE_UNLEASHED_MAX_FILE_SIZE_MB", 100),
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
