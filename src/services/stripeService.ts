import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";
import { SubscriptionPlan } from "../types/user";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const getStripe = async (): Promise<Stripe | null> => {
  return await stripePromise;
};

// Stripe Price IDs (replace with actual IDs from Stripe Dashboard)
export const STRIPE_PRICE_IDS = {
  pro: {
    monthly: "price_1234567890", // Replace with actual Stripe price ID
    yearly: "price_1234567891", // Replace with actual Stripe price ID
  },
  unleashed: {
    monthly: "price_1234567892", // Replace with actual Stripe price ID
    yearly: "price_1234567893", // Replace with actual Stripe price ID
  },
} as const;

export interface CreateCheckoutSessionParams {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
  planName: SubscriptionPlan;
  billingCycle: "monthly" | "yearly";
}

export interface StripeService {
  createCheckoutSession: (
    params: CreateCheckoutSessionParams,
  ) => Promise<{ sessionId: string; url: string }>;
  createPortalSession: (
    customerId: string,
    returnUrl: string,
  ) => Promise<{ url: string }>;
  getSubscriptionStatus: (customerId: string) => Promise<any>;
  cancelSubscription: (subscriptionId: string) => Promise<any>;
}

class StripeServiceImpl implements StripeService {
  private baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  async createCheckoutSession(params: CreateCheckoutSessionParams) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(params),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw new Error("Failed to create checkout session");
    }
  }

  async createPortalSession(customerId: string, returnUrl: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/stripe/create-portal-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ customerId, returnUrl }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating portal session:", error);
      throw new Error("Failed to create portal session");
    }
  }

  async getSubscriptionStatus(customerId: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/stripe/subscription-status/${customerId}`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      throw new Error("Failed to fetch subscription status");
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/stripe/cancel-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ subscriptionId }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw new Error("Failed to cancel subscription");
    }
  }
}

export const stripeService = new StripeServiceImpl();

// Helper function to get price ID for a plan
export const getPriceId = (
  plan: SubscriptionPlan,
  billingCycle: "monthly" | "yearly",
): string => {
  if (plan === "free") {
    throw new Error("Free plan does not have a price ID");
  }

  return STRIPE_PRICE_IDS[plan][billingCycle];
};

// Helper function to redirect to Stripe Checkout
export const redirectToCheckout = async (
  params: CreateCheckoutSessionParams,
): Promise<void> => {
  try {
    const stripe = await getStripe();
    if (!stripe) throw new Error("Stripe not loaded");

    const { sessionId } = await stripeService.createCheckoutSession(params);

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error("Stripe checkout error:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error redirecting to checkout:", error);
    throw error;
  }
};
