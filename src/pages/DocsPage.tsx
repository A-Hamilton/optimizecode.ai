// Updated for TypeScript migration
import React, { useState, useEffect } from "react";
import "./DocsPage.css";

interface NavigationItem {
  id: string;
  title: string;
  level: number;
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("getting-started");

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        showCopyFeedback("Copied to clipboard!");
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
          showCopyFeedback("Copied to clipboard!");
        } else {
          showCopyFeedback("Copy failed - please copy manually", true);
        }
      }
    } catch (err) {
      showCopyFeedback("Copy not supported - please copy manually", true);
    }
  };

  const showCopyFeedback = (
    message: string,
    isError: boolean = false,
  ): void => {
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

  const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = "bash" }) => (
    <div className="code-block-container">
      <div className="code-block-header">
        <span className="code-language">{language}</span>
        <button
          className="copy-button"
          onClick={() => copyToClipboard(code)}
          title="Copy to clipboard"
        >
          📋 Copy
        </button>
      </div>
      <pre className="code-block">
        <code>{code}</code>
      </pre>
    </div>
  );

  useEffect(() => {
    const handleScroll = (): void => {
      const sections = document.querySelectorAll(".doc-section");
      let current = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          current = section.id;
        }
      });

      if (current && current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const navigationItems: NavigationItem[] = [
    { id: "getting-started", title: "🚀 Getting Started", level: 1 },
    { id: "installation", title: "Installation", level: 2 },
    { id: "basic-usage", title: "Basic Usage", level: 2 },
    { id: "api-reference", title: "📚 API Reference", level: 1 },
    { id: "authentication", title: "Authentication", level: 2 },
    { id: "endpoints", title: "Endpoints", level: 2 },
    { id: "examples", title: "Response Examples", level: 2 },
    { id: "integrations", title: "🔧 Integrations", level: 1 },
    { id: "github-app", title: "GitHub App", level: 2 },
    { id: "vscode-extension", title: "VS Code Extension", level: 2 },
    { id: "cli-tool", title: "CLI Tool", level: 2 },
    { id: "tutorials", title: "📖 Tutorials", level: 1 },
    {
      id: "javascript-optimization",
      title: "JavaScript Optimization",
      level: 2,
    },
    { id: "python-performance", title: "Python Performance", level: 2 },
    { id: "cicd-integration", title: "CI/CD Integration", level: 2 },
  ];

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="docs-page">
      <div className="docs-container">
        {/* Sticky Sidebar Navigation */}
        <nav className="docs-sidebar">
          <div className="sidebar-header">
            <h3>Documentation</h3>
          </div>
          <ul className="sidebar-nav">
            {navigationItems.map((item) => (
              <li
                key={item.id}
                className={`nav-item level-${item.level} ${activeSection === item.id ? "active" : ""}`}
              >
                <button
                  className="nav-link"
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="docs-content">
          <header className="docs-header">
            <h1>OptimizeCode.ai Documentation</h1>
            <p className="docs-intro">
              Complete API reference, tutorials, and integration guides for
              OptimizeCode.ai. Get started with AI-powered code optimization in
              minutes.
            </p>
          </header>

          <section id="getting-started" className="doc-section">
            <h2>🚀 Getting Started</h2>
            <p>
              OptimizeCode.ai provides multiple ways to integrate AI-powered
              code optimization into your development workflow. Choose the
              method that best fits your needs.
            </p>

            <div id="installation" className="subsection">
              <h3>Installation</h3>
              <p>Install the OptimizeCode.ai CLI tool globally using npm:</p>
              <CodeBlock
                language="bash"
                code={`# Install CLI globally
npm install -g @optimizecode/cli

# Verify installation
optimize-code --version`}
              />
            </div>

            <div id="basic-usage" className="subsection">
              <h3>Basic Usage</h3>
              <p>Optimize your code files with simple commands:</p>
              <CodeBlock
                language="bash"
                code={`# Optimize a single file
optimize-code ./src/app.js

# Optimize entire directory
optimize-code ./src --recursive

# Output to specific file
optimize-code input.js --output optimized.js`}
              />
            </div>
          </section>

          <section id="api-reference" className="doc-section">
            <h2>📚 API Reference</h2>
            <p>
              The OptimizeCode.ai REST API allows you to integrate code
              optimization directly into your applications and workflows.
            </p>

            <div id="authentication" className="subsection">
              <h3>Authentication</h3>
              <p>All API requests require authentication using your API key:</p>
              <CodeBlock
                language="bash"
                code={`curl -X POST https://api.optimizecode.ai/optimize \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
              />
            </div>

            <div id="endpoints" className="subsection">
              <h3>Endpoints</h3>

              <div className="endpoint-card">
                <h4>POST /optimize</h4>
                <p>Optimize code and return the improved version</p>
                <CodeBlock
                  language="javascript"
                  code={`// Request body
{
  "code": "your source code here",
  "language": "javascript",
  "options": {
    "performance": true,
    "readability": true,
    "security": true
  }
}`}
                />
              </div>

              <div className="endpoint-card">
                <h4>GET /languages</h4>
                <p>Get list of supported programming languages</p>
                <CodeBlock
                  language="bash"
                  code={`curl -X GET https://api.optimizecode.ai/languages \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                />
              </div>
            </div>

            <div id="examples" className="subsection">
              <h3>Response Examples</h3>
              <CodeBlock
                language="json"
                code={`// Successful optimization response
{
  "success": true,
  "original_code": "var x = 1; console.log(x);",
  "optimized_code": "const x = 1;",
  "optimizations": [
    "Replaced var with const",
    "Removed unnecessary console.log"
  ],
  "performance_improvement": "15%",
  "size_reduction": "23%"
}`}
              />
            </div>
          </section>

          <section id="integrations" className="doc-section">
            <h2>🔧 Integrations</h2>
            <p>
              OptimizeCode.ai integrates seamlessly with your existing
              development tools and workflows.
            </p>

            <div id="github-app" className="subsection">
              <h3>GitHub App</h3>
              <p>
                Install the GitHub App to automatically optimize pull requests:
              </p>
              <ol>
                <li>Go to the GitHub Marketplace</li>
                <li>Search for "OptimizeCode.ai"</li>
                <li>Install on your repositories</li>
                <li>
                  Configure optimization rules in <code>.optimizecode.yml</code>
                </li>
              </ol>
              <CodeBlock
                language="yaml"
                code={`# .optimizecode.yml
rules:
  - performance: true
  - security: true
  - auto_merge: false
file_patterns:
  - "src/**/*.js"
  - "src/**/*.ts"`}
              />
            </div>

            <div id="vscode-extension" className="subsection">
              <h3>VS Code Extension</h3>
              <p>Optimize code directly in your editor:</p>
              <ol>
                <li>Install "OptimizeCode.ai" from VS Code Marketplace</li>
                <li>Configure your API key in settings</li>
                <li>Right-click any code file and select "Optimize with AI"</li>
              </ol>
            </div>

            <div id="cli-tool" className="subsection">
              <h3>CLI Tool</h3>
              <p>Integrate with your CI/CD pipeline:</p>
              <CodeBlock
                language="yaml"
                code={`# GitHub Actions example
name: Optimize Code
on: [push]
jobs:
  optimize:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install OptimizeCode CLI
        run: npm install -g @optimizecode/cli
      - name: Optimize code
        run: optimize-code ./src --check-only
        env:
          OPTIMIZECODE_API_KEY: ${"$"}{{ secrets.OPTIMIZECODE_API_KEY }}`}
              />
            </div>
          </section>

          <section id="tutorials" className="doc-section">
            <h2>📖 Tutorials</h2>

            <div id="javascript-optimization" className="subsection">
              <h3>JavaScript Optimization Guide</h3>
              <p>
                Learn how to optimize JavaScript code for better performance:
              </p>

              <div className="tutorial-example">
                <h4>Before Optimization:</h4>
                <CodeBlock
                  language="javascript"
                  code={`// Inefficient array processing
function processUsers(users) {
  var result = [];
  for (var i = 0; i < users.length; i++) {
    for (var j = 0; j < users.length; j++) {
      if (users[i].id === users[j].managerId) {
        result.push({
          employee: users[i],
          manager: users[j]
        });
      }
    }
  }
  return result;
}`}
                />

                <h4>After Optimization:</h4>
                <CodeBlock
                  language="javascript"
                  code={`// Optimized with Map for O(n) complexity
function processUsers(users) {
  const managerMap = new Map(
    users.map(user => [user.id, user])
  );

  return users
    .filter(user => user.managerId)
    .map(employee => ({
      employee,
      manager: managerMap.get(employee.managerId)
    }))
    .filter(pair => pair.manager);
}`}
                />
              </div>
            </div>

            <div id="python-performance" className="subsection">
              <h3>Python Performance Tuning</h3>
              <p>
                Optimize Python code for better performance and memory usage:
              </p>
              <CodeBlock
                language="python"
                code={`# Before: List comprehension with multiple iterations
def process_data(items):
    filtered = [x for x in items if x > 0]
    squared = [x**2 for x in filtered]
    return sum(squared)

# After: Single pass optimization
def process_data(items):
    return sum(x**2 for x in items if x > 0)`}
              />
            </div>

            <div id="cicd-integration" className="subsection">
              <h3>CI/CD Integration</h3>
              <p>
                Set up automated code optimization in your deployment pipeline:
              </p>
              <CodeBlock
                language="bash"
                code={`#!/bin/bash
# pre-deploy-optimization.sh

echo "🚀 Starting code optimization..."

# Optimize JavaScript/TypeScript files
find ./src -name "*.js" -o -name "*.ts" | while read file; do
  echo "Optimizing ${"$"}file..."
  optimize-code "${"$"}file" --output "${"$"}file.optimized"
  mv "${"$"}file.optimized" "${"$"}file"
done

echo "✅ Code optimization complete!"
npm run build`}
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DocsPage;
