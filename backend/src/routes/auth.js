const express = require("express");
const { body, validationResult } = require("express-validator");
const { userService } = require("../config/firebase");
const { asyncHandler } = require("../middleware/errorHandler");

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("displayName").optional().trim().isLength({ min: 1, max: 100 }),
];

const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 1 }).withMessage("Password is required"),
];

// Register new user
router.post(
  "/register",
  validateRegistration,
  asyncHandler(async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid input data",
        details: errors.array(),
      });
    }

    const { email, password, displayName } = req.body;

    try {
      // In a real implementation, you'd create the user via Firebase Auth
      // For now, we'll create a user profile directly
      const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const profileData = {
        email,
        displayName: displayName || email.split("@")[0],
        emailVerified: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        subscription: {
          plan: "free",
          status: "active",
          startDate: new Date().toISOString(),
          cancelAtPeriodEnd: false,
        },
        usage: {
          optimizationsToday: 0,
          totalOptimizations: 0,
          currentDayStart: new Date().toISOString(),
        },
        limits: {
          optimizationsPerDay: 10,
          maxFileUploads: 2,
          maxPasteCharacters: 10000,
          maxFileSize: 1,
          prioritySupport: false,
          advancedFeatures: false,
        },
      };

      const result = await userService.createUserProfile(uid, profileData);

      if (!result.success) {
        return res.status(500).json({
          error: "Registration Failed",
          message: result.error,
        });
      }

      res.status(201).json({
        message: "User registered successfully",
        user: {
          uid,
          email,
          displayName: profileData.displayName,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        error: "Registration Failed",
        message: "Unable to create user account",
      });
    }
  }),
);

// Login user (verify credentials)
router.post(
  "/login",
  validateLogin,
  asyncHandler(async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid input data",
        details: errors.array(),
      });
    }

    const { email, password } = req.body;

    // In a real implementation, this would verify against Firebase Auth
    // For demo purposes, we'll just validate the format and return success
    res.json({
      message: "Login successful",
      token: "demo-token", // In production, this would be a Firebase ID token
      user: {
        uid: "demo-user-id",
        email,
        displayName: email.split("@")[0],
      },
    });
  }),
);

// Logout user
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    // In Firebase, logout is typically handled client-side
    // This endpoint can be used for server-side cleanup if needed
    res.json({
      message: "Logout successful",
    });
  }),
);

// Verify authentication token
router.post(
  "/verify",
  asyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Token is required",
      });
    }

    const result = await userService.verifyToken(token);

    if (!result.success) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid token",
      });
    }

    res.json({
      message: "Token is valid",
      user: result.user,
    });
  }),
);

// Get user profile after authentication
router.get(
  "/profile",
  asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication token required",
      });
    }

    const authResult = await userService.verifyToken(token);

    if (!authResult.success) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid authentication token",
      });
    }

    const profileResult = await userService.getUserProfile(authResult.user.uid);

    if (!profileResult.success) {
      return res.status(404).json({
        error: "Not Found",
        message: "User profile not found",
      });
    }

    res.json({
      user: authResult.user,
      profile: profileResult.profile,
    });
  }),
);

// Password reset (placeholder)
router.post(
  "/reset-password",
  [body("email").isEmail().normalizeEmail()],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Valid email is required",
        details: errors.array(),
      });
    }

    const { email } = req.body;

    // In production, this would trigger Firebase password reset
    console.log(`Password reset requested for: ${email}`);

    res.json({
      message: "Password reset email sent successfully",
    });
  }),
);

module.exports = router;
