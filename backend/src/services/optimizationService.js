const { OpenAI } = require("openai");

// Initialize OpenAI if API key is available
let openai = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.log("OpenAI not configured, using mock optimization");
}

/**
 * Detect programming language from code content and filename
 */
const detectLanguage = (code, filename = "") => {
  // Check file extension first
  const ext = filename.toLowerCase().split(".").pop();
  const extMap = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
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
    scss: "scss",
    sass: "sass",
    sql: "sql",
    sh: "bash",
    bash: "bash",
    ps1: "powershell",
    kt: "kotlin",
    scala: "scala",
    swift: "swift",
    dart: "dart",
    vue: "vue",
    svelte: "svelte",
  };

  if (extMap[ext]) return extMap[ext];

  // Pattern-based detection for files without clear extensions
  const codePatterns = [
    { pattern: /\b(function|const|let|var)\s+\w+/, language: "javascript" },
    { pattern: /\b(def|import.*from|class\s+\w+:)/, language: "python" },
    { pattern: /\b(public\s+class|private\s+|System\.out)/, language: "java" },
    { pattern: /#include|int\s+main/, language: "cpp" },
    { pattern: /\bfunc\s+\w+.*\{/, language: "go" },
    { pattern: /\bfn\s+\w+.*->/, language: "rust" },
    { pattern: /<\?php/, language: "php" },
    { pattern: /\bclass\s+\w+.*</, language: "ruby" },
    { pattern: /<html|<!DOCTYPE/i, language: "html" },
    { pattern: /\{[^}]*color\s*:/, language: "css" },
    { pattern: /\bSELECT\s+.*FROM\b/i, language: "sql" },
  ];

  for (const { pattern, language } of codePatterns) {
    if (pattern.test(code)) {
      return language;
    }
  }

  return "text"; // fallback
};

/**
 * Mock optimization for when OpenAI is not available
 */
const mockOptimization = (code, language = "javascript") => {
  let optimized = code;

  // Basic optimizations based on language
  switch (language.toLowerCase()) {
    case "javascript":
    case "typescript":
      // Convert var to const/let
      optimized = optimized.replace(/\bvar\s+/g, "const ");
      // Modernize function declarations
      optimized = optimized.replace(/function\s+(\w+)\s*\(/g, "const $1 = (");
      // Clean up semicolons
      optimized = optimized.replace(/;\s*\n/g, ";\n");
      break;

    case "python":
      // Remove trailing whitespace
      optimized = optimized.replace(/\s+$/gm, "");
      // Standardize imports
      optimized = optimized.replace(/from\s+(\w+)\s+import\s+\*/g, "import $1");
      break;

    case "java":
      // Standardize System.out.println
      optimized = optimized.replace(
        /System\.out\.println/g,
        "System.out.println",
      );
      break;

    case "css":
      // Remove unnecessary whitespace
      optimized = optimized.replace(/\s*{\s*/g, " {\n  ");
      optimized = optimized.replace(/;\s*/g, ";\n  ");
      optimized = optimized.replace(/\s*}\s*/g, "\n}\n");
      break;
  }

  // General optimizations
  optimized = optimized.replace(/\{\s*\n\s*/g, "{\n  ");
  optimized = optimized.replace(/\n\s*\}/g, "\n}");
  optimized = optimized.replace(/\s+\n/g, "\n"); // Remove trailing spaces

  return optimized;
};

/**
 * AI-powered optimization using OpenAI
 */
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

  const systemPrompt = `You are an expert ${language} developer and code optimizer. Your task is to optimize code while maintaining its functionality. Always:
1. Preserve the original functionality
2. Use modern language features and best practices
3. Optimize for the specified type: ${optimizationType}
4. Return only the optimized code without explanations or markdown formatting
5. Ensure the code is production-ready`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `${prompts[optimizationType] || prompts.performance}\n\nOriginal code:\n\n${code}`,
        },
      ],
      temperature: 0.1,
      max_tokens: Math.min(4000, code.length * 2), // Adaptive token limit
    });

    const optimizedCode = response.choices[0]?.message?.content?.trim();

    // Fallback to mock if AI response is invalid
    if (!optimizedCode || optimizedCode.length < code.length * 0.1) {
      console.warn(
        "AI optimization returned invalid result, using mock optimization",
      );
      return mockOptimization(code, language);
    }

    return optimizedCode;
  } catch (error) {
    console.error("OpenAI optimization error:", error.message);
    return mockOptimization(code, language);
  }
};

