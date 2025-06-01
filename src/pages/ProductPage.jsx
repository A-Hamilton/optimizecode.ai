import React, { useState } from "react";
import "./ProductPage.css";

function ProductPage() {
  const [expandedTechSection, setExpandedTechSection] = useState(false);
  const [activeCodeExample, setActiveCodeExample] = useState(0);

  const codeExamples = [
    {
      title: "Performance Optimization",
      language: "JavaScript",
      before: `// Before: O(n²) complexity - Inefficient nested loops
function findUsersByRole(users, targetRole) {
  var result = [];
  for (var i = 0; i < users.length; i++) {
    for (var j = 0; j < users[i].roles.length; j++) {
      if (users[i].roles[j] === targetRole) {
        result.push(users[i]);
        break;
      }
    }
  }
  return result;
}

// Multiple DOM queries
var elements = document.getElementsByClassName('item');
for (var k = 0; k < elements.length; k++) {
  elements[k].style.display = 'none';
}`,
      after: `// After: O(n) complexity - Optimized with modern patterns
const findUsersByRole = (users, targetRole) => 
  users.filter(user => user.roles.includes(targetRole));

// Single DOM query with efficient batch operation
const elements = document.querySelectorAll('.item');
elements.forEach(el => el.style.display = 'none');`,
      improvements: [
        "Reduced time complexity from O(n²) to O(n)",
        "40% faster execution time",
        "Modern ES6+ syntax",
        "Reduced memory footprint",
      ],
    },
    {
      title: "Memory Optimization",
      language: "Python",
      before: `# Before: Memory-intensive approach
def process_large_dataset(data):
    # Loading entire dataset into memory
    results = []
    all_items = load_all_data(data)  # 10GB+ in memory
    
    for item in all_items:
        processed = expensive_operation(item)
        results.append(processed)
    
    return results

# Inefficient string concatenation
def build_report(items):
    report = ""
    for item in items:
        report += f"Item: {item.name}\\n"
    return report`,
      after: `# After: Memory-efficient streaming approach
def process_large_dataset(data):
    # Generator-based streaming processing
    for batch in load_data_in_batches(data, batch_size=1000):
        for item in batch:
            yield expensive_operation(item)  # Process on-demand

# Efficient string building
def build_report(items):
    return "\\n".join(f"Item: {item.name}" for item in items)`,
      improvements: [
        "95% reduction in memory usage",
        "Streaming processing for large datasets",
        "Generator-based lazy evaluation",
        "Eliminated memory leaks",
      ],
    },
    {
      title: "Security Enhancement",
      language: "Node.js",
      before: `// Before: Security vulnerabilities
const express = require('express');
const app = express();

// Vulnerable to SQL injection
app.get('/user/:id', (req, res) => {
  const query = \`SELECT * FROM users WHERE id = \${req.params.id}\`;
  db.query(query, (err, result) => {
    res.json(result);
  });
});

// Vulnerable to XSS attacks
app.get('/search', (req, res) => {
  const html = \`<h1>Results for: \${req.query.q}</h1>\`;
  res.send(html);
});`,
      after: `// After: Security hardened
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const helmet = require('helmet');

const app = express();
app.use(helmet()); // Security headers

// SQL injection prevention with parameterized queries
app.get('/user/:id', 
  param('id').isInt().withMessage('Invalid user ID'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [req.params.id], (err, result) => {
      res.json(result);
    });
  });

// XSS prevention with proper escaping
app.get('/search', (req, res) => {
  const sanitizedQuery = escapeHtml(req.query.q);
  const html = \`<h1>Results for: \${sanitizedQuery}</h1>\`;
  res.send(html);
});`,
      improvements: [
        "100% SQL injection prevention",
        "XSS attack mitigation",
        "Input validation and sanitization",
        "Security headers implementation",
      ],
    },
  ];

  const allTechnologies = [
    {
      category: "Frontend",
      items: [
        "JavaScript",
        "TypeScript",
        "React",
        "Vue.js",
        "Angular",
        "Svelte",
        "Next.js",
        "Nuxt.js",
        "Gatsby",
      ],
    },
    {
      category: "Backend",
      items: [
        "Node.js",
        "Python",
        "Java",
        "C#",
        "Go",
        "Rust",
        "PHP",
        "Ruby",
        "Scala",
      ],
    },
    {
      category: "Mobile",
      items: [
        "React Native",
        "Flutter",
        "Swift",
        "Kotlin",
        "Xamarin",
        "Ionic",
        "Cordova",
      ],
    },
    {
      category: "Database",
      items: [
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Elasticsearch",
        "DynamoDB",
        "Cassandra",
      ],
    },
    {
      category: "Cloud",
      items: [
        "AWS",
        "Azure",
        "Google Cloud",
        "Docker",
        "Kubernetes",
        "Terraform",
        "Serverless",
      ],
    },
    {
      category: "DevOps",
      items: [
        "GitHub Actions",
        "GitLab CI",
        "Jenkins",
        "CircleCI",
        "Travis CI",
        "Azure DevOps",
      ],
    },
  ];

  const visibleTechCategories = expandedTechSection
    ? allTechnologies
    : allTechnologies.slice(0, 3);

  const integrations = [
    {
      name: "GitHub App",
      icon: "🐙",
      description:
        "Seamless integration with your repositories for automated code optimization",
      features: [
        "Auto-optimize pull requests",
        "Code quality reports",
        "Custom rules",
      ],
    },
    {
      name: "VS Code Extension",
      icon: "💻",
      description:
        "Optimize code directly in your favorite editor with real-time suggestions",
      features: [
        "Real-time optimization",
        "Inline suggestions",
        "Performance metrics",
      ],
    },
    {
      name: "CLI Tool",
      icon: "⌨️",
      description:
        "Command-line interface for CI/CD pipelines and batch processing",
      features: [
        "Batch optimization",
        "CI/CD integration",
        "Automated workflows",
      ],
    },
    {
      name: "REST API",
      icon: "🔗",
      description:
        "Integrate with your existing workflows and custom applications",
      features: ["RESTful endpoints", "Webhook support", "Rate limiting"],
    },
    {
      name: "Slack Integration",
      icon: "💬",
      description:
        "Get optimization reports and notifications directly in Slack",
      features: ["Instant notifications", "Team reports", "Custom alerts"],
    },
    {
      name: "Jira Integration",
      icon: "🎯",
      description:
        "Automatically create optimization tasks and track technical debt",
      features: [
        "Auto-create tickets",
        "Progress tracking",
        "Performance metrics",
      ],
    },
  ];

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        showCopyFeedback("Code copied to clipboard!");
      } else {
        // Fallback method
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (successful) {
          showCopyFeedback("Code copied to clipboard!");
        } else {
          showCopyFeedback("Copy failed - please copy manually", true);
        }
      }
    } catch (err) {
      showCopyFeedback("Copy not supported - please copy manually", true);
    }
  };

  const showCopyFeedback = (message, isError = false) => {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${isError ? "#ef4444" : "#22c55e"};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-10px)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

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

        {/* Before/After Code Demonstrations */}
        <section className="code-demonstration-section">
          <h2>See the Transformation</h2>
          <p>
            Witness how our AI transforms your code with real before-and-after
            examples
          </p>

          <div className="code-examples-nav">
            {codeExamples.map((example, index) => (
              <button
                key={index}
                className={`example-tab ${activeCodeExample === index ? "active" : ""}`}
                onClick={() => setActiveCodeExample(index)}
              >
                {example.title}
              </button>
            ))}
          </div>

          <div className="code-comparison-container">
            <div className="code-comparison-header">
              <h3>{codeExamples[activeCodeExample].title}</h3>
              <span className="language-badge">
                {codeExamples[activeCodeExample].language}
              </span>
            </div>

            <div className="before-after-comparison">
              <div className="code-section before">
                <div className="section-header">
                  <h4>❌ Before Optimization</h4>
                  <button
                    className="copy-button"
                    onClick={() =>
                      copyToClipboard(codeExamples[activeCodeExample].before)
                    }
                  >
                    📋 Copy
                  </button>
                </div>
                <pre className="code-block">
                  <code>{codeExamples[activeCodeExample].before}</code>
                </pre>
              </div>

              <div className="code-section after">
                <div className="section-header">
                  <h4>✅ After Optimization</h4>
                  <button
                    className="copy-button"
                    onClick={() =>
                      copyToClipboard(codeExamples[activeCodeExample].after)
                    }
                  >
                    📋 Copy
                  </button>
                </div>
                <pre className="code-block">
                  <code>{codeExamples[activeCodeExample].after}</code>
                </pre>
              </div>
            </div>

            <div className="improvements-list">
              <h4>Key Improvements</h4>
              <div className="improvements-grid">
                {codeExamples[activeCodeExample].improvements.map(
                  (improvement, index) => (
                    <div key={index} className="improvement-item">
                      <span className="improvement-icon">⚡</span>
                      {improvement}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className="features-grid-section">
          <h2>Core Features</h2>
          <div className="features-detailed-grid">
            <div className="feature-detail">
              <div className="feature-icon">🚀</div>
              <h3>Performance Optimization</h3>
              <p>
                Advanced algorithm analysis and optimization for 40% faster code
                execution
              </p>
              <ul className="feature-benefits">
                <li>Time complexity reduction</li>
                <li>Memory usage optimization</li>
                <li>Runtime performance boost</li>
                <li>Resource efficiency</li>
              </ul>
            </div>

            <div className="feature-detail">
              <div className="feature-icon">💰</div>
              <h3>Cost Reduction</h3>
              <p>
                Intelligent resource optimization to reduce cloud computing
                costs by 60%
              </p>
              <ul className="feature-benefits">
                <li>Lower server resource usage</li>
                <li>Reduced bandwidth consumption</li>
                <li>Optimized database queries</li>
                <li>Efficient API calls</li>
              </ul>
            </div>

            <div className="feature-detail">
              <div className="feature-icon">🔒</div>
              <h3>Security Enhancement</h3>
              <p>
                Identifies and fixes security vulnerabilities while maintaining
                functionality
              </p>
              <ul className="feature-benefits">
                <li>SQL injection prevention</li>
                <li>XSS vulnerability fixes</li>
                <li>Input validation</li>
                <li>Secure coding patterns</li>
              </ul>
            </div>

            <div className="feature-detail">
              <div className="feature-icon">📖</div>
              <h3>Code Modernization</h3>
              <p>Updates legacy code to modern standards and best practices</p>
              <ul className="feature-benefits">
                <li>ES6+ syntax adoption</li>
                <li>Framework migrations</li>
                <li>Design pattern improvements</li>
                <li>Code style consistency</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Scalable Technology Listing */}
        <section className="languages-section">
          <h2>Supported Languages & Frameworks</h2>
          <p>
            OptimizeCode.ai supports a comprehensive range of programming
            languages and frameworks
          </p>

          <div className="tech-categories">
            {visibleTechCategories.map((category, index) => (
              <div key={index} className="tech-category">
                <h3 className="category-title">{category.category}</h3>
                <div className="tech-items">
                  {category.items.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="tech-toggle">
            <button
              className="toggle-button"
              onClick={() => setExpandedTechSection(!expandedTechSection)}
            >
              {expandedTechSection ? "Show Less" : "Show All Technologies"}
              <span
                className={`toggle-arrow ${expandedTechSection ? "up" : "down"}`}
              >
                ▼
              </span>
            </button>
          </div>
        </section>

        {/* Enhanced Integrations */}
        <section className="integrations-section">
          <h2>Seamless Integrations</h2>
          <p>
            Connect OptimizeCode.ai with your existing development tools and
            workflows
          </p>

          <div className="integrations-grid">
            {integrations.map((integration, index) => (
              <div key={index} className="integration-card">
                <div className="integration-header">
                  <div className="integration-icon">{integration.icon}</div>
                  <h3>{integration.name}</h3>
                </div>
                <p className="integration-description">
                  {integration.description}
                </p>
                <ul className="integration-features">
                  {integration.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
                <button className="integration-cta">Setup Integration</button>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="metrics-section">
          <h2>Proven Results</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-number">40%</div>
              <div className="metric-label">Faster Execution</div>
              <div className="metric-description">
                Average performance improvement
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-number">60%</div>
              <div className="metric-label">Cost Reduction</div>
              <div className="metric-description">
                Cloud infrastructure savings
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-number">95%</div>
              <div className="metric-label">Bug Prevention</div>
              <div className="metric-description">
                Security vulnerabilities eliminated
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-number">3x</div>
              <div className="metric-label">Faster Development</div>
              <div className="metric-description">
                Accelerated development cycles
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="product-cta">
          <div className="cta-content">
            <h2>Ready to Transform Your Code?</h2>
            <p>
              Experience the power of AI-driven code optimization. Start
              optimizing your codebase today.
            </p>
            <div className="cta-buttons">
              <button className="btn-primary large">Start Free Trial</button>
              <button className="btn-secondary large">Schedule Demo</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductPage;
