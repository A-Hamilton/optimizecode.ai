// Updated for TypeScript migration
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface SecurityFeature {
  icon: string;
  title: string;
  description: string;
  details: string[];
}

interface Certification {
  name: string;
  description: string;
  icon: string;
  status: "Active" | "In Progress" | "Pending";
  validUntil?: string;
}

interface SecurityMeasure {
  category: string;
  measures: Array<{
    title: string;
    description: string;
    implementation: string;
  }>;
}

const SecurityPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const securityFeatures: SecurityFeature[] = [
    {
      icon: "🔐",
      title: "End-to-End Encryption",
      description:
        "All data is encrypted in transit and at rest using industry-standard protocols",
      details: [
        "TLS 1.3 for data in transit",
        "AES-256 encryption for data at rest",
        "Key rotation every 90 days",
        "Zero-knowledge architecture",
      ],
    },
    {
      icon: "🛡️",
      title: "Code Privacy Protection",
      description:
        "Your source code is never permanently stored and is processed securely",
      details: [
        "Temporary processing only",
        "Automatic deletion after optimization",
        "Isolated processing environments",
        "No code retention policies",
      ],
    },
    {
      icon: "👥",
      title: "Access Controls",
      description: "Multi-layered authentication and authorization systems",
      details: [
        "Multi-factor authentication (MFA)",
        "Role-based access control (RBAC)",
        "Single sign-on (SSO) support",
        "API key management",
      ],
    },
    {
      icon: "🏢",
      title: "Infrastructure Security",
      description:
        "Enterprise-grade cloud infrastructure with multiple security layers",
      details: [
        "AWS/Azure enterprise compliance",
        "VPC isolation and firewalls",
        "DDoS protection and monitoring",
        "24/7 security monitoring",
      ],
    },
    {
      icon: "📊",
      title: "Audit & Monitoring",
      description: "Comprehensive logging and monitoring for security events",
      details: [
        "Real-time security monitoring",
        "Audit logs for all activities",
        "SIEM integration capabilities",
        "Incident response procedures",
      ],
    },
    {
      icon: "⚖️",
      title: "Compliance Standards",
      description:
        "Adherence to international security and privacy regulations",
      details: [
        "SOC 2 Type II certified",
        "GDPR compliant operations",
        "ISO 27001 standards",
        "HIPAA compliance available",
      ],
    },
  ];

  const certifications: Certification[] = [
    {
      name: "SOC 2 Type II",
      description:
        "Security, availability, and confidentiality controls audited by independent third parties",
      icon: "🏆",
      status: "Active",
      validUntil: "December 2024",
    },
    {
      name: "ISO 27001",
      description:
        "International standard for information security management systems",
      icon: "🌍",
      status: "Active",
      validUntil: "March 2025",
    },
    {
      name: "GDPR Compliance",
      description:
        "European data protection regulation compliance for user privacy",
      icon: "🇪🇺",
      status: "Active",
    },
    {
      name: "HIPAA Compliance",
      description:
        "Healthcare data protection standards for enterprise customers",
      icon: "🏥",
      status: "In Progress",
    },
  ];

  const securityMeasures: SecurityMeasure[] = [
    {
      category: "Data Protection",
      measures: [
        {
          title: "Data Minimization",
          description:
            "We only collect and process the minimum data necessary to provide our service",
          implementation:
            "Automated data classification and retention policies",
        },
        {
          title: "Data Segregation",
          description:
            "Customer data is isolated using dedicated processing environments",
          implementation: "Container-based isolation with network segmentation",
        },
        {
          title: "Backup Security",
          description:
            "All backups are encrypted and stored in geographically distributed locations",
          implementation: "Cross-region encrypted backups with access controls",
        },
      ],
    },
    {
      category: "Application Security",
      measures: [
        {
          title: "Secure Development",
          description:
            "Security is built into every stage of our development lifecycle",
          implementation: "Static analysis, code review, and security testing",
        },
        {
          title: "Vulnerability Management",
          description: "Regular security assessments and penetration testing",
          implementation: "Monthly scans and quarterly penetration tests",
        },
        {
          title: "Dependency Security",
          description:
            "All third-party dependencies are continuously monitored for vulnerabilities",
          implementation: "Automated vulnerability scanning and updates",
        },
      ],
    },
    {
      category: "Operational Security",
      measures: [
        {
          title: "Employee Security",
          description:
            "All team members undergo background checks and security training",
          implementation:
            "Annual security awareness training and access reviews",
        },
        {
          title: "Incident Response",
          description:
            "24/7 security operations center with defined incident response procedures",
          implementation: "Automated alerting and escalation procedures",
        },
        {
          title: "Business Continuity",
          description:
            "Disaster recovery and business continuity plans are regularly tested",
          implementation: "Quarterly DR testing and annual BCP reviews",
        },
      ],
    },
  ];

  const SectionNav: React.FC = () => (
    <div className="flex flex-wrap gap-4 mb-8 justify-center">
      {[
        { id: "overview", label: "Security Overview" },
        { id: "features", label: "Security Features" },
        { id: "compliance", label: "Compliance" },
        { id: "measures", label: "Security Measures" },
        { id: "contact", label: "Security Contact" },
      ].map((section) => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeSection === section.id
              ? "bg-primary text-white"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
          }`}
        >
          {section.label}
        </button>
      ))}
    </div>
  );

  const SecurityFeatureCard: React.FC<{ feature: SecurityFeature }> = ({
    feature,
  }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all duration-300">
      <div className="text-4xl mb-4">{feature.icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
      <p className="text-white/70 mb-4 leading-relaxed">
        {feature.description}
      </p>
      <ul className="space-y-2">
        {feature.details.map((detail, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-white/60 text-sm"
          >
            <span className="text-primary">✓</span>
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );

  const CertificationCard: React.FC<{ cert: Certification }> = ({ cert }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-3xl">{cert.icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{cert.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                cert.status === "Active"
                  ? "bg-green-500/20 text-green-400"
                  : cert.status === "In Progress"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {cert.status}
            </span>
            {cert.validUntil && (
              <span className="text-white/50 text-xs">
                Valid until {cert.validUntil}
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="text-white/70 text-sm leading-relaxed">
        {cert.description}
      </p>
    </div>
  );

  return (
    <div className="page min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-6">
            Security & Privacy
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Your code security and privacy are our top priorities. Learn about
            our comprehensive security measures, compliance certifications, and
            privacy protections.
          </p>
        </header>

        {/* Section Navigation */}
        <SectionNav />

        {/* Security Overview */}
        {activeSection === "overview" && (
          <section className="mb-16">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Security First Approach
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    🛡️ Zero-Trust Architecture
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-4">
                    Our platform is built on a zero-trust security model where
                    every request is authenticated, authorized, and encrypted.
                    No component trusts any other by default.
                  </p>
                  <ul className="space-y-2 text-white/60 text-sm">
                    <li>• All communications encrypted with TLS 1.3</li>
                    <li>• Multi-factor authentication required</li>
                    <li>• Continuous security monitoring</li>
                    <li>• Least privilege access principles</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    🔒 Code Privacy Guarantee
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-4">
                    Your source code is never permanently stored. It's processed
                    in isolated, secure environments and automatically deleted
                    after optimization.
                  </p>
                  <ul className="space-y-2 text-white/60 text-sm">
                    <li>• Temporary processing only (&lt; 30 minutes)</li>
                    <li>• Isolated compute environments</li>
                    <li>• No long-term data retention</li>
                    <li>• Optional on-premises deployment</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  99.9%
                </div>
                <div className="text-white/70">Uptime SLA</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  &lt;30min
                </div>
                <div className="text-white/70">Data Retention</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-white/70">Security Monitoring</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">0</div>
                <div className="text-white/70">Data Breaches</div>
              </div>
            </div>
          </section>
        )}

        {/* Security Features */}
        {activeSection === "features" && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Security Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityFeatures.map((feature, index) => (
                <SecurityFeatureCard key={index} feature={feature} />
              ))}
            </div>
          </section>
        )}

        {/* Compliance */}
        {activeSection === "compliance" && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Compliance & Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {certifications.map((cert, index) => (
                <CertificationCard key={index} cert={cert} />
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-6">
                Regulatory Compliance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">
                    🇺🇸 United States
                  </h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li>• SOX compliance for financial data</li>
                    <li>• HIPAA compliance for healthcare</li>
                    <li>• FedRAMP authorization in progress</li>
                    <li>• NIST Cybersecurity Framework</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">
                    🇪🇺 European Union
                  </h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li>• GDPR data protection compliance</li>
                    <li>• ISO 27001 information security</li>
                    <li>• Data residency options available</li>
                    <li>• Right to be forgotten support</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Security Measures */}
        {activeSection === "measures" && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Security Measures
            </h2>
            <div className="space-y-8">
              {securityMeasures.map((category, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-8"
                >
                  <h3 className="text-xl font-semibold text-white mb-6">
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {category.measures.map((measure, measureIndex) => (
                      <div
                        key={measureIndex}
                        className="bg-white/5 border border-white/10 rounded-lg p-6"
                      >
                        <h4 className="text-lg font-medium text-white mb-3">
                          {measure.title}
                        </h4>
                        <p className="text-white/70 text-sm mb-4 leading-relaxed">
                          {measure.description}
                        </p>
                        <div className="text-white/50 text-xs">
                          <strong>Implementation:</strong>{" "}
                          {measure.implementation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Security Contact */}
        {activeSection === "contact" && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Security Contact & Reporting
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-white mb-6">
                  🔍 Security Vulnerability Reporting
                </h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  We appreciate security researchers who help us maintain the
                  security of our platform. If you discover a security
                  vulnerability, please report it responsibly.
                </p>
                <div className="space-y-4">
                  <div>
                    <strong className="text-white">Email:</strong>
                    <div className="text-primary">security@optimizecode.ai</div>
                  </div>
                  <div>
                    <strong className="text-white">PGP Key:</strong>
                    <div className="text-white/60 text-sm">
                      Available upon request
                    </div>
                  </div>
                  <div>
                    <strong className="text-white">Response Time:</strong>
                    <div className="text-white/60 text-sm">Within 24 hours</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-white mb-6">
                  👨‍💼 Security Team Contact
                </h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  For security questions, compliance inquiries, or to request
                  security documentation for enterprise evaluations.
                </p>
                <div className="space-y-4">
                  <div>
                    <strong className="text-white">General Inquiries:</strong>
                    <div className="text-primary">security@optimizecode.ai</div>
                  </div>
                  <div>
                    <strong className="text-white">Compliance:</strong>
                    <div className="text-primary">
                      compliance@optimizecode.ai
                    </div>
                  </div>
                  <div>
                    <strong className="text-white">Enterprise Security:</strong>
                    <div className="text-primary">
                      enterprise@optimizecode.ai
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                📋 Security Documentation
              </h3>
              <p className="text-white/70 mb-6">
                Additional security documentation is available for enterprise
                customers and security evaluations.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Request Security Questionnaire
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium border border-white/20 transition-colors">
                  Download SOC 2 Report
                </button>
                <Link
                  to="/contact"
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium border border-white/20 transition-colors"
                >
                  Schedule Security Review
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="text-center bg-white/5 border border-white/10 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Secure by Design
          </h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Start optimizing your code with confidence. Our security-first
            approach ensures your intellectual property remains protected
            throughout the optimization process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/optimize"
              className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Try Secure Optimization
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium border border-white/20 transition-colors"
            >
              Enterprise Security Consultation
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SecurityPage;
