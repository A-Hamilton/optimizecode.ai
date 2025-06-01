// Updated for TypeScript migration
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { SubscriptionPlan, PLAN_DETAILS } from "../types/user";
import "./PlanSelector.css";

interface PlanSelectorProps {
  onPlanChange?: (plan: SubscriptionPlan) => void;
  showUsage?: boolean;
  compact?: boolean;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({
  onPlanChange,
  showUsage = true,
  compact = false,
}) => {
  const { userProfile, changePlan } = useAuth();

  const handlePlanSelect = async (plan: SubscriptionPlan) => {
    if (plan === userProfile?.subscription.plan) return;

    try {
      const result = await changePlan(plan);
      if (result.success && onPlanChange) {
        onPlanChange(plan);
      }
    } catch (error) {
      console.error("Failed to change plan:", error);
    }
  };

  const getCurrentUsage = () => {
    if (!userProfile) return { used: 0, total: 2 };

    const { filesOptimizedThisMonth } = userProfile.usage;
    const { filesPerMonth } = userProfile.limits;

    return {
      used: filesOptimizedThisMonth,
      total: filesPerMonth === -1 ? "∞" : filesPerMonth,
    };
  };

  const isLimitReached = () => {
    if (!userProfile) return false;
    const { filesOptimizedThisMonth } = userProfile.usage;
    const { filesPerMonth } = userProfile.limits;
    return filesPerMonth !== -1 && filesOptimizedThisMonth >= filesPerMonth;
  };

  const currentPlan = userProfile?.subscription.plan || "free";
  const usage = getCurrentUsage();

  if (compact) {
    return (
      <div className="plan-selector compact">
        <div className="current-plan-info">
          <span className={`plan-badge ${currentPlan}`}>
            {PLAN_DETAILS[currentPlan].name}
          </span>
          {showUsage && (
            <span
              className={`usage-info ${isLimitReached() ? "limit-reached" : ""}`}
            >
              {usage.used}/{usage.total} files
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="plan-selector">
      {showUsage && (
        <div className="usage-display">
          <div className="usage-header">
            <h3>Monthly Usage</h3>
            <span
              className={`usage-count ${isLimitReached() ? "limit-reached" : ""}`}
            >
              {usage.used}/{usage.total} files
            </span>
          </div>

          {userProfile?.limits.filesPerMonth !== -1 && (
            <div className="usage-bar">
              <div
                className="usage-fill"
                style={{
                  width: `${Math.min((usage.used / (userProfile?.limits.filesPerMonth || 1)) * 100, 100)}%`,
                }}
              />
            </div>
          )}

          {isLimitReached() && (
            <div className="limit-warning">
              <svg
                className="warning-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              You've reached your monthly limit. Upgrade for more files!
            </div>
          )}
        </div>
      )}

      <div className="plan-options">
        <h3>Select Plan</h3>
        <div className="plan-buttons">
          {Object.entries(PLAN_DETAILS).map(([planKey, planInfo]) => {
            const plan = planKey as SubscriptionPlan;
            const isActive = plan === currentPlan;

            return (
              <button
                key={plan}
                className={`plan-option ${plan} ${isActive ? "active" : ""}`}
                onClick={() => handlePlanSelect(plan)}
                disabled={isActive}
              >
                <div className="plan-name">{planInfo.name}</div>
                <div className="plan-price">
                  {planInfo.price === 0 ? "Free" : `$${planInfo.price}/mo`}
                </div>
                <div className="plan-files">
                  {plan === "free"
                    ? "2 files"
                    : plan === "pro"
                      ? "50 files"
                      : "Unlimited"}
                </div>
                {isActive && <div className="current-badge">Current</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlanSelector;