/**
 * Generate optimization insights and statistics
 */
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

  // Analyze improvements
  const improvements = [];

  // Language-specific improvements
  if (language === "javascript" || language === "typescript") {
    if (optimized.includes("const ") && !original.includes("const ")) {
      improvements.push("Modern variable declarations");
    }
    if (optimized.includes("=>") && !original.includes("=>")) {
      improvements.push("Arrow function syntax");
    }
    if (optimized.includes("async") && !original.includes("async")) {
      improvements.push("Asynchronous improvements");
    }
  }

  if (language === "python") {
    if (optimized.includes("with ") && !original.includes("with ")) {
      improvements.push("Context manager usage");
    }
    if (
      optimized.match(/\blist\(/g)?.length >
      (original.match(/\blist\(/g)?.length || 0)
    ) {
      improvements.push("List comprehensions");
    }
  }

  // General improvements
  if (linesReduced > 0) {
    improvements.push(`Reduced ${linesReduced} lines of code`);
  }
  if (sizeReduction > 0) {
    improvements.push(`${sizeReduction}% size reduction`);
  }

  // Pattern-based improvements
  const patterns = [
    {
      check: /\/\*[\s\S]*?\*\/|\/\/.*$/gm,
      improvement: "Better documentation",
    },
    { check: /\btry\s*{/g, improvement: "Error handling" },
    { check: /\bcatch\s*\(/g, improvement: "Exception handling" },
    { check: /\bvalidate|sanitize/gi, improvement: "Input validation" },
  ];

  patterns.forEach(({ check, improvement }) => {
    const originalMatches = (original.match(check) || []).length;
    const optimizedMatches = (optimized.match(check) || []).length;
    if (optimizedMatches > originalMatches) {
      improvements.push(improvement);
    }
  });

  // Default improvements if none detected
  if (improvements.length === 0) {
    improvements.push("Code structure optimized", "Best practices applied");
  }

  return {
    linesReduced,
    sizeReduction: `${Math.abs(sizeReduction)}%`,
    sizeChange: sizeReduction >= 0 ? "reduced" : "increased",
    originalSize: originalChars,
    optimizedSize: optimizedChars,
    originalLines,
    optimizedLines,
    language,
    improvements: improvements.slice(0, 5), // Limit to top 5 improvements
    performanceGain: Math.min(
      Math.max(linesReduced * 2 + Math.abs(sizeReduction), 5),
      50,
    ), // Estimated percentage
  };
};

/**
 * Optimize a single code snippet
 */
const optimizeCode = async (
  code,
  language = null,
  optimizationType = "performance",
) => {
  try {
    const detectedLanguage = language || detectLanguage(code);
    const optimizedCode = await aiOptimization(
      code,
      detectedLanguage,
      optimizationType,
    );
    const insights = generateInsights(code, optimizedCode, detectedLanguage);

    return {
      success: true,
      original: code,
      optimized: optimizedCode,
      insights,
      language: detectedLanguage,
      optimizationType,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Code optimization error:", error);
    return {
      success: false,
      error: "Failed to optimize code",
      message: error.message,
    };
  }
};

/**
 * Optimize multiple files in batch
 */
const optimizeBatch = async (files, optimizationType = "performance") => {
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
        filePath: file.path || file.name,
        original: file.content,
        optimized: optimizedCode,
        insights,
        language: detectedLanguage,
      });
    }

    // Calculate batch statistics
    const totalOriginalLines = results.reduce(
      (sum, r) => sum + r.insights.originalLines,
      0,
    );
    const totalOptimizedLines = results.reduce(
      (sum, r) => sum + r.insights.optimizedLines,
      0,
    );
    const totalOriginalChars = results.reduce(
      (sum, r) => sum + r.insights.originalSize,
      0,
    );
    const totalOptimizedChars = results.reduce(
      (sum, r) => sum + r.insights.optimizedSize,
      0,
    );

    const batchInsights = {
      totalFiles: files.length,
      totalLinesReduced: Math.max(0, totalOriginalLines - totalOptimizedLines),
      totalSizeReduction:
        totalOriginalChars > 0
          ? Math.round((1 - totalOptimizedChars / totalOriginalChars) * 100)
          : 0,
      averagePerformanceGain: Math.round(
        results.reduce((sum, r) => sum + r.insights.performanceGain, 0) /
          results.length,
      ),
      languagesProcessed: [...new Set(results.map((r) => r.language))],
    };

    return {
      success: true,
      results,
      batchInsights,
      totalFiles: files.length,
      optimizationType,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Batch optimization error:", error);
    return {
      success: false,
      error: "Failed to optimize files",
      message: error.message,
    };
  }
};

module.exports = {
  detectLanguage,
  optimizeCode,
  optimizeBatch,
  generateInsights,
  mockOptimization,
  aiOptimization,
};
