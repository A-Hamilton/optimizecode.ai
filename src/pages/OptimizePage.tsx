// Updated for TypeScript migration
import React, { useState, useEffect } from "react";
import { CodeFile } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { PLAN_DETAILS } from "../types/user";
import CodeInput from "../components/CodeInput";
import FileDropZone from "../components/FileDropZone";
import ResultsDisplay from "../components/ResultsDisplay";
import "./OptimizePage.css";

const OptimizePage: React.FC = () => {
  const { userProfile, trackUsage, currentUser } = useAuth();
  const [code, setCode] = useState<string>("");
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [optimizedCode, setOptimizedCode] = useState<string>("");
  const [optimizedFiles, setOptimizedFiles] = useState<CodeFile[]>([]);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationSummary, setOptimizationSummary] = useState<
    Record<string, any>
  >({});
  const [usageError, setUsageError] = useState<string>("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "warning" | "info";
  } | null>(null);

  const showNotification = (
    message: string,
    type: "error" | "warning" | "info" = "info",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const optimizeCode = async () => {
    if (!code.trim() && files.length === 0) {
      return;
    }

    // Check usage limits before optimization
    if (!currentUser || !userProfile) {
      setUsageError("Please log in to optimize code");
      return;
    }

    // Check if user has reached their limit
    const { filesPerMonth } = userProfile.limits;
    const { filesOptimizedThisMonth } = userProfile.usage;

    if (filesPerMonth !== -1 && filesOptimizedThisMonth >= filesPerMonth) {
      setUsageError(
        `You've reached your monthly limit of ${filesPerMonth} files. Upgrade your plan for more files.`,
      );
      return;
    }

    setIsOptimizing(true);
    setUsageError("");

    // Clear previous optimization summary before starting
    setOptimizationSummary({});

    try {
      // Track usage for this optimization
      const usageResult = await trackUsage();
      if (!usageResult.success && usageResult.error) {
        setUsageError(usageResult.error);
        setIsOptimizing(false);
        return;
      }

      if (code.trim()) {
        // Simulate optimization process
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const optimized = simulateCodeOptimization(code);
        setOptimizedCode(optimized);

        setOptimizationSummary((prev) => ({
          ...prev,
          manual_input: {
            original: code,
            optimized: optimized,
            improvements: getOptimizationImprovements(code, optimized),
          },
        }));
      }

      if (files.length > 0) {
        const optimizedFileResults: CodeFile[] = [];
        const summary: Record<string, any> = {};

        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          // Simulate processing time
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const optimizedContent = simulateCodeOptimization(file.content);
          const optimizedFile: CodeFile = {
            name: `${file.name}.optimized${file.name.substring(file.name.lastIndexOf("."))}`,
            path: file.path,
            content: optimizedContent,
          };

          optimizedFileResults.push(optimizedFile);

          summary[file.name] = {
            original: file.content,
            optimized: optimizedContent,
            improvements: getOptimizationImprovements(
              file.content,
              optimizedContent,
            ),
          };
        }

        setOptimizedFiles(optimizedFileResults);
        setOptimizationSummary((prev) => ({ ...prev, ...summary }));
      }
    } catch (error) {
      console.error("Optimization failed:", error);
      setUsageError("Optimization failed. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const resetCode = () => {
    setCode("");
    setFiles([]);
    setOptimizedCode("");
    setOptimizedFiles([]);
    setOptimizationSummary({});
    setUsageError("");
  };

  const simulateCodeOptimization = (inputCode: string): string => {
    // Simple simulation - in reality, this would call your optimization API
    let optimized = inputCode;

    // Simulate some optimizations
    optimized = optimized.replace(/var /g, "const ");
    optimized = optimized.replace(/;\s*\n/g, ";\n");
    optimized = optimized.replace(/\{\s*\n\s*/g, "{\n  ");
    optimized = optimized.replace(/\n\s*\}/g, "\n}");

    return optimized;
  };

  const getOptimizationImprovements = (original: string, optimized: string) => {
    const originalLines = original.split("\n").length;
    const optimizedLines = optimized.split("\n").length;

    return {
      linesReduced: Math.max(0, originalLines - optimizedLines),
      sizeReduction: `${Math.round((1 - optimized.length / original.length) * 100)}%`,
      improvements: [
        "Variable declarations optimized",
        "Code formatting improved",
        "Whitespace optimized",
      ],
    };
  };

  const InlineNotification: React.FC<{
    message: string;
    type: "error" | "warning" | "info";
    onClose: () => void;
  }> = ({ message, type, onClose }) => {
    const typeStyles = {
      error: "bg-red-500/20 border-red-500/30 text-red-200",
      warning: "bg-yellow-500/20 border-yellow-500/30 text-yellow-200",
      info: "bg-blue-500/20 border-blue-500/30 text-blue-200",
    };

    return (
      <div
        className={`p-3 rounded-lg border mb-4 flex items-center justify-between ${typeStyles[type]}`}
      >
        <span className="text-sm">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-lg leading-none hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div className="optimize-page">
      <div className="optimize-container">
        <header className="optimize-header">
          <div className="header-content">
            <div className="title-section">
              <h1>Code Optimizer</h1>
              <p>
                AI-powered code optimization for better performance,
                readability, and maintainability
              </p>
            </div>

            <div className="current-plan">
              <span className="plan-label">Current Plan:</span>
              <span
                className={`plan-name ${userProfile?.subscription.plan || "free"}`}
              >
                {userProfile?.subscription.plan
                  ? PLAN_DETAILS[userProfile.subscription.plan].name
                  : "Free"}
              </span>
              <span className="plan-usage">
                {userProfile?.usage.filesOptimizedThisMonth || 0}/
                {userProfile?.limits.filesPerMonth === -1
                  ? "∞"
                  : userProfile?.limits.filesPerMonth || 2}{" "}
                files
              </span>
              <div className="plan-upgrade-buttons">
                <button
                  className={`plan-btn free ${userProfile?.subscription.plan === "free" ? "active" : ""}`}
                  onClick={() => (window.location.href = "/pricing")}
                >
                  Free
                </button>
                <button
                  className={`plan-btn pro ${userProfile?.subscription.plan === "pro" ? "active" : ""}`}
                  onClick={() => (window.location.href = "/pricing")}
                >
                  Pro
                </button>
                <button
                  className={`plan-btn unleashed ${userProfile?.subscription.plan === "unleashed" ? "active" : ""}`}
                  onClick={() => (window.location.href = "/pricing")}
                >
                  Unleashed
                </button>
              </div>
            </div>

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
            {usageError && (
              <div className="usage-error">
                <svg
                  className="error-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{usageError}</span>
                <button
                  className="upgrade-btn"
                  onClick={() => (window.location.href = "/pricing")}
                >
                  Upgrade Plan
                </button>
              </div>
            )}

            <CodeInput code={code} onCodeChange={setCode} />

            <div className="quick-tips">
              <h3>💡 Quick Start Tips:</h3>
              <ul>
                <li>Paste any code snippet to see instant AI optimization</li>
                <li>Supports 15+ programming languages</li>
                <li>
                  Get performance improvements, cleaner syntax, and security
                  fixes
                </li>
                <li>Use the file upload below for multiple files</li>
              </ul>
            </div>
          </div>

          <div className="file-section">
            <FileDropZone
              files={files}
              onFilesChange={setFiles}
              showNotification={showNotification}
            />
          </div>

          <div className="action-section">
            <div className="optimize-actions">
              <button
                className="optimize-btn"
                onClick={optimizeCode}
                disabled={(!code.trim() && files.length === 0) || isOptimizing}
              >
                <span className="btn-content">
                  {isOptimizing ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Optimize Code
                    </>
                  )}
                </span>
              </button>

              {(code.trim() || files.length > 0) && !isOptimizing && (
                <button className="reset-btn" onClick={resetCode}>
                  <span className="btn-content">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 12a9 9 0 1013.5-7.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 5l-3-3 3-3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Reset
                  </span>
                </button>
              )}
            </div>
          </div>

          <ResultsDisplay
            originalCode={code}
            optimizedCode={optimizedCode}
            files={optimizedFiles}
            isOptimizing={isOptimizing}
            optimizationSummary={optimizationSummary}
          />
        </main>
      </div>
    </div>
  );
};

export default OptimizePage;
