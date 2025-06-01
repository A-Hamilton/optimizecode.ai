import React, { useState } from "react";
import { redirectToCheckout, getPriceId } from "../services/stripeService";
import { useAuth } from "../contexts/AuthContext";
import { SubscriptionPlan } from "../types/user";

interface StripeCheckoutProps {
  plan: SubscriptionPlan;
  billingCycle: "monthly" | "yearly";
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  children: React.ReactNode;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  plan,
  billingCycle,
  onSuccess,
  onError,
  className = "",
  children,
}) => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!currentUser) {
      onError?.("Please log in to subscribe");
      return;
    }

    if (plan === "free") {
      onError?.("Free plan does not require payment");
      return;
    }

    setIsLoading(true);

    try {
      const priceId = getPriceId(plan, billingCycle);

      await redirectToCheckout({
        priceId,
        userId: currentUser.uid,
        userEmail: currentUser.email || "",
        successUrl: `${window.location.origin}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        planName: plan,
        billingCycle,
      });

      onSuccess?.();
    } catch (error) {
      console.error("Checkout error:", error);
      onError?.(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading || !currentUser}
      className={`${className} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default StripeCheckout;
