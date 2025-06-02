// Updated for TypeScript migration
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import {
  AnimatedSection,
  StaggeredList,
  AnimatedCounter,
  TypewriterText,
  useScrollAnimation,
} from "../components/animations";

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
            <AnimatedSection animation="animate-fade-in-up" delay={200}>
              <h1 className="hero-title">
                <TypewriterText
                  text="AI-Powered Code Optimization"
                  speed={80}
                  delay={500}
                />
                <AnimatedSection animation="animate-bounce-in" delay={3000}>
                  <span className="hero-highlight"> in One Click</span>
                </AnimatedSection>
              </h1>
            </AnimatedSection>

            <AnimatedSection animation="animate-fade-in-up" delay={600}>
              <p className="hero-subtitle">
                Transform your code instantly with advanced AI. Boost
                performance by 40%, reduce cloud costs, and improve readability
                across 15+ programming languages.
              </p>
            </AnimatedSection>

            <AnimatedSection animation="animate-fade-in-up" delay={800}>
              <div className="hero-actions">
                <Link
                  to="/optimize"
                  className="btn-primary interactive-cta group hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
                >
                  <span className="cta-text">Start Optimizing Free</span>
                  <span className="cta-arrow transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <a
                  href="#demo"
                  className="btn-secondary interactive-cta group hover:shadow-lg transition-all duration-300"
                >
                  <span className="cta-text">Watch Demo</span>
                  <span className="cta-icon transition-transform duration-300 group-hover:scale-125">
                    ▶
                  </span>
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="animate-fade-in" delay={1000}>
              <p className="hero-trust">
                <span className="trust-item animate-pulse-gentle">
                  ✅ Free forever
                </span>
                <span className="trust-divider">•</span>
                <span className="trust-item">🔒 No credit card required</span>
                <span className="trust-divider">•</span>
                <span className="trust-item">⚡ 2M+ lines optimized</span>
              </p>
            </AnimatedSection>
          </div>

          <AnimatedSection animation="animate-float" delay={400}>
            <div className="hero-visual">
              <div className="code-preview hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                <div className="code-header">
                  <div className="code-tabs">
                    <span className="tab active">app.js</span>
                    <span className="tab">optimized.js</span>
                  </div>
                  <div className="optimization-badge animate-pulse-gentle">
                    ✨ 47% faster
                  </div>
                </div>
                <div className="code-content">
                  <div className="code-line animate-stagger-1">
                    <span className="line-number">1</span>
                    <span className="code-text">
                      const optimizedCode = ai.transform(yourCode)
                    </span>
                  </div>
                  <div className="code-line animate-stagger-2">
                    <span className="line-number">2</span>
                    <span className="code-text">
                      // ⚡ Performance improved by 40%
                    </span>
                  </div>
                  <div className="code-line animate-stagger-3">
                    <span className="line-number">3</span>
                    <span className="code-text">
                      // 💰 Cloud costs reduced by 60%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 2. Enhanced Social Proof Bar */}
      <section className="social-proof">
        <div className="container">
          <AnimatedSection animation="animate-fade-in">
            <p className="social-proof-text">Trusted by developers at</p>
          </AnimatedSection>

          <StaggeredList
            className="social-proof-logos"
            staggerDelay={100}
            animation="animate-fade-in-up"
          >
            {[
              { icon: "🚀", name: "Startups" },
              { icon: "🏢", name: "Fortune 500" },
              { icon: "🎯", name: "Scale-ups" },
              { icon: "💻", name: "Agencies" },
              { icon: "🔬", name: "Research Labs" },
            ].map((item, index) => (
              <div
                key={index}
                className="logo-item group hover:scale-110 hover:-translate-y-1 transition-all duration-300"
              >
                <span className="logo-icon group-hover:animate-bounce">
                  {item.icon}
                </span>
                <span className="logo-name">{item.name}</span>
              </div>
            ))}
          </StaggeredList>
        </div>
      </section>

      {/* 3. Enhanced Problem → Solution Split */}
      <section className="problem-solution">
        <div className="container">
          <div className="split-layout">
            <AnimatedSection
              animation="animate-fade-in-left"
              className="problem-side"
            >
              <h2 className="animate-fade-in-up">
                The Code Performance Problem
              </h2>
              <StaggeredList
                className="pain-points"
                staggerDelay={200}
                animation="animate-fade-in-up"
              >
                {[
                  {
                    icon: "⚡",
                    title: "Slow Application Performance",
                    description:
                      "Unoptimized code causes 60% slower load times and poor user experience",
                    stat: "❌ 3.2s average load time",
                    iconAnimation: "hover:animate-wiggle",
                  },
                  {
                    icon: "💰",
                    title: "High Cloud Computing Costs",
                    description:
                      "Inefficient code increases server costs by 40-70% unnecessarily",
                    stat: "💸 $847k annual overspend",
                    iconAnimation: "hover:animate-bounce",
                  },
                  {
                    icon: "🔍",
                    title: "Hard to Maintain Legacy Code",
                    description:
                      "Technical debt slows development and increases bug risk",
                    stat: "🐛 73% more bugs in legacy code",
                    iconAnimation: "hover:animate-pulse-gentle",
                  },
                ].map((pain, index) => (
                  <div
                    key={index}
                    className="pain-point group hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                  >
                    <span
                      className={`pain-icon text-2xl transition-all duration-300 group-hover:scale-125 ${pain.iconAnimation}`}
                    >
                      {pain.icon}
                    </span>
                    <div>
                      <h3 className="group-hover:text-red-400 transition-colors duration-300">
                        {pain.title}
                      </h3>
                      <p>{pain.description}</p>
                      <div className="pain-stat animate-pulse-gentle">
                        {pain.stat}
                      </div>
                    </div>
                  </div>
                ))}
              </StaggeredList>
            </AnimatedSection>

            <AnimatedSection
              animation="animate-fade-in-right"
              delay={300}
              className="solution-side"
            >
              <h2 className="animate-fade-in-up">
                How OptimizeCode.ai Solves It
              </h2>
              <StaggeredList
                className="solutions"
                staggerDelay={200}
                animation="animate-fade-in-up"
              >
                {[
                  {
                    icon: "⚡",
                    title: "Instant Performance Boost",
                    description:
                      "AI analyzes and optimizes algorithms, reducing execution time by 40%+",
                    stat: "✅ 1.1s optimized load time",
                    iconAnimation: "hover:animate-wiggle",
                  },
                  {
                    icon: "💡",
                    title: "Smart Cost Optimization",
                    description:
                      "Reduces cloud bills through efficient resource usage and better algorithms",
                    stat: "💰 $312k annual savings",
                    iconAnimation: "hover:animate-bounce",
                  },
                  {
                    icon: "🛡️",
                    title: "Enhanced Code Quality",
                    description:
                      "Modernizes syntax, improves readability, and reduces security vulnerabilities",
                    stat: "🎯 95% fewer vulnerabilities",
                    iconAnimation: "hover:animate-heart-beat",
                  },
                ].map((solution, index) => (
                  <div
                    key={index}
                    className="solution group hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                  >
                    <span
                      className={`solution-icon text-2xl transition-all duration-300 group-hover:scale-125 ${solution.iconAnimation}`}
                    >
                      {solution.icon}
                    </span>
                    <div>
                      <h3 className="group-hover:text-primary transition-colors duration-300">
                        {solution.title}
                      </h3>
                      <p>{solution.description}</p>
                      <div className="solution-stat animate-pulse-gentle">
                        {solution.stat}
                      </div>
                    </div>
                  </div>
                ))}
              </StaggeredList>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 4. Feature Highlights with consistent iconography */}
      <section className="features">
        <div className="container">
          <AnimatedSection animation="animate-fade-in-up">
            <h2 className="section-title">
              Powerful Features for Modern Development
            </h2>
          </AnimatedSection>

          <StaggeredList
            className="features-grid"
            staggerDelay={150}
            animation="animate-fade-in-up"
          >
            {[
              {
                icon: "⚡",
                title: "Lightning Speed",
                description:
                  "Optimize code in seconds, not hours. Our AI processes millions of lines instantly.",
                stat: "40% faster execution",
                link: "/product",
                hoverAnimation: "hover:animate-wiggle",
              },
              {
                icon: "💰",
                title: "Cost Savings",
                description:
                  "Reduce cloud computing costs through intelligent resource optimization.",
                stat: "60% lower bills",
                link: "/solutions",
                hoverAnimation: "hover:animate-bounce",
              },
              {
                icon: "📖",
                title: "Better Readability",
                description:
                  "Transform complex code into clean, maintainable, well-documented solutions.",
                stat: "90% cleaner code",
                link: "/product",
                hoverAnimation: "hover:animate-pulse-gentle",
              },
              {
                icon: "🛡️",
                title: "Enhanced Security",
                description:
                  "Identify and fix security vulnerabilities while optimizing performance.",
                stat: "Zero breaches",
                link: "/security",
                hoverAnimation: "hover:animate-heart-beat",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-card group hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500"
              >
                <div
                  className={`feature-icon text-4xl transition-all duration-300 group-hover:scale-125 ${feature.hoverAnimation}`}
                >
                  {feature.icon}
                </div>
                <h3 className="group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p>{feature.description}</p>
                <div className="feature-stat animate-pulse-gentle">
                  {feature.stat}
                </div>
                <Link
                  to={feature.link}
                  className="feature-link group-hover:text-primary transition-all duration-300 hover:translate-x-2"
                >
                  Learn more →
                </Link>
              </div>
            ))}
          </StaggeredList>
        </div>
      </section>

      {/* 5. How It Works with visual connectors */}
      <section className="how-it-works">
        <div className="container">
          <AnimatedSection animation="animate-fade-in-up">
            <h2 className="section-title">Simple 3-Step Process</h2>
          </AnimatedSection>

          <div className="steps">
            <AnimatedSection animation="animate-scale-in" delay={200}>
              <div className="step group hover:scale-105 hover:-translate-y-2 transition-all duration-500">
                <div className="step-number bg-gradient-to-br from-primary to-primary-dark animate-pulse-gentle group-hover:animate-bounce">
                  1
                </div>
                <div className="step-content">
                  <h3 className="group-hover:text-primary transition-colors duration-300">
                    <span className="group-hover:animate-bounce inline-block">
                      📤
                    </span>{" "}
                    Upload Your Code
                  </h3>
                  <p>
                    Drag & drop files, paste code, or connect your GitHub
                    repository
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="animate-draw-line" delay={600}>
              <div className="step-connector">
                <div className="connector-line"></div>
                <div className="connector-arrow animate-pulse-gentle hover:animate-wiggle transition-all duration-300">
                  →
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="animate-scale-in" delay={800}>
              <div className="step group hover:scale-105 hover:-translate-y-2 transition-all duration-500">
                <div className="step-number bg-gradient-to-br from-primary to-primary-dark animate-pulse-gentle group-hover:animate-bounce">
                  2
                </div>
                <div className="step-content">
                  <h3 className="group-hover:text-primary transition-colors duration-300">
                    <span className="group-hover:animate-spin inline-block">
                      🤖
                    </span>{" "}
                    AI Analysis
                  </h3>
                  <p>
                    Our advanced AI analyzes performance, security, and
                    optimization opportunities
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="animate-draw-line" delay={1200}>
              <div className="step-connector">
                <div className="connector-line"></div>
                <div className="connector-arrow animate-pulse-gentle hover:animate-wiggle transition-all duration-300">
                  →
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="animate-scale-in" delay={1400}>
              <div className="step group hover:scale-105 hover:-translate-y-2 transition-all duration-500">
                <div className="step-number bg-gradient-to-br from-primary to-primary-dark animate-pulse-gentle group-hover:animate-bounce">
                  3
                </div>
                <div className="step-content">
                  <h3 className="group-hover:text-primary transition-colors duration-300">
                    <span className="group-hover:animate-heart-beat inline-block">
                      ✨
                    </span>{" "}
                    Get Optimized Code
                  </h3>
                  <p>
                    Review improvements and apply changes with detailed
                    explanations
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 6. Animated Performance Metrics */}
      <section className="metrics">
        <div className="container">
          <AnimatedSection animation="animate-fade-in-up">
            <h2 className="section-title">Proven Results</h2>
          </AnimatedSection>

          <StaggeredList
            className="metrics-grid"
            staggerDelay={150}
            animation="animate-scale-in"
          >
            {[
              {
                value: 40,
                suffix: "%",
                label: "Faster Execution",
                description: "Average performance improvement",
                icon: "⚡",
                color: "text-green-400",
              },
              {
                value: 60,
                suffix: "%",
                label: "Cost Reduction",
                description: "Cloud infrastructure savings",
                icon: "💰",
                color: "text-blue-400",
              },
              {
                value: 2,
                suffix: "M+",
                label: "Lines Optimized",
                description: "Code transformations completed",
                icon: "📝",
                color: "text-purple-400",
              },
              {
                value: 15,
                suffix: "+",
                label: "Languages Supported",
                description: "Programming languages and frameworks",
                icon: "🔧",
                color: "text-orange-400",
              },
            ].map((metric, index) => (
              <div
                key={index}
                className="metric group hover:scale-110 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500"
              >
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl group-hover:animate-bounce">
                    {metric.icon}
                  </span>
                </div>
                <div
                  className={`metric-value ${metric.color} group-hover:animate-pulse-gentle`}
                >
                  <AnimatedCounter
                    end={metric.value}
                    suffix={metric.suffix}
                    duration={2000}
                    threshold={0.3}
                  />
                </div>
                <div className="metric-label group-hover:text-primary transition-colors duration-300">
                  {metric.label}
                </div>
                <div className="metric-description">{metric.description}</div>
              </div>
            ))}
          </StaggeredList>
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
