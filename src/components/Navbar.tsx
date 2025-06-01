// Updated for TypeScript migration
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

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
          {currentUser ? (
            // Authenticated state
            <>
              <Link
                to="/optimize"
                className={`btn-primary relative overflow-hidden group ${
                  isActive("/optimize") ? "ring-2 ring-primary/50" : ""
                }`}
              >
                <span className="relative z-10">Optimize Code</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>

              <div className="relative">
                <button
                  className="flex items-center gap-2 text-white/80 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs">
                      {currentUser.displayName?.[0] ||
                        currentUser.email?.[0] ||
                        "U"}
                    </div>
                  )}
                  <span>{currentUser.displayName || "Account"}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl py-2 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <div className="border-t border-white/10 my-1"></div>
                    <button
                      onClick={async () => {
                        await logout();
                        setIsMenuOpen(false);
                        navigate("/");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Unauthenticated state
            <>
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
                to="/login"
                className={`text-white/80 hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                  isActive("/login") ? "bg-white/10 text-white" : ""
                }`}
              >
                Login
              </Link>
            </>
          )}
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
