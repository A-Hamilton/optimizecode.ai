// OptimizeCode.ai Enhanced UI Component Library
import React, { useState, useEffect, useRef, forwardRef, useId } from "react";
import "./DesignSystem.css";

// ========================================
// TYPES & INTERFACES
// ========================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

// ========================================
// ENHANCED BUTTON COMPONENT
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
  tooltip?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
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
      tooltip,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const [ripples, setRipples] = useState<
      Array<{ id: number; x: number; y: number }>
    >([]);
    const buttonId = useId();

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
        setRipples((prev) =>
          prev.filter((ripple) => ripple.id !== newRipple.id),
        );
      }, 600);

      // Call original onClick
      onClick?.(event);
    };

    const baseClasses = "btn touch-manipulation";
    const variantClasses = `btn-${variant}`;
    const sizeClasses = `btn-${size}`;
    const widthClasses = fullWidth ? "w-full" : "";

    const classes = [
      baseClasses,
      variantClasses,
      sizeClasses,
      widthClasses,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const effectiveAriaLabel =
      ariaLabel || (typeof children === "string" ? children : undefined);

    return (
      <>
        <button
          ref={ref}
          id={buttonId}
          className={classes}
          disabled={disabled || loading}
          onClick={handleClick}
          aria-label={effectiveAriaLabel}
          aria-describedby={tooltip ? `${buttonId}-tooltip` : undefined}
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
              aria-hidden="true"
            />
          ))}

          {loading && (
            <div className="loading-spinner" role="status" aria-label="Loading">
              <span className="sr-only">Loading...</span>
            </div>
          )}

          {!loading && icon && iconPosition === "left" && (
            <span
              className="transition-transform duration-200 group-hover:scale-110"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          <span className="relative z-10">{children}</span>

          {!loading && icon && iconPosition === "right" && (
            <span
              className="transition-transform duration-200 group-hover:scale-110"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
        </button>

        {/* Tooltip */}
        {tooltip && (
          <div id={`${buttonId}-tooltip`} role="tooltip" className="sr-only">
            {tooltip}
          </div>
        )}
      </>
    );
  },
);

Button.displayName = "Button";

// ========================================
// ENHANCED INPUT COMPONENT
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
  onIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      required = false,
      helpText,
      icon,
      iconPosition = "left",
      onIconClick,
      className = "",
      id,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || useId();
    const hasError = !!error;
    const hasSuccess = !!success;
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;
    const helpId = `${inputId}-help`;

    const describedBy =
      [
        ariaDescribedBy,
        hasError ? errorId : null,
        hasSuccess ? successId : null,
        helpText ? helpId : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    const inputClasses = [
      "form-input",
      hasError ? "error" : "",
      hasSuccess ? "success" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="form-group">
        {label && (
          <label
            htmlFor={inputId}
            className={`form-label ${
              isFocused ? "text-primary-400" : ""
            } ${required ? "required" : ""}`}
          >
            {label}
            {required && <span className="sr-only"> (required)</span>}
          </label>
        )}

        <div className="relative group">
          {icon && iconPosition === "left" && (
            <div
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                isFocused ? "text-primary-400" : "text-gray-400"
              } ${onIconClick ? "cursor-pointer" : ""}`}
              onClick={onIconClick}
              role={onIconClick ? "button" : undefined}
              tabIndex={onIconClick ? 0 : -1}
              aria-label={onIconClick ? "Icon action" : undefined}
            >
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            style={{
              paddingLeft:
                icon && iconPosition === "left" ? "2.5rem" : undefined,
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
            aria-describedby={describedBy}
            aria-invalid={hasError}
            aria-required={required}
            {...props}
          />

          {icon && iconPosition === "right" && (
            <div
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                isFocused ? "text-primary-400" : "text-gray-400"
              } ${onIconClick ? "cursor-pointer" : ""}`}
              onClick={onIconClick}
              role={onIconClick ? "button" : undefined}
              tabIndex={onIconClick ? 0 : -1}
              aria-label={onIconClick ? "Icon action" : undefined}
            >
              {icon}
            </div>
          )}
        </div>

        {error && (
          <div id={errorId} className="form-error animate-fade-in" role="alert">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div id={successId} className="form-success animate-fade-in">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {helpText && !error && !success && (
          <p id={helpId} className="form-help">
            {helpText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

// ========================================
// ENHANCED TEXTAREA COMPONENT
// ========================================

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  required?: boolean;
  helpText?: string;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      success,
      required = false,
      helpText,
      autoResize = false,
      className = "",
      id,
      onChange,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const inputId = id || useId();
    const hasError = !!error;
    const hasSuccess = !!success;
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;
    const helpId = `${inputId}-help`;

    const describedBy =
      [
        ariaDescribedBy,
        hasError ? errorId : null,
        hasSuccess ? successId : null,
        helpText ? helpId : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    const textareaClasses = [
      "form-input",
      "form-textarea",
      hasError ? "error" : "",
      hasSuccess ? "success" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
      onChange?.(e);
    };

    return (
      <div className="form-group">
        {label && (
          <label
            htmlFor={inputId}
            className={`form-label ${required ? "required" : ""}`}
          >
            {label}
            {required && <span className="sr-only"> (required)</span>}
          </label>
        )}

        <textarea
          ref={(node) => {
            textareaRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          id={inputId}
          className={textareaClasses}
          onChange={handleChange}
          aria-describedby={describedBy}
          aria-invalid={hasError}
          aria-required={required}
          {...props}
        />

        {error && (
          <div id={errorId} className="form-error animate-fade-in" role="alert">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div id={successId} className="form-success animate-fade-in">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {helpText && !error && !success && (
          <p id={helpId} className="form-help">
            {helpText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

// ========================================
// ENHANCED CARD COMPONENT
// ========================================

export interface CardProps extends BaseComponentProps {
  hover?: boolean;
  interactive?: boolean;
  padding?: "none" | "sm" | "base" | "lg";
  as?: keyof JSX.IntrinsicElements;
  onClick?: () => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = "",
      hover = true,
      interactive = false,
      padding = "base",
      as: Component = "div",
      onClick,
      ...props
    },
    ref,
  ) => {
    const paddingClasses = {
      none: "",
      sm: "p-4",
      base: "p-6",
      lg: "p-8",
    };

    const classes = [
      "card",
      hover ? "hover:shadow-lg hover:border-gray-600 hover:-translate-y-1" : "",
      interactive ? "card-interactive" : "",
      paddingClasses[padding],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Component
        ref={ref}
        className={classes}
        onClick={onClick}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Card.displayName = "Card";

export const CardHeader: React.FC<BaseComponentProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<BaseComponentProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`card-body ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<BaseComponentProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

// ========================================
// ENHANCED NOTIFICATION SYSTEM
// ========================================

export interface NotificationProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  actions?: React.ReactNode;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
  actions,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState(100);
  const notificationId = useId();

  useEffect(() => {
    // Show notification
    setIsVisible(true);

    if (autoClose && onClose) {
      // Progress bar animation
      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (duration / 50);
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 50);

      // Auto close timer
      const closeTimer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(closeTimer);
        clearInterval(progressTimer);
      };
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 300); // Match animation duration
  };

  const getIcon = () => {
    const iconClasses = "w-5 h-5 flex-shrink-0";

    switch (type) {
      case "success":
        return (
          <svg
            className={iconClasses}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className={iconClasses}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className={iconClasses}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className={iconClasses}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getAriaLive = () => {
    return type === "error" ? "assertive" : "polite";
  };

  return (
    <div
      className={`notification notification-${type} group relative overflow-hidden ${
        isVisible && !isClosing
          ? "animate-slide-in-right"
          : isClosing
            ? "animate-slide-out-right"
            : "opacity-0 translate-x-full"
      }`}
      role="alert"
      aria-live={getAriaLive()}
      aria-labelledby={title ? `${notificationId}-title` : undefined}
      aria-describedby={`${notificationId}-message`}
    >
      {/* Progress bar */}
      {autoClose && (
        <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
          <div
            className="h-full bg-white/40 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
      )}

      <div className="flex-shrink-0" aria-hidden="true">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <div
            id={`${notificationId}-title`}
            className="font-medium mb-1 animate-fade-in-up animate-delay-100"
          >
            {title}
          </div>
        )}
        <div
          id={`${notificationId}-message`}
          className="text-sm animate-fade-in-up animate-delay-200"
        >
          {message}
        </div>
        {actions && (
          <div className="mt-3 animate-fade-in-up animate-delay-300">
            {actions}
          </div>
        )}
      </div>

      {onClose && (
        <button
          onClick={handleClose}
          className="notification-close"
          aria-label="Close notification"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
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
// ENHANCED LOADING SPINNER
// ========================================

export interface LoadingSpinnerProps {
  size?: "sm" | "base" | "lg";
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "base",
  className = "",
  label = "Loading",
}) => {
  const sizeClasses = {
    sm: "loading-spinner-sm",
    base: "",
    lg: "loading-spinner-lg",
  };

  return (
    <div
      className={`loading-spinner ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}...</span>
    </div>
  );
};

// ========================================
// ENHANCED BADGE COMPONENT
// ========================================

export interface BadgeProps extends BaseComponentProps {
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "base" | "lg";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "base",
  dot = false,
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "badge-sm",
    base: "",
    lg: "badge-lg",
  };

  const classes = ["badge", `badge-${variant}`, sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {dot && (
        <span className="w-2 h-2 bg-current rounded-full" aria-hidden="true" />
      )}
      {children}
    </span>
  );
};

// ========================================
// ENHANCED SKELETON LOADER
// ========================================

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: "text" | "rectangular" | "circular" | "button";
  animation?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height,
  className = "",
  variant = "rectangular",
  animation = true,
}) => {
  const variantClasses = {
    text: "skeleton-text",
    rectangular: "",
    circular: "skeleton-avatar",
    button: "skeleton-button",
  };

  const defaultHeight =
    variant === "text" ? "1em" : variant === "button" ? "44px" : "1rem";

  const classes = [
    animation ? "loading-skeleton" : "bg-gray-700",
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: height
          ? typeof height === "number"
            ? `${height}px`
            : height
          : defaultHeight,
      }}
      aria-hidden="true"
    />
  );
};

// ========================================
// EMPTY STATE COMPONENT
// ========================================

export interface EmptyStateProps extends BaseComponentProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  size?: "sm" | "base" | "lg";
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  size = "base",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "py-8",
    base: "py-12",
    lg: "py-16",
  };

  const iconSizeClasses = {
    sm: "w-8 h-8",
    base: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const titleSizeClasses = {
    sm: "text-base",
    base: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className={`text-center ${sizeClasses[size]} ${className}`} {...props}>
      {icon && (
        <div
          className={`text-gray-400 mb-4 flex justify-center ${iconSizeClasses[size]}`}
        >
          {icon}
        </div>
      )}
      <h3
        className={`${titleSizeClasses[size]} font-medium text-gray-200 mb-2`}
      >
        {title}
      </h3>
      {description && (
        <p className="text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

// ========================================
// ENHANCED DIVIDER COMPONENT
// ========================================

export interface DividerProps extends BaseComponentProps {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted";
  spacing?: "sm" | "base" | "lg";
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  variant = "solid",
  spacing = "base",
  label,
  className = "",
  ...props
}) => {
  const spacingClasses = {
    sm: orientation === "horizontal" ? "my-2" : "mx-2",
    base: orientation === "horizontal" ? "my-4" : "mx-4",
    lg: orientation === "horizontal" ? "my-6" : "mx-6",
  };

  const borderClasses = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
  };

  if (label && orientation === "horizontal") {
    return (
      <div
        className={`relative ${spacingClasses[spacing]} ${className}`}
        {...props}
      >
        <div className="absolute inset-0 flex items-center">
          <div
            className={`w-full border-t border-gray-600 ${borderClasses[variant]}`}
          />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-900 text-gray-400">{label}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        orientation === "horizontal"
          ? `border-t border-gray-600 ${spacingClasses[spacing]}`
          : `border-l border-gray-600 ${spacingClasses[spacing]} h-full`
      } ${borderClasses[variant]} ${className}`}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  );
};

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
  Divider,
};
