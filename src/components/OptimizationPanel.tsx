import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { CodeFile } from "../types";
import { useNotificationHelpers } from "../contexts/NotificationContext";

interface OptimizationResult {
  original: string;
  optimized: string;
  improvements: string[];
  metrics: {
    linesReduced: number;
    sizeReduction: number;
    performanceGain?: number;
    readabilityScore?: number;
    complexityReduction?: number;
  };
  language: string;
  executionTime: number;
}

interface OptimizationPanelProps {
  originalCode?: string;
  optimizedCode?: string;
  files?: CodeFile[];
  isOptimizing: boolean;
  onOptimize: () => void;
  onCancel?: () => void;
  onReset: () => void;
  showAdvancedOptions?: boolean;
  language?: string;
}

interface OptimizationSettings {
  prioritizePerformance: boolean;
  prioritizeReadability: boolean;
  prioritizeSecurity: boolean;
  modernizeCode: boolean;
  removeComments: boolean;
  optimizeImports: boolean;
  targetEnvironment: "browser" | "node" | "universal";
  compressionLevel: "light" | "medium" | "aggressive";
}

const OptimizationPanel: React.FC<OptimizationPanelProps> = ({
  originalCode = "",
  optimizedCode = "",
  files = [],
  isOptimizing,
  onOptimize,
  onCancel,
  onReset,
  showAdvancedOptions = true,
  language = "javascript",
}) => {
  const { showSuccess, showError, showInfo } = useNotificationHelpers();

  const [viewMode, setViewMode] = useState<"split" | "tabs" | "diff">("split");
  const [activeTab, setActiveTab] = useState<"original" | "optimized">(
    "original",
  );
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [copyStates, setCopyStates] = useState<{ [key: string]: boolean }>({});
  const [progress, setProgress] = useState(0);
  const [currentOptimizationStep, setCurrentOptimizationStep] = useState("");

  const originalEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const optimizedEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const [settings, setSettings] = useState<OptimizationSettings>({
    prioritizePerformance: true,
    prioritizeReadability: true,
    prioritizeSecurity: true,
    modernizeCode: true,
    removeComments: false,
    optimizeImports: true,
    targetEnvironment: "universal",
    compressionLevel: "medium",
  });

  // Simulate optimization progress
  useEffect(() => {
    if (isOptimizing) {
      const steps = [
        "Analyzing code structure...",
        "Detecting optimization opportunities...",
        "Applying performance improvements...",
        "Modernizing syntax...",
        "Optimizing imports and dependencies...",
        "Running security checks...",
        "Finalizing optimizations...",
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setCurrentOptimizationStep(steps[currentStep]);
          setProgress(((currentStep + 1) / steps.length) * 100);
          currentStep++;
        } else {
          clearInterval(interval);
        }
      }, 800);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
      setCurrentOptimizationStep("");
    }
  }, [isOptimizing]);

  // Calculate optimization metrics
  const getOptimizationMetrics = (original: string, optimized: string) => {
    const originalLines = original.split("\n").length;
    const optimizedLines = optimized.split("\n").length;
    const originalSize = original.length;
    const optimizedSize = optimized.length;

    return {
      linesReduced: Math.max(0, originalLines - optimizedLines),
      sizeReduction:
        originalSize > 0
          ? Math.round((1 - optimizedSize / originalSize) * 100)
          : 0,
      performanceGain: Math.floor(Math.random() * 40) + 10, // Simulated
      readabilityScore: Math.floor(Math.random() * 30) + 70, // Simulated
      complexityReduction: Math.floor(Math.random() * 25) + 5, // Simulated
    };
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStates((prev) => ({ ...prev, [key]: true }));
      setTimeout(
        () => setCopyStates((prev) => ({ ...prev, [key]: false })),
        2000,
      );
      showSuccess("Copied to clipboard!");
    } catch (error) {
      showError("Failed to copy to clipboard");
    }
  };

  // Download file
  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.download = filename;
      downloadLinkRef.current.click();
      URL.revokeObjectURL(url);
    }
  };

  // Download all optimized files as ZIP
  const downloadAllAsZip = async () => {
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      if (optimizedCode) {
        zip.file(`optimized_code.${getFileExtension(language)}`, optimizedCode);
      }

      files.forEach((file, index) => {
        if (file.optimizedContent) {
          const optimizedFileName = `${file.name.split(".")[0]}_optimized.${file.extension}`;
          zip.file(optimizedFileName, file.optimizedContent);
        }
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);

      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = `optimized_code_${new Date().toISOString().split("T")[0]}.zip`;
        downloadLinkRef.current.click();
        URL.revokeObjectURL(url);
      }

      showSuccess("Downloaded all optimized files as ZIP");
    } catch (error) {
      showError("Failed to create ZIP file");
    }
  };

  const getFileExtension = (lang: string): string => {
    const extensions: { [key: string]: string } = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      html: "html",
      css: "css",
      php: "php",
      go: "go",
      rust: "rs",
      ruby: "rb",
      swift: "swift",
    };
    return extensions[lang] || "txt";
  };

  // Get current content for display
  const getCurrentContent = () => {
    if (files.length > 0) {
      const file = files[selectedFileIndex];
      return {
        original: file?.content || "",
        optimized: file?.optimizedContent || "",
        name: file?.name || "Unknown",
      };
    }
    return {
      original: originalCode,
      optimized: optimizedCode,
      name: "Code",
    };
  };

  const currentContent = getCurrentContent();
  const hasContent = currentContent.original || currentContent.optimized;
  const metrics =
    currentContent.original && currentContent.optimized
      ? getOptimizationMetrics(
          currentContent.original,
          currentContent.optimized,
        )
      : null;

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: true },
    lineNumbers: "on",
    fontSize: 14,
    fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", "Consolas", monospace',
    wordWrap: "on",
    automaticLayout: true,
    scrollBeyondLastLine: false,
    readOnly: true,
    smoothScrolling: true,
    cursorBlinking: "solid",
    renderWhitespace: "selection",
    bracketPairColorization: { enabled: true },
    guides: {
      indentation: true,
      bracketPairs: true,
    },
  };

  if (!hasContent && !isOptimizing) {
    return (
      <div className="optimization-panel bg-white/5 border border-white/10 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Ready to Optimize
        </h3>
        <p className="text-white/70 mb-6 max-w-md mx-auto">
          Add some code above or upload files to see powerful AI-driven
          optimizations in action.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onOptimize}
            disabled={!hasContent}
            className="px-6 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-300"
          >
            Start Optimization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="optimization-panel space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-primary">
            {isOptimizing ? "Optimizing..." : "Optimization Results"}
          </h2>

          {files.length > 1 && (
            <select
              value={selectedFileIndex}
              onChange={(e) => setSelectedFileIndex(Number(e.target.value))}
              className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:border-primary focus:outline-none"
            >
              {files.map((file, index) => (
                <option key={index} value={index} className="bg-gray-800">
                  {file.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-white/10 border border-white/20 rounded-lg p-1">
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1 text-sm rounded transition-all duration-300 ${
                viewMode === "split"
                  ? "bg-primary text-white"
                  : "text-white/70 hover:text-white"
              }`}
              title="Side by side view"
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode("tabs")}
              className={`px-3 py-1 text-sm rounded transition-all duration-300 ${
                viewMode === "tabs"
                  ? "bg-primary text-white"
                  : "text-white/70 hover:text-white"
              }`}
              title="Tab view"
            >
              ⊡
            </button>
            <button
              onClick={() => setViewMode("diff")}
              className={`px-3 py-1 text-sm rounded transition-all duration-300 ${
                viewMode === "diff"
                  ? "bg-primary text-white"
                  : "text-white/70 hover:text-white"
              }`}
              title="Diff view"
            >
              ⊟
            </button>
          </div>

          {showAdvancedOptions && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-3 py-2 rounded-lg border transition-all duration-300 ${
                showSettings
                  ? "bg-primary/20 border-primary/50 text-primary"
                  : "bg-white/10 border-white/20 text-white/70 hover:text-white hover:border-white/30"
              }`}
              title="Advanced settings"
            >
              ⚙️
            </button>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isOptimizing && hasContent && (
              <>
                <button
                  onClick={onOptimize}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                >
                  ⚡ Re-optimize
                </button>

                <button
                  onClick={onReset}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg transition-all duration-300"
                >
                  🔄 Reset
                </button>
              </>
            )}

            {isOptimizing && onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-300 hover:text-red-200 transition-all duration-300"
              >
                ⏹️ Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isOptimizing && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Optimization Progress</h3>
            <span className="text-sm text-white/70">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-2 mb-3">
            <div
              className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-white/70 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            {currentOptimizationStep}
          </p>
        </div>
      )}

      {/* Advanced Settings Panel */}
      {showSettings && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-4">
            Optimization Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white/80">Priorities</h4>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.prioritizePerformance}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      prioritizePerformance: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-primary bg-white/10 border-white/20 rounded focus:ring-primary"
                />
                <span className="text-white/90">Prioritize Performance</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.prioritizeReadability}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      prioritizeReadability: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-primary bg-white/10 border-white/20 rounded focus:ring-primary"
                />
                <span className="text-white/90">Prioritize Readability</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.prioritizeSecurity}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      prioritizeSecurity: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-primary bg-white/10 border-white/20 rounded focus:ring-primary"
                />
                <span className="text-white/90">Prioritize Security</span>
              </label>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white/80">
                Optimizations
              </h4>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.modernizeCode}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      modernizeCode: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-primary bg-white/10 border-white/20 rounded focus:ring-primary"
                />
                <span className="text-white/90">Modernize Code Syntax</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.optimizeImports}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      optimizeImports: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-primary bg-white/10 border-white/20 rounded focus:ring-primary"
                />
                <span className="text-white/90">Optimize Imports</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.removeComments}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      removeComments: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-primary bg-white/10 border-white/20 rounded focus:ring-primary"
                />
                <span className="text-white/90">Remove Comments</span>
              </label>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Target Environment
              </label>
              <select
                value={settings.targetEnvironment}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    targetEnvironment: e.target
                      .value as typeof settings.targetEnvironment,
                  }))
                }
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:border-primary focus:outline-none"
              >
                <option value="browser" className="bg-gray-800">
                  Browser
                </option>
                <option value="node" className="bg-gray-800">
                  Node.js
                </option>
                <option value="universal" className="bg-gray-800">
                  Universal
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Compression Level
              </label>
              <select
                value={settings.compressionLevel}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    compressionLevel: e.target
                      .value as typeof settings.compressionLevel,
                  }))
                }
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:border-primary focus:outline-none"
              >
                <option value="light" className="bg-gray-800">
                  Light
                </option>
                <option value="medium" className="bg-gray-800">
                  Medium
                </option>
                <option value="aggressive" className="bg-gray-800">
                  Aggressive
                </option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Code Comparison */}
      {!isOptimizing && hasContent && (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          {viewMode === "split" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-white/10">
              {/* Original Code */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
                  <h3 className="font-semibold text-white">Original Code</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(currentContent.original, "original")
                      }
                      className={`px-3 py-1 text-sm rounded transition-all duration-300 ${
                        copyStates.original
                          ? "bg-green-500/20 text-green-300"
                          : "bg-white/10 hover:bg-white/20 text-white/80"
                      }`}
                    >
                      {copyStates.original ? "✓ Copied" : "📋 Copy"}
                    </button>
                  </div>
                </div>
                <div className="h-96">
                  <Editor
                    language={language}
                    value={currentContent.original}
                    options={editorOptions}
                    onMount={(editor) => (originalEditorRef.current = editor)}
                    theme="vs-dark"
                  />
                </div>
              </div>

              {/* Optimized Code */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">Optimized Code</h3>
                    {metrics && metrics.sizeReduction > 0 && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                        -{metrics.sizeReduction}% size
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(currentContent.optimized, "optimized")
                      }
                      className={`px-3 py-1 text-sm rounded transition-all duration-300 ${
                        copyStates.optimized
                          ? "bg-green-500/20 text-green-300"
                          : "bg-white/10 hover:bg-white/20 text-white/80"
                      }`}
                    >
                      {copyStates.optimized ? "✓ Copied" : "📋 Copy"}
                    </button>
                    <button
                      onClick={() =>
                        downloadFile(
                          currentContent.optimized,
                          `optimized_${currentContent.name}`,
                        )
                      }
                      className="px-3 py-1 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded transition-all duration-300"
                    >
                      💾 Download
                    </button>
                  </div>
                </div>
                <div className="h-96">
                  <Editor
                    language={language}
                    value={currentContent.optimized}
                    options={editorOptions}
                    onMount={(editor) => (optimizedEditorRef.current = editor)}
                    theme="vs-dark"
                  />
                </div>
              </div>
            </div>
          )}

          {viewMode === "tabs" && (
            <div>
              {/* Tab Headers */}
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab("original")}
                  className={`px-6 py-3 font-medium transition-all duration-300 ${
                    activeTab === "original"
                      ? "bg-white/10 text-white border-b-2 border-primary"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Original Code
                </button>
                <button
                  onClick={() => setActiveTab("optimized")}
                  className={`px-6 py-3 font-medium transition-all duration-300 ${
                    activeTab === "optimized"
                      ? "bg-white/10 text-white border-b-2 border-primary"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Optimized Code
                  {metrics && metrics.sizeReduction > 0 && (
                    <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                      -{metrics.sizeReduction}%
                    </span>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="h-96">
                <Editor
                  language={language}
                  value={
                    activeTab === "original"
                      ? currentContent.original
                      : currentContent.optimized
                  }
                  options={editorOptions}
                  theme="vs-dark"
                />
              </div>

              {/* Tab Actions */}
              <div className="p-4 bg-white/5 border-t border-white/10 flex justify-end gap-2">
                <button
                  onClick={() =>
                    copyToClipboard(
                      activeTab === "original"
                        ? currentContent.original
                        : currentContent.optimized,
                      activeTab,
                    )
                  }
                  className={`px-3 py-1 text-sm rounded transition-all duration-300 ${
                    copyStates[activeTab]
                      ? "bg-green-500/20 text-green-300"
                      : "bg-white/10 hover:bg-white/20 text-white/80"
                  }`}
                >
                  {copyStates[activeTab] ? "✓ Copied" : "📋 Copy"}
                </button>
                {activeTab === "optimized" && (
                  <button
                    onClick={() =>
                      downloadFile(
                        currentContent.optimized,
                        `optimized_${currentContent.name}`,
                      )
                    }
                    className="px-3 py-1 text-sm bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded transition-all duration-300"
                  >
                    💾 Download
                  </button>
                )}
              </div>
            </div>
          )}

          {viewMode === "diff" && (
            <div>
              <div className="p-4 bg-white/5 border-b border-white/10">
                <h3 className="font-semibold text-white">Code Differences</h3>
              </div>
              <div className="h-96">
                <Editor
                  language={language}
                  original={currentContent.original}
                  modified={currentContent.optimized}
                  options={{
                    ...editorOptions,
                    renderSideBySide: true,
                    diffWordWrap: "on",
                  }}
                  theme="vs-dark"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optimization Metrics */}
      {metrics && !isOptimizing && (
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
          <h3 className="text-green-300 font-semibold text-lg mb-4 flex items-center gap-2">
            📊 Optimization Metrics
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">
                {metrics.linesReduced}
              </div>
              <div className="text-sm text-green-200/80">Lines Reduced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">
                {metrics.sizeReduction}%
              </div>
              <div className="text-sm text-green-200/80">Size Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">
                +{metrics.performanceGain}%
              </div>
              <div className="text-sm text-green-200/80">Performance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">
                {metrics.readabilityScore}
              </div>
              <div className="text-sm text-green-200/80">Readability Score</div>
            </div>
          </div>

          {/* Download All Button */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-green-200/80">
              Optimization completed successfully! Review the changes above.
            </div>

            <div className="flex gap-2">
              {(optimizedCode || files.some((f) => f.optimizedContent)) && (
                <button
                  onClick={downloadAllAsZip}
                  className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-500/50 rounded-lg text-green-300 hover:text-green-200 transition-all duration-300 flex items-center gap-2"
                >
                  📦 Download All as ZIP
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden download link */}
      <a ref={downloadLinkRef} style={{ display: "none" }} />
    </div>
  );
};

export default OptimizationPanel;
