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
import InteractiveCodePreview from "../components/InteractiveCodePreview";

interface CodeExample {
  id: string;
  name: string;
  language: string;
  originalCode: string;
  optimizedCode: string;
  improvements: string[];
}

const codeExamples: CodeExample[] = [
  {
    id: "js-array",
    name: "Array Processing",
    language: "javascript",
    originalCode: `// Inefficient array processing
function processUsers(users) {
  var result = [];
  for (var i = 0; i < users.length; i++) {
    if (users[i].active === true) {
      var user = users[i];
      result.push({
        id: user.id,
        name: user.name,
        email: user.email
      });
    }
  }
  return result;
}`,
    optimizedCode: `// Optimized with modern ES6+ features
const processUsers = (users) =>
  users
    .filter(user => user.active)
    .map(({ id, name, email }) => ({ id, name, email }));`,
    improvements: [
      "Reduced from 12 lines to 4 lines",
      "40% better performance",
      "Modern ES6+ syntax",
      "Functional programming approach",
    ],
  },
  {
    id: "js-async",
    name: "Async Operations",
    language: "javascript",
    originalCode: `// Callback hell and error handling issues
function fetchUserData(userId, callback) {
  fetch('/api/users/' + userId)
    .then(response => {
      response.json().then(data => {
        if (data.error) {
          callback(data.error, null);
        } else {
          callback(null, data);
        }
      }).catch(err => callback(err, null));
    })
    .catch(err => callback(err, null));
}`,
    optimizedCode: `// Clean async/await with proper error handling
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    throw new Error(\`Failed to fetch user: \${error.message}\`);
  }
};`,
    improvements: [
      "Eliminated callback hell",
      "Improved error handling",
      "Modern async/await syntax",
      "Better readability and maintainability",
    ],
  },
  {
    id: "py-list",
    name: "Python List Processing",
    language: "python",
    originalCode: `# Inefficient list processing with nested loops
def find_matching_pairs(list1, list2):
    matches = []
    for item1 in list1:
        for item2 in list2:
            if item1['id'] == item2['user_id']:
                matches.append({
                    'user': item1,
                    'data': item2
                })
    return matches`,
    optimizedCode: `# Optimized with dictionary lookup for O(n) complexity
def find_matching_pairs(list1, list2):
    user_dict = {item['id']: item for item in list1}
    return [
        {'user': user_dict[item['user_id']], 'data': item}
        for item in list2 
        if item['user_id'] in user_dict
    ]`,
    improvements: [
      "Reduced time complexity from O(n²) to O(n)",
      "60% performance improvement",
      "More pythonic approach",
      "Better memory efficiency",
    ],
  },
];

