const express = require("express");
const { body, validationResult } = require("express-validator");
const { userService } = require("../config/firebase");
const { asyncHandler } = require("../middleware/errorHandler");
const { checkUsageLimits, requireSubscription } = require("../middleware/auth");
const {
  optimizeCode: optimizeCodeService,
  optimizeBatch: optimizeBatchService,
  detectLanguage,
} = require("../services/optimizationService");

const router = express.Router();

// Optimize single code snippet
router.post(
  "/code",
  [
    body("code").notEmpty().withMessage("Code is required"),
    body("language").optional().isString(),
    body("optimizationType")
      .optional()
      .isIn(["performance", "readability", "security", "best_practices"]),
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

    const { code, language, optimizationType = "performance" } = req.body;
    const userId = req.user.uid;

    // Check usage limits
    const profileResult = await userService.getUserProfile(userId);
    if (!profileResult.success) {
      return res.status(404).json({
        error: "User Not Found",
        message: "User profile not found",
      });
    }

    const profile = profileResult.profile;
    const limits = profile.limits || {};
    const usage = profile.usage || {};

    // Check character limits
    if (
      limits.maxPasteCharacters !== -1 &&
      code.length > limits.maxPasteCharacters
    ) {
      return res.status(413).json({
        error: "Content Too Large",
        message: `Code exceeds character limit of ${limits.maxPasteCharacters.toLocaleString()} characters`,
        currentSize: code.length,
        maxSize: limits.maxPasteCharacters,
      });
    }

    // Track usage
    try {
      const trackingResult = await fetch(
        `${req.protocol}://${req.get("host")}/api/user/track-usage`,
        {
          method: "POST",
          headers: {
            Authorization: req.headers.authorization,
            "Content-Type": "application/json",
          },
        },
      );

      if (!trackingResult.ok) {
        const error = await trackingResult.json();
        return res.status(trackingResult.status).json(error);
      }
    } catch (error) {
      return res.status(500).json({
        error: "Usage Tracking Failed",
        message: "Could not track optimization usage",
      });
    }

    try {
      const result = await optimizeCodeService(
        code,
        language,
        optimizationType,
      );

      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json({
          error: "Optimization Failed",
          message:
            result.message || "Unable to optimize code. Please try again.",
        });
      }
    } catch (error) {
      console.error("Code optimization error:", error);
      res.status(500).json({
        error: "Optimization Failed",
        message: "Unable to optimize code. Please try again.",
      });
    }
  }),
);

// Optimize multiple files (Pro/Unleashed feature)
router.post(
  "/batch",
  requireSubscription("pro"),
  [
    body("files")
      .isArray({ min: 1, max: 50 })
      .withMessage("Files array is required (1-50 files)"),
    body("files.*.name").notEmpty().withMessage("File name is required"),
    body("files.*.content").notEmpty().withMessage("File content is required"),
    body("optimizationType")
      .optional()
      .isIn(["performance", "readability", "security", "best_practices"]),
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

    const { files, optimizationType = "performance" } = req.body;
    const userId = req.user.uid;
    const profile = req.userProfile;

    // Check file limits
    const maxFiles = profile.limits.maxFileUploads;
    if (maxFiles !== -1 && files.length > maxFiles) {
      return res.status(413).json({
        error: "Too Many Files",
        message: `File limit exceeded. Your plan allows ${maxFiles} files per optimization.`,
        fileCount: files.length,
        maxFiles,
      });
    }

    // Track usage for batch optimization
    try {
      const trackingResult = await fetch(
        `${req.protocol}://${req.get("host")}/api/user/track-usage`,
        {
          method: "POST",
          headers: {
            Authorization: req.headers.authorization,
            "Content-Type": "application/json",
          },
        },
      );

      if (!trackingResult.ok) {
        const error = await trackingResult.json();
        return res.status(trackingResult.status).json(error);
      }
    } catch (error) {
      return res.status(500).json({
        error: "Usage Tracking Failed",
        message: "Could not track optimization usage",
      });
    }

    try {
      const results = [];

      for (const file of files) {
        const detectedLanguage = detectLanguage(file.content, file.name);
        const optimizedCode = await aiOptimization(
          file.content,
          detectedLanguage,
          optimizationType,
        );
        const insights = generateInsights(
          file.content,
          optimizedCode,
          detectedLanguage,
        );

        results.push({
          fileName: file.name,
          original: file.content,
          optimized: optimizedCode,
          insights,
          language: detectedLanguage,
        });
      }

      res.json({
        success: true,
        results,
        totalFiles: files.length,
        optimizationType,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Batch optimization error:", error);
      res.status(500).json({
        error: "Batch Optimization Failed",
        message: "Unable to optimize files. Please try again.",
      });
    }
  }),
);

// Get optimization history (Pro/Unleashed feature)
router.get(
  "/history",
  requireSubscription("pro"),
  asyncHandler(async (req, res) => {
    const userId = req.user.uid;
    const { limit = 10, offset = 0 } = req.query;

    try {
      // In a real implementation, you'd fetch from a database
      // For now, return mock data
      const history = [
        {
          id: "opt_1",
          timestamp: new Date().toISOString(),
          language: "javascript",
          optimizationType: "performance",
          insights: {
            linesReduced: 5,
            sizeReduction: "15%",
            improvements: [
              "Improved variable declarations",
              "Modern function syntax",
            ],
          },
        },
      ];

      res.json({
        history,
        total: history.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
    } catch (error) {
      console.error("History fetch error:", error);
      res.status(500).json({
        error: "History Fetch Failed",
        message: "Unable to fetch optimization history",
      });
    }
  }),
);

module.exports = router;
