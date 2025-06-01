import React, { useState } from "react";
import { Button, Input, Notification } from "./ui";

interface NewsletterProps {
  className?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
}

export const Newsletter: React.FC<NewsletterProps> = ({
  className = "",
  title = "Stay Updated",
  description = "Get the latest updates on new features and optimizations.",
  placeholder = "your@email.com",
  buttonText = "Subscribe",
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Email validation regex
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if email is already subscribed (mock check)
  const isEmailSubscribed = (email: string): boolean => {
    const subscribedEmails = JSON.parse(
      localStorage.getItem("newsletter_subscribers") || "[]",
    );
    return subscribedEmails.includes(email.toLowerCase());
  };

  // Save email to localStorage (in production, this would be an API call)
  const saveEmailSubscription = async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const subscribedEmails = JSON.parse(
            localStorage.getItem("newsletter_subscribers") || "[]",
          );
          const updatedEmails = [...subscribedEmails, email.toLowerCase()];
          localStorage.setItem(
            "newsletter_subscribers",
            JSON.stringify(updatedEmails),
          );

          // Also save subscription metadata
          const subscriptionData = {
            email: email.toLowerCase(),
            subscribedAt: new Date().toISOString(),
            source: "footer_newsletter",
            status: "active",
          };

          const allSubscriptions = JSON.parse(
            localStorage.getItem("newsletter_subscriptions") || "[]",
          );
          allSubscriptions.push(subscriptionData);
          localStorage.setItem(
            "newsletter_subscriptions",
            JSON.stringify(allSubscriptions),
          );

          resolve();
        } catch (error) {
          reject(error);
        }
      }, 1000); // Simulate network delay
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous notifications
    setNotification(null);

    // Validate email
    if (!email.trim()) {
      setNotification({
        type: "error",
        message: "Please enter your email address",
      });
      return;
    }

    if (!isValidEmail(email)) {
      setNotification({
        type: "error",
        message: "Please enter a valid email address",
      });
      return;
    }

    // Check if already subscribed
    if (isEmailSubscribed(email)) {
      setNotification({
        type: "warning",
        message: "This email is already subscribed to our newsletter",
      });
      return;
    }

    // Start loading
    setIsLoading(true);

    try {
      // Simulate API call
      await saveEmailSubscription(email);

      // Success
      setNotification({
        type: "success",
        message: "Thanks for subscribing! You'll receive our latest updates.",
      });

      setIsSubscribed(true);
      setEmail("");

      // Analytics event (in production, you'd track this)
      console.log("Newsletter subscription:", {
        email: email.toLowerCase(),
        timestamp: new Date().toISOString(),
        source: "footer",
      });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setNotification({
        type: "error",
        message: "Failed to subscribe. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (notification?.type === "error") {
      setNotification(null);
    }
  };

  // Reset subscription state
  const handleReset = () => {
    setIsSubscribed(false);
    setNotification(null);
  };

  return (
    <div className={`newsletter-signup ${className}`}>
      <h5 className="newsletter-title">{title}</h5>
      <p className="newsletter-description">{description}</p>

      {/* Show notifications */}
      {notification && (
        <div className="newsletter-notification">
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
            autoClose={notification.type === "success"}
            duration={notification.type === "success" ? 4000 : 6000}
          />
        </div>
      )}

      {/* Show form or success state */}
      {isSubscribed ? (
        <div className="newsletter-success">
          <div className="success-icon">✨</div>
          <p className="success-text">
            You're all set! Check your inbox for confirmation.
          </p>
          <button onClick={handleReset} className="reset-button">
            Subscribe another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="newsletter-form">
          <div className="newsletter-input-group">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder={placeholder}
              className={`newsletter-input ${notification?.type === "error" ? "error" : ""}`}
              disabled={isLoading}
              aria-label="Email address for newsletter"
              aria-describedby="newsletter-description"
            />
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={isLoading || !email.trim()}
              className="newsletter-button"
            >
              {isLoading ? "Subscribing..." : buttonText}
            </Button>
          </div>

          {/* Privacy notice */}
          <p className="newsletter-privacy">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      )}
    </div>
  );
};

export default Newsletter;
