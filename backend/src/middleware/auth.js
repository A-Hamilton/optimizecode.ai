const { userService, isDemoMode } = require("../config/firebase");

// Middleware to authenticate Firebase tokens
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No authentication token provided",
      });
    }

    // Handle demo mode
    if (isDemoMode() && token === "demo-token") {
      req.user = {
        uid: "demo-user-id",
        email: "demo@optimizecode.ai",
        name: "Demo User",
      };
      return next();
    }

    // Verify Firebase token
    const result = await userService.verifyToken(token);

    if (!result.success) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid authentication token",
      });
    }

    // Attach user info to request
    req.user = result.user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      error: "Unauthorized",
      message: "Authentication failed",
    });
  }
};

// Middleware to check if user has required subscription level
const requireSubscription = (requiredPlan) => {
  return async (req, res, next) => {
    try {
      const uid = req.user?.uid;
      if (!uid) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "User not authenticated",
        });
      }

      // Get user profile to check subscription
      const profileResult = await userService.getUserProfile(uid);

      if (!profileResult.success) {
        return res.status(404).json({
          error: "Not Found",
          message: "User profile not found",
        });
      }

      const userPlan = profileResult.profile.subscription?.plan || "free";

      // Plan hierarchy: free < pro < unleashed
      const planLevels = { free: 0, pro: 1, unleashed: 2 };
      const userLevel = planLevels[userPlan] || 0;
      const requiredLevel = planLevels[requiredPlan] || 0;

      if (userLevel < requiredLevel) {
        return res.status(403).json({
          error: "Forbidden",
          message: `This feature requires ${requiredPlan} subscription or higher. Current plan: ${userPlan}`,
          currentPlan: userPlan,
          requiredPlan,
        });
      }

      req.userProfile = profileResult.profile;
      next();
    } catch (error) {
      console.error("Subscription check error:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to verify subscription",
      });
    }
  };
};

// Middleware to check usage limits
const checkUsageLimits = async (req, res, next) => {
  try {
    const uid = req.user?.uid;
    const userProfile = req.userProfile;

    if (!uid || !userProfile) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User authentication required",
      });
    }

    const { limits, usage } = userProfile;
    const { optimizationsPerDay, optimizationsToday } = usage;

    // Check daily optimization limit
    if (
      limits.optimizationsPerDay !== -1 &&
      optimizationsToday >= limits.optimizationsPerDay
    ) {
      return res.status(429).json({
        error: "Usage Limit Exceeded",
        message: `Daily optimization limit reached (${limits.optimizationsPerDay}). Upgrade your plan for more optimizations.`,
        used: optimizationsToday,
        limit: limits.optimizationsPerDay,
        upgradeRequired: true,
      });
    }

    next();
  } catch (error) {
    console.error("Usage limit check error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to check usage limits",
    });
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (token) {
      const result = await userService.verifyToken(token);
      if (result.success) {
        req.user = result.user;
      }
    }

    next();
  } catch (error) {
    // Don't fail on optional auth errors
    next();
  }
};

module.exports = {
  authenticateToken,
  requireSubscription,
  checkUsageLimits,
  optionalAuth,
};
