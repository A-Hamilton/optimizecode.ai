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

const OptimizePage: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [optimizedCode, setOptimizedCode] = useState<string>("");
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationSummary, setOptimizationSummary] =
    useState<OptimizationSummary>({});

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

  const handleFilesSelected = (newFiles: CodeFile[]): void => {
    const currentLimit = planLimits[currentPlan].maxFiles;

    if (newFiles.length > currentLimit) {
      alert(
        `File limit exceeded! Your ${planLimits[currentPlan].name} plan allows up to ${currentLimit === Infinity ? "unlimited" : currentLimit} files per optimization.\n\n${planLimits[currentPlan].upgradeMessage}`,
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

      // Replace var with const
      if (optimized.includes("var ")) {
        optimized = optimized.replace(/var /g, "const ");
        optimizations.push("Replaced var with const");
      }

      // Replace let with const where appropriate
      if (optimized.includes("let ")) {
        optimized = optimized.replace(/let /g, "const ");
        optimizations.push("Replaced let with const");
      }

      // Modernize function syntax
      if (/function\s+\w+/.test(optimized)) {
        optimized = optimized.replace(/function\s+(\w+)/g, "const $1 = ");
        optimizations.push("Modernized function syntax");
      }

      // Remove console.log statements
      if (optimized.includes("console.log")) {
        optimized = optimized.replace(/console\.log\([^)]*\);?\s*\n?/g, "");
        optimizations.push("Removed console.log statements");
      }

      // Remove TODO comments
      if (optimized.includes("TODO")) {
        optimized = optimized.replace(/\/\/\s*TODO.*/g, "");
        optimizations.push("Removed TODO comments");
      }

      // Clean up formatting
      optimized = optimized
        .replace(/;\s*\n/g, "\n")
        .replace(/\{\s*\n\s*return/g, "{ return")
        .replace(/\s+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\s+$/gm, "") // Remove trailing whitespace
        .trim();

      if (optimizations.length > 0) {
        optimizations.push("Cleaned up formatting");
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
      alert("Please paste some code or upload files to optimize.");
      return;
    }

    // Check file limits before optimization
    if (hasFileInput) {
      const currentLimit = planLimits[currentPlan].maxFiles;
      if (files.length > currentLimit) {
        alert(
          `Cannot optimize ${files.length} files. Your ${planLimits[currentPlan].name} plan allows up to ${currentLimit === Infinity ? "unlimited" : currentLimit} files.\n\n${planLimits[currentPlan].upgradeMessage}`,
        );
        return;
      }
    }

    setIsOptimizing(true);
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

      console.log("Optimization completed successfully");
    } catch (error) {
      console.error("Optimization failed:", error);
      alert("Optimization failed. Please try again.");
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
