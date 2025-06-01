import React, { useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  LoadingSpinner,
  Skeleton,
  EmptyState,
} from "../components/ui";
import {
  useNotification,
  useNotificationHelpers,
} from "../contexts/NotificationContext";
import {
  PageLoading,
  CardSkeleton,
  ProfileSkeleton,
  DashboardStatsKeleton,
  LoadingOverlay,
} from "../components/ui/LoadingStates";

const TestPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const { showSuccess, showError, showWarning, showInfo } =
    useNotificationHelpers();

  const handleTestNotifications = () => {
    showSuccess("Success notification works!", "Great job!");
    setTimeout(() => showInfo("Info notification works!"), 500);
    setTimeout(() => showWarning("Warning notification works!"), 1000);
    setTimeout(() => showError("Error notification works!"), 1500);
  };

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  const handleOverlayTest = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 3000);
  };

  return (
    <LoadingOverlay loading={showOverlay} message="Testing overlay...">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            🧪 UX Component Testing Lab
          </h1>

          {/* Button Variants */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-white">
                Button Components
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Button variant="primary" size="sm">
                  Primary SM
                </Button>
                <Button variant="secondary" size="base">
                  Secondary
                </Button>
                <Button variant="outline" size="lg">
                  Outline LG
                </Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success" loading={loading}>
                  {loading ? "Loading..." : "Success"}
                </Button>
              </div>
              <div className="mt-4 flex gap-4">
                <Button onClick={handleLoadingTest} variant="primary">
                  Test Loading (3s)
                </Button>
                <Button onClick={handleOverlayTest} variant="outline">
                  Test Overlay (3s)
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Form Components */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-white">
                Form Components
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    required
                    helpText="We'll never share your email"
                  />
                  <Input
                    label="Password"
                    type="password"
                    error="Password is too weak"
                  />
                  <Input
                    label="Confirmation"
                    type="text"
                    success="Looks good!"
                  />
                </div>
                <div>
                  <Textarea
                    label="Message"
                    placeholder="Enter your message..."
                    rows={4}
                    helpText="Maximum 500 characters"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Badges and States */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-white">
                Badges & States
              </h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-4 mb-6">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Loading Spinners
                  </h3>
                  <div className="flex items-center gap-4">
                    <LoadingSpinner size="sm" />
                    <LoadingSpinner size="base" />
                    <LoadingSpinner size="lg" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Skeletons
                  </h3>
                  <div className="space-y-2">
                    <Skeleton height="20px" width="80%" />
                    <Skeleton height="16px" width="60%" />
                    <Skeleton height="14px" width="40%" />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Notifications Test */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-white">
                Notification System
              </h2>
            </CardHeader>
            <CardBody>
              <Button onClick={handleTestNotifications} variant="primary">
                🔔 Test All Notifications
              </Button>
              <p className="text-gray-400 mt-2">
                Click to see success, info, warning, and error notifications
              </p>
            </CardBody>
          </Card>

          {/* Empty States */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-white">
                Empty States
              </h2>
            </CardHeader>
            <CardBody>
              <EmptyState
                icon={<div className="text-6xl">📂</div>}
                title="No Files Found"
                description="Get started by uploading your first code file for optimization"
                action={<Button variant="primary">Upload File</Button>}
              />
            </CardBody>
          </Card>

          {/* Loading States */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-white">
                  Card Skeleton
                </h3>
              </CardHeader>
              <CardBody>
                <CardSkeleton showImage lines={3} />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-white">
                  Dashboard Stats
                </h3>
              </CardHeader>
              <CardBody>
                <DashboardStatsKeleton />
              </CardBody>
            </Card>
          </div>

          {/* Responsive Test */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-white">
                Responsive Grid Test
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="card p-4 text-center">
                    <div className="text-2xl mb-2">📱</div>
                    <h4 className="text-white font-medium">Card {i + 1}</h4>
                    <p className="text-gray-400 text-sm">
                      Responsive grid item
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
            <CardFooter>
              <p className="text-gray-400 text-sm">
                🔍 Resize your browser to test responsiveness
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default TestPage;
