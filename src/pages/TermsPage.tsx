import React from "react";
import { Link } from "react-router-dom";
import "./TermsPage.css";

const TermsPage: React.FC = () => {
  return (
    <div className="terms-page">
      <div className="container">
        <div className="terms-header">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last updated: January 20, 2024</p>
        </div>

        <div className="terms-content">
          <section className="terms-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using OptimizeCode.ai ("Service"), you accept and
              agree to be bound by the terms and provision of this agreement. If
              you do not agree to abide by the above, please do not use this
              service.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. Description of Service</h2>
            <p>
              OptimizeCode.ai provides AI-powered code optimization services
              that analyze, improve, and optimize source code for better
              performance, readability, and maintainability. Our service
              supports multiple programming languages and offers various
              subscription tiers.
            </p>
            <div className="subsection">
              <h3>2.1 Service Features</h3>
              <ul>
                <li>Automated code analysis and optimization</li>
                <li>Support for multiple programming languages</li>
                <li>Performance and readability improvements</li>
                <li>Security vulnerability detection</li>
                <li>Code quality metrics and insights</li>
              </ul>
            </div>
          </section>

          <section className="terms-section">
            <h2>3. User Accounts and Registration</h2>
            <div className="subsection">
              <h3>3.1 Account Creation</h3>
              <p>
                To access certain features of our Service, you must register for
                an account. You agree to provide accurate, current, and complete
                information during the registration process.
              </p>
            </div>
            <div className="subsection">
              <h3>3.2 Account Security</h3>
              <p>
                You are responsible for safeguarding the password and for all
                activities that occur under your account. You agree to notify us
                immediately of any unauthorized use of your account.
              </p>
            </div>
            <div className="subsection">
              <h3>3.3 Account Termination</h3>
              <p>
                We reserve the right to terminate or suspend your account at any
                time for violations of these Terms of Service or for any other
                reason we deem appropriate.
              </p>
            </div>
          </section>

          <section className="terms-section">
            <h2>4. Subscription Plans and Payment</h2>
            <div className="subsection">
              <h3>4.1 Plan Types</h3>
              <ul>
                <li>
                  <strong>Free Plan:</strong> Limited daily optimizations with
                  basic features
                </li>
                <li>
                  <strong>Pro Plan:</strong> Enhanced limits and priority
                  support
                </li>
                <li>
                  <strong>Unleashed Plan:</strong> Unlimited access with
                  enterprise features
                </li>
              </ul>
            </div>
            <div className="subsection">
              <h3>4.2 Payment Terms</h3>
              <p>
                Subscription fees are billed in advance on a monthly or yearly
                basis. All payments are processed securely through Stripe. Fees
                are non-refundable except as required by law.
              </p>
            </div>
            <div className="subsection">
              <h3>4.3 Plan Changes and Cancellation</h3>
              <p>
                You may upgrade, downgrade, or cancel your subscription at any
                time. Changes take effect at the next billing cycle.
                Cancellations remain active until the end of the current billing
                period.
              </p>
            </div>
          </section>

          <section className="terms-section">
            <h2>5. Acceptable Use Policy</h2>
            <div className="subsection">
              <h3>5.1 Permitted Uses</h3>
              <p>
                You may use our Service only for lawful purposes and in
                accordance with these Terms. You agree to use the Service only
                to optimize legitimate source code that you own or have
                permission to modify.
              </p>
            </div>
            <div className="subsection">
              <h3>5.2 Prohibited Uses</h3>
              <p>You agree not to use the Service:</p>
              <ul>
                <li>
                  To upload or process malicious code, malware, or viruses
                </li>
                <li>To violate any applicable laws or regulations</li>
                <li>To infringe upon the rights of others</li>
                <li>To attempt to gain unauthorized access to our systems</li>
                <li>
                  To reverse engineer or attempt to extract our optimization
                  algorithms
                </li>
                <li>
                  To use the Service for competitive analysis or benchmarking
                  without permission
                </li>
              </ul>
            </div>
          </section>

          <section className="terms-section">
            <h2>6. Intellectual Property Rights</h2>
            <div className="subsection">
              <h3>6.1 Your Content</h3>
              <p>
                You retain ownership of all source code you submit to our
                Service. By using our Service, you grant us a limited license to
                process and optimize your code as necessary to provide the
                Service.
              </p>
            </div>
            <div className="subsection">
              <h3>6.2 Our Content</h3>
              <p>
                The Service, including all optimization algorithms, software,
                and documentation, is protected by copyright and other
                intellectual property laws. You may not copy, modify, or
                distribute our proprietary technology.
              </p>
            </div>
            <div className="subsection">
              <h3>6.3 Optimized Code</h3>
              <p>
                The optimized code generated by our Service belongs to you.
                However, the optimization techniques and methodologies remain
                our intellectual property.
              </p>
            </div>
          </section>

          <section className="terms-section">
            <h2>7. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please review our{" "}
              <Link to="/privacy" className="link">
                Privacy Policy
              </Link>
              , which also governs your use of the Service, to understand our
              practices regarding the collection and use of your information.
            </p>
            <div className="subsection">
              <h3>7.1 Code Processing</h3>
              <p>
                Code submitted to our Service is processed using secure,
                encrypted connections. We do not store your source code longer
                than necessary to provide the optimization service.
              </p>
            </div>
          </section>

          <section className="terms-section">
            <h2>8. Service Availability and Limitations</h2>
            <div className="subsection">
              <h3>8.1 Service Uptime</h3>
              <p>
                While we strive to maintain high availability, we do not
                guarantee uninterrupted access to the Service. Maintenance,
                updates, and unforeseen circumstances may cause temporary
                service interruptions.
              </p>
            </div>
            <div className="subsection">
              <h3>8.2 Usage Limits</h3>
              <p>
                Usage limits apply based on your subscription plan. Exceeding
                these limits may result in temporary service restrictions or
                requests to upgrade your plan.
              </p>
            </div>
          </section>

          <section className="terms-section">
            <h2>9. Disclaimers and Limitation of Liability</h2>
            <div className="subsection">
              <h3>9.1 Service Warranty</h3>
              <p>
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE
                DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                NON-INFRINGEMENT.
              </p>
            </div>
            <div className="subsection">
              <h3>9.2 Code Optimization Results</h3>
              <p>
                While our Service aims to improve code quality and performance,
                we make no guarantees about specific optimization results. You
                are responsible for testing and validating optimized code before
                use in production environments.
              </p>
            </div>
            <div className="subsection">
              <h3>9.3 Limitation of Liability</h3>
              <p>
                IN NO EVENT SHALL OPTIMIZECODE.AI BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                INCLUDING LOST PROFITS OR DATA, ARISING FROM YOUR USE OF THE
                SERVICE.
              </p>
            </div>
          </section>

          <section className="terms-section">
            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless OptimizeCode.ai and its
              affiliates from any claims, damages, or expenses arising from your
              use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="terms-section">
            <h2>11. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes
              will be effective immediately upon posting. Your continued use of
              the Service after posting of changes constitutes acceptance of the
              modified Terms.
            </p>
          </section>

          <section className="terms-section">
            <h2>12. Governing Law and Dispute Resolution</h2>
            <div className="subsection">
              <h3>12.1 Governing Law</h3>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the United States and the State of California,
                without regard to conflict of law principles.
              </p>
            </div>
            <div className="subsection">
              <h3>12.2 Dispute Resolution</h3>
              <p>
                Any disputes arising from these Terms or your use of the Service
                shall be resolved through binding arbitration in accordance with
                the rules of the American Arbitration Association.
              </p>
            </div>
          </section>

          <section className="terms-section">
            <h2>13. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <div className="contact-info">
              <p>
                <strong>Email:</strong> legal@optimizecode.ai
              </p>
              <p>
                <strong>Address:</strong> OptimizeCode.ai Legal Department
                <br />
                123 Innovation Drive
                <br />
                San Francisco, CA 94105
              </p>
            </div>
          </section>

          <section className="terms-section">
            <h2>14. Effective Date</h2>
            <p>
              These Terms of Service are effective as of January 20, 2024, and
              will remain in effect until modified or terminated.
            </p>
          </section>
        </div>

        <div className="terms-footer">
          <p>
            By using OptimizeCode.ai, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service.
          </p>
          <div className="footer-links">
            <Link to="/privacy" className="link">
              Privacy Policy
            </Link>
            <Link to="/support" className="link">
              Contact Support
            </Link>
            <Link to="/" className="link">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
