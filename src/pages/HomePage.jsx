import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="homepage">
      {/* 1. Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              AI-Powered Code Optimization
              <span className="hero-highlight"> in One Click</span>
            </h1>
            <p className="hero-subtitle">
              Transform your code instantly with advanced AI. Boost performance
              by 40%, reduce cloud costs, and improve readability across 15+
              programming languages.
            </p>
            <div className="hero-actions">
              <Link to="/optimize" className="btn-primary">
                Start Optimizing Free
              </Link>
              <a href="#demo" className="btn-secondary">
                Watch Demo
              </a>
            </div>
            <p className="hero-trust">
              Free forever • No credit card required • 2M+ lines optimized
            </p>
          </div>
        </div>
      </section>

      {/* 2. Social Proof Bar */}
      <section className="social-proof">
        <div className="container">
          <p className="social-proof-text">Trusted by developers at</p>
          <div className="social-proof-logos">
            <div className="logo-item">🚀 Startup</div>
            <div className="logo-item">🏢 Enterprise</div>
            <div className="logo-item">🎯 Scale-up</div>
            <div className="logo-item">💻 Freelance</div>
            <div className="logo-item">🔬 Research</div>
          </div>
        </div>
      </section>

      {/* 3. Problem → Solution Split */}
      <section className="problem-solution">
        <div className="container">
          <div className="split-layout">
            <div className="problem-side">
              <h2>The Code Performance Problem</h2>
              <div className="pain-points">
                <div className="pain-point">
                  <span className="pain-icon">⚡</span>
                  <div>
                    <h3>Slow Application Performance</h3>
                    <p>
                      Unoptimized code causes 60% slower load times and poor
                      user experience
                    </p>
                  </div>
                </div>
                <div className="pain-point">
                  <span className="pain-icon">💰</span>
                  <div>
                    <h3>High Cloud Computing Costs</h3>
                    <p>
                      Inefficient code increases server costs by 40-70%
                      unnecessarily
                    </p>
                  </div>
                </div>
                <div className="pain-point">
                  <span className="pain-icon">🔍</span>
                  <div>
                    <h3>Hard to Maintain Legacy Code</h3>
                    <p>
                      Technical debt slows development and increases bug risk
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="solution-side">
              <h2>How OptimizeCode.ai Solves It</h2>
              <div className="solutions">
                <div className="solution">
                  <span className="solution-icon">⚡</span>
                  <div>
                    <h3>Instant Performance Boost</h3>
                    <p>
                      AI analyzes and optimizes algorithms, reducing execution
                      time by 40%+
                    </p>
                  </div>
                </div>
                <div className="solution">
                  <span className="solution-icon">💡</span>
                  <div>
                    <h3>Smart Cost Optimization</h3>
                    <p>
                      Reduces cloud bills through efficient resource usage and
                      better algorithms
                    </p>
                  </div>
                </div>
                <div className="solution">
                  <span className="solution-icon">🛡️</span>
                  <div>
                    <h3>Enhanced Code Quality</h3>
                    <p>
                      Modernizes syntax, improves readability, and reduces
                      security vulnerabilities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Highlights */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">
            Powerful Features for Modern Development
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Speed</h3>
              <p>
                Optimize code in seconds, not hours. Our AI processes millions
                of lines instantly.
              </p>
              <div className="feature-stat">40% faster execution</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Cost Savings</h3>
              <p>
                Reduce cloud computing costs through intelligent resource
                optimization.
              </p>
              <div className="feature-stat">60% lower bills</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Better Readability</h3>
              <p>
                Transform complex code into clean, maintainable, well-documented
                solutions.
              </p>
              <div className="feature-stat">90% cleaner code</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Enhanced Security</h3>
              <p>
                Identify and fix security vulnerabilities while optimizing
                performance.
              </p>
              <div className="feature-stat">Zero breaches</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">Simple 3-Step Process</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Upload Your Code</h3>
                <p>
                  Drag & drop files, paste code, or connect your GitHub
                  repository
                </p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>AI Analysis</h3>
                <p>
                  Our advanced AI analyzes performance, security, and
                  optimization opportunities
                </p>
              </div>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get Optimized Code</h3>
                <p>
                  Review improvements and apply changes with detailed
                  explanations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Performance Metrics */}
      <section className="metrics">
        <div className="container">
          <h2 className="section-title">Proven Results</h2>
          <div className="metrics-grid">
            <div className="metric">
              <div className="metric-value">40%</div>
              <div className="metric-label">Faster Execution</div>
            </div>
            <div className="metric">
              <div className="metric-value">60%</div>
              <div className="metric-label">Cost Reduction</div>
            </div>
            <div className="metric">
              <div className="metric-value">2M+</div>
              <div className="metric-label">Lines Optimized</div>
            </div>
            <div className="metric">
              <div className="metric-value">15+</div>
              <div className="metric-label">Languages Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Developer Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Developers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial">
              <div className="testimonial-content">
                "OptimizeCode.ai reduced our API response time by 45%. Our users
                love the faster experience!"
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍💻</div>
                <div>
                  <div className="author-name">Sarah Chen</div>
                  <div className="author-role">
                    Senior Developer at TechCorp
                  </div>
                </div>
                <div className="author-lang">⚛️ React</div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                "Cut our AWS costs by 60% just by optimizing our Python data
                processing pipeline."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👩‍💻</div>
                <div>
                  <div className="author-name">Mike Rodriguez</div>
                  <div className="author-role">CTO at DataFlow</div>
                </div>
                <div className="author-lang">🐍 Python</div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                "The code quality improvements are incredible. My team can
                actually understand our legacy codebase now."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍💻</div>
                <div>
                  <div className="author-name">Alex Kim</div>
                  <div className="author-role">Lead Engineer at StartupXYZ</div>
                </div>
                <div className="author-lang">📱 TypeScript</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Pricing Teaser */}
      <section className="pricing-teaser">
        <div className="container">
          <div className="pricing-content">
            <h2>Start Optimizing Today</h2>
            <p>Free forever plan • No credit card required • Upgrade anytime</p>
            <div className="pricing-actions">
              <Link to="/optimize" className="btn-primary">
                Try Free Now
              </Link>
              <Link to="/pricing" className="btn-outline">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Final CTA Banner */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Optimize Your Code?</h2>
            <p>
              Join thousands of developers who've already improved their code
              performance
            </p>
            <Link to="/optimize" className="btn-cta-large">
              Start Your Free Trial →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
