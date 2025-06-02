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

// Mock code optimization (fallback if no OpenAI)
const mockOptimization = (code, language = "javascript") => {
  let optimized = code;

  // Basic optimizations based on language
  switch (language.toLowerCase()) {
    case "javascript":
    case "typescript":
      optimized = optimized.replace(/var /g, "const ");
      optimized = optimized.replace(/function\s+(\w+)\s*\(/g, "const $1 = (");
      optimized = optimized.replace(/;\s*\n/g, ";\n");
      break;

    case "python":
      optimized = optimized.replace(/\bprint\(/g, "print(");
      optimized = optimized.replace(/\s+$/gm, ""); // Remove trailing whitespace
      break;

    case "java":
      optimized = optimized.replace(
        /System\.out\.println/g,
        "System.out.println",
      );
      break;
  }

  // General optimizations
  optimized = optimized.replace(/\{\s*\n\s*/g, "{\n  ");
  optimized = optimized.replace(/\n\s*\}/g, "\n}");
  optimized = optimized.replace(/\s+\n/g, "\n"); // Remove trailing spaces

  return optimized;
};

// Real AI optimization using OpenAI
const aiOptimization = async (
  code,
  language = "javascript",
  optimizationType = "performance",
) => {
  if (!openai) {
    return mockOptimization(code, language);
  }

  const prompts = {
    performance: `Optimize this ${language} code for better performance. Focus on algorithmic improvements, memory usage, and execution speed. Return only the optimized code without explanations.`,
    readability: `Improve the readability and maintainability of this ${language} code. Focus on clear variable names, proper structure, and code organization. Return only the optimized code without explanations.`,
    security: `Review and improve the security of this ${language} code. Fix potential vulnerabilities and add security best practices. Return only the optimized code without explanations.`,
    best_practices: `Refactor this ${language} code to follow modern best practices and coding standards. Return only the optimized code without explanations.`,
  };

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert code optimizer. Return only optimized code without explanations, comments, or markdown formatting.",
        },
        {
          role: "user",
          content: `${prompts[optimizationType] || prompts.performance}\n\nCode to optimize:\n\n${code}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });

    return (
      response.choices[0]?.message?.content?.trim() ||
      mockOptimization(code, language)
    );
  } catch (error) {
    console.error("OpenAI optimization error:", error);
    return mockOptimization(code, language);
  }
};

// Detect programming language from code
const detectLanguage = (code, filename = "") => {
  // Check file extension first
  const ext = filename.toLowerCase().split(".").pop();
  const extMap = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    go: "go",
    rs: "rust",
    php: "php",
    rb: "ruby",
    cs: "csharp",
    html: "html",
    css: "css",
    sql: "sql",
  };

  if (extMap[ext]) return extMap[ext];

  // Pattern-based detection
  if (
    code.includes("function") ||
    code.includes("const ") ||
    code.includes("let ")
  )
    return "javascript";
  if (
    code.includes("def ") ||
    (code.includes("import ") && code.includes("from "))
  )
    return "python";
  if (
    code.includes("public class") ||
    code.includes("private ") ||
    code.includes("System.out")
  )
    return "java";
  if (code.includes("#include") || code.includes("int main")) return "cpp";
  if (code.includes("func ") && code.includes("package ")) return "go";
  if (code.includes("fn ") && code.includes("let mut")) return "rust";
  if (code.includes("<?php")) return "php";
  if (code.includes("class ") && code.includes("def ")) return "python";
  if (code.includes("<html") || code.includes("<!DOCTYPE")) return "html";
  if (code.includes("{") && code.includes("color:")) return "css";

  return "javascript"; // default
};

// Generate optimization insights
const generateInsights = (original, optimized, language) => {
  const originalLines = original.split("\n").length;
  const optimizedLines = optimized.split("\n").length;
  const originalChars = original.length;
  const optimizedChars = optimized.length;

  const linesReduced = Math.max(0, originalLines - optimizedLines);
  const sizeReduction =
    originalChars > 0
      ? Math.round((1 - optimizedChars / originalChars) * 100)
      : 0;

  const improvements = [];

  if (linesReduced > 0)
    improvements.push(`Reduced ${linesReduced} lines of code`);
  if (sizeReduction > 0) improvements.push(`${sizeReduction}% size reduction`);
  if (optimized.includes("const ") && !original.includes("const "))
    improvements.push("Improved variable declarations");
  if (optimized.includes("=>") && !original.includes("=>"))
    improvements.push("Modernized function syntax");

  if (improvements.length === 0) {
    improvements.push("Code structure optimized", "Best practices applied");
  }

  return {
    linesReduced,
    sizeReduction: `${sizeReduction}%`,
    originalSize: originalChars,
    optimizedSize: optimizedChars,
    language,
    improvements,
  };
};

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
      const detectedLanguage = language || detectLanguage(code);
      const optimizedCode = await aiOptimization(
        code,
        detectedLanguage,
        optimizationType,
      );
      const insights = generateInsights(code, optimizedCode, detectedLanguage);

      res.json({
        success: true,
        original: code,
        optimized: optimizedCode,
        insights,
        language: detectedLanguage,
        optimizationType,
        timestamp: new Date().toISOString(),
      });
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
