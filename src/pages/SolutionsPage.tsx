import React, { useState } from "react";
import "./SolutionsPage.css";

interface Benefit {
  metric: string;
  description: string;
}

interface CaseStudy {
  company: string;
  result: string;
  improvement: string;
}

interface Solution {
  id: string;
  category: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: Benefit[];
  useCases: string[];
  technologies: string[];
  caseStudy: CaseStudy;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const SolutionsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const solutions: Solution[] = [
    {
      id: "performance",
      category: "performance",
      icon: "🚀",
      title: "Performance-Critical Applications",
      subtitle: "Gaming, fintech, and real-time systems",
      description:
        "Optimize latency-sensitive applications where every millisecond counts. Perfect for high-frequency trading, real-time gaming, and interactive media applications.",
      benefits: [
        { metric: "40% faster", description: "execution speed" },
        { metric: "60% less", description: "memory usage" },
        { metric: "25% lower", description: "CPU utilization" },
      ],
      useCases: [
        "High-frequency trading platforms",
        "Real-time multiplayer games",
        "Video streaming applications",
        "IoT sensor processing",
      ],
      technologies: ["JavaScript", "C++", "Python", "Go", "Rust"],
      caseStudy: {
        company: "TradingPro",
        result: "Reduced trade execution latency from 15ms to 8ms",
        improvement: "47% faster",
      },
    },
    {
      id: "cost-reduction",
      category: "cost",
      icon: "💰",
      title: "Cloud Cost Optimization",
      subtitle: "AWS, Azure, and GCP efficiency",
      description:
        "Dramatically reduce cloud computing costs through intelligent code optimization. Minimize resource consumption while maintaining performance.",
      benefits: [
        { metric: "65% savings", description: "on cloud bills" },
        { metric: "80% less", description: "server instances" },
        { metric: "50% reduction", description: "in data transfer" },
      ],
      useCases: [
        "Microservices architectures",
        "Serverless functions optimization",
        "Container workload efficiency",
        "Database query optimization",
      ],
      technologies: ["Node.js", "Python", "Java", "Docker", "Kubernetes"],
      caseStudy: {
        company: "CloudScale Inc",
        result: "Reduced AWS costs from $45k to $16k monthly",
        improvement: "64% cost savings",
      },
    },
    {
      id: "legacy-modernization",
      category: "modernization",
      icon: "🔄",
      title: "Legacy Code Modernization",
      subtitle: "Transform outdated codebases safely",
      description:
        "Safely modernize legacy applications while preserving functionality. Upgrade to modern frameworks, patterns, and best practices.",
      benefits: [
        { metric: "3x faster", description: "development cycles" },
        { metric: "70% fewer", description: "bugs introduced" },
        { metric: "90% reduction", description: "in technical debt" },
      ],
      useCases: [
        "Monolith to microservices migration",
        "Framework upgrades (Angular, React)",
        "Database modernization",
        "API refactoring and optimization",
      ],
      technologies: [
        "Legacy JavaScript",
        "Java Enterprise",
        "PHP",
        ".NET",
        "Python 2 to 3",
      ],
      caseStudy: {
        company: "FinanceCore",
        result: "Migrated 500k LOC from jQuery to React in 3 months",
        improvement: "75% faster feature delivery",
      },
    },
    {
      id: "security-hardening",
      category: "security",
      icon: "🔒",
      title: "Security Enhancement",
      subtitle: "Identify and fix vulnerabilities automatically",
      description:
        "Automatically detect and resolve security vulnerabilities while optimizing code. Ensure compliance with security standards.",
      benefits: [
        { metric: "95% reduction", description: "in security issues" },
        { metric: "100% compliance", description: "with OWASP standards" },
        { metric: "0 known", description: "vulnerabilities post-optimization" },
      ],
      useCases: [
        "SQL injection prevention",
        "XSS vulnerability fixes",
        "Authentication improvements",
        "Data encryption optimization",
      ],
      technologies: [
        "All supported languages",
        "OWASP Standards",
        "Security Frameworks",
      ],
      caseStudy: {
        company: "SecureBank",
        result: "Eliminated 143 security vulnerabilities in production code",
        improvement: "100% security compliance",
      },
    },
    {
      id: "scalability",
      category: "performance",
      icon: "📈",
      title: "Scalability Optimization",
      subtitle: "Handle millions of users efficiently",
      description:
        "Optimize applications to handle massive scale. Improve concurrent user capacity and system throughput.",
      benefits: [
        { metric: "10x more", description: "concurrent users" },
        { metric: "5x better", description: "response times" },
        { metric: "90% less", description: "server downtime" },
      ],
      useCases: [
        "High-traffic web applications",
        "API rate limiting optimization",
        "Database connection pooling",
        "Caching strategy implementation",
      ],
      technologies: ["Node.js", "Python", "Java", "Redis", "MongoDB"],
      caseStudy: {
        company: "SocialHub",
        result: "Increased user capacity from 10k to 100k concurrent users",
        improvement: "1000% scalability increase",
      },
    },
    {
      id: "mobile-optimization",
      category: "performance",
      icon: "📱",
      title: "Mobile App Performance",
      subtitle: "Optimize for mobile devices and networks",
      description:
        "Enhance mobile application performance with optimizations for battery life, network efficiency, and resource constraints.",
      benefits: [
        { metric: "45% longer", description: "battery life" },
        { metric: "60% faster", description: "app startup" },
        { metric: "30% smaller", description: "app bundle size" },
      ],
      useCases: [
        "React Native optimization",
        "Flutter performance tuning",
        "Progressive Web App optimization",
        "Offline functionality improvements",
      ],
      technologies: ["React Native", "Flutter", "Swift", "Kotlin", "PWA"],
      caseStudy: {
        company: "MobileFirst",
        result: "Improved app store rating from 3.2 to 4.7 stars",
        improvement: "47% user satisfaction increase",
      },
    },
  ];

