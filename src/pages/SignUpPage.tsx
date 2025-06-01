// Updated for TypeScript migration
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./SignUpPage.css";

interface SignUpFormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface FormErrors {
  displayName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { signup, loginWithGoogle, loginWithGithub } = useAuth();

  const [formData, setFormData] = useState<SignUpFormData>({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Focus name input on component mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Validate form in real time
  useEffect(() => {
    const isValid =
      formData.displayName.length > 0 &&
      formData.email.length > 0 &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword &&
      formData.acceptTerms;
    setIsFormValid(isValid);
  }, [formData]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));

    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Full name is required";
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
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
      const result = await signup(
        formData.email,
        formData.password,
        formData.displayName.trim(),
      );

      if (result.error) {
        setErrors({ general: result.error });
      } else {
        // Redirect to dashboard on successful signup
        navigate("/dashboard");
      }
    } catch (error) {
      setErrors({ general: "Sign up failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: "google" | "github") => {
    setIsLoading(true);
    setErrors({});

    try {
      const result =
        provider === "google"
          ? await loginWithGoogle()
          : await loginWithGithub();

      if (result.error) {
        setErrors({ general: result.error });
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrors({ general: `${provider} sign up failed. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Logo */}
        <div className="signup-header">
          <Link to="/" className="signup-logo">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">OptimizeCode.ai</span>
          </Link>
          <h1 className="signup-title">Create Your Account</h1>
          <p className="signup-subtitle">
            Join thousands of developers optimizing their code
          </p>
        </div>

        {/* Social Sign Up Buttons */}
        <div className="social-signup-section">
          <button
            type="button"
            className="social-btn google-btn"
            onClick={() => handleSocialSignUp("google")}
            disabled={isLoading}
          >
            <svg
              className="social-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>

          <button
            type="button"
            className="social-btn github-btn"
            onClick={() => handleSocialSignUp("github")}
            disabled={isLoading}
          >
            <svg
              className="social-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Sign up with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="divider">
          <span className="divider-text">or</span>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="signup-form" noValidate>
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

          {/* Display Name Field */}
          <div className="form-group">
            <label
              htmlFor="displayName"
              className={`form-label ${formData.displayName ? "has-value" : ""}`}
            >
              Full Name
            </label>
            <input
              ref={nameInputRef}
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={`form-input ${errors.displayName ? "error" : ""}`}
              aria-describedby={errors.displayName ? "name-error" : undefined}
              autoComplete="name"
            />
            {errors.displayName && (
              <span id="name-error" className="field-error">
                {errors.displayName}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label
              htmlFor="email"
              className={`form-label ${formData.email ? "has-value" : ""}`}
            >
              Email Address
            </label>
            <input
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

          {/* Password Field */}
          <div className="form-group">
            <label
              htmlFor="password"
              className={`form-label ${formData.password ? "has-value" : ""}`}
            >
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password (6+ characters)"
                className={`form-input ${errors.password ? "error" : ""}`}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0112 20C7 20 2.73 16.39 1 12A23.72 23.72 0 015.06 5.06M9.9 4.24A9.12 9.12 0 0112 4C17 4 21.27 7.61 23 12A23.72 23.72 0 0120.49 15.51M14.12 14.12A3 3 0 119.88 9.88M1 1L23 23"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span id="password-error" className="field-error">
                {errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label
              htmlFor="confirmPassword"
              className={`form-label ${formData.confirmPassword ? "has-value" : ""}`}
            >
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                aria-describedby={
                  errors.confirmPassword ? "confirm-password-error" : undefined
                }
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0112 20C7 20 2.73 16.39 1 12A23.72 23.72 0 015.06 5.06M9.9 4.24A9.12 9.12 0 0112 4C17 4 21.27 7.61 23 12A23.72 23.72 0 0120.49 15.51M14.12 14.12A3 3 0 119.88 9.88M1 1L23 23"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span id="confirm-password-error" className="field-error">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="form-group">
            <label className="terms-checkbox">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="checkbox"
              />
              <span className="checkbox-label">
                I agree to the{" "}
                <Link to="/terms" className="terms-link">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="terms-link">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <span className="field-error">{errors.acceptTerms}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`signup-btn ${!isFormValid ? "disabled" : ""} ${isLoading ? "loading" : ""}`}
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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="login-link">
          <span>Already have an account? </span>
          <Link to="/login" className="login-btn-link">
            Log in
          </Link>
        </div>

        {/* Security Badge */}
        <div className="security-badge">
          <svg
            className="security-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M9 12L11 14L15 10M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Secure Registration - Protected by HTTPS</span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
