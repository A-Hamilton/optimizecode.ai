// Updated for TypeScript migration
import React from "react";
import { Link } from "react-router-dom";
import Newsletter from "./Newsletter";
import "./Newsletter.css";

const Footer: React.FC = () => {
  const FooterSection: React.FC<{
    title: string;
    children: React.ReactNode;
  }> = ({ title, children }) => (
    <div>
      <h4 className="text-lg font-semibold text-white mb-6 relative">
        {title}
        <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-primary"></span>
      </h4>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );

  const FooterLink: React.FC<{
    to?: string;
    href?: string;
    children: React.ReactNode;
    external?: boolean;
  }> = ({ to, href, children, external = false }) => {
    const className =
      "text-white/70 hover:text-primary transition-all duration-300 text-sm hover:translate-x-1 hover:underline";

    if (to) {
      return (
        <Link to={to} className={className}>
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        className={className}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
        {external && <span className="ml-1">↗</span>}
      </a>
    );
  };

  const SocialLink: React.FC<{ href: string; icon: string; label: string }> = ({
    href,
    icon,
    label,
  }) => (
    <a
      href={href}
      className="group relative"
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="text-2xl hover:scale-125 transition-all duration-300 group-hover:rotate-6">
        {icon}
      </span>
      {/* Tooltip */}
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        {label}
      </span>
    </a>
  );

  return (
    <footer className="bg-black/80 border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-6">
              OptimizeCode.ai
            </h3>
            <p className="text-white/70 mb-8 leading-relaxed text-base">
              AI-powered code optimization for better performance, readability,
              and maintainability. Transform your code with the power of
              artificial intelligence.
            </p>

            {/* Social Links */}
            <div className="flex gap-6 mb-6">
              <SocialLink
                href="mailto:hello@optimizecode.ai"
                icon="📧"
                label="Email"
              />
              <SocialLink
                href="https://twitter.com/optimizecodeai"
                icon="🐦"
                label="Twitter"
              />
              <SocialLink
                href="https://linkedin.com/company/optimizecode-ai"
                icon="💼"
                label="LinkedIn"
              />
              <SocialLink
                href="https://github.com/optimizecode-ai"
                icon="🐙"
                label="GitHub"
              />
            </div>

            {/* Newsletter Signup */}
            <Newsletter />
          </div>

          {/* Product Links */}
          <FooterSection title="Product">
            <FooterLink to="/product">Features</FooterLink>
            <FooterLink to="/pricing">Pricing</FooterLink>
            <FooterLink to="/optimize">Try Free</FooterLink>
            <FooterLink to="/docs">API Documentation</FooterLink>
            <FooterLink to="/security">Security</FooterLink>
            <FooterLink href="#" external>
              Integrations
            </FooterLink>
          </FooterSection>

          {/* Solutions Links */}
          <FooterSection title="Solutions">
            <FooterLink to="/solutions">Performance Optimization</FooterLink>
            <FooterLink to="/solutions">Cost Reduction</FooterLink>
            <FooterLink to="/solutions">Legacy Modernization</FooterLink>
            <FooterLink to="/solutions">Security Enhancement</FooterLink>
            <FooterLink to="/solutions">Team Collaboration</FooterLink>
            <FooterLink href="#" external>
              Case Studies
            </FooterLink>
          </FooterSection>

          {/* Company Links */}
          <FooterSection title="Company">
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/blog">Blog</FooterLink>
            <FooterLink href="#" external>
              Careers
            </FooterLink>
            <FooterLink to="/support">Support</FooterLink>
            <FooterLink href="#" external>
              Press Kit
            </FooterLink>
            <FooterLink href="#" external>
              Contact
            </FooterLink>
          </FooterSection>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-6">
          {/* Legal Links */}
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            <a
              href="#"
              className="text-white/60 hover:text-white/80 text-sm transition-colors hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-white/80 text-sm transition-colors hover:underline"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-white/80 text-sm transition-colors hover:underline"
            >
              Cookie Policy
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-white/80 text-sm transition-colors hover:underline"
            >
              GDPR Compliance
            </a>
          </div>

          {/* Copyright */}
          <div className="text-white/60 text-sm text-center md:text-right">
            © 2024 OptimizeCode.ai. All rights reserved.
            <br />
            <span className="text-white/40 text-xs">
              Built with ❤️ for developers worldwide
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
