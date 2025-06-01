import React from "react";

function SecurityPage() {
  return (
    <div className="page">
      <div className="container">
        <h1>Security & Compliance</h1>
        <p>Your code security is our top priority</p>

        <div className="security-features">
          <div className="security-item">
            <h3>🔒 End-to-End Encryption</h3>
            <p>All code is encrypted in transit and at rest</p>
          </div>
          <div className="security-item">
            <h3>🏆 SOC 2 Certified</h3>
            <p>Independently audited security controls</p>
          </div>
          <div className="security-item">
            <h3>🌍 Data Residency</h3>
            <p>Choose where your data is processed and stored</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecurityPage;
