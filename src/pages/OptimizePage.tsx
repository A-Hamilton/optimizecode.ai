import React, { useState } from "react";
import CodeInput from "../components/CodeInput";
import FileDropZone from "../components/FileDropZone";
import ResultsDisplay from "../components/ResultsDisplay";
import { CodeFile, OptimizationSummary } from "../types";
import "./OptimizePage.css";

// User plan types
type UserPlan = "free" | "pro" | "unleashed";

interface PlanLimits {
  maxFiles: number;
  name: string;
  upgradeMessage: string;
}

interface NotificationProps {
  message: string;
  type: "error" | "warning" | "info" | "success";
  onClose: () => void;
}

const OptimizePage: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [optimizedCode, setOptimizedCode] = useState<string>("");
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationSummary, setOptimizationSummary] =
    useState<OptimizationSummary>({});
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "warning" | "info" | "success";
  } | null>(null);

  // Simulate user plan - in a real app, this would come from authentication/subscription service
  const [currentPlan, setCurrentPlan] = useState<UserPlan>("free"); // Default to free for demo

  const planLimits: Record<UserPlan, PlanLimits> = {
    free: {
      maxFiles: 2,
      name: "Free",
      upgradeMessage:
        "Upgrade to Pro to optimize up to 50 files at once, or Unleashed for unlimited files.",
    },
    pro: {
      maxFiles: 50,
      name: "Pro",
      upgradeMessage:
        "Upgrade to Unleashed for unlimited file optimization and advanced features.",
    },
    unleashed: {
      maxFiles: Infinity,
      name: "Unleashed",
      upgradeMessage: "You're on the Unleashed plan with unlimited everything!",
    },
  };

  const showNotification = (
    message: string,
    type: "error" | "warning" | "info" | "success" = "info",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 8000); // Auto-hide after 8 seconds
  };

  const InlineNotification: React.FC<NotificationProps> = ({
    message,
    type,
    onClose,
  }) => {
    const typeStyles = {
      error: "bg-red-500/20 border-red-500/30 text-red-200",
      warning: "bg-yellow-500/20 border-yellow-500/30 text-yellow-200",
      info: "bg-blue-500/20 border-blue-500/30 text-blue-200",
      success: "bg-green-500/20 border-green-500/30 text-green-200",
    };

    const typeIcons = {
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
      success: "✅",
    };

    return (
      <div
        className={`p-4 rounded-lg border mb-6 flex items-start justify-between ${typeStyles[type]}`}
      >
        <div className="flex items-start space-x-3">
          <span className="text-lg">{typeIcons[type]}</span>
          <div className="flex-1">
            <p className="text-sm leading-relaxed">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-3 text-xl leading-none hover:opacity-70 transition-opacity flex-shrink-0"
        >
          ×
        </button>
      </div>
    );
  };

  const handleFilesSelected = (newFiles: CodeFile[]): void => {
    const currentLimit = planLimits[currentPlan].maxFiles;

    if (newFiles.length > currentLimit) {
      showNotification(
        `File limit exceeded! Your ${planLimits[currentPlan].name} plan allows up to ${currentLimit === Infinity ? "unlimited" : currentLimit} files per optimization. ${planLimits[currentPlan].upgradeMessage}`,
        "warning",
      );

      // Truncate to the allowed limit
      const limitedFiles = newFiles.slice(0, currentLimit);
      setFiles(limitedFiles);
      return;
    }

    setFiles(newFiles);
  };

  const simulateOptimization = async (
    inputCode: string,
    filename: string = "",
  ): Promise<string> => {
    console.log(
      `Starting optimization for ${filename || "code"}, input length: ${inputCode?.length}`,
    );

    // Simulate AI optimization - replace with actual AI service
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1500 + 800),
    );

    if (!inputCode || typeof inputCode !== "string" || !inputCode.trim()) {
      console.log("No valid code provided for optimization");
      return "// No code provided for optimization.";
    }

    try {
      // Track what optimizations were made
      const optimizations: string[] = [];
      let optimized = inputCode;

      // Replace var with const/let - ALWAYS suggest this if var is found
      if (optimized.includes("var ")) {
        optimized = optimized.replace(/var\s+/g, "const ");
        optimizations.push("Replaced var with const for better scoping");
      }

      // Replace let with const where appropriate (if variable is never reassigned)
      const letMatches = optimized.match(/let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
      if (letMatches) {
        letMatches.forEach((match) => {
          const varName = match.replace("let ", "");
          // Simple check: if variable name appears only once (not reassigned)
          const varRegex = new RegExp(`\\b${varName}\\s*=`, "g");
          const assignments = optimized.match(varRegex);
          if (assignments && assignments.length === 1) {
            optimized = optimized.replace(`let ${varName}`, `const ${varName}`);
            if (
              !optimizations.includes(
                "Replaced let with const where variables are not reassigned",
              )
            ) {
              optimizations.push(
                "Replaced let with const where variables are not reassigned",
              );
            }
          }
        });
      }

      // Modernize function syntax
      if (optimized.includes("function ")) {
        const functionRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
        if (functionRegex.test(optimized)) {
          optimized = optimized.replace(functionRegex, "const $1 = function");
          optimizations.push(
            "Modernized function declarations to const assignments",
          );
        }
      }

      // Remove console.log statements (common optimization)
      if (optimized.includes("console.log")) {
        optimized = optimized.replace(/console\.log\([^)]*\);?\s*\n?/g, "");
        optimizations.push("Removed console.log statements for production");
      }

      // Remove TODO/FIXME comments
      if (optimized.includes("TODO") || optimized.includes("FIXME")) {
        optimized = optimized.replace(/\/\/\s*(TODO|FIXME)[^\n]*/g, "");
        optimizations.push("Removed TODO/FIXME comments");
      }

      // Optimize string concatenation to template literals
      if (optimized.includes(" + ") && /['"][^'"]*['"]\s*\+/.test(optimized)) {
        optimizations.push(
          "String concatenation can be optimized with template literals",
        );
      }

      // Check for inefficient loops
      if (optimized.includes("for(") || optimized.includes("for (")) {
        optimizations.push(
          "Loop structure can be optimized for better performance",
        );
      }

      // Clean up formatting
      const originalLines = optimized.split("\n").length;
      optimized = optimized
        .replace(/;\s*\n/g, ";\n")
        .replace(/\{\s*\n\s*return/g, "{\n  return")
        .replace(/\s+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\s+$/gm, "") // Remove trailing whitespace
        .trim();

      if (optimizations.length > 0) {
        optimizations.push("Cleaned up formatting and whitespace");
      }

      // IMPORTANT: Always create optimizations for demonstration
      // In a real app, you'd have actual AI analysis
      if (optimizations.length === 0) {
        // Add some generic optimizations based on code patterns
        if (optimized.includes("React")) {
          optimizations.push("React component structure optimized");
        }
        if (optimized.includes("import")) {
          optimizations.push("Import statements organized for better bundling");
        }
        if (optimized.includes("{") && optimized.includes("}")) {
          optimizations.push("Code structure improved for readability");
        }
      }

      // Store optimizations for display
      setOptimizationSummary((prev) => ({
        ...prev,
        [filename || "pasted-code"]: optimizations,
      }));

      console.log(
        `Optimization completed for ${filename || "code"}, optimizations: ${optimizations.join(", ")}`,
      );

      return optimized;
    } catch (error) {
      console.error("Error during optimization:", error);
      return inputCode; // Return original code on error
    }
  };

  const optimizeCode = async (): Promise<void> => {
    const hasCodeInput = code && code.trim().length > 0;
    const hasFileInput = files && files.length > 0;

    console.log("Optimize button clicked", {
      hasCodeInput,
      hasFileInput,
      codeLength: code?.length,
      filesCount: files?.length,
    });

    if (!hasCodeInput && !hasFileInput) {
      showNotification(
        "Please paste some code or upload files to optimize.",
        "warning",
      );
      return;
    }

    // Check file limits before optimization
    if (hasFileInput) {
      const currentLimit = planLimits[currentPlan].maxFiles;
      if (files.length > currentLimit) {
        showNotification(
          `Cannot optimize ${files.length} files. Your ${planLimits[currentPlan].name} plan allows up to ${currentLimit === Infinity ? "unlimited" : currentLimit} files. ${planLimits[currentPlan].upgradeMessage}`,
          "error",
        );
        return;
      }
    }

    setIsOptimizing(true);

    // CLEAR PREVIOUS OPTIMIZATION SUMMARY BEFORE STARTING
    setOptimizationSummary({});

    console.log("Starting optimization...");

    try {
      // Optimize pasted code
      if (hasCodeInput) {
        console.log("Optimizing pasted code:", code.substring(0, 100) + "...");
        const optimized = await simulateOptimization(code, "pasted-code");
        console.log("Pasted code optimized, result length:", optimized?.length);
        setOptimizedCode(optimized);
      }

      // Optimize uploaded files
      if (hasFileInput) {
        console.log(
          "Optimizing files:",
          files.map((f) => f.name),
        );
        const optimizedFiles = await Promise.all(
          files.map(async (file, index) => {
            console.log(
              `Optimizing file ${index + 1}/${files.length}: ${file.name}`,
            );
            const optimizedContent = await simulateOptimization(
              file.content,
              file.path,
            );
            console.log(
              `File ${file.name} optimized, result length:`,
              optimizedContent?.length,
            );
            return {
              ...file,
              optimizedContent,
            };
          }),
        );
        console.log("All files optimized:", optimizedFiles.length);
        setFiles(optimizedFiles);
      }

      showNotification(
        `Optimization completed successfully! ${hasCodeInput ? "Code" : ""} ${hasCodeInput && hasFileInput ? "and" : ""} ${hasFileInput ? `${files.length} file${files.length > 1 ? "s" : ""}` : ""} optimized with AI improvements.`,
        "success",
      );

      console.log("Optimization completed successfully");
    } catch (error) {
      console.error("Optimization failed:", error);
      showNotification("Optimization failed. Please try again.", "error");
    } finally {
      setIsOptimizing(false);
    }
  };

  const resetAll = (): void => {
    setCode("");
    setFiles([]);
    setOptimizedCode("");
    setIsOptimizing(false);
    setOptimizationSummary({}); // Clear optimization summary
    setNotification(null);
  };

  const hasInput =
    (code && code.trim().length > 0) || (files && files.length > 0);

  const isAtFileLimit = files.length >= planLimits[currentPlan].maxFiles;

  return (
    <div className="optimize-page">
      <div className="optimize-container">
        <header className="optimize-header">
          <h1 className="optimize-title">Code Optimizer</h1>
          <p className="optimize-subtitle">
            AI-powered code optimization for better performance, readability,
            and maintainability
          </p>

          {/* Plan indicator and file limit display */}
          <div className="plan-indicator">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-white/90">
                  Current Plan:{" "}
                  <span className="text-primary font-semibold">
                    {planLimits[currentPlan].name}
                  </span>
                </span>
                <span className="text-xs text-white/60">
                  📁 {files.length}/
                  {planLimits[currentPlan].maxFiles === Infinity
                    ? "∞"
                    : planLimits[currentPlan].maxFiles}{" "}
                  files
                </span>
              </div>

              {/* Plan switcher for demo purposes */}
              <div className="flex space-x-2">
                <button
                  className={`text-xs px-2 py-1 rounded transition-all ${currentPlan === "free" ? "bg-primary text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
                  onClick={() => setCurrentPlan("free")}
                >
                  Free
                </button>
                <button
                  className={`text-xs px-2 py-1 rounded transition-all ${currentPlan === "pro" ? "bg-primary text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
                  onClick={() => setCurrentPlan("pro")}
                >
                  Pro
                </button>
                <button
                  className={`text-xs px-2 py-1 rounded transition-all ${currentPlan === "unleashed" ? "bg-primary text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
                  onClick={() => setCurrentPlan("unleashed")}
                >
                  Unleashed
                </button>
              </div>
            </div>

            {/* File limit warning */}
            {isAtFileLimit && planLimits[currentPlan].maxFiles !== Infinity && (
              <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg mb-6">
                <p className="text-sm text-yellow-200">
                  ⚠️ You've reached your file limit of{" "}
                  {planLimits[currentPlan].maxFiles} files.
                  {currentPlan === "free" && (
                    <span>
                      {" "}
                      <a
                        href="/pricing"
                        className="text-yellow-100 underline hover:text-white"
                      >
                        Upgrade to Pro
                      </a>{" "}
                      for 50 files or{" "}
                      <a
                        href="/pricing"
                        className="text-yellow-100 underline hover:text-white"
                      >
                        Unleashed
                      </a>{" "}
                      for unlimited files.
                    </span>
                  )}
                  {currentPlan === "pro" && (
                    <span>
                      {" "}
                      <a
                        href="/pricing"
                        className="text-yellow-100 underline hover:text-white"
                      >
                        Upgrade to Unleashed
                      </a>{" "}
                      for unlimited files.
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Inline Notification */}
            {notification && (
              <InlineNotification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
              />
            )}
          </div>
        </header>

        <main className="optimize-main">
          <div className="input-section">
            <CodeInput code={code} onCodeChange={setCode} />

            <div className="section-divider">
              <span>OR</span>
            </div>

            <FileDropZone files={files} onFilesSelected={handleFilesSelected} />

            {/* Enhanced Action Controls with proper styling */}
            <div className="action-controls flex gap-4 mt-6">
              <button
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 ${
                  !hasInput || isOptimizing
                    ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                }`}
                onClick={optimizeCode}
                disabled={!hasInput || isOptimizing}
              >
                {isOptimizing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Optimizing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>⚡</span>
                    Optimize Code
                  </div>
                )}
              </button>

              {hasInput && (
                <button
                  className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 ${
                    isOptimizing
                      ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                      : "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 hover:border-red-500/50 hover:scale-105 active:scale-95"
                  }`}
                  onClick={resetAll}
                  disabled={isOptimizing}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>🗑️</span>
                    Reset
                  </div>
                </button>
              )}
            </div>
          </div>

          <ResultsDisplay
            originalCode={code}
            optimizedCode={optimizedCode}
            files={files}
            isOptimizing={isOptimizing}
            optimizationSummary={optimizationSummary}
          />
        </main>
      </div>
    </div>
  );
};

export default OptimizePage;
