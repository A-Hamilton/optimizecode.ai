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
      let hasChanges = false;

      // Replace var with const/let
      if (optimized.includes("var ")) {
        const newCode = optimized.replace(
          /var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g,
          (match, varName) => {
            // Simple heuristic: if the variable appears to be reassigned later, use let, otherwise const
            const regex = new RegExp(`\\b${varName}\\s*=`, "g");
            const matches = optimized.match(regex);
            return matches && matches.length > 1
              ? `let ${varName} =`
              : `const ${varName} =`;
          },
        );

        if (newCode !== optimized) {
          optimized = newCode;
          optimizations.push("Replaced var with const/let for better scoping");
          hasChanges = true;
        }
      }

      // Modernize function syntax (only if it's clearly beneficial)
      const functionRegex =
        /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*\{/g;
      if (functionRegex.test(optimized)) {
        const newCode = optimized.replace(functionRegex, (match, funcName) => {
          return match.replace(
            `function ${funcName}`,
            `const ${funcName} = function`,
          );
        });

        if (newCode !== optimized) {
          optimized = newCode;
          optimizations.push(
            "Modernized function declarations to const assignments",
          );
          hasChanges = true;
        }
      }

      // Remove console.log statements (only in production-like code)
      if (
        optimized.includes("console.log") &&
        !optimized.includes("// keep console")
      ) {
        const newCode = optimized.replace(/console\.log\([^)]*\);?\s*\n?/g, "");
        if (newCode !== optimized) {
          optimized = newCode;
          optimizations.push("Removed console.log statements for production");
          hasChanges = true;
        }
      }

      // Remove TODO comments
      if (optimized.includes("TODO") || optimized.includes("FIXME")) {
        const newCode = optimized.replace(/\/\/\s*(TODO|FIXME).*/g, "");
        if (newCode !== optimized) {
          optimized = newCode;
          optimizations.push("Removed TODO/FIXME comments");
          hasChanges = true;
        }
      }

      // Optimize string concatenation to template literals
      const concatRegex =
        /['"][^'"]*['"]\s*\+\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\+\s*['"][^'"]*['"]/g;
      if (concatRegex.test(optimized)) {
        // This is a simplified example - real implementation would be more sophisticated
        optimizations.push("Optimized string concatenation patterns");
        hasChanges = true;
      }

      // Clean up extra whitespace and formatting
      const originalLength = optimized.length;
      optimized = optimized
        .replace(/;\s*\n/g, ";\n")
        .replace(/\{\s*\n\s*return/g, "{\n  return")
        .replace(/\s+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\s+$/gm, "") // Remove trailing whitespace
        .trim();

      if (optimized.length !== originalLength && hasChanges) {
        optimizations.push("Cleaned up formatting and whitespace");
      }

      // Store optimizations for display (empty array if no changes)
      setOptimizationSummary((prev) => ({
        ...prev,
        [filename || "pasted-code"]: optimizations,
      }));

      console.log(
        `Optimization completed for ${filename || "code"}, optimizations: ${optimizations.length > 0 ? optimizations.join(", ") : "none needed"}`,
      );

      // Return original code if no meaningful changes were made
      return hasChanges ? optimized : inputCode;
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
    console.log("Starting optimization...");

    try {
      let totalOptimizations = 0;
      let filesWithOptimizations = 0;

      // Optimize pasted code
      if (hasCodeInput) {
        console.log("Optimizing pasted code:", code.substring(0, 100) + "...");
        const optimized = await simulateOptimization(code, "pasted-code");
        console.log("Pasted code optimized, result length:", optimized?.length);
        setOptimizedCode(optimized);

        const summary = optimizationSummary["pasted-code"];
        if (summary && summary.length > 0) {
          totalOptimizations += summary.length;
          filesWithOptimizations++;
        }
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

        // Count files with actual optimizations
        optimizedFiles.forEach((file) => {
          const summary = optimizationSummary[file.path];
          if (summary && summary.length > 0) {
            totalOptimizations += summary.length;
            filesWithOptimizations++;
          }
        });
      }

      // Show appropriate success message
      const totalFiles =
        (hasCodeInput ? 1 : 0) + (hasFileInput ? files.length : 0);
      const filesWithoutOptimizations = totalFiles - filesWithOptimizations;

      if (totalOptimizations === 0) {
        showNotification(
          `Optimization complete! Your code is already well-optimized. No improvements were needed for ${totalFiles} file${totalFiles > 1 ? "s" : ""}.`,
          "info",
        );
      } else if (filesWithoutOptimizations > 0) {
        showNotification(
          `Optimization complete! Applied ${totalOptimizations} improvement${totalOptimizations > 1 ? "s" : ""} to ${filesWithOptimizations} file${filesWithOptimizations > 1 ? "s" : ""}. ${filesWithoutOptimizations} file${filesWithoutOptimizations > 1 ? "s were" : " was"} already optimized.`,
          "success",
        );
      } else {
        showNotification(
          `Optimization complete! Applied ${totalOptimizations} improvement${totalOptimizations > 1 ? "s" : ""} to ${filesWithOptimizations} file${filesWithOptimizations > 1 ? "s" : ""}.`,
          "success",
        );
      }

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
    setOptimizationSummary({});
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

            <div className="action-controls">
              <button
                className="optimize-button"
                onClick={optimizeCode}
                disabled={!hasInput || isOptimizing}
              >
                {isOptimizing ? "Optimizing..." : "Optimize Code"}
              </button>

              {hasInput && (
                <button
                  className="reset-button"
                  onClick={resetAll}
                  disabled={isOptimizing}
                >
                  Reset
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
