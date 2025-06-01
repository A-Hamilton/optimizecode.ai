// Updated for TypeScript migration
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

interface AnimatedMetrics {
  performance: string;
  cost: string;
  lines: string;
  languages: string;
}

const HomePage: React.FC = () => {
  const [animatedMetrics, setAnimatedMetrics] = useState<AnimatedMetrics>({
    performance: "0%",
    cost: "0%",
    lines: "0",
    languages: "0",
  });
  const [isMetricsVisible, setIsMetricsVisible] = useState<boolean>(false);
  const metricsRef = useRef<HTMLElement>(null);

  // Animated counter for metrics
  const animateValue = (
    start: number,
    end: number,
    duration: number,
    setter: (value: string) => void,
    suffix: string = "",
  ): void => {
    const startTime = Date.now();
    const step = (): void => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      setter(current + suffix);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  // Intersection Observer for metrics animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isMetricsVisible) {
            setIsMetricsVisible(true);

            // Animate metrics with delays
            setTimeout(
              () =>
                animateValue(
                  0,
                  40,
                  1500,
                  (val: string) =>
                    setAnimatedMetrics((prev) => ({
                      ...prev,
                      performance: val,
                    })),
                  "%",
                ),
              200,
            );

            setTimeout(
              () =>
                animateValue(
                  0,
                  60,
                  1500,
                  (val: string) =>
                    setAnimatedMetrics((prev) => ({ ...prev, cost: val })),
                  "%",
                ),
              400,
            );

            setTimeout(
              () =>
                animateValue(
                  0,
                  2,
                  1500,
                  (val: string) =>
                    setAnimatedMetrics((prev) => ({
                      ...prev,
                      lines: val,
                    })),
                  "M+",
                ),
              600,
            );

            setTimeout(
              () =>
                animateValue(
                  0,
                  15,
                  1500,
                  (val: string) =>
                    setAnimatedMetrics((prev) => ({
                      ...prev,
                      languages: val,
                    })),
                  "+",
                ),
              800,
            );
          }
        });
      },
      { threshold: 0.5 },
    );

    if (metricsRef.current) {
      observer.observe(metricsRef.current);
    }

    return () => observer.disconnect();
  }, [isMetricsVisible]);

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
              <Link to="/optimize" className="btn-primary interactive-cta">
                <span className="cta-text">Start Optimizing Free</span>
                <span className="cta-arrow">→</span>
              </Link>
              <a href="#demo" className="btn-secondary interactive-cta">
                <span className="cta-text">Watch Demo</span>
                <span className="cta-icon">▶</span>
              </a>
            </div>
            <p className="hero-trust">
              <span className="trust-item">✅ Free forever</span>
              <span className="trust-divider">•</span>
              <span className="trust-item">🔒 No credit card required</span>
              <span className="trust-divider">•</span>
              <span className="trust-item">⚡ 2M+ lines optimized</span>
            </p>
          </div>
          <div className="hero-visual">
            <div className="code-preview">
              <div className="code-header">
                <div className="code-tabs">
                  <span className="tab active">app.js</span>
                  <span className="tab">optimized.js</span>
                </div>
                <div className="optimization-badge">✨ 47% faster</div>
              </div>
              <div className="code-content">
                <div className="code-line">
                  <span className="line-number">1</span>
                  <span className="code-text">
                    const optimizedCode = ai.transform(yourCode)
                  </span>
                </div>
                <div className="code-line">
                  <span className="line-number">2</span>
                  <span className="code-text">
                    // ⚡ Performance improved by 40%
                  </span>
                </div>
                <div className="code-line">
                  <span className="line-number">3</span>
                  <span className="code-text">
                    // 💰 Cloud costs reduced by 60%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Enhanced Social Proof Bar */}
      <section className="social-proof">
        <div className="container">
          <p className="social-proof-text">Trusted by developers at</p>
          <div className="social-proof-logos">
            <div className="logo-item">
              <span className="logo-icon">🚀</span>
              <span className="logo-name">Startups</span>
            </div>
            <div className="logo-item">
              <span className="logo-icon">🏢</span>
              <span className="logo-name">Fortune 500</span>
            </div>
            <div className="logo-item">
              <span className="logo-icon">🎯</span>
              <span className="logo-name">Scale-ups</span>
            </div>
            <div className="logo-item">
              <span className="logo-icon">💻</span>
              <span className="logo-name">Agencies</span>
            </div>
            <div className="logo-item">
              <span className="logo-icon">🔬</span>
              <span className="logo-name">Research Labs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Enhanced Problem → Solution Split */}
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
                    <div className="pain-stat">❌ 3.2s average load time</div>
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
                    <div className="pain-stat">💸 $847k annual overspend</div>
                  </div>
                </div>
                <div className="pain-point">
                  <span className="pain-icon">🔍</span>
                  <div>
                    <h3>Hard to Maintain Legacy Code</h3>
                    <p>
                      Technical debt slows development and increases bug risk
                    </p>
                    <div className="pain-stat">
                      🐛 73% more bugs in legacy code
                    </div>
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
                    <div className="solution-stat">
                      ✅ 1.1s optimized load time
                    </div>
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
                    <div className="solution-stat">💰 $312k annual savings</div>
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
                    <div className="solution-stat">
                      🎯 95% fewer vulnerabilities
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Highlights with consistent iconography */}
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
              <Link to="/product" className="feature-link">
                Learn more →
              </Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Cost Savings</h3>
              <p>
                Reduce cloud computing costs through intelligent resource
                optimization.
              </p>
              <div className="feature-stat">60% lower bills</div>
              <Link to="/solutions" className="feature-link">
                Learn more →
              </Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Better Readability</h3>
              <p>
                Transform complex code into clean, maintainable, well-documented
                solutions.
              </p>
              <div className="feature-stat">90% cleaner code</div>
              <Link to="/product" className="feature-link">
                Learn more →
              </Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Enhanced Security</h3>
              <p>
                Identify and fix security vulnerabilities while optimizing
                performance.
              </p>
              <div className="feature-stat">Zero breaches</div>
              <Link to="/security" className="feature-link">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works with visual connectors */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">Simple 3-Step Process</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>📤 Upload Your Code</h3>
                <p>
                  Drag & drop files, paste code, or connect your GitHub
                  repository
                </p>
              </div>
            </div>
            <div className="step-connector">
              <div className="connector-line"></div>
              <div className="connector-arrow">→</div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>🤖 AI Analysis</h3>
                <p>
                  Our advanced AI analyzes performance, security, and
                  optimization opportunities
                </p>
              </div>
            </div>
            <div className="step-connector">
              <div className="connector-line"></div>
              <div className="connector-arrow">→</div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>✨ Get Optimized Code</h3>
                <p>
                  Review improvements and apply changes with detailed
                  explanations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Animated Performance Metrics */}
      <section className="metrics" ref={metricsRef}>
        <div className="container">
          <h2 className="section-title">Proven Results</h2>
          <div className="metrics-grid">
            <div className="metric animated">
              <div className="metric-value">
                {animatedMetrics.performance || "40%"}
              </div>
              <div className="metric-label">Faster Execution</div>
              <div className="metric-description">
                Average performance improvement
              </div>
            </div>
            <div className="metric animated">
              <div className="metric-value">
                {animatedMetrics.cost || "60%"}
              </div>
              <div className="metric-label">Cost Reduction</div>
              <div className="metric-description">
                Cloud infrastructure savings
              </div>
            </div>
            <div className="metric animated">
              <div className="metric-value">
                {animatedMetrics.lines || "2M+"}
              </div>
              <div className="metric-label">Lines Optimized</div>
              <div className="metric-description">
                Code transformations completed
              </div>
            </div>
            <div className="metric animated">
              <div className="metric-value">
                {animatedMetrics.languages || "15+"}
              </div>
              <div className="metric-label">Languages Supported</div>
              <div className="metric-description">
                Programming languages and frameworks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pricing Teaser */}
      <section className="pricing-teaser">
        <div className="container">
          <div className="pricing-content">
            <h2>Start Optimizing Today</h2>
            <p>Free forever plan • No credit card required • Upgrade anytime</p>
            <div className="pricing-actions">
              <Link to="/optimize" className="btn-primary interactive-cta">
                <span className="cta-text">Try Free Now</span>
                <span className="cta-arrow">→</span>
              </Link>
              <Link to="/pricing" className="btn-outline interactive-cta">
                <span className="cta-text">View Pricing</span>
                <span className="cta-icon">💰</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
