// TypeScript migration completed - all .jsx files removed
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import OptimizePage from "./pages/OptimizePage";
import EnhancedOptimizePage from "./pages/EnhancedOptimizePage";
import ProductPage from "./pages/ProductPage";
import PricingPage from "./pages/PricingPage";
import DocsPage from "./pages/DocsPage";
import SolutionsPage from "./pages/SolutionsPage";
import BlogPage from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";
import SecurityPage from "./pages/SecurityPage";
import SupportPage from "./pages/SupportPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import ProfilePage from "./pages/ProfilePage";
import TestPage from "./pages/TestPage";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Footer from "./components/Footer";
import "./styles/optimization.css";

function App(): JSX.Element {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/optimize" element={<OptimizePage />} />
              <Route
                path="/optimize-enhanced"
                element={<EnhancedOptimizePage />}
              />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
