import React from "react";

const DashboardPage: React.FC = () => {
  return (
    <div className="page">
      <div className="container">
        <h1>Dashboard</h1>
        <p>Manage your optimization projects and settings</p>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>📊 Optimization History</h3>
            <p>View your past optimizations and results</p>
          </div>
          <div className="dashboard-card">
            <h3>⚙️ Settings</h3>
            <p>Configure API keys and preferences</p>
          </div>
          <div className="dashboard-card">
            <h3>💳 Billing</h3>
            <p>Manage your subscription and usage</p>
          </div>
          <div className="dashboard-card">
            <h3>👥 Team</h3>
            <p>Manage team members and permissions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
