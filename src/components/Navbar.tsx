import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent"
        >
          OptimizeCode.ai
        </Link>

        <div
          className={`md:flex items-center gap-8 ${isMenuOpen ? "flex" : "hidden"} absolute md:relative top-16 md:top-0 left-0 right-0 bg-gray-900/98 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none flex-col md:flex-row p-6 md:p-0`}
        >
          <Link
            to="/product"
            className={`text-white/80 hover:text-primary transition-colors relative ${isActive("/product") ? "text-primary" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Product
          </Link>
          <Link
            to="/solutions"
            className={`text-white/80 hover:text-primary transition-colors relative ${isActive("/solutions") ? "text-primary" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Solutions
          </Link>
          <Link
            to="/pricing"
            className={`text-white/80 hover:text-primary transition-colors relative ${isActive("/pricing") ? "text-primary" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            to="/docs"
            className={`text-white/80 hover:text-primary transition-colors relative ${isActive("/docs") ? "text-primary" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Docs
          </Link>
          <Link
            to="/blog"
            className={`text-white/80 hover:text-primary transition-colors relative ${isActive("/blog") ? "text-primary" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            to="/about"
            className={`text-white/80 hover:text-primary transition-colors relative ${isActive("/about") ? "text-primary" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/optimize" className="btn-primary">
            Try Free
          </Link>
          <Link
            to="/dashboard"
            className="text-white/80 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
          >
            Login
          </Link>
        </div>

        <button
          className="md:hidden flex flex-col gap-1 p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="w-6 h-0.5 bg-white/80 transition-all duration-300"></span>
          <span className="w-6 h-0.5 bg-white/80 transition-all duration-300"></span>
          <span className="w-6 h-0.5 bg-white/80 transition-all duration-300"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
