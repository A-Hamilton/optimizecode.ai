import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">OptimizeCode.ai</h3>
            <p className="footer-description">
              AI-powered code optimization for better performance, readability,
              and maintainability.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link">
                📧
              </a>
              <a href="#" className="social-link">
                🐦
              </a>
              <a href="#" className="social-link">
                💼
              </a>
              <a href="#" className="social-link">
                🐙
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Product</h4>
            <div className="footer-links">
              <Link to="/product" className="footer-link">
                Features
              </Link>
              <Link to="/pricing" className="footer-link">
                Pricing
              </Link>
              <Link to="/optimize" className="footer-link">
                Try Free
              </Link>
              <Link to="/docs" className="footer-link">
                API Docs
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Solutions</h4>
            <div className="footer-links">
              <Link to="/solutions" className="footer-link">
                Performance
              </Link>
              <Link to="/solutions" className="footer-link">
                Cost Reduction
              </Link>
              <Link to="/solutions" className="footer-link">
                Legacy Code
              </Link>
              <Link to="/solutions" className="footer-link">
                Security
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Resources</h4>
            <div className="footer-links">
              <Link to="/blog" className="footer-link">
                Blog
              </Link>
              <Link to="/docs" className="footer-link">
                Documentation
              </Link>
              <Link to="/support" className="footer-link">
                Support
              </Link>
              <a href="#" className="footer-link">
                Status
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Company</h4>
            <div className="footer-links">
              <Link to="/about" className="footer-link">
                About
              </Link>
              <a href="#" className="footer-link">
                Careers
              </a>
              <Link to="/security" className="footer-link">
                Security
              </Link>
              <a href="#" className="footer-link">
                Press Kit
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <a href="#" className="legal-link">
              Privacy Policy
            </a>
            <a href="#" className="legal-link">
              Terms of Service
            </a>
            <a href="#" className="legal-link">
              Cookie Policy
            </a>
          </div>
          <div className="footer-copy">
            © 2024 OptimizeCode.ai. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
