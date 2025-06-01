// Updated for TypeScript migration
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  UserSubscription,
  UsageStats,
  BillingHistory,
  SUBSCRIPTION_PLANS,
  SubscriptionPlan,
} from "../types/subscription";
import { useNotificationHelpers } from "../contexts/NotificationContext";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  EmptyState,
  LoadingSpinner,
} from "../components/ui";
import { PageLoading } from "../components/ui/LoadingStates";
import "./SubscriptionPage.css";

const SubscriptionPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useNotificationHelpers();

  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null,
  );
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );

  useEffect(() => {
    // Check authentication status first
    const checkAuthAndLoadData = async () => {
      try {
        setLoading(true);

        // Wait a moment for auth to initialize
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!currentUser) {
          // User is not logged in
          setAuthChecked(true);
          setLoading(false);
          return;
        }

        // User is logged in, load subscription data
        await loadSubscriptionData();
        setAuthChecked(true);
      } catch (error) {
        console.error("Error checking auth or loading data:", error);
        showError("Failed to load subscription information");
        setAuthChecked(true);
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [currentUser]);

  const loadSubscriptionData = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      // Mock subscription data - In real app, these would be actual API calls
      const mockSubscription: UserSubscription = {
        id: "sub_demo_123",
        userId: currentUser.uid,
        planId:
          userProfile?.subscription?.plan === "pro" ? "pro-monthly" : "free",
        status: "active",
        currentPeriodStart: new Date(2024, 0, 1),
        currentPeriodEnd: new Date(2024, 1, 1),
        cancelAtPeriodEnd: false,
        createdAt: new Date(2024, 0, 1),
        updatedAt: new Date(),
        plan:
          SUBSCRIPTION_PLANS.find(
            (p) =>
              p.id ===
              (userProfile?.subscription?.plan === "pro"
                ? "pro-monthly"
                : "free"),
          ) || SUBSCRIPTION_PLANS[0],
      };

      const mockUsage: UsageStats = {
        filesOptimized: userProfile?.usage?.optimizationsToday || 0,
        filesRemaining:
          userProfile?.limits?.optimizationsPerDay === -1
            ? 999
            : (userProfile?.limits?.optimizationsPerDay || 10) -
              (userProfile?.usage?.optimizationsToday || 0),
        totalOptimizations: userProfile?.usage?.totalOptimizations || 0,
        lastOptimization: userProfile?.usage?.lastOptimizationDate
          ? new Date(userProfile.usage.lastOptimizationDate)
          : undefined,
      };

      const mockBilling: BillingHistory[] = [
        {
          id: "inv_demo_001",
          subscriptionId: "sub_demo_123",
          amount: 2900,
          currency: "usd",
          status: "paid",
          date: new Date(2024, 0, 1),
          downloadUrl: "#",
          description: "Pro Plan - Monthly",
        },
        {
          id: "inv_demo_002",
          subscriptionId: "sub_demo_123",
          amount: 2900,
          currency: "usd",
          status: "paid",
          date: new Date(2023, 11, 1),
          downloadUrl: "#",
          description: "Pro Plan - Monthly",
        },
      ];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSubscription(mockSubscription);
      setUsage(mockUsage);
      setBillingHistory(mockBilling);
    } catch (error) {
      console.error("Error loading subscription data:", error);
      showError("Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (planId: string) => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setShowUpgradeModal(true);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      // In real app, this would call the cancellation API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showWarning(
        "Subscription will be cancelled at the end of your current billing period",
      );
      setShowCancelModal(false);

      // Update subscription state
      if (subscription) {
        setSubscription({
          ...subscription,
          cancelAtPeriodEnd: true,
        });
      }
    } catch (error) {
      showError("Failed to cancel subscription");
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleGoToPricing = () => {
    navigate("/pricing");
  };

  // Show loading while checking authentication
  if (!authChecked || (currentUser && loading)) {
    return (
      <PageLoading message="Loading your subscription details..." size="lg" />
    );
  }

  // Show login prompt if not authenticated
  if (!currentUser) {
    return (
      <div className="subscription-page">
        <div className="container">
          <EmptyState
            icon={<div className="text-6xl mb-4">🔐</div>}
            title="Login Required"
            description="You need to be logged in to view your subscription details"
            action={
              <div className="flex gap-4 justify-center">
                <Button variant="primary" onClick={handleGoToLogin}>
                  Log In
                </Button>
                <Button variant="outline" onClick={handleGoToPricing}>
                  View Pricing
                </Button>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  // Show error state if data failed to load
  if (!loading && !subscription) {
    return (
      <div className="subscription-page">
        <div className="container">
          <EmptyState
            icon={<div className="text-6xl mb-4">⚠️</div>}
            title="Failed to Load Subscription"
            description="We couldn't load your subscription information. Please try again."
            action={
              <div className="flex gap-4 justify-center">
                <Button
                  variant="primary"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
                <Button variant="outline" onClick={() => navigate("/profile")}>
                  Go to Profile
                </Button>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-page">
      <div className="container">
        {/* Header */}
        <div className="subscription-header">
          <div>
            <h1 className="page-title">Subscription Management</h1>
            <p className="page-subtitle">
              Manage your plan, usage, and billing information
            </p>
          </div>

          {subscription && subscription.plan.id !== "free" && (
            <div className="subscription-status">
              <Badge
                variant={
                  subscription.status === "active" ? "success" : "warning"
                }
              >
                {subscription.status.charAt(0).toUpperCase() +
                  subscription.status.slice(1)}
              </Badge>
              {subscription.cancelAtPeriodEnd && (
                <Badge variant="warning">
                  Cancels {subscription.currentPeriodEnd.toLocaleDateString()}
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="subscription-grid">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <h2>Current Plan</h2>
              <p>Your active subscription details</p>
            </CardHeader>
            <CardBody>
              {subscription && (
                <div className="current-plan">
                  <div className="plan-info">
                    <h3 className="plan-name">{subscription.plan.name}</h3>
                    <div className="plan-price">
                      ${subscription.plan.price.monthly}/month
                    </div>
                    <p className="plan-description">
                      {subscription.plan.description}
                    </p>
                  </div>

                  <div className="plan-features">
                    <h4>Plan Features</h4>
                    <ul>
                      {subscription.plan.features.map((feature, index) => (
                        <li key={index} className="feature-item">
                          <span className="feature-icon">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {subscription.plan.id !== "free" && (
                    <div className="billing-info">
                      <div className="billing-item">
                        <span>Next billing date:</span>
                        <span>
                          {subscription.currentPeriodEnd.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="billing-item">
                        <span>Billing cycle:</span>
                        <span>Monthly</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
            <CardFooter>
              <div className="plan-actions">
                {subscription?.plan.id === "free" ? (
                  <Button
                    variant="primary"
                    onClick={() => navigate("/pricing")}
                  >
                    Upgrade Plan
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/pricing")}
                    >
                      Change Plan
                    </Button>
                    {!subscription.cancelAtPeriodEnd && (
                      <Button
                        variant="danger"
                        onClick={() => setShowCancelModal(true)}
                      >
                        Cancel Subscription
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <h2>Usage This Month</h2>
              <p>Track your optimization usage</p>
            </CardHeader>
            <CardBody>
              {usage && (
                <div className="usage-stats">
                  <div className="usage-item">
                    <div className="usage-number">{usage.filesOptimized}</div>
                    <div className="usage-label">Optimizations Used</div>
                  </div>
                  <div className="usage-item">
                    <div className="usage-number">
                      {usage.filesRemaining === 999
                        ? "∞"
                        : usage.filesRemaining}
                    </div>
                    <div className="usage-label">Remaining</div>
                  </div>
                  <div className="usage-item">
                    <div className="usage-number">
                      {usage.totalOptimizations}
                    </div>
                    <div className="usage-label">Total Optimizations</div>
                  </div>
                  {usage.lastOptimization && (
                    <div className="usage-item">
                      <div className="usage-number">
                        {usage.lastOptimization.toLocaleDateString()}
                      </div>
                      <div className="usage-label">Last Optimization</div>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Billing History */}
          <Card className="billing-history-card">
            <CardHeader>
              <h2>Billing History</h2>
              <p>Your payment history and invoices</p>
            </CardHeader>
            <CardBody>
              {billingHistory.length > 0 ? (
                <div className="billing-history">
                  {billingHistory.map((invoice) => (
                    <div key={invoice.id} className="billing-item">
                      <div className="billing-details">
                        <div className="billing-date">
                          {invoice.date.toLocaleDateString()}
                        </div>
                        <div className="billing-description">
                          {invoice.description}
                        </div>
                      </div>
                      <div className="billing-amount">
                        ${(invoice.amount / 100).toFixed(2)}
                      </div>
                      <div className="billing-actions">
                        <Badge
                          variant={
                            invoice.status === "paid" ? "success" : "warning"
                          }
                        >
                          {invoice.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(invoice.downloadUrl, "_blank")
                          }
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<div className="text-4xl">📄</div>}
                  title="No Billing History"
                  description="Your billing history will appear here"
                />
              )}
            </CardBody>
          </Card>
        </div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowCancelModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Cancel Subscription</h3>
              <p>
                Are you sure you want to cancel your subscription? You'll still
                have access until the end of your current billing period.
              </p>
              <div className="modal-actions">
                <Button
                  variant="ghost"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Subscription
                </Button>
                <Button variant="danger" onClick={handleCancelSubscription}>
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
