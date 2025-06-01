// Updated for TypeScript migration
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  UserSubscription,
  UsageStats,
  BillingHistory,
  SUBSCRIPTION_PLANS,
  SubscriptionPlan,
} from "../types/subscription";
import "./SubscriptionPage.css";

const SubscriptionPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null,
  );
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );

  useEffect(() => {
    loadSubscriptionData();
  }, [currentUser]);

  const loadSubscriptionData = async () => {
    if (!currentUser) return;

    setLoading(true);

    // Simulate API calls - In real app, these would be actual API calls
    try {
      // Mock subscription data
      const mockSubscription: UserSubscription = {
        id: "sub_demo_123",
        userId: currentUser.uid,
        planId: "pro-monthly",
        status: "active",
        currentPeriodStart: new Date(2024, 0, 1),
        currentPeriodEnd: new Date(2024, 1, 1),
        cancelAtPeriodEnd: false,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date(),
        plan: SUBSCRIPTION_PLANS.find((p) => p.id === "pro-monthly")!,
      };

      const mockUsage: UsageStats = {
        filesOptimized: 23,
        filesRemaining: 27,
        totalOptimizations: 156,
        lastOptimization: new Date(2024, 0, 15),
      };

      const mockBilling: BillingHistory[] = [
        {
          id: "inv_001",
          amount: 29.0,
          currency: "USD",
          status: "paid",
          date: new Date(2024, 0, 1),
          description: "Pro Plan - Monthly",
          downloadUrl: "#",
        },
        {
          id: "inv_002",
          amount: 29.0,
          currency: "USD",
          status: "paid",
          date: new Date(2023, 11, 1),
          description: "Pro Plan - Monthly",
          downloadUrl: "#",
        },
      ];

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubscription(mockSubscription);
      setUsage(mockUsage);
      setBillingHistory(mockBilling);
    } catch (error) {
      console.error("Failed to load subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      // Simulate API call to cancel subscription
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: true,
        updatedAt: new Date(),
      });

      setShowCancelModal(false);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    }
  };

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    try {
      // Simulate API call to upgrade subscription
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (subscription) {
        setSubscription({
          ...subscription,
          planId: plan.id,
          plan: plan,
          updatedAt: new Date(),
        });
      }

      setShowUpgradeModal(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error("Failed to upgrade subscription:", error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="subscription-page">
        <div className="subscription-container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading your subscription details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="subscription-page">
        <div className="subscription-container">
          <div className="no-subscription">
            <h1>No Active Subscription</h1>
            <p>
              You don't have an active subscription. Choose a plan to get
              started!
            </p>
            <button
              className="btn-primary"
              onClick={() => setShowUpgradeModal(true)}
            >
              View Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-page">
      <div className="subscription-container">
        <div className="subscription-header">
          <h1>Manage Subscription</h1>
          <p>View and manage your OptimizeCode.ai subscription</p>
        </div>

        {/* Current Plan */}
        <div className="current-plan-section">
          <div className="plan-card current">
            <div className="plan-header">
              <div className="plan-info">
                <h2>{subscription.plan.name} Plan</h2>
                <div className="plan-price">
                  {formatCurrency(subscription.plan.price)}
                  <span className="interval">
                    /{subscription.plan.interval}
                  </span>
                </div>
                <div className={`plan-status ${subscription.status}`}>
                  {subscription.cancelAtPeriodEnd
                    ? "Cancelling"
                    : subscription.status}
                </div>
              </div>
              <div className="plan-actions">
                {!subscription.cancelAtPeriodEnd && (
                  <>
                    <button
                      className="btn-secondary"
                      onClick={() => setShowUpgradeModal(true)}
                    >
                      Change Plan
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => setShowCancelModal(true)}
                    >
                      Cancel Subscription
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="plan-details">
              <div className="billing-cycle">
                <h3>Billing Cycle</h3>
                <p>
                  Current period: {formatDate(subscription.currentPeriodStart)}{" "}
                  - {formatDate(subscription.currentPeriodEnd)}
                </p>
                {subscription.cancelAtPeriodEnd && (
                  <p className="cancel-notice">
                    Your subscription will end on{" "}
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                )}
              </div>

              <div className="plan-features">
                <h3>Plan Features</h3>
                <ul>
                  {subscription.plan.features.map((feature, index) => (
                    <li key={index}>
                      <svg
                        className="check-icon"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="#22c55e"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        {usage && (
          <div className="usage-section">
            <h2>Usage This Month</h2>
            <div className="usage-grid">
              <div className="usage-card">
                <div className="usage-number">{usage.filesOptimized}</div>
                <div className="usage-label">Files Optimized</div>
              </div>
              <div className="usage-card">
                <div className="usage-number">
                  {subscription.plan.fileLimit === -1
                    ? "∞"
                    : usage.filesRemaining}
                </div>
                <div className="usage-label">Files Remaining</div>
              </div>
              <div className="usage-card">
                <div className="usage-number">{usage.totalOptimizations}</div>
                <div className="usage-label">Total Optimizations</div>
              </div>
            </div>

            {subscription.plan.fileLimit !== -1 && (
              <div className="usage-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(usage.filesOptimized / subscription.plan.fileLimit) * 100}%`,
                    }}
                  ></div>
                </div>
                <p>
                  {usage.filesOptimized} of {subscription.plan.fileLimit} files
                  used this month
                </p>
              </div>
            )}
          </div>
        )}

        {/* Billing History */}
        <div className="billing-section">
          <h2>Billing History</h2>
          <div className="billing-table">
            <div className="table-header">
              <div>Date</div>
              <div>Description</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Action</div>
            </div>
            {billingHistory.map((invoice) => (
              <div key={invoice.id} className="table-row">
                <div>{formatDate(invoice.date)}</div>
                <div>{invoice.description}</div>
                <div>{formatCurrency(invoice.amount, invoice.currency)}</div>
                <div>
                  <span className={`status-badge ${invoice.status}`}>
                    {invoice.status}
                  </span>
                </div>
                <div>
                  {invoice.downloadUrl && (
                    <button className="btn-link">Download</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowCancelModal(false)}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Cancel Subscription</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowCancelModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to cancel your subscription? Your
                  subscription will remain active until{" "}
                  {formatDate(subscription.currentPeriodEnd)}, and you won't be
                  charged again.
                </p>
                <div className="cancel-benefits">
                  <h4>You'll lose access to:</h4>
                  <ul>
                    {subscription.plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Subscription
                </button>
                <button
                  className="btn-danger"
                  onClick={handleCancelSubscription}
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowUpgradeModal(false)}
          >
            <div className="modal large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Change Plan</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowUpgradeModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="plans-grid">
                  {SUBSCRIPTION_PLANS.filter((plan) => plan.id !== "free").map(
                    (plan) => (
                      <div
                        key={plan.id}
                        className={`plan-option ${plan.id === subscription.planId ? "current" : ""} ${plan.isPopular ? "popular" : ""}`}
                      >
                        {plan.isPopular && (
                          <div className="popular-badge">Most Popular</div>
                        )}
                        <div className="plan-name">{plan.name}</div>
                        <div className="plan-price">
                          {formatCurrency(plan.price)}
                          <span>/{plan.interval}</span>
                        </div>
                        <ul className="plan-features">
                          {plan.features.slice(0, 4).map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                        {plan.id === subscription.planId ? (
                          <button className="btn-current" disabled>
                            Current Plan
                          </button>
                        ) : (
                          <button
                            className="btn-primary"
                            onClick={() => handleUpgrade(plan)}
                          >
                            {plan.price > subscription.plan.price
                              ? "Upgrade"
                              : "Downgrade"}
                          </button>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
