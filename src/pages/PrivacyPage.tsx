import React from "react";
import { Link } from "react-router-dom";

const PrivacyPage: React.FC = () => {
  return (
    <div className="page min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="privacy-header text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-white/70 mb-4">
            Last updated: January 20, 2024
          </p>
          <p className="text-white/60">
            Your privacy is important to us. This Privacy Policy explains how
            OptimizeCode.ai collects, uses, and protects your information.
          </p>
        </div>

        <div className="privacy-content space-y-8">
          <section className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              1. Information We Collect
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  1.1 Account Information
                </h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  When you create an account, we collect:
                </p>
                <ul className="list-disc list-inside text-white/60 space-y-1 ml-4">
                  <li>Name and email address</li>
                  <li>Password (encrypted and hashed)</li>
                  <li>Profile information you choose to provide</li>
                  <li>
                    Payment information (processed securely through Stripe)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  1.2 Code and Usage Data
                </h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  To provide our optimization service, we temporarily process:
                </p>
                <ul className="list-disc list-inside text-white/60 space-y-1 ml-4">
                  <li>Source code you submit for optimization</li>
                  <li>Programming language and framework metadata</li>
                  <li>Optimization preferences and settings</li>
                  <li>Usage statistics and performance metrics</li>
                </ul>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                  <p className="text-primary text-sm font-medium">
                    🔒 Important: Your source code is processed temporarily and
                    deleted within 30 minutes. We never store your code
                    permanently.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  1.3 Technical Information
                </h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  We automatically collect certain technical information:
                </p>
                <ul className="list-disc list-inside text-white/60 space-y-1 ml-4">
                  <li>IP address and general location</li>
                  <li>Browser type and version</li>
                  <li>Device information and operating system</li>
                  <li>Pages visited and time spent on our service</li>
                  <li>Referring websites and search terms</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              2. How We Use Your Information
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  2.1 Service Provision
                </h3>
                <ul className="list-disc list-inside text-white/60 space-y-1 ml-4">
                  <li>Process and optimize your source code</li>
                  <li>Provide personalized optimization recommendations</li>
                  <li>Maintain your account and subscription</li>
                  <li>Provide customer support and respond to inquiries</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  2.2 Service Improvement
                </h3>
                <ul className="list-disc list-inside text-white/60 space-y-1 ml-4">
                  <li>Analyze usage patterns to improve our AI models</li>
                  <li>Monitor service performance and reliability</li>
                  <li>Develop new features and capabilities</li>
                  <li>Conduct research and analysis (anonymized data only)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  2.3 Communication
                </h3>
                <ul className="list-disc list-inside text-white/60 space-y-1 ml-4">
                  <li>Send important service updates and notifications</li>
                  <li>Provide customer support and technical assistance</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Notify you about security issues or policy changes</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              3. Information Sharing and Disclosure
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  3.1 We Do Not Sell Your Data
                </h3>
                <p className="text-white/70 leading-relaxed">
                  We never sell, rent, or trade your personal information or
                  source code to third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  3.2 Limited Sharing
                </h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  We may share your information in these limited circumstances:
                </p>
                <ul className="list-disc list-inside text-white/60 space-y-1 ml-4">
                  <li>
                    <strong>Service Providers:</strong> Trusted third parties
                    who help us operate our service (e.g., payment processing,
                    hosting)
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law,
                    court order, or to protect our rights
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the event of a
                    merger, acquisition, or sale of assets
                  </li>
                  <li>
                    <strong>Consent:</strong> With your explicit consent for
                    specific purposes
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  3.3 Anonymized Data
                </h3>
                <p className="text-white/70 leading-relaxed">
                  We may share anonymized, aggregated data that cannot be used
                  to identify you for research, industry reports, or service
                  improvement purposes.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              4. Data Security and Protection
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  4.1 Security Measures
                </h3>
                <ul className="list-disc list-inside text-white/60 space-y-1 ml-4">
                  <li>End-to-end encryption for all data transmission</li>
                  <li>AES-256 encryption for data at rest</li>
                  <li>Multi-factor authentication support</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>SOC 2 Type II certified infrastructure</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  4.2 Code Processing Security
                </h3>
                <ul className="list-disc list-inside text-white/60 space-y-1 ml-4">
                  <li>
                    Isolated processing environments for each optimization
                  </li>
                  <li>Automatic deletion of source code after processing</li>
                  <li>No persistent storage of source code</li>
                  <li>Encrypted communication channels</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  4.3 Access Controls
                </h3>
                <ul className="list-disc list-inside text-white/60 space-y-1 ml-4">
                  <li>Role-based access control for our employees</li>
                  <li>Regular access reviews and audits</li>
                  <li>Principle of least privilege</li>
                  <li>Background checks for all team members</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              5. Data Retention and Deletion
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  5.1 Source Code
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Source code submitted for optimization is automatically
                  deleted within 30 minutes of processing. We do not retain
                  copies of your source code for any purpose.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  5.2 Account Data
                </h3>
                <p className="text-white/70 leading-relaxed">
                  We retain your account information for as long as your account
                  is active or as needed to provide services. You can request
                  account deletion at any time.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  5.3 Usage Data
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Anonymized usage statistics may be retained for up to 2 years
                  for service improvement purposes.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              6. Your Rights and Choices
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  6.1 Access and Control
                </h3>
                <ul className="list-disc list-inside text-white/60 space-y-1 ml-4">
                  <li>
                    Access your personal information in your account settings
                  </li>
                  <li>Update or correct your information at any time</li>
                  <li>Download your data in a portable format</li>
                  <li>Delete your account and associated data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  6.2 Communication Preferences
                </h3>
                <ul className="list-disc list-inside text-white/60 space-y-1 ml-4">
                  <li>Opt out of marketing communications</li>
                  <li>Choose notification preferences</li>
                  <li>Manage email subscription settings</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  6.3 GDPR Rights (EU Residents)
                </h3>
                <ul className="list-disc list-inside text-white/60 space-y-1 ml-4">
                  <li>Right to access your personal data</li>
                  <li>Right to rectification of inaccurate data</li>
                  <li>Right to erasure ("right to be forgotten")</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                  <li>Right to restrict processing</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              7. Cookies and Tracking
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  7.1 Essential Cookies
                </h3>
                <p className="text-white/70 leading-relaxed">
                  We use essential cookies to maintain your session, remember
                  your preferences, and ensure security.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  7.2 Analytics Cookies
                </h3>
                <p className="text-white/70 leading-relaxed">
                  With your consent, we use analytics cookies to understand how
                  our service is used and improve performance.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  7.3 Cookie Management
                </h3>
                <p className="text-white/70 leading-relaxed">
                  You can control cookies through your browser settings or our
                  cookie preference center.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              8. International Data Transfers
            </h2>

            <p className="text-white/70 leading-relaxed mb-4">
              OptimizeCode.ai is based in the United States. If you access our
              service from outside the US, your information may be transferred
              to, stored, and processed in the US or other countries where we
              operate.
            </p>

            <p className="text-white/70 leading-relaxed mb-4">
              We ensure appropriate safeguards are in place for international
              transfers, including:
            </p>

            <ul className="list-disc list-inside text-white/60 space-y-1 ml-4">
              <li>Standard Contractual Clauses (SCCs) for EU data transfers</li>
              <li>Adequacy decisions where applicable</li>
              <li>Data processing agreements with third parties</li>
              <li>Regional data residency options for enterprise customers</li>
            </ul>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              9. Children's Privacy
            </h2>

            <p className="text-white/70 leading-relaxed">
              Our service is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13. If we become aware that we have collected such information, we
              will take steps to delete it promptly.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              10. Changes to This Policy
            </h2>

            <p className="text-white/70 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by:
            </p>

            <ul className="list-disc list-inside text-white/60 space-y-1 ml-4 mb-4">
              <li>Posting the updated policy on our website</li>
              <li>Sending you an email notification</li>
              <li>Displaying a notice in your account dashboard</li>
            </ul>

            <p className="text-white/70 leading-relaxed">
              Your continued use of our service after the changes take effect
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              11. Contact Us
            </h2>

            <p className="text-white/70 leading-relaxed mb-6">
              If you have questions about this Privacy Policy or our privacy
              practices, please contact us:
            </p>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="space-y-3 text-white/70">
                <div>
                  <strong className="text-white">Email:</strong>{" "}
                  privacy@optimizecode.ai
                </div>
                <div>
                  <strong className="text-white">
                    Data Protection Officer:
                  </strong>{" "}
                  dpo@optimizecode.ai
                </div>
                <div>
                  <strong className="text-white">Mailing Address:</strong>
                  <br />
                  OptimizeCode.ai Privacy Department
                  <br />
                  123 Innovation Drive
                  <br />
                  San Francisco, CA 94105
                  <br />
                  United States
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              12. Effective Date
            </h2>

            <p className="text-white/70 leading-relaxed">
              This Privacy Policy is effective as of January 20, 2024, and will
              remain in effect until modified or terminated.
            </p>
          </section>
        </div>

        <div className="privacy-footer text-center mt-12 pt-8 border-t border-white/10">
          <p className="text-white/60 mb-6">
            By using OptimizeCode.ai, you acknowledge that you have read,
            understood, and agree to this Privacy Policy.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link
              to="/terms"
              className="text-primary hover:text-primary-light transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/security"
              className="text-primary hover:text-primary-light transition-colors"
            >
              Security Information
            </Link>
            <Link
              to="/support"
              className="text-primary hover:text-primary-light transition-colors"
            >
              Contact Support
            </Link>
            <Link
              to="/"
              className="text-primary hover:text-primary-light transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
