import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">OptimizeCode.ai</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <Link
            to="/product"
            className={`navbar-link ${isActive("/product") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Product
          </Link>
          <Link
            to="/solutions"
            className={`navbar-link ${isActive("/solutions") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Solutions
          </Link>
          <Link
            to="/pricing"
            className={`navbar-link ${isActive("/pricing") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            to="/docs"
            className={`navbar-link ${isActive("/docs") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Docs
          </Link>
          <Link
            to="/blog"
            className={`navbar-link ${isActive("/blog") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            to="/about"
            className={`navbar-link ${isActive("/about") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
        </div>

        <div className="navbar-actions">
          <Link to="/optimize" className="navbar-cta">
            Try Free
          </Link>
          <Link to="/dashboard" className="navbar-login">
            Login
          </Link>
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
