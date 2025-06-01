import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/80 border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-4">
              OptimizeCode.ai
            </h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              AI-powered code optimization for better performance, readability,
              and maintainability.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-2xl hover:scale-125 transition-transform"
              >
                📧
              </a>
              <a
                href="#"
                className="text-2xl hover:scale-125 transition-transform"
              >
                🐦
              </a>
              <a
                href="#"
                className="text-2xl hover:scale-125 transition-transform"
              >
                💼
              </a>
              <a
                href="#"
                className="text-2xl hover:scale-125 transition-transform"
              >
                🐙
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <div className="flex flex-col gap-3">
              <Link
                to="/product"
                className="text-white/70 hover:text-primary transition-colors text-sm"
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="text-white/70 hover:text-primary transition-colors text-sm"
              >
                Pricing
              </Link>
              <Link
                to="/optimize"
                className="text-white/70 hover:text-primary transition-colors text-sm"
              >
                Try Free
              </Link>
              <Link
                to="/docs"
                className="text-white/70 hover:text-primary transition-colors text-sm"
              >
                API Docs
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Solutions</h4>
            <div className="flex flex-col gap-3">
              <Link
                to="/solutions"
                className="text-white/70 hover:text-primary transition-colors text-sm"
              >
                Performance
              </Link>
              <Link
                to="/solutions"
                className="text-white/70 hover:text-primary transition-colors text-sm"
              >
                Cost Reduction
              </Link>
              <Link
                to="/solutions"
                className="text-white/70 hover:text-primary transition-colors text-sm"
              >
                Legacy Code
              </Link>
              <Link
                to="/solutions"
                className="text-white/70 hover:text-primary transition-colors text-sm"
              >
                Security
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <div className="flex flex-col gap-3">
              <Link
                to="/about"
                className="text-white/70 hover:text-primary transition-colors text-sm"
              >
                About
              </Link>
              <a
                href="#"
                className="text-white/70 hover:text-primary transition-colors text-sm"
              >
                Careers
              </a>
              <Link
                to="/security"
                className="text-white/70 hover:text-primary transition-colors text-sm"
              >
                Security
              </Link>
              <a
                href="#"
                className="text-white/70 hover:text-primary transition-colors text-sm"
              >
                Press Kit
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4">
          <div className="flex gap-8">
            <a
              href="#"
              className="text-white/60 hover:text-white/80 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-white/80 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-white/80 text-sm transition-colors"
            >
              Cookie Policy
            </a>
          </div>
          <div className="text-white/60 text-sm">
            © 2024 OptimizeCode.ai. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
