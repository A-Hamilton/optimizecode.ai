import React, { createContext, useContext, useState, useCallback } from "react";
import { Notification } from "../components/ui";

interface NotificationData {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
  autoClose?: boolean;
}

interface NotificationContextType {
  notifications: NotificationData[];
  showNotification: (notification: Omit<NotificationData, "id">) => void;
  hideNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
  defaultDuration = 5000,
  position = "top-right",
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const showNotification = useCallback(
    (notification: Omit<NotificationData, "id">) => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newNotification: NotificationData = {
        id,
        duration: defaultDuration,
        autoClose: true,
        ...notification,
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        // Keep only the most recent notifications
        return updated.slice(0, maxNotifications);
      });

      // Auto-remove notification
      if (
        newNotification.autoClose &&
        newNotification.duration &&
        newNotification.duration > 0
      ) {
        setTimeout(() => {
          hideNotification(id);
        }, newNotification.duration);
      }
    },
    [defaultDuration, maxNotifications],
  );

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      default:
        return "top-4 right-4";
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, hideNotification, clearAll }}
    >
      {children}

      {/* Notification Container */}
      <div
        className={`fixed ${getPositionClasses()} z-[9999] max-w-md w-full space-y-2 pointer-events-none`}
      >
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification
              type={notification.type}
              title={notification.title}
              message={notification.message}
              onClose={() => hideNotification(notification.id)}
              autoClose={notification.autoClose}
              duration={notification.duration}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Helper functions for easy use
export const useNotificationHelpers = () => {
  const { showNotification } = useNotification();

  return {
    showSuccess: (message: string, title?: string) =>
      showNotification({ type: "success", message, title }),

    showError: (message: string, title?: string) =>
      showNotification({ type: "error", message, title, duration: 7000 }),

    showWarning: (message: string, title?: string) =>
      showNotification({ type: "warning", message, title, duration: 6000 }),

    showInfo: (message: string, title?: string) =>
      showNotification({ type: "info", message, title }),

    showPersistent: (
      type: "success" | "error" | "warning" | "info",
      message: string,
      title?: string,
    ) => showNotification({ type, message, title, autoClose: false }),
  };
};
