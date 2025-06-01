import React, { useState } from "react";
import "./PricingPage.css";

interface Feature {
  text: string;
  hasTooltip: boolean;
  tooltip?: string;
}

interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  price: { monthly: number | string; yearly: number | string };
  popular: boolean;
  features: Feature[];
  cta: string;
  ctaStyle: "primary" | "secondary";
  fileLimit: number | string;
}

interface FeatureTooltipProps {
  feature: string;
  description: string;
  id: string;
}

type BillingCycle = "monthly" | "yearly";

const PricingPage: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const FeatureTooltip: React.FC<FeatureTooltipProps> = ({
    feature,
    description,
    id,
  }) => (
    <div className="feature-tooltip-wrapper">
      <span
        className="feature-with-tooltip"
        onMouseEnter={() => setShowTooltip(id)}
        onMouseLeave={() => setShowTooltip(null)}
      >
        {feature}
        <span className="tooltip-icon">ⓘ</span>
      </span>
      {showTooltip === id && <div className="tooltip">{description}</div>}
    </div>
  );

  const pricingPlans: PricingPlan[] = [
    {
      id: "free",
      name: "Free",
      subtitle: "Perfect for getting started",
      price: { monthly: 0, yearly: 0 },
      popular: false,
      fileLimit: 2,
      features: [
        {
          text: "100 optimizations per month",
          hasTooltip: true,
          tooltip:
            "Code optimization requests including both individual files and batch operations",
        },
        {
          text: "Max 2 files per optimization",
          hasTooltip: true,
          tooltip: "You can upload up to 2 code files at once for optimization",
        },
        {
          text: "Basic language support",
          hasTooltip: true,
          tooltip: "JavaScript, Python, and Java optimization capabilities",
        },
        {
          text: "Community support",
          hasTooltip: true,
          tooltip: "Access to community forums and documentation",
        },
        { text: "Basic analytics", hasTooltip: false },
        { text: "Standard optimization speed", hasTooltip: false },
      ],
      cta: "Get Started Free",
      ctaStyle: "secondary",
    },
    {
      id: "pro",
      name: "Pro",
      subtitle: "Most popular for serious developers",
      price: { monthly: 29, yearly: 290 },
      popular: true,
      fileLimit: 50,
      features: [
        {
          text: "Unlimited optimizations",
          hasTooltip: true,
          tooltip: "No limits on the number of code optimization requests",
        },
        {
          text: "Max 50 files per optimization",
          hasTooltip: true,
          tooltip: "Upload up to 50 code files at once for batch optimization",
        },
        {
          text: "All languages & frameworks",
          hasTooltip: true,
          tooltip:
            "15+ languages including JavaScript, TypeScript, Python, Java, C++, Go, Rust, and popular frameworks",
        },
        {
          text: "Priority support",
          hasTooltip: true,
          tooltip: "24/7 email support with 4-hour response time",
        },
        {
          text: "Advanced analytics & insights",
          hasTooltip: true,
          tooltip:
            "Detailed performance metrics, code quality scores, and optimization history",
        },
        {
          text: "API access with higher rate limits",
          hasTooltip: true,
          tooltip: "10,000 API requests per hour with dedicated endpoints",
        },
        {
          text: "VS Code & IDE integrations",
          hasTooltip: true,
          tooltip: "Extensions for VS Code, IntelliJ, WebStorm, and PyCharm",
        },
        {
          text: "CI/CD pipeline integration",
          hasTooltip: true,
          tooltip:
            "GitHub Actions, GitLab CI, Jenkins, and Azure DevOps integration",
        },
        {
          text: "3x faster optimization speed",
          hasTooltip: true,
          tooltip: "Priority processing queue with dedicated compute resources",
        },
      ],
      cta: "Start 14-Day Free Trial",
      ctaStyle: "primary",
    },
    {
      id: "unleashed",
      name: "Unleashed",
      subtitle: "Unlimited everything for power users",
      price: { monthly: 200, yearly: 2000 },
      popular: false,
      fileLimit: "Unlimited",
      features: [
        { text: "Everything in Pro", hasTooltip: false },
        {
          text: "Unlimited files per optimization",
          hasTooltip: true,
          tooltip:
            "No limits on the number of files you can upload and optimize at once",
        },
        {
          text: "Custom optimization rules",
          hasTooltip: true,
          tooltip:
            "Define company-specific coding standards and optimization preferences",
        },
        {
          text: "Dedicated account manager",
          hasTooltip: true,
          tooltip:
            "Personal support representative for onboarding and ongoing assistance",
        },
        {
          text: "SLA with 99.9% uptime guarantee",
          hasTooltip: true,
          tooltip:
            "Service level agreement with financial penalties for downtime",
        },
        {
          text: "On-premise deployment option",
          hasTooltip: true,
          tooltip:
            "Install OptimizeCode.ai within your own infrastructure for maximum security",
        },
        {
          text: "Advanced security & compliance",
          hasTooltip: true,
          tooltip:
            "SOC 2 Type II, GDPR compliance, and custom security configurations",
        },
        {
          text: "Bulk user management & SSO",
          hasTooltip: true,
          tooltip:
            "Active Directory, SAML, and OAuth integration for team management",
        },
        {
          text: "Priority feature requests",
          hasTooltip: true,
          tooltip:
            "Direct input on product roadmap and custom feature development",
        },
        {
          text: "White-label solutions",
          hasTooltip: true,
          tooltip:
            "Brand OptimizeCode.ai with your company's logo and custom domain",
        },
      ],
      cta: "Contact Sales",
      ctaStyle: "secondary",
    },
  ];

  const getPrice = (plan: PricingPlan): string => {
    if (typeof plan.price[billingCycle] === "number") {
      return billingCycle === "yearly"
        ? `$${plan.price.yearly}`
        : `$${plan.price.monthly}`;
    }
    return plan.price[billingCycle] as string;
  };

  const getSavings = (plan: PricingPlan): string | null => {
    if (
      billingCycle === "yearly" &&
      typeof plan.price.yearly === "number" &&
      typeof plan.price.monthly === "number" &&
      plan.price.monthly > 0
    ) {
      const yearlySavings = plan.price.monthly * 12 - plan.price.yearly;
      const percentSavings = Math.round(
        (yearlySavings / (plan.price.monthly * 12)) * 100,
      );
      return `Save ${percentSavings}% ($${yearlySavings})`;
    }
    return null;
  };

  return (
    <div className="pricing-page">
      <div className="container">
        <header className="pricing-header">
          <h1>Simple, Transparent Pricing</h1>
          <p>
            Choose the perfect plan for your optimization needs. All plans
            include core AI optimization features.
          </p>

          {/* Billing Toggle */}
          <div className="billing-toggle">
            <span className={billingCycle === "monthly" ? "active" : ""}>
              Monthly
            </span>
            <button
              className="toggle-switch"
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly",
                )
              }
            >
              <div
                className={`toggle-slider ${billingCycle === "yearly" ? "yearly" : "monthly"}`}
              ></div>
            </button>
            <span className={billingCycle === "yearly" ? "active" : ""}>
              Yearly <span className="savings-badge">Save 17%</span>
            </span>
          </div>
        </header>

        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
            >
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}

              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-subtitle">{plan.subtitle}</p>

                <div className="pricing-display">
                  <div className="price">
                    {getPrice(plan)}
                    {typeof plan.price[billingCycle] === "number" && (
                      <span className="price-period">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    )}
                  </div>
                  {getSavings(plan) && (
                    <div className="savings">{getSavings(plan)}</div>
                  )}
                </div>

                {/* File Limit Display */}
                <div className="file-limit-badge">
                  📁 {plan.fileLimit} files per optimization
                </div>
              </div>

              <ul className="features-list">
                {plan.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <span className="feature-icon">✓</span>
                    {feature.hasTooltip && feature.tooltip ? (
                      <FeatureTooltip
                        feature={feature.text}
                        description={feature.tooltip}
                        id={`${plan.id}-${index}`}
                      />
                    ) : (
                      <span>{feature.text}</span>
                    )}
                  </li>
                ))}
              </ul>

              <button
                className={`cta-button ${plan.ctaStyle} ${plan.popular ? "enhanced" : ""}`}
              >
                {plan.cta}
                {plan.popular && <span className="cta-arrow">→</span>}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison Section */}
        <section className="feature-comparison">
          <h2>Detailed Feature Comparison</h2>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Features</th>
                  <th>Free</th>
                  <th>Pro</th>
                  <th>Unleashed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Optimizations per month</td>
                  <td>100</td>
                  <td>Unlimited</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td>Files per optimization</td>
                  <td>2</td>
                  <td>50</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td>Supported languages</td>
                  <td>3</td>
                  <td>15+</td>
                  <td>15+</td>
                </tr>
                <tr>
                  <td>API rate limits</td>
                  <td>100/hour</td>
                  <td>10,000/hour</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td>Support response time</td>
                  <td>Community</td>
                  <td>4 hours</td>
                  <td>1 hour</td>
                </tr>
                <tr>
                  <td>Custom optimization rules</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>On-premise deployment</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>SLA guarantee</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>99.9%</td>
                </tr>
                <tr>
                  <td>White-label solutions</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pricing-faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Can I change plans anytime?</h3>
              <p>
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately, and billing is prorated.
              </p>
            </div>
            <div className="faq-item">
              <h3>What happens if I exceed the file limits?</h3>
              <p>
                If you try to upload more files than your plan allows, you'll be
                prompted to upgrade or remove some files to stay within your
                limit.
              </p>
            </div>
            <div className="faq-item">
              <h3>Do you offer refunds?</h3>
              <p>
                Yes! We offer a 30-day money-back guarantee for all paid plans.
                No questions asked.
              </p>
            </div>
            <div className="faq-item">
              <h3>Is there a setup fee?</h3>
              <p>
                No setup fees for any plan. Unleashed customers get dedicated
                onboarding support included.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="pricing-cta">
          <div className="cta-content">
            <h2>Ready to optimize your code?</h2>
            <p>
              Join thousands of developers who've improved their code
              performance by 40% on average.
            </p>
            <div className="cta-buttons">
              <button className="btn-primary large">Start Free Trial</button>
              <button className="btn-secondary large">Contact Sales</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PricingPage;
