import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./SubscriptionPage.css";

const SubscriptionPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Simple auth check with timeout
    const checkAuth = async () => {
      try {
        // Give auth context a moment to initialize
        await new Promise((resolve) => setTimeout(resolve, 500));

        setAuthChecked(true);
        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthChecked(true);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Still loading auth
  if (!authChecked || loading) {
    return (
      <div className="subscription-page">
        <div className="subscription-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your subscription details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    return (
      <div className="subscription-page">
        <div className="subscription-container">
          <div className="auth-required">
            <div className="auth-icon">🔐</div>
            <h1>Login Required</h1>
            <p>You need to be logged in to view your subscription details.</p>
            <div className="auth-actions">
              <button
                className="btn-primary"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate("/pricing")}
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is logged in - show subscription page
  const currentPlan = userProfile?.subscription?.plan || "free";
  const planDetails = {
    free: {
      name: "Free",
      price: "$0",
      features: ["10 optimizations/day", "Basic support"],
    },
    pro: {
      name: "Pro",
      price: "$29",
      features: ["300 optimizations/day", "Priority support"],
    },
    unleashed: {
      name: "Unleashed",
      price: "$200",
      features: ["Unlimited optimizations", "24/7 support"],
    },
  };

  const plan =
    planDetails[currentPlan as keyof typeof planDetails] || planDetails.free;

  return (
    <div className="subscription-page">
      <div className="subscription-container">
        {/* Header */}
        <div className="subscription-header">
          <h1>Subscription Management</h1>
          <p>Manage your plan, usage, and billing information</p>
        </div>

        {/* Current Plan Card */}
        <div className="subscription-card">
          <div className="card-header">
            <h2>Current Plan</h2>
            <div className="plan-badge">
              <span className={`badge ${currentPlan}`}>{plan.name}</span>
            </div>
          </div>

          <div className="card-body">
            <div className="plan-info">
              <div className="plan-price">
                {plan.price}
                <span>/month</span>
              </div>
              <div className="plan-features">
                <h3>Plan Features:</h3>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="checkmark">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="card-footer">
            {currentPlan === "free" ? (
              <button
                className="btn-primary"
                onClick={() => navigate("/pricing")}
              >
                Upgrade Plan
              </button>
            ) : (
              <div className="plan-actions">
                <button
                  className="btn-secondary"
                  onClick={() => navigate("/pricing")}
                >
                  Change Plan
                </button>
                <button className="btn-danger">Cancel Subscription</button>
              </div>
            )}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="subscription-card">
          <div className="card-header">
            <h2>Usage This Month</h2>
          </div>
          <div className="card-body">
            <div className="usage-stats">
              <div className="usage-item">
                <div className="usage-number">
                  {userProfile?.usage?.optimizationsToday || 0}
                </div>
                <div className="usage-label">Used Today</div>
              </div>
              <div className="usage-item">
                <div className="usage-number">
                  {userProfile?.limits?.optimizationsPerDay === -1
                    ? "∞"
                    : (userProfile?.limits?.optimizationsPerDay || 10) -
                      (userProfile?.usage?.optimizationsToday || 0)}
                </div>
                <div className="usage-label">Remaining</div>
              </div>
              <div className="usage-item">
                <div className="usage-number">
                  {userProfile?.usage?.totalOptimizations || 0}
                </div>
                <div className="usage-label">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="subscription-card">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="card-body">
            <div className="quick-actions">
              <button
                className="action-button"
                onClick={() => navigate("/optimize")}
              >
                <span className="action-icon">⚡</span>
                <div>
                  <div className="action-title">Start Optimizing</div>
                  <div className="action-subtitle">Optimize your code now</div>
                </div>
              </button>

              <button
                className="action-button"
                onClick={() => navigate("/profile")}
              >
                <span className="action-icon">👤</span>
                <div>
                  <div className="action-title">Profile Settings</div>
                  <div className="action-subtitle">Manage your account</div>
                </div>
              </button>

              <button
                className="action-button"
                onClick={() => navigate("/pricing")}
              >
                <span className="action-icon">💳</span>
                <div>
                  <div className="action-title">View Plans</div>
                  <div className="action-subtitle">Compare all plans</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
