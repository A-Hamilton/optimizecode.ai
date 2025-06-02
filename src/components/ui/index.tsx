// OptimizeCode.ai UI Component Library
import React, { useState, useEffect } from "react";
import "./DesignSystem.css";

// ========================================
// BUTTON COMPONENT
// ========================================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success";
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "base",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  disabled,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Create ripple effect
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    // Call original onClick
    if (onClick) {
      onClick(event);
    }
  };

  const baseClasses = "btn relative overflow-hidden";
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  const widthClasses = fullWidth ? "w-full" : "";
  const animationClasses =
    "transition-all duration-300 ease-out transform hover:scale-105 active:scale-95";

  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClasses,
    animationClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none animate-ripple"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}

      {loading && <div className="loading-spinner" />}
      {!loading && icon && iconPosition === "left" && (
        <span className="transition-transform duration-200 group-hover:scale-110">
          {icon}
        </span>
      )}
      <span className="relative z-10">{children}</span>
      {!loading && icon && iconPosition === "right" && (
        <span className="transition-transform duration-200 group-hover:scale-110">
          {icon}
        </span>
      )}
    </button>
  );
};

// ========================================
// INPUT COMPONENT
// ========================================

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  required?: boolean;
  helpText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  required = false,
  helpText,
  icon,
  iconPosition = "left",
  className = "",
  id,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  const hasSuccess = !!success;

  const inputClasses = [
    "form-input",
    "transition-all duration-300 ease-out",
    "border-2 focus:border-primary focus:ring-2 focus:ring-primary/20",
    hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "",
    hasSuccess
      ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="form-group">
      {label && (
        <label
          htmlFor={inputId}
          className={`form-label transition-colors duration-200 ${
            isFocused ? "text-primary" : ""
          } ${required ? "required" : ""}`}
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {icon && iconPosition === "left" && (
          <div
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
              isFocused ? "text-primary" : "text-gray-400"
            }`}
          >
            {icon}
          </div>
        )}

        <input
          id={inputId}
          className={inputClasses}
          style={{
            paddingLeft: icon && iconPosition === "left" ? "2.5rem" : undefined,
            paddingRight:
              icon && iconPosition === "right" ? "2.5rem" : undefined,
          }}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {icon && iconPosition === "right" && (
          <div
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
              isFocused ? "text-primary" : "text-gray-400"
            }`}
          >
            {icon}
          </div>
        )}

        {/* Focus line effect */}
        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
            isFocused ? "w-full" : "w-0"
          }`}
        />
      </div>

      {error && (
        <div className="form-error animate-fade-in">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="form-success animate-fade-in">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {success}
        </div>
      )}

      {helpText && !error && !success && (
        <p className="text-sm text-gray-400 mt-2 transition-opacity duration-200">
          {helpText}
        </p>
      )}
    </div>
  );
};

// ========================================
// TEXTAREA COMPONENT
// ========================================

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  required?: boolean;
  helpText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  success,
  required = false,
  helpText,
  className = "",
  id,
  ...props
}) => {
  const textareaId =
    id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  const textareaClasses = [
    "form-input",
    "form-textarea",
    hasError ? "error" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="form-group">
      {label && (
        <label
          htmlFor={textareaId}
          className={`form-label ${required ? "required" : ""}`}
        >
          {label}
        </label>
      )}

      <textarea id={textareaId} className={textareaClasses} {...props} />

      {error && (
        <div className="form-error">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="form-success">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {success}
        </div>
      )}

      {helpText && !error && !success && (
        <p className="text-sm text-gray-400 mt-2">{helpText}</p>
      )}
    </div>
  );
};

// ========================================
// CARD COMPONENT
// ========================================

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = true,
}) => {
  const classes = [
    "card",
    hover ? "hover:shadow-lg hover:border-gray-600" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`card-body ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`card-footer ${className}`}>{children}</div>
);

// ========================================
// NOTIFICATION SYSTEM
// ========================================

export interface NotificationProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "info":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`notification notification-${type}`}>
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1">
        {title && <div className="font-medium mb-1">{title}</div>}
        <div className="text-sm">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="notification-close"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

// ========================================
// LOADING SPINNER
// ========================================

export interface LoadingSpinnerProps {
  size?: "sm" | "base" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "base",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    base: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]} ${className}`} />
  );
};

// ========================================
// BADGE COMPONENT
// ========================================

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger";
  size?: "sm" | "base";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "base",
  className = "",
}) => {
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-2 py-1 text-xs";
  const classes = ["badge", `badge-${variant}`, sizeClasses, className]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{children}</span>;
};

// ========================================
// SKELETON LOADER
// ========================================

export interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  className = "",
}) => (
  <div className={`loading-skeleton ${className}`} style={{ width, height }} />
);

// ========================================
// EMPTY STATE COMPONENT
// ========================================

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => (
  <div className={`text-center py-12 ${className}`}>
    {icon && (
      <div className="text-gray-400 mb-4 flex justify-center">{icon}</div>
    )}
    <h3 className="text-lg font-medium text-gray-200 mb-2">{title}</h3>
    {description && (
      <p className="text-gray-400 mb-6 max-w-sm mx-auto">{description}</p>
    )}
    {action && <div>{action}</div>}
  </div>
);

// ========================================
// EXPORTS
// ========================================

export default {
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Notification,
  LoadingSpinner,
  Badge,
  Skeleton,
  EmptyState,
};