const HomePage: React.FC = () => {
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [isTypewriterActive, setIsTypewriterActive] = useState(false);
  const [showOptimized, setShowOptimized] = useState(false);
  const [showImprovements, setShowImprovements] = useState(false);
  const [typewriterKey, setTypewriterKey] = useState(0);

  // Auto-cycle through examples every 10 seconds (faster)
  useEffect(() => {
    const interval = setInterval(() => {
      setShowOptimized(false);
      setShowImprovements(false);

      setTimeout(() => {
        setCurrentExampleIndex((prev) => (prev + 1) % codeExamples.length);
        setTypewriterKey((prev) => prev + 1); // Force re-render of typewriter
      }, 200);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Trigger typewriter when demo section comes into view
  const { ref: demoRef, isVisible: isDemoVisible } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    if (isDemoVisible) {
      setIsTypewriterActive(true);
    }
  }, [isDemoVisible]);

  // Handle the sequence of showing original -> optimized -> improvements (faster timing)
  useEffect(() => {
    if (isTypewriterActive) {
      setShowOptimized(false);
      setShowImprovements(false);

      // Show optimized code after original code finishes typing (faster)
      const optimizedTimer = setTimeout(() => {
        setShowOptimized(true);
      }, 2500);

      // Show improvements after optimized code finishes typing (faster)
      const improvementsTimer = setTimeout(() => {
        setShowImprovements(true);
      }, 4500);

      return () => {
        clearTimeout(optimizedTimer);
        clearTimeout(improvementsTimer);
      };
    }
  }, [currentExampleIndex, isTypewriterActive, typewriterKey]);

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
              <InteractiveCodePreview />
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
                  className="feature-link group-hover:text-primary transition-all duration-300 hover:translate-x-2 flex items-center gap-2"
                >
                  Learn more
                  <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
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
                  <span className="text-primary text-xl">→</span>
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
                  <span className="text-primary text-xl">→</span>
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

      {/* 7. Static Code Demo with Typewriter Effect */}
      <section
        id="demo"
        ref={demoRef}
        className="interactive-demo py-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50"
      >
        <div className="container">
          <AnimatedSection animation="animate-fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Try OptimizeCode.ai{" "}
                <span className="text-primary">Live Demo</span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Experience the power of AI code optimization in real-time. Watch
                automatic examples transform before your eyes.
              </p>
            </div>
          </AnimatedSection>

          {/* Static Code Example Showcase */}
          <div className="max-w-6xl mx-auto mb-12">
            {/* Example Tabs */}
            <div className="flex justify-center mb-8">
              <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
                {codeExamples.map((example, index) => (
                  <div
                    key={example.id}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentExampleIndex === index
                        ? "bg-primary text-white transform scale-105"
                        : "text-white/60"
                    }`}
                  >
                    <span className="mr-2">
                      {example.language === "javascript" ? "🟨" : "🐍"}
                    </span>
                    {example.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Browser-style Code Window */}
            <div className="bg-gray-900/80 border border-white/10 rounded-xl overflow-hidden backdrop-blur-lg">
              {/* Browser Header */}
              <div className="flex items-center justify-between px-6 py-3 bg-gray-800/60 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>

                {/* Tab Headers */}
                <div className="flex gap-1">
                  <div
                    className={`px-4 py-1 text-sm rounded-t-lg transition-all duration-300 ${
                      !showOptimized
                        ? "bg-gray-700 text-white"
                        : "bg-gray-600/50 text-white/60"
                    }`}
                  >
                    original.{codeExamples[currentExampleIndex].language}
                  </div>
                  <div
                    className={`px-4 py-1 text-sm rounded-t-lg transition-all duration-300 ${
                      showOptimized
                        ? "bg-gray-700 text-white"
                        : "bg-gray-600/50 text-white/60"
                    }`}
                  >
                    optimized.{codeExamples[currentExampleIndex].language}
                  </div>
                </div>

                {/* Performance Badge */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    showOptimized
                      ? "bg-green-500/20 text-green-300 scale-100 opacity-100"
                      : "bg-green-500/20 text-green-300 scale-90 opacity-0"
                  }`}
                >
                  ⚡ 47% faster
                </div>
              </div>

              {/* Code Content */}
              <div className="relative min-h-[400px] overflow-hidden">
                {/* Original Code */}
                <div
                  className={`absolute inset-0 p-6 transition-all duration-500 ease-in-out ${
                    showOptimized
                      ? "opacity-0 translate-x-[-50%]"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  <pre className="text-red-200/90 font-mono text-sm leading-relaxed">
                    {isTypewriterActive && !showOptimized && (
                      <TypewriterText
                        key={`original-${typewriterKey}`}
                        text={codeExamples[currentExampleIndex].originalCode}
                        speed={15}
                        cursor={true}
                        cursorChar="▋"
                      />
                    )}
                  </pre>
                </div>

                {/* Optimized Code */}
                <div
                  className={`absolute inset-0 p-6 transition-all duration-500 ease-in-out ${
                    showOptimized
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-[50%]"
                  }`}
                >
                  <pre className="text-green-200/90 font-mono text-sm leading-relaxed">
                    {showOptimized && (
                      <TypewriterText
                        key={`optimized-${typewriterKey}`}
                        text={codeExamples[currentExampleIndex].optimizedCode}
                        speed={15}
                        cursor={true}
                        cursorChar="▋"
                      />
                    )}
                  </pre>
                </div>
              </div>
            </div>

            {/* Improvements List */}
            <div
              className={`mt-8 transition-all duration-500 ease-in-out ${
                showImprovements
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                <h4 className="text-green-300 font-semibold mb-4 flex items-center gap-2">
                  🚀 Optimizations Applied:
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {codeExamples[currentExampleIndex].improvements.map(
                    (improvement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 animate-fade-in-up"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: "both",
                        }}
                      >
                        <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-green-200/90 text-sm">
                          {improvement}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-3">
                {codeExamples.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentExampleIndex
                        ? "bg-primary scale-125"
                        : "bg-white/20 scale-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Call to Action Button */}
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 border border-primary/20 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Ready to Optimize Your Code?
                </h3>
                <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                  Start optimizing your code with our AI-powered platform. Get
                  instant improvements, better performance, and cleaner code in
                  seconds.
                </p>
                <Link
                  to="/optimize"
                  className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 text-white"
                >
                  <span>🚀</span>
                  Try the Optimizer Now
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Pricing Teaser */}
      <section className="pricing-teaser">
        <div className="container">
          <AnimatedSection
            animation="animate-fade-in-up"
            className="pricing-content"
          >
            <h2 className="animate-fade-in-up">Start Optimizing Today</h2>
            <p className="animate-fade-in-up animate-delay-200">
              Free forever plan • No credit card required • Upgrade anytime
            </p>
            <div className="pricing-actions animate-fade-in-up animate-delay-400">
              <Link
                to="/optimize"
                className="btn-primary interactive-cta group hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                <span className="cta-text">Try Free Now</span>
                <span className="cta-arrow transition-transform duration-300 group-hover:translate-x-2 group-hover:animate-bounce">
                  →
                </span>
              </Link>
              <Link
                to="/pricing"
                className="btn-outline interactive-cta group hover:shadow-lg transition-all duration-300"
              >
                <span className="cta-text">View Pricing</span>
                <span className="cta-icon transition-transform duration-300 group-hover:scale-125 group-hover:animate-bounce">
                  💰
                </span>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
