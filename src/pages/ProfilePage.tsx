import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Notification,
  Badge,
  LoadingSpinner,
  EmptyState,
} from "../components/ui";
import "./ProfilePage.css";

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
  isActive: boolean;
}

interface NotificationPreferences {
  productUpdates: boolean;
  billingAlerts: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
}

const ProfilePage: React.FC = () => {
  const { currentUser, userProfile, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "api" | "notifications" | "preferences"
  >("profile");

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    displayName: userProfile?.displayName || "",
    email: userProfile?.email || "",
    bio: "",
    company: "",
    location: "",
    website: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // API Keys state
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [showCreateAPIKey, setShowCreateAPIKey] = useState(false);
  const [newAPIKeyName, setNewAPIKeyName] = useState("");

  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] =
    useState<NotificationPreferences>({
      productUpdates: true,
      billingAlerts: true,
      securityAlerts: true,
      marketingEmails: false,
      weeklyReports: true,
    });

  // Theme preference state
  const [themePreference, setThemePreference] = useState<
    "light" | "dark" | "system"
  >("dark");

  // Connected accounts state
  const [connectedAccounts, setConnectedAccounts] = useState({
    github: false,
    google: true,
    gitlab: false,
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Load user data
    loadUserData();
  }, [currentUser, navigate]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // In a real app, fetch user data from API
      // For now, use mock data
      setApiKeys([
        {
          id: "1",
          name: "Production API",
          key: "ock_1234567890abcdef",
          createdAt: new Date("2024-01-15"),
          lastUsed: new Date("2024-01-20"),
          isActive: true,
        },
      ]);
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to load profile data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email if changed
      if (profileForm.email !== userProfile?.email) {
        // In a real app, this would trigger email verification
        setNotification({
          type: "warning",
          message: "Email verification required. Please check your inbox.",
        });
      }

      await updateProfile(profileForm);
      setNotification({
        type: "success",
        message: "Profile updated successfully!",
      });
    } catch (error) {
      setNotification({ type: "error", message: "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotification({ type: "error", message: "New passwords do not match" });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setNotification({
        type: "error",
        message: "Password must be at least 8 characters",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, call password change API
      setNotification({
        type: "success",
        message: "Password updated successfully!",
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setNotification({ type: "error", message: "Failed to update password" });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAPIKey = async () => {
    if (!newAPIKeyName.trim()) {
      setNotification({
        type: "error",
        message: "Please enter a name for the API key",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newKey: APIKey = {
        id: Date.now().toString(),
        name: newAPIKeyName,
        key: `ock_${Math.random().toString(36).substr(2, 24)}`,
        createdAt: new Date(),
        isActive: true,
      };

      setApiKeys([...apiKeys, newKey]);
      setNewAPIKeyName("");
      setShowCreateAPIKey(false);
      setNotification({
        type: "success",
        message: "API key created successfully!",
      });
    } catch (error) {
      setNotification({ type: "error", message: "Failed to create API key" });
    } finally {
      setIsLoading(false);
    }
  };

  const revokeAPIKey = async (keyId: string) => {
    setIsLoading(true);
    try {
      setApiKeys(apiKeys.filter((key) => key.id !== keyId));
      setNotification({
        type: "success",
        message: "API key revoked successfully",
      });
    } catch (error) {
      setNotification({ type: "error", message: "Failed to revoke API key" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationPrefsUpdate = async () => {
    setIsLoading(true);
    try {
      // Save notification preferences
      setNotification({
        type: "success",
        message: "Notification preferences updated!",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to update preferences",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectAccount = async (provider: string) => {
    setIsLoading(true);
    try {
      setConnectedAccounts({
        ...connectedAccounts,
        [provider]: false,
      });
      setNotification({
        type: "success",
        message: `${provider} account disconnected`,
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: `Failed to disconnect ${provider}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      // In a real app, call delete account API
      await logout();
      navigate("/");
    } catch (error) {
      setNotification({ type: "error", message: "Failed to delete account" });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "api", label: "API Keys", icon: "🔑" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setNotification({ type: "success", message: "Copied to clipboard!" });
  };

  if (!currentUser) {
    return (
      <div className="profile-page">
        <div className="container">
          <EmptyState
            icon={<div className="text-6xl">🔒</div>}
            title="Access Denied"
            description="Please log in to view your profile"
            action={
              <Button onClick={() => navigate("/login")}>Go to Login</Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Header */}
        <div className="profile-header">
          <div>
            <h1 className="page-title">Profile Settings</h1>
            <p className="page-subtitle">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="profile-avatar">
            <div className="avatar-circle">
              {userProfile?.displayName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="avatar-info">
              <div className="avatar-name">
                {userProfile?.displayName || "User"}
              </div>
              <Badge variant="success" size="sm">
                {userProfile?.subscription?.plan || "Free"} Plan
              </Badge>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Tabs */}
        <div className="profile-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <h2>Profile Information</h2>
                <p>Update your basic account information</p>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleProfileUpdate} className="profile-form">
                  <div className="form-row">
                    <Input
                      label="Display Name"
                      value={profileForm.displayName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          displayName: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      helpText="Changing email will require verification"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <Input
                      label="Company"
                      value={profileForm.company}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          company: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Location"
                      value={profileForm.location}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Input
                    label="Website"
                    type="url"
                    value={profileForm.website}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        website: e.target.value,
                      })
                    }
                    placeholder="https://your-website.com"
                  />
                </form>
              </CardBody>
              <CardFooter>
                <Button onClick={handleProfileUpdate} loading={isLoading}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "security" && (
            <div className="security-section">
              <Card className="mb-6">
                <CardHeader>
                  <h2>Change Password</h2>
                  <p>Update your account password</p>
                </CardHeader>
                <CardBody>
                  <form
                    onSubmit={handlePasswordChange}
                    className="password-form"
                  >
                    <Input
                      label="Current Password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      label="New Password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      helpText="Must be at least 8 characters"
                      required
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </form>
                </CardBody>
                <CardFooter>
                  <Button onClick={handlePasswordChange} loading={isLoading}>
                    Update Password
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <h2>Connected Accounts</h2>
                  <p>Manage your connected social accounts</p>
                </CardHeader>
                <CardBody>
                  <div className="connected-accounts">
                    {Object.entries(connectedAccounts).map(
                      ([provider, connected]) => (
                        <div key={provider} className="account-item">
                          <div className="account-info">
                            <span className="account-icon">
                              {provider === "github" && "🐙"}
                              {provider === "google" && "🟢"}
                              {provider === "gitlab" && "🦊"}
                            </span>
                            <div>
                              <div className="account-name">
                                {provider.charAt(0).toUpperCase() +
                                  provider.slice(1)}
                              </div>
                              <div className="account-status">
                                {connected ? "Connected" : "Not connected"}
                              </div>
                            </div>
                          </div>
                          {connected ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => disconnectAccount(provider)}
                            >
                              Disconnect
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                setNotification({
                                  type: "info",
                                  message:
                                    "OAuth connection not implemented in demo",
                                })
                              }
                            >
                              Connect
                            </Button>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === "api" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h2>API Keys</h2>
                    <p>Manage your API keys for programmatic access</p>
                  </div>
                  <Button onClick={() => setShowCreateAPIKey(true)}>
                    Create API Key
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {showCreateAPIKey && (
                  <div className="create-api-key mb-6">
                    <Input
                      label="API Key Name"
                      value={newAPIKeyName}
                      onChange={(e) => setNewAPIKeyName(e.target.value)}
                      placeholder="e.g., Production API, Development"
                    />
                    <div className="flex gap-2 mt-4">
                      <Button onClick={generateAPIKey} loading={isLoading}>
                        Generate Key
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowCreateAPIKey(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {apiKeys.length === 0 ? (
                  <EmptyState
                    icon={<div className="text-4xl">🔑</div>}
                    title="No API Keys"
                    description="Create your first API key to get started with programmatic access"
                  />
                ) : (
                  <div className="api-keys-list">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="api-key-item">
                        <div className="api-key-info">
                          <div className="api-key-name">{key.name}</div>
                          <div className="api-key-details">
                            <span>
                              Created: {key.createdAt.toLocaleDateString()}
                            </span>
                            {key.lastUsed && (
                              <span>
                                Last used: {key.lastUsed.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div className="api-key-value">
                            <code>{key.key}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(key.key)}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => revokeAPIKey(key.id)}
                        >
                          Revoke
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <h2>Notification Preferences</h2>
                <p>Choose what notifications you'd like to receive</p>
              </CardHeader>
              <CardBody>
                <div className="notification-prefs">
                  {Object.entries(notificationPrefs).map(([key, enabled]) => (
                    <div key={key} className="notification-item">
                      <div className="notification-info">
                        <div className="notification-name">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </div>
                        <div className="notification-description">
                          {key === "productUpdates" &&
                            "Get notified about new features and updates"}
                          {key === "billingAlerts" &&
                            "Important billing and payment notifications"}
                          {key === "securityAlerts" &&
                            "Security-related notifications"}
                          {key === "marketingEmails" &&
                            "Promotional emails and newsletters"}
                          {key === "weeklyReports" &&
                            "Weekly usage and performance reports"}
                        </div>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) =>
                            setNotificationPrefs({
                              ...notificationPrefs,
                              [key]: e.target.checked,
                            })
                          }
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  ))}
                </div>
              </CardBody>
              <CardFooter>
                <Button
                  onClick={handleNotificationPrefsUpdate}
                  loading={isLoading}
                >
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "preferences" && (
            <div className="preferences-section">
              <Card className="mb-6">
                <CardHeader>
                  <h2>Theme Preference</h2>
                  <p>Choose your preferred theme</p>
                </CardHeader>
                <CardBody>
                  <div className="theme-options">
                    {(["light", "dark", "system"] as const).map((theme) => (
                      <label key={theme} className="theme-option">
                        <input
                          type="radio"
                          name="theme"
                          value={theme}
                          checked={themePreference === theme}
                          onChange={(e) =>
                            setThemePreference(e.target.value as any)
                          }
                        />
                        <div className="theme-preview">
                          <div className={`theme-circle theme-${theme}`}></div>
                          <span>
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card className="danger-zone">
                <CardHeader>
                  <h2 className="text-red-400">Danger Zone</h2>
                  <p>Irreversible and destructive actions</p>
                </CardHeader>
                <CardBody>
                  <div className="danger-item">
                    <div>
                      <h3>Delete Account</h3>
                      <p>
                        Permanently delete your account and all associated data.
                        This action cannot be undone.
                      </p>
                    </div>
                    <Button
                      variant="danger"
                      onClick={handleDeleteAccount}
                      loading={isLoading}
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
