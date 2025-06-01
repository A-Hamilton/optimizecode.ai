import React from "react";

function SolutionsPage() {
  return (
    <div className="page">
      <div className="container">
        <h1>Solutions</h1>
        <p>OptimizeCode.ai solutions for different use cases</p>

        <div className="solutions-grid">
          <div className="solution-card">
            <h3>🏎️ Performance-Critical Apps</h3>
            <p>
              Gaming, fintech, and real-time applications requiring maximum
              performance
            </p>
          </div>
          <div className="solution-card">
            <h3>☁️ Cloud Cost Reduction</h3>
            <p>
              Reduce AWS, Azure, and GCP costs through intelligent code
              optimization
            </p>
          </div>
          <div className="solution-card">
            <h3>🔄 Legacy Code Modernization</h3>
            <p>Transform old codebases into modern, maintainable solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SolutionsPage;
