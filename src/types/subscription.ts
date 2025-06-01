// Updated for TypeScript migration
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  features: string[];
  fileLimit: number;
  priority: "standard" | "high" | "premium";
  support: "email" | "priority" | "24/7";
  isPopular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: "active" | "cancelled" | "past_due" | "trialing" | "incomplete";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
  plan: SubscriptionPlan;
}

export interface UsageStats {
  filesOptimized: number;
  filesRemaining: number;
  totalOptimizations: number;
  lastOptimization?: Date;
}

export interface BillingHistory {
  id: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  date: Date;
  description: string;
  downloadUrl?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "monthly",
    features: [
      "2 files per month",
      "Basic optimization",
      "Email support",
      "Standard processing",
    ],
    fileLimit: 2,
    priority: "standard",
    support: "email",
  },
  {
    id: "pro-monthly",
    name: "Pro",
    price: 29,
    interval: "monthly",
    features: [
      "50 files per month",
      "Advanced optimization",
      "Priority support",
      "Faster processing",
      "Download optimized files",
      "Code analytics",
    ],
    fileLimit: 50,
    priority: "high",
    support: "priority",
    isPopular: true,
  },
  {
    id: "pro-yearly",
    name: "Pro",
    price: 290,
    interval: "yearly",
    features: [
      "50 files per month",
      "Advanced optimization",
      "Priority support",
      "Faster processing",
      "Download optimized files",
      "Code analytics",
      "Save 17% annually",
    ],
    fileLimit: 50,
    priority: "high",
    support: "priority",
    isPopular: true,
  },
  {
    id: "unleashed-monthly",
    name: "Unleashed",
    price: 200,
    interval: "monthly",
    features: [
      "Unlimited files",
      "Premium optimization",
      "24/7 support",
      "Fastest processing",
      "Advanced analytics",
      "Custom integrations",
      "Team collaboration",
    ],
    fileLimit: -1, // -1 means unlimited
    priority: "premium",
    support: "24/7",
  },
  {
    id: "unleashed-yearly",
    name: "Unleashed",
    price: 2000,
    interval: "yearly",
    features: [
      "Unlimited files",
      "Premium optimization",
      "24/7 support",
      "Fastest processing",
      "Advanced analytics",
      "Custom integrations",
      "Team collaboration",
      "Save 17% annually",
    ],
    fileLimit: -1,
    priority: "premium",
    support: "24/7",
  },
];
