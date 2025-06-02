// Updated for TypeScript migration
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useConditionalAnimation } from "../hooks/useReducedMotion";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const bounceAnimation = useConditionalAnimation("hover:animate-bounce");
  const slideAnimation = useConditionalAnimation("animate-slide-down");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
      setIsMenuOpen(false);
    };

    if (isDropdownOpen || isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isDropdownOpen, isMenuOpen]);

  const isActive = (path: string): boolean => location.pathname === path;

  const NavLink: React.FC<{
    to: string;
    children: React.ReactNode;
    onClick?: () => void;
    mobile?: boolean;
  }> = ({ to, children, onClick, mobile = false }) => (
    <Link
      to={to}
      className={`relative text-sm font-medium transition-all duration-300 group ${
        mobile ? "text-base py-2" : ""
      } ${
        isActive(to)
          ? "text-primary"
          : "text-white/80 hover:text-primary hover:scale-105"
      }`}
      onClick={onClick}
    >
      {children}

      {/* Active indicator - underline */}
      <span
        className={`absolute ${mobile ? "bottom-0" : "bottom-0"} left-0 w-full h-0.5 bg-gradient-to-r from-primary to-primary-light transform transition-all duration-300 ${
          isActive(to)
            ? "scale-x-100 opacity-100"
            : "scale-x-0 group-hover:scale-x-100 opacity-70"
        }`}
      />

      {/* Subtle background for active state */}
      <span
        className={`absolute inset-0 -inset-x-3 -inset-y-2 bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-lg transform transition-all duration-300 -z-10 ${
          isActive(to)
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-50"
        }`}
      />

      {/* Hover glow effect */}
      <span
        className={`absolute inset-0 -inset-x-2 -inset-y-1 bg-primary/5 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 -z-20 ${
          isActive(to) ? "hidden" : ""
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
                  <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        {currentUser.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt="Profile"
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-sm font-medium">
                            {currentUser.displayName?.[0] ||
                              currentUser.email?.[0] ||
                              "U"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm truncate">
                            {currentUser.displayName || "User"}
                          </div>
                          <div className="text-white/60 text-xs truncate">
                            {currentUser.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
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
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m8 5 4-4 4 4"
                          />
                        </svg>
                        Dashboard
                      </Link>

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile Settings
                      </Link>

                      <Link
                        to="/subscription"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
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
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        Billing & Plans
                      </Link>
                    </div>

                    <div className="border-t border-white/10 my-1"></div>

                    <button
                      onClick={async () => {
                        await logout();
                        setIsMenuOpen(false);
                        navigate("/");
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                    >
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
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
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
