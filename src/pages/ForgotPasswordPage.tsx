// Updated for TypeScript migration
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./LoginPage.css"; // Reuse login page styles

interface ForgotPasswordFormData {
  email: string;
}

interface FormErrors {
  email?: string;
  general?: string;
}

const ForgotPasswordPage: React.FC = () => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const { resetPassword } = useAuth();

  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Focus email input on component mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setFormData({ email: value });

    // Clear error when user starts typing
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await resetPassword(formData.email);

      if (result.error) {
        setErrors({ general: result.error });
      } else {
        setIsSuccess(true);
      }
    } catch (error) {
      setErrors({ general: "Password reset failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <Link to="/" className="login-logo">
              <span className="logo-icon">🚀</span>
              <span className="logo-text">OptimizeCode.ai</span>
            </Link>
            <h1 className="login-title">Check Your Email</h1>
            <p className="login-subtitle">
              We've sent password reset instructions to{" "}
              <strong>{formData.email}</strong>
            </p>
          </div>

          <div className="success-message">
            <svg
              className="success-icon"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>
              If an account with that email exists, you'll receive reset
              instructions shortly.
            </p>
          </div>

          <div className="form-actions" style={{ marginTop: "2rem" }}>
            <Link
              to="/login"
              className="login-btn"
              style={{
                textDecoration: "none",
                display: "block",
                textAlign: "center",
              }}
            >
              Back to Login
            </Link>
          </div>

          <div className="signup-link">
            <span>Didn't receive the email? </span>
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({ email: "" });
              }}
              className="signup-btn"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo */}
        <div className="login-header">
          <Link to="/" className="login-logo">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">OptimizeCode.ai</span>
          </Link>
          <h1 className="login-title">Reset Your Password</h1>
          <p className="login-subtitle">
            Enter your email to receive reset instructions
          </p>
        </div>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* General Error */}
          {errors.general && (
            <div className="error-message general-error">
              <svg
                className="error-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {errors.general}
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label
              htmlFor="email"
              className={`form-label ${formData.email ? "has-value" : ""}`}
            >
              Email Address
            </label>
            <input
              ref={emailInputRef}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className={`form-input ${errors.email ? "error" : ""}`}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <span id="email-error" className="field-error">
                {errors.email}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.email || isLoading}
            className={`login-btn ${!formData.email ? "disabled" : ""} ${isLoading ? "loading" : ""}`}
          >
            {isLoading ? (
              <>
                <svg
                  className="spinner"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="spinner-circle"
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    strokeWidth="2"
                  />
                </svg>
                Sending...
              </>
            ) : (
              "Send Reset Instructions"
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="signup-link">
          <span>Remember your password? </span>
          <Link to="/login" className="signup-btn">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
