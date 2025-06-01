// Updated for TypeScript migration
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const isActive = (path: string): boolean => location.pathname === path;

  const NavLink: React.FC<{
    to: string;
    children: React.ReactNode;
    onClick?: () => void;
  }> = ({ to, children, onClick }) => (
    <Link
      to={to}
      className={`relative text-sm font-medium transition-all duration-300 group ${
        isActive(to) ? "text-primary" : "text-white/80 hover:text-primary"
      }`}
      onClick={onClick}
    >
      {children}
      {/* Active indicator - underline */}
      <span
        className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${
          isActive(to) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
      {/* Subtle background for active state */}
      <span
        className={`absolute inset-0 -inset-x-3 -inset-y-2 bg-primary/10 rounded-lg transform transition-all duration-300 -z-10 ${
          isActive(to) ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      />
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
        >
          OptimizeCode.ai
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/product">Product</NavLink>
          <NavLink to="/solutions">Solutions</NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/docs">Docs</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/about">About</NavLink>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden flex items-center gap-6 ${
            isMenuOpen ? "flex" : "hidden"
          } absolute top-16 left-0 right-0 bg-gray-900/98 backdrop-blur-xl border-b border-white/10 flex-col p-6`}
        >
          <NavLink to="/product" onClick={() => setIsMenuOpen(false)}>
            Product
          </NavLink>
          <NavLink to="/solutions" onClick={() => setIsMenuOpen(false)}>
            Solutions
          </NavLink>
          <NavLink to="/pricing" onClick={() => setIsMenuOpen(false)}>
            Pricing
          </NavLink>
          <NavLink to="/docs" onClick={() => setIsMenuOpen(false)}>
            Docs
          </NavLink>
          <NavLink to="/blog" onClick={() => setIsMenuOpen(false)}>
            Blog
          </NavLink>
          <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
            About
          </NavLink>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/optimize"
            className={`btn-primary relative overflow-hidden group ${
              isActive("/optimize") ? "ring-2 ring-primary/50" : ""
            }`}
          >
            <span className="relative z-10">Try Free</span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
          <Link
            to="/dashboard"
            className={`text-white/80 hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
              isActive("/dashboard") ? "bg-white/10 text-white" : ""
            }`}
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1 p-2 group"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-white/80 transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-white/80 transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-white/80 transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
