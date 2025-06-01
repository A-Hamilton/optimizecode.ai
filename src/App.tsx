// TypeScript migration completed - all .jsx files removed
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import OptimizePage from "./pages/OptimizePage";
import ProductPage from "./pages/ProductPage";
import PricingPage from "./pages/PricingPage";
import DocsPage from "./pages/DocsPage";
import SolutionsPage from "./pages/SolutionsPage";
import BlogPage from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";
import SecurityPage from "./pages/SecurityPage";
import SupportPage from "./pages/SupportPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer";

function App(): JSX.Element {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/optimize" element={<OptimizePage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
