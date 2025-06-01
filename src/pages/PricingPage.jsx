import React from "react";

function PricingPage() {
  return (
    <div className="page">
      <div className="container">
        <header className="page-header">
          <h1>Pricing Plans</h1>
          <p>Choose the perfect plan for your optimization needs</p>
        </header>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Free</h3>
            <div className="price">
              $0<span>/month</span>
            </div>
            <ul>
              <li>✓ 100 optimizations/month</li>
              <li>✓ Basic language support</li>
              <li>✓ Community support</li>
            </ul>
            <button className="btn-primary">Get Started</button>
          </div>

          <div className="pricing-card featured">
            <h3>Pro</h3>
            <div className="price">
              $29<span>/month</span>
            </div>
            <ul>
              <li>✓ Unlimited optimizations</li>
              <li>✓ All languages & frameworks</li>
              <li>✓ Priority support</li>
              <li>✓ Advanced analytics</li>
            </ul>
            <button className="btn-primary">Start Trial</button>
          </div>

          <div className="pricing-card">
            <h3>Enterprise</h3>
            <div className="price">Custom</div>
            <ul>
              <li>✓ Everything in Pro</li>
              <li>✓ Custom integrations</li>
              <li>✓ Dedicated support</li>
              <li>✓ SLA guarantee</li>
            </ul>
            <button className="btn-primary">Contact Sales</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