  const categories: Category[] = [
    { id: "all", name: "All Solutions", icon: "🎯" },
    { id: "performance", name: "Performance", icon: "⚡" },
    { id: "cost", name: "Cost Optimization", icon: "💰" },
    { id: "modernization", name: "Modernization", icon: "🔄" },
    { id: "security", name: "Security", icon: "🔒" },
  ];

  const filteredSolutions =
    activeFilter === "all"
      ? solutions
      : solutions.filter((solution) => solution.category === activeFilter);

  return (
    <div className="solutions-page">
      <div className="container">
        {/* Header Section */}
        <header className="solutions-header">
          <h1>Solutions for Every Challenge</h1>
          <p>
            OptimizeCode.ai provides specialized solutions for different
            industries and use cases. Discover how AI-powered optimization can
            transform your specific challenges into competitive advantages.
          </p>
        </header>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`filter-button ${activeFilter === category.id ? "active" : ""}`}
              onClick={() => setActiveFilter(category.id)}
            >
              <span className="filter-icon">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Solutions Grid */}
        <div className="solutions-grid">
          {filteredSolutions.map((solution) => (
            <div key={solution.id} className="solution-card">
              <div className="solution-header">
                <div className="solution-icon">{solution.icon}</div>
                <div className="solution-title-section">
                  <h3 className="solution-title">{solution.title}</h3>
                  <p className="solution-subtitle">{solution.subtitle}</p>
                </div>
              </div>

              <p className="solution-description">{solution.description}</p>

              {/* Key Benefits with Metrics */}
              <div className="benefits-section">
                <h4>Key Benefits</h4>
                <div className="benefits-grid">
                  {solution.benefits.map((benefit, index) => (
                    <div key={index} className="benefit-item">
                      <div className="benefit-metric">{benefit.metric}</div>
                      <div className="benefit-description">
                        {benefit.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div className="use-cases-section">
                <h4>Common Use Cases</h4>
                <ul className="use-cases-list">
                  {solution.useCases.map((useCase, index) => (
                    <li key={index}>{useCase}</li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div className="technologies-section">
                <h4>Supported Technologies</h4>
                <div className="tech-tags">
                  {solution.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Case Study */}
              <div className="case-study">
                <h4>Success Story</h4>
                <div className="case-study-content">
                  <div className="case-study-company">
                    {solution.caseStudy.company}
                  </div>
                  <div className="case-study-result">
                    {solution.caseStudy.result}
                  </div>
                  <div className="case-study-improvement">
                    {solution.caseStudy.improvement}
                  </div>
                </div>
              </div>

              <button className="solution-cta">
                Learn More & Get Started
                <span className="cta-arrow">→</span>
              </button>
            </div>
          ))}
        </div>

        {/* Industries Section */}
        <section className="industries-section">
          <h2>Trusted by Leading Industries</h2>
          <div className="industries-grid">
            <div className="industry-item">
              <div className="industry-icon">🏦</div>
              <h3>Financial Services</h3>
              <p>
                High-frequency trading, risk analysis, and regulatory compliance
                systems
              </p>
            </div>
            <div className="industry-item">
              <div className="industry-icon">🎮</div>
              <h3>Gaming & Entertainment</h3>
              <p>
                Real-time multiplayer games, streaming platforms, and
                interactive media
              </p>
            </div>
            <div className="industry-item">
              <div className="industry-icon">🏥</div>
              <h3>Healthcare</h3>
              <p>
                Medical imaging, patient monitoring, and health data processing
              </p>
            </div>
            <div className="industry-item">
              <div className="industry-icon">🛒</div>
              <h3>E-commerce</h3>
              <p>
                Product recommendation engines, payment processing, and
                inventory management
              </p>
            </div>
            <div className="industry-item">
              <div className="industry-icon">🚗</div>
              <h3>Automotive</h3>
              <p>
                Autonomous driving systems, vehicle diagnostics, and fleet
                management
              </p>
            </div>
            <div className="industry-item">
              <div className="industry-icon">🏭</div>
              <h3>Manufacturing</h3>
              <p>
                IoT sensor networks, predictive maintenance, and supply chain
                optimization
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="solutions-cta">
          <div className="cta-content">
            <h2>Ready to Transform Your Code?</h2>
            <p>
              Choose your optimization strategy and start seeing results in
              minutes. Our AI analyzes your specific use case and applies the
              most effective optimizations.
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
};

export default SolutionsPage;
