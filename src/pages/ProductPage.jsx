import React from "react";
// import './ProductPage.css'

function ProductPage() {
  return (
    <div className="product-page">
      <div className="container">
        <header className="page-header">
          <h1>Product Features</h1>
          <p>
            Deep-dive into OptimizeCode.ai's powerful AI optimization
            capabilities
          </p>
        </header>

        <section className="features-grid-section">
          <h2>Core Features</h2>
          <div className="features-detailed-grid">
            <div className="feature-detail">
              <h3>🚀 Performance Optimization</h3>
              <p>
                Advanced algorithm analysis and optimization for 40% faster code
                execution
              </p>
              <div className="code-snippet">
                <pre>
                  <code>{`// Before: O(n²) complexity
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length; j++) {
    // operations
  }
}

// After: O(n) optimized
const map = new Map();
for (const item of arr) {
  // optimized operations
}`}</code>
                </pre>
              </div>
            </div>

            <div className="feature-detail">
              <h3>💰 Cost Reduction</h3>
              <p>
                Intelligent resource optimization to reduce cloud computing
                costs by 60%
              </p>
            </div>

            <div className="feature-detail">
              <h3>🔒 Security Enhancement</h3>
              <p>
                Identifies and fixes security vulnerabilities while maintaining
                functionality
              </p>
            </div>

            <div className="feature-detail">
              <h3>📖 Code Modernization</h3>
              <p>Updates legacy code to modern standards and best practices</p>
            </div>
          </div>
        </section>

        <section className="languages-section">
          <h2>Supported Languages & Frameworks</h2>
          <div className="language-cloud">
            <span className="lang-tag">JavaScript</span>
            <span className="lang-tag">TypeScript</span>
            <span className="lang-tag">Python</span>
            <span className="lang-tag">Java</span>
            <span className="lang-tag">C++</span>
            <span className="lang-tag">Go</span>
            <span className="lang-tag">Rust</span>
            <span className="lang-tag">React</span>
            <span className="lang-tag">Vue.js</span>
            <span className="lang-tag">Node.js</span>
            <span className="lang-tag">Django</span>
            <span className="lang-tag">Spring</span>
          </div>
        </section>

        <section className="integrations-section">
          <h2>Integrations</h2>
          <div className="integrations-grid">
            <div className="integration-card">
              <h3>🐙 GitHub App</h3>
              <p>Seamless integration with your repositories</p>
            </div>
            <div className="integration-card">
              <h3>⌨️ CLI Tool</h3>
              <p>Command-line interface for CI/CD pipelines</p>
            </div>
            <div className="integration-card">
              <h3>💻 VS Code Extension</h3>
              <p>Optimize code directly in your editor</p>
            </div>
            <div className="integration-card">
              <h3>🔗 REST API</h3>
              <p>Integrate with your existing workflows</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductPage;
