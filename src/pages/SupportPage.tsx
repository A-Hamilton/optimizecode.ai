// Updated for TypeScript migration
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportResource {
  title: string;
  description: string;
  icon: string;
  href: string;
  external?: boolean;
}

interface ContactMethod {
  title: string;
  description: string;
  icon: string;
  actionText: string;
  action: () => void;
  availability?: string;
}

const SupportPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "normal",
  });

  const faqs: FAQ[] = [
    {
      id: "what-is-optimizecode",
      question: "What is OptimizeCode.ai and how does it work?",
      answer:
        "OptimizeCode.ai is an AI-powered platform that analyzes your source code and automatically optimizes it for better performance, readability, and maintainability. Our advanced machine learning models understand code patterns and apply proven optimization techniques to improve your codebase while preserving functionality.",
      category: "general",
    },
    {
      id: "supported-languages",
      question: "Which programming languages are supported?",
      answer:
        "We currently support 15+ programming languages including JavaScript, TypeScript, Python, Java, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, and more. We're constantly adding support for new languages based on community demand.",
      category: "technical",
    },
    {
      id: "code-security",
      question: "Is my code secure? Do you store my source code?",
      answer:
        "Absolutely! Your code security is our top priority. We use end-to-end encryption and process your code in isolated, secure environments. Your source code is never permanently stored and is automatically deleted after optimization (typically within 30 minutes).",
      category: "security",
    },
    {
      id: "pricing-plans",
      question: "What are the different pricing plans?",
      answer:
        "We offer three plans: Free (limited daily optimizations), Pro ($29/month with enhanced limits), and Unleashed ($99/month with unlimited access). All plans include core optimization features, with Pro and Unleashed offering additional benefits like priority support and advanced analytics.",
      category: "billing",
    },
    {
      id: "optimization-accuracy",
      question: "How accurate are the optimizations? Will they break my code?",
      answer:
        "Our AI models are trained on millions of code samples and maintain a 99.9% accuracy rate. We preserve code functionality while improving performance. However, we always recommend testing optimized code in a development environment before production deployment.",
      category: "technical",
    },
    {
      id: "api-integration",
      question: "Can I integrate OptimizeCode.ai into my CI/CD pipeline?",
      answer:
        "Yes! We provide a comprehensive REST API, CLI tools, and integrations with popular platforms like GitHub, GitLab, and Jenkins. You can automate code optimization as part of your development workflow.",
      category: "integrations",
    },
    {
      id: "enterprise-features",
      question: "What enterprise features are available?",
      answer:
        "Enterprise customers get dedicated support, custom optimization rules, on-premises deployment options, SSO integration, team management features, detailed analytics, and SLA guarantees. Contact our sales team for custom enterprise solutions.",
      category: "enterprise",
    },
    {
      id: "cancel-subscription",
      question: "How do I cancel my subscription?",
      answer:
        "You can cancel your subscription anytime from your account settings. Your access will continue until the end of your current billing period. No cancellation fees apply, and you can reactivate your subscription at any time.",
      category: "billing",
    },
    {
      id: "optimization-types",
      question: "What types of optimizations does the AI perform?",
      answer:
        "Our AI performs various optimizations including performance improvements (reducing time/space complexity), code modernization (updating to latest language features), security enhancements (fixing vulnerabilities), readability improvements, and best practice implementations.",
      category: "technical",
    },
    {
      id: "team-collaboration",
      question: "Can my team collaborate on code optimization?",
      answer:
        "Yes! Pro and Unleashed plans include team features like shared optimization history, collaborative code reviews, team analytics, and role-based permissions. You can invite team members and manage access levels from your dashboard.",
      category: "general",
    },
  ];

  const supportResources: SupportResource[] = [
    {
      title: "API Documentation",
      description:
        "Complete reference for our REST API, including authentication, endpoints, and examples",
      icon: "📚",
      href: "/docs",
    },
    {
      title: "Quick Start Guide",
      description: "Get up and running with OptimizeCode.ai in minutes",
      icon: "🚀",
      href: "/docs/quickstart",
    },
    {
      title: "Integration Tutorials",
      description:
        "Step-by-step guides for integrating with your favorite tools",
      icon: "🔧",
      href: "/docs/integrations",
    },
    {
      title: "Best Practices",
      description: "Learn how to get the most out of code optimization",
      icon: "💡",
      href: "/blog",
    },
    {
      title: "Video Tutorials",
      description: "Watch detailed tutorials and product demos",
      icon: "🎥",
      href: "https://youtube.com/optimizecodeai",
      external: true,
    },
    {
      title: "Community Forum",
      description: "Connect with other developers and share experiences",
      icon: "👥",
      href: "https://community.optimizecode.ai",
      external: true,
    },
  ];

  const contactMethods: ContactMethod[] = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: "💬",
      actionText: "Start Chat",
      action: () => {
        // In a real app, this would open a chat widget
        alert("Live chat would open here!");
      },
      availability: "Mon-Fri, 9 AM - 6 PM PST",
    },
    {
      title: "Email Support",
      description:
        "Send us a detailed message and we'll respond within 24 hours",
      icon: "📧",
      actionText: "Send Email",
      action: () => {
        window.location.href = "mailto:support@optimizecode.ai";
      },
      availability: "24/7 response within 24h",
    },
    {
      title: "Schedule a Call",
      description: "Book a 30-minute call with our technical team",
      icon: "📞",
      actionText: "Book Call",
      action: () => {
        // In a real app, this would open a scheduling widget
        alert("Scheduling widget would open here!");
      },
      availability: "Business hours only",
    },
    {
      title: "Emergency Support",
      description:
        "For critical issues affecting production systems (Enterprise only)",
      icon: "🚨",
      actionText: "Emergency Contact",
      action: () => {
        window.location.href = "mailto:emergency@optimizecode.ai";
      },
      availability: "24/7 for Enterprise customers",
    },
  ];

  const categories = [
    { id: "all", name: "All", count: faqs.length },
    {
      id: "general",
      name: "General",
      count: faqs.filter((f) => f.category === "general").length,
    },
    {
      id: "technical",
      name: "Technical",
      count: faqs.filter((f) => f.category === "technical").length,
    },
    {
      id: "security",
      name: "Security",
      count: faqs.filter((f) => f.category === "security").length,
    },
    {
      id: "billing",
      name: "Billing",
      count: faqs.filter((f) => f.category === "billing").length,
    },
    {
      id: "integrations",
      name: "Integrations",
      count: faqs.filter((f) => f.category === "integrations").length,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      count: faqs.filter((f) => f.category === "enterprise").length,
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    alert("Contact form submitted! We'll get back to you soon.");
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      priority: "normal",
    });
  };

  const FAQItem: React.FC<{ faq: FAQ }> = ({ faq }) => (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      <button
        className="w-full p-6 text-left hover:bg-white/8 transition-colors focus:outline-none"
        onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-white pr-4">
            {faq.question}
          </h3>
          <span
            className={`text-primary transition-transform duration-300 ${
              openFAQ === faq.id ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </div>
      </button>
      {openFAQ === faq.id && (
        <div className="px-6 pb-6">
          <p className="text-white/70 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  );

  const ResourceCard: React.FC<{ resource: SupportResource }> = ({
    resource,
  }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all duration-300 group">
      <div className="text-3xl mb-4">{resource.icon}</div>
      <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary transition-colors">
        {resource.title}
      </h3>
      <p className="text-white/70 text-sm leading-relaxed mb-4">
        {resource.description}
      </p>
      {resource.external ? (
        <a
          href={resource.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-light text-sm font-medium flex items-center gap-1"
        >
          Learn More →
        </a>
      ) : (
        <Link
          to={resource.href}
          className="text-primary hover:text-primary-light text-sm font-medium flex items-center gap-1"
        >
          Learn More →
        </Link>
      )}
    </div>
  );

  const ContactMethodCard: React.FC<{ method: ContactMethod }> = ({
    method,
  }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all duration-300">
      <div className="text-3xl mb-4">{method.icon}</div>
      <h3 className="text-lg font-semibold text-white mb-3">{method.title}</h3>
      <p className="text-white/70 text-sm leading-relaxed mb-4">
        {method.description}
      </p>
      {method.availability && (
        <p className="text-white/50 text-xs mb-4">{method.availability}</p>
      )}
      <button
        onClick={method.action}
        className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {method.actionText}
      </button>
    </div>
  );

  return (
    <div className="page min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-6">
            Help & Support
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Get the help you need to optimize your code effectively. Browse our
            resources, find answers to common questions, or contact our support
            team.
          </p>
        </header>

        {/* Quick Actions */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <ContactMethodCard key={index} method={method} />
            ))}
          </div>
        </section>

        {/* Search and FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>

          {/* Search */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => <FAQItem key={faq.id} faq={faq} />)
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white/80 mb-2">
                  No results found
                </h3>
                <p className="text-white/60">
                  Try adjusting your search or selecting a different category.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Resources Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Helpful Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Send Us a Message
          </h2>
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={handleContactSubmit}
              className="bg-white/5 border border-white/10 rounded-xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors"
                  placeholder="What can we help you with?"
                />
              </div>

              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">
                  Priority
                </label>
                <select
                  value={contactForm.priority}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, priority: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="normal">Normal - Standard support</option>
                  <option value="high">High - Urgent issue</option>
                  <option value="critical">Critical - Production issue</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors resize-vertical"
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-light text-white py-3 rounded-lg font-medium transition-colors"
              >
                Send Message
              </button>

              <p className="text-white/50 text-xs mt-4 text-center">
                We typically respond within 24 hours. For urgent issues, please
                use live chat or call our support line.
              </p>
            </form>
          </div>
        </section>

        {/* Status and Updates */}
        <section className="text-center bg-white/5 border border-white/10 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            System Status & Updates
          </h2>
          <p className="text-white/70 mb-6">
            Stay informed about service status, maintenance windows, and feature
            updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://status.optimizecode.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Check Service Status
            </a>
            <Link
              to="/blog"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium border border-white/20 transition-colors"
            >
              Latest Updates
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SupportPage;
