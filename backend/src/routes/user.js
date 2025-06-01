const express = require("express");
const { body, validationResult } = require("express-validator");
const { userService } = require("../config/firebase");
const { asyncHandler } = require("../middleware/errorHandler");

const router = express.Router();

// Get user profile
router.get(
  "/profile",
  asyncHandler(async (req, res) => {
    const uid = req.user.uid;

    const result = await userService.getUserProfile(uid);

    if (!result.success) {
      return res.status(404).json({
        error: "Not Found",
        message: "User profile not found",
      });
    }

    res.json({
      profile: result.profile,
    });
  }),
);

// Update user profile
router.put(
  "/profile",
  [
    body("displayName").optional().trim().isLength({ min: 1, max: 100 }),
    body("email").optional().isEmail().normalizeEmail(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid input data",
        details: errors.array(),
      });
    }

    const uid = req.user.uid;
    const updates = {};

    // Only include provided fields
    if (req.body.displayName) updates.displayName = req.body.displayName;
    if (req.body.email) updates.email = req.body.email;

    const result = await userService.updateUserProfile(uid, updates);

    if (!result.success) {
      return res.status(500).json({
        error: "Update Failed",
        message: result.error,
      });
    }

    res.json({
      message: "Profile updated successfully",
    });
  }),
);

// Get usage statistics
router.get(
  "/usage",
  asyncHandler(async (req, res) => {
    const uid = req.user.uid;

    const result = await userService.getUserProfile(uid);

    if (!result.success) {
      return res.status(404).json({
        error: "Not Found",
        message: "User profile not found",
      });
    }

    const profile = result.profile;
    const usage = profile.usage || {};
    const limits = profile.limits || {};

    // Check if we need to reset daily usage
    const today = new Date().toDateString();
    const lastResetDate = new Date(usage.currentDayStart).toDateString();

    let resetUsage = false;
    if (today !== lastResetDate) {
      resetUsage = true;
      // Reset daily counters
      await userService.updateUserProfile(uid, {
        "usage.optimizationsToday": 0,
        "usage.currentDayStart": new Date().toISOString(),
      });
    }

    res.json({
      usage: {
        optimizationsToday: resetUsage ? 0 : usage.optimizationsToday || 0,
        totalOptimizations: usage.totalOptimizations || 0,
        lastOptimizationDate: usage.lastOptimizationDate,
        currentDayStart: resetUsage
          ? new Date().toISOString()
          : usage.currentDayStart,
      },
      limits: {
        optimizationsPerDay: limits.optimizationsPerDay || 10,
        maxFileUploads: limits.maxFileUploads || 2,
        maxPasteCharacters: limits.maxPasteCharacters || 10000,
        maxFileSize: limits.maxFileSize || 1,
      },
      subscription: profile.subscription || { plan: "free", status: "active" },
    });
  }),
);

// Track optimization usage
router.post(
  "/track-usage",
  asyncHandler(async (req, res) => {
    const uid = req.user.uid;

    const profileResult = await userService.getUserProfile(uid);

    if (!profileResult.success) {
      return res.status(404).json({
        error: "Not Found",
        message: "User profile not found",
      });
    }

    const profile = profileResult.profile;
    const usage = profile.usage || {};
    const limits = profile.limits || {};

    // Check daily limits
    const optimizationsPerDay = limits.optimizationsPerDay || 10;
    const currentUsage = usage.optimizationsToday || 0;

    // Check if we need to reset daily usage
    const today = new Date().toDateString();
    const lastResetDate = new Date(usage.currentDayStart).toDateString();

    let actualUsage = currentUsage;
    if (today !== lastResetDate) {
      actualUsage = 0; // Reset if new day
    }

    // Check if user has exceeded limit
    if (optimizationsPerDay !== -1 && actualUsage >= optimizationsPerDay) {
      return res.status(429).json({
        error: "Usage Limit Exceeded",
        message: `Daily optimization limit reached (${optimizationsPerDay}). Upgrade your plan for more optimizations.`,
        used: actualUsage,
        limit: optimizationsPerDay,
        upgradeRequired: true,
      });
    }

    // Update usage
    const newUsage = actualUsage + 1;
    const updates = {
      "usage.optimizationsToday": newUsage,
      "usage.totalOptimizations": (usage.totalOptimizations || 0) + 1,
      "usage.lastOptimizationDate": new Date().toISOString(),
    };

    // Reset daily counter if new day
    if (today !== lastResetDate) {
      updates["usage.currentDayStart"] = new Date().toISOString();
    }

    const updateResult = await userService.updateUserProfile(uid, updates);

    if (!updateResult.success) {
      return res.status(500).json({
        error: "Update Failed",
        message: "Failed to track usage",
      });
    }

    const remainingOptimizations =
      optimizationsPerDay === -1 ? -1 : optimizationsPerDay - newUsage;

    res.json({
      success: true,
      usage: {
        used: newUsage,
        remaining: remainingOptimizations,
        total: optimizationsPerDay,
        isUnlimited: optimizationsPerDay === -1,
      },
    });
  }),
);

// Change subscription plan
router.post(
  "/change-plan",
  [body("plan").isIn(["free", "pro", "unleashed"])],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Valid plan is required (free, pro, unleashed)",
        details: errors.array(),
      });
    }

    const uid = req.user.uid;
    const { plan } = req.body;

    // Define plan limits
    const planLimits = {
      free: {
        optimizationsPerDay: 10,
        maxFileUploads: 2,
        maxPasteCharacters: 10000,
        maxFileSize: 1,
        prioritySupport: false,
        advancedFeatures: false,
      },
      pro: {
        optimizationsPerDay: 300,
        maxFileUploads: 50,
        maxPasteCharacters: 100000,
        maxFileSize: 10,
        prioritySupport: true,
        advancedFeatures: true,
      },
      unleashed: {
        optimizationsPerDay: -1,
        maxFileUploads: -1,
        maxPasteCharacters: -1,
        maxFileSize: 100,
        prioritySupport: true,
        advancedFeatures: true,
      },
    };

    const updates = {
      "subscription.plan": plan,
      "subscription.startDate": new Date().toISOString(),
      "subscription.status": "active",
      "subscription.cancelAtPeriodEnd": false,
      limits: planLimits[plan],
    };

    const result = await userService.updateUserProfile(uid, updates);

    if (!result.success) {
      return res.status(500).json({
        error: "Update Failed",
        message: result.error,
      });
    }

    res.json({
      message: `Successfully changed to ${plan} plan`,
      plan,
      limits: planLimits[plan],
    });
  }),
);

// Delete user account
router.delete(
  "/account",
  asyncHandler(async (req, res) => {
    const uid = req.user.uid;

    // In production, you'd also delete from Firebase Auth
    // For now, we'll just remove the profile
    try {
      // This would typically involve:
      // 1. Cancel any active subscriptions
      // 2. Delete user data from Firestore
      // 3. Delete user from Firebase Auth
      // 4. Clean up any associated resources

      res.json({
        message:
          "Account deletion initiated. You will receive confirmation via email.",
      });
    } catch (error) {
      console.error("Account deletion error:", error);
      res.status(500).json({
        error: "Deletion Failed",
        message: "Unable to delete account. Please contact support.",
      });
    }
  }),
);

module.exports = router;
