import React from "react";

function DocsPage() {
  return (
    <div className="page">
      <div className="container">
        <h1>Documentation</h1>
        <p>API reference, tutorials, and examples for OptimizeCode.ai</p>

        <div className="docs-sections">
          <div className="doc-section">
            <h2>🚀 Quick Start</h2>
            <pre>
              <code>{`# Install CLI
npm install -g @optimizecode/cli

# Optimize a file
optimize-code ./src/app.js

# API usage
curl -X POST https://api.optimizecode.ai/optimize \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"code": "your code here"}'`}</code>
            </pre>
          </div>

          <div className="doc-section">
            <h2>📚 Tutorials</h2>
            <ul>
              <li>
                <a href="#">Getting Started with JavaScript Optimization</a>
              </li>
              <li>
                <a href="#">Python Performance Tuning</a>
              </li>
              <li>
                <a href="#">Integrating with CI/CD Pipelines</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocsPage;
