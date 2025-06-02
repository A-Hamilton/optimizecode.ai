import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotificationHelpers } from "../contexts/NotificationContext";
import { CodeFile } from "../types";
import CodeEditor from "../components/CodeEditor";
import FileUpload from "../components/FileUpload";
import OptimizationPanel from "../components/OptimizationPanel";
import { AnimatedSection } from "../components/animations";

interface OptimizationHistory {
  id: string;
  timestamp: Date;
  originalCode?: string;
  optimizedCode?: string;
  files?: CodeFile[];
  language: string;
  metrics: {
    linesReduced: number;
    sizeReduction: number;
    performanceGain: number;
  };
}

const EnhancedOptimizePage: React.FC = () => {
  const { userProfile, trackUsage, currentUser } = useAuth();
  const { showSuccess, showError, showWarning } = useNotificationHelpers();

  // State management
  const [code, setCode] = useState("");
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [optimizedCode, setOptimizedCode] = useState("");
  const [optimizedFiles, setOptimizedFiles] = useState<CodeFile[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [history, setHistory] = useState<OptimizationHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeView, setActiveView] = useState<"input" | "output">("input");
  const [optimizationQueue, setOptimizationQueue] = useState<string[]>([]);
  const [isQueued, setIsQueued] = useState(false);

  // Check if user has any input
  const hasInput = code.trim().length > 0 || files.length > 0;
  const hasOutput =
    optimizedCode.length > 0 || optimizedFiles.some((f) => f.optimizedContent);

  // Get user usage info
  const getUsageInfo = useCallback(() => {
    if (!userProfile)
      return { used: 0, total: 10, percentage: 0, isUnlimited: false };

    const { optimizationsToday } = userProfile.usage;
    const { optimizationsPerDay } = userProfile.limits;
    const isUnlimited = optimizationsPerDay === -1;

    return {
      used: optimizationsToday,
      total: isUnlimited ? "∞" : optimizationsPerDay,
      percentage: isUnlimited
        ? 0
        : Math.min((optimizationsToday / optimizationsPerDay) * 100, 100),
      isUnlimited,
    };
  }, [userProfile]);

  // Check usage limits
  const canOptimize = useCallback(() => {
    if (!currentUser || !userProfile) return false;

    const { optimizationsPerDay } = userProfile.limits;
    const { optimizationsToday } = userProfile.usage;

    return (
      optimizationsPerDay === -1 || optimizationsToday < optimizationsPerDay
    );
  }, [currentUser, userProfile]);

  // Simulate optimization process
  const optimizeCode = useCallback(async () => {
    if (!hasInput || !canOptimize()) {
      if (!canOptimize()) {
        showError(
          "Daily optimization limit reached. Please upgrade your plan.",
        );
      }
      return;
    }

    setIsOptimizing(true);
    setActiveView("output");

    try {
      // Track usage
      const usageResult = await trackUsage();
      if (!usageResult.success && usageResult.error) {
        showError(usageResult.error);
        return;
      }

      // Simulate optimization delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      let newOptimizedCode = "";
      const newOptimizedFiles: CodeFile[] = [];

      // Optimize pasted code
      if (code.trim()) {
        newOptimizedCode = simulateCodeOptimization(code);
        setOptimizedCode(newOptimizedCode);
      }

      // Optimize files
      if (files.length > 0) {
        for (const file of files) {
          const optimizedContent = simulateCodeOptimization(file.content);
          const optimizedFile: CodeFile = {
            ...file,
            optimizedContent,
          };
          newOptimizedFiles.push(optimizedFile);
        }
        setOptimizedFiles(newOptimizedFiles);
      }

      // Add to history
      const historyItem: OptimizationHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        originalCode: code || undefined,
        optimizedCode: newOptimizedCode || undefined,
        files: newOptimizedFiles.length > 0 ? newOptimizedFiles : undefined,
        language,
        metrics: {
          linesReduced: Math.floor(Math.random() * 10) + 1,
          sizeReduction: Math.floor(Math.random() * 30) + 10,
          performanceGain: Math.floor(Math.random() * 40) + 20,
        },
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 items

      showSuccess("Code optimization completed successfully!");
    } catch (error) {
      showError("Optimization failed. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  }, [
    hasInput,
    canOptimize,
    code,
    files,
    language,
    trackUsage,
    showSuccess,
    showError,
  ]);

  // Queue optimization
  const queueOptimization = () => {
    if (!hasInput) return;

    setOptimizationQueue((prev) => [...prev, `optimization_${Date.now()}`]);
    setIsQueued(true);
    showSuccess("Optimization queued! It will start automatically.");

    // Auto-start after 2 seconds
    setTimeout(() => {
      optimizeCode();
      setIsQueued(false);
      setOptimizationQueue((prev) => prev.slice(1));
    }, 2000);
  };

  // Cancel optimization
  const cancelOptimization = () => {
    setIsOptimizing(false);
    setIsQueued(false);
    setOptimizationQueue([]);
    showWarning("Optimization cancelled");
  };

  // Reset all
  const resetAll = () => {
    setCode("");
    setFiles([]);
    setOptimizedCode("");
    setOptimizedFiles([]);
    setActiveView("input");
    showSuccess("All content cleared");
  };

  // Load from history
  const loadFromHistory = (item: OptimizationHistory) => {
    if (item.originalCode) {
      setCode(item.originalCode);
      setOptimizedCode(item.optimizedCode || "");
    }
    if (item.files) {
      setFiles(item.files);
      setOptimizedFiles(item.files);
    }
    setLanguage(item.language);
    setActiveView("output");
    setShowHistory(false);
    showSuccess("Loaded from history");
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    showSuccess("History cleared");
  };

  // Simulate code optimization
  const simulateCodeOptimization = (inputCode: string): string => {
    let optimized = inputCode;

    // Basic optimizations
    optimized = optimized.replace(/var /g, "const ");
    optimized = optimized.replace(/function\s+(\w+)\s*\(/g, "const $1 = (");
    optimized = optimized.replace(/\)\s*{/g, ") => {");
    optimized = optimized.replace(/;\s*\n\s*}/g, ";\n}");
    optimized = optimized.replace(/\n\s*\n\s*\n/g, "\n\n");

    // Remove some unnecessary whitespace
    optimized = optimized
      .split("\n")
      .map((line) => line.trim())
      .join("\n");

    return optimized;
  };

  const usageInfo = getUsageInfo();
  const isNearLimit =
    !usageInfo.isUnlimited &&
    usageInfo.used >= (usageInfo.total as number) * 0.8;
  const isAtLimit =
    !usageInfo.isUnlimited && usageInfo.used >= (usageInfo.total as number);

  return (
    <div className="enhanced-optimize-page min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <AnimatedSection animation="animate-fade-in-up" className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              AI Code Optimizer
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Transform your code with advanced AI. Get performance
              improvements, cleaner syntax, and security fixes in seconds.
            </p>
          </div>

          {/* Usage Status Bar */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-white/70">Daily Usage:</span>
                  <span
                    className={`font-semibold ${
                      isAtLimit
                        ? "text-red-400"
                        : isNearLimit
                          ? "text-yellow-400"
                          : "text-green-400"
                    }`}
                  >
                    {usageInfo.used} / {usageInfo.total}
                  </span>
                </div>

                {!usageInfo.isUnlimited && (
                  <div className="w-32 bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isAtLimit
                          ? "bg-red-500"
                          : isNearLimit
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${usageInfo.percentage}%` }}
                    />
                  </div>
                )}

                <span className="text-sm text-white/60">
                  {userProfile?.subscription?.plan || "Free"} Plan
                </span>
              </div>

              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 transition-all duration-300 flex items-center gap-2"
                  >
                    📜 History ({history.length})
                  </button>
                )}

                {isNearLimit && (
                  <button
                    onClick={() => (window.location.href = "/pricing")}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg font-medium transition-all duration-300"
                  >
                    Upgrade Plan
                  </button>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* History Panel */}
        {showHistory && (
          <AnimatedSection animation="animate-fade-in" className="mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Optimization History
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={clearHistory}
                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-sm text-red-300 transition-all duration-300"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-sm text-white/70 transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-all duration-300 cursor-pointer"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-white">
                          {item.originalCode
                            ? "Code"
                            : `${item.files?.length} files`}
                        </span>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          {item.language}
                        </span>
                        <span className="text-xs text-green-400">
                          -{item.metrics.sizeReduction}% size
                        </span>
                      </div>
                      <div className="text-xs text-white/60 mt-1">
                        {item.timestamp.toLocaleString()}
                      </div>
                    </div>
                    <button className="text-primary hover:text-primary-light transition-colors">
                      Load →
                    </button>
                  </div>
                ))}

                {history.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    No optimization history yet. Start optimizing code to see
                    your history here.
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Input Section */}
          <div
            className={`xl:col-span-2 space-y-6 ${activeView === "output" ? "hidden xl:block" : ""}`}
          >
            <AnimatedSection animation="animate-fade-in-left">
              <CodeEditor
                code={code}
                onCodeChange={setCode}
                language={language}
                onLanguageChange={setLanguage}
                height="500px"
                placeholder="Paste your code here to get started with AI optimization..."
              />
            </AnimatedSection>

            <AnimatedSection animation="animate-fade-in-left" delay={200}>
              <FileUpload
                files={files}
                onFilesChange={setFiles}
                showPreview={true}
                allowFolders={true}
              />
            </AnimatedSection>

            {/* Action Buttons */}
            <AnimatedSection animation="animate-fade-in-up" delay={400}>
              <div className="flex flex-wrap items-center justify-center gap-4 p-6 bg-white/5 border border-white/10 rounded-xl">
                <button
                  onClick={optimizeCode}
                  disabled={!hasInput || isOptimizing || isQueued || isAtLimit}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 ${
                    hasInput && !isOptimizing && !isQueued && !isAtLimit
                      ? "bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isOptimizing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Optimizing...
                    </>
                  ) : isQueued ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Queued...
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">⚡</span>
                      Optimize Code
                    </>
                  )}
                </button>

                {hasInput && !isOptimizing && !isQueued && (
                  <button
                    onClick={queueOptimization}
                    className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 rounded-lg text-blue-300 transition-all duration-300 flex items-center gap-2"
                  >
                    ⏱️ Queue Optimization
                  </button>
                )}

                {(isOptimizing || isQueued) && (
                  <button
                    onClick={cancelOptimization}
                    className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-300 transition-all duration-300"
                  >
                    ⏹️ Cancel
                  </button>
                )}

                {hasInput && (
                  <button
                    onClick={resetAll}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg text-white/70 hover:text-white transition-all duration-300"
                  >
                    🔄 Reset All
                  </button>
                )}
              </div>
            </AnimatedSection>

            {/* Mobile View Toggle */}
            <div className="xl:hidden flex justify-center">
              <div className="flex bg-white/10 border border-white/20 rounded-lg p-1">
                <button
                  onClick={() => setActiveView("input")}
                  className={`px-4 py-2 rounded transition-all duration-300 ${
                    activeView === "input"
                      ? "bg-primary text-white"
                      : "text-white/70"
                  }`}
                >
                  Input
                </button>
                <button
                  onClick={() => setActiveView("output")}
                  className={`px-4 py-2 rounded transition-all duration-300 ${
                    activeView === "output"
                      ? "bg-primary text-white"
                      : "text-white/70"
                  }`}
                >
                  Results{" "}
                  {hasOutput && <span className="ml-1 text-green-400">●</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div
            className={`xl:col-span-1 ${activeView === "input" ? "hidden xl:block" : ""}`}
          >
            <AnimatedSection animation="animate-fade-in-right">
              <OptimizationPanel
                originalCode={code}
                optimizedCode={optimizedCode}
                files={optimizedFiles}
                isOptimizing={isOptimizing}
                onOptimize={optimizeCode}
                onCancel={cancelOptimization}
                onReset={resetAll}
                language={language}
                showAdvancedOptions={true}
              />
            </AnimatedSection>
          </div>
        </div>

        {/* Features Showcase */}
        <AnimatedSection
          animation="animate-fade-in-up"
          delay={600}
          className="mt-12"
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 border border-primary/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              🚀 Advanced Optimization Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-semibold text-white mb-2">
                  Performance Boost
                </h3>
                <p className="text-white/70 text-sm">
                  Get up to 40% performance improvements with algorithmic
                  optimizations
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="font-semibold text-white mb-2">
                  Security Fixes
                </h3>
                <p className="text-white/70 text-sm">
                  Automatically detect and fix security vulnerabilities in your
                  code
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3">📖</div>
                <h3 className="font-semibold text-white mb-2">
                  Better Readability
                </h3>
                <p className="text-white/70 text-sm">
                  Modernize syntax and improve code structure for better
                  maintainability
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-white/60 mb-4">
                Supports 15+ programming languages including JavaScript, Python,
                Java, C++, and more
              </p>

              {isAtLimit ? (
                <button
                  onClick={() => (window.location.href = "/pricing")}
                  className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg font-medium transition-all duration-300"
                >
                  Upgrade for Unlimited Optimizations
                </button>
              ) : (
                <p className="text-primary">
                  {usageInfo.isUnlimited
                    ? "✨ Unlimited optimizations available"
                    : `${(usageInfo.total as number) - usageInfo.used} optimizations remaining today`}
                </p>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default EnhancedOptimizePage;
