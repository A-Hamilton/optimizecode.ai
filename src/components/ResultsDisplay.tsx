import React, { useState, useRef } from "react";
import { ResultsDisplayProps } from "../types";

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  originalCode,
  optimizedCode,
  files,
  isOptimizing,
  optimizationSummary,
}) => {
  const [activeTab, setActiveTab] = useState<"code" | "files">("code");
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copyStates, setCopyStates] = useState<{ [key: string]: boolean }>({});
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const showCopyFeedback = (
    message: string,
    isError: boolean = false,
  ): void => {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${isError ? "#ef4444" : "#22c55e"};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-10px)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const copyToClipboard = async (text: string, key: string): Promise<void> => {
    if (!text) return;

    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopyStates((prev) => ({ ...prev, [key]: true }));
        setTimeout(
          () => setCopyStates((prev) => ({ ...prev, [key]: false })),
          2000,
        );
        showCopyFeedback("Copied to clipboard!");
        return;
      }
    } catch (err) {
      console.warn("Clipboard API failed, trying fallback method:", err);
    }

    // Fallback method
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        setCopyStates((prev) => ({ ...prev, [key]: true }));
        setTimeout(
          () => setCopyStates((prev) => ({ ...prev, [key]: false })),
          2000,
        );
        showCopyFeedback("Copied to clipboard!");
      } else {
        showCopyFeedback("Copy failed - please copy manually", true);
      }
    } catch (fallbackErr) {
      console.error("All copy methods failed:", fallbackErr);
      showCopyFeedback("Copy not supported - please copy manually", true);
    }
  };

  const downloadFile = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.download = filename;
      downloadLinkRef.current.click();
      URL.revokeObjectURL(url);
    }
  };

  const downloadAllOptimizedFiles = (): void => {
    const optimizedFiles = files.filter((file) => file.optimizedContent);
    if (optimizedFiles.length === 0) return;

    // Create a zip-like structure or download individually
    optimizedFiles.forEach((file, index) => {
      setTimeout(() => {
        downloadFile(file.optimizedContent!, `optimized_${file.name}`);
      }, index * 100); // Stagger downloads
    });

    showCopyFeedback(`Downloading ${optimizedFiles.length} optimized files...`);
  };

  const CopyButton: React.FC<{
    text: string;
    label: string;
    copyKey: string;
    className?: string;
  }> = ({ text, label, copyKey, className = "" }) => {
    const isCopied = copyStates[copyKey];

    return (
      <button
        onClick={() => copyToClipboard(text, copyKey)}
        className={`flex items-center gap-2 px-3 py-1 text-xs rounded transition-all duration-300 ${
          isCopied
            ? "bg-green-500/20 border-green-500/30 text-green-300 border"
            : "bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white/80 hover:text-white"
        } ${className}`}
        disabled={!text || isOptimizing}
        title={`Copy ${label}`}
        type="button"
      >
        {isCopied ? <>✓ Copied</> : <>📋 Copy {label}</>}
      </button>
    );
  };

  const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <div className="text-center">
        <p className="text-white/80 font-medium">Optimizing your code...</p>
        <p className="text-white/60 text-sm mt-1">
          AI is analyzing and improving your code
        </p>
      </div>
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );

  const hasResults =
    (originalCode && optimizedCode) || files.some((f) => f.optimizedContent);
  const hasCodeInput = originalCode && originalCode.trim().length > 0;
  const hasFileInput = files && files.length > 0;

  if (!hasCodeInput && !hasFileInput) {
    return (
      <div className="mt-8 p-8 border-2 border-dashed border-white/20 rounded-xl text-center">
        <div className="text-4xl mb-4">🚀</div>
        <h3 className="text-lg font-semibold text-white/80 mb-2">
          Ready to Optimize
        </h3>
        <p className="text-white/60">
          Paste your code above or upload files to see AI-powered optimizations
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary">
          Optimization Results
        </h3>

        {/* Tab Switcher */}
        {hasCodeInput && hasFileInput && (
          <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 py-2 text-sm font-medium rounded transition-all duration-300 ${
                activeTab === "code"
                  ? "bg-primary text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              Pasted Code
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`px-4 py-2 text-sm font-medium rounded transition-all duration-300 ${
                activeTab === "files"
                  ? "bg-primary text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              Files ({files.length})
            </button>
          </div>
        )}
      </div>

      {/* Code Results */}
      {(activeTab === "code" || !hasFileInput) && hasCodeInput && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Code */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
              <h4 className="font-medium text-white">Original Code</h4>
              <div className="flex gap-2">
                <CopyButton
                  text={originalCode}
                  label="Original"
                  copyKey="original"
                />
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-auto">
              <pre className="text-sm text-white/90 font-mono leading-6 whitespace-pre-wrap">
                {originalCode || "No code to display"}
              </pre>
            </div>
          </div>

          {/* Optimized Code */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
              <h4 className="font-medium text-white">Optimized Code</h4>
              <div className="flex gap-2">
                {optimizedCode && (
                  <>
                    <CopyButton
                      text={optimizedCode}
                      label="Optimized"
                      copyKey="optimized"
                    />
                    <button
                      onClick={() =>
                        downloadFile(optimizedCode, "optimized_code.js")
                      }
                      className="flex items-center gap-2 px-3 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 rounded transition-all duration-300 text-blue-300 hover:text-blue-200"
                      title="Download optimized code"
                    >
                      💾 Download
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-auto">
              {isOptimizing ? (
                <LoadingSpinner />
              ) : optimizedCode ? (
                <pre className="text-sm text-white/90 font-mono leading-6 whitespace-pre-wrap">
                  {optimizedCode}
                </pre>
              ) : (
                <div className="text-center text-white/60 py-8">
                  <div className="text-3xl mb-3">⚡</div>
                  <p>Click 'Optimize Code' to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* File Results */}
      {(activeTab === "files" || !hasCodeInput) && hasFileInput && (
        <div className="space-y-6">
          {/* File Selector */}
          {files.length > 1 && (
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-white/70 text-sm font-medium">
                Select File:
              </span>
              <div className="flex gap-2 flex-wrap">
                {files.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFileIndex(index)}
                    className={`px-3 py-1 text-xs rounded transition-all duration-300 ${
                      selectedFileIndex === index
                        ? "bg-primary text-white"
                        : "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
                    }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>
              {files.some((f) => f.optimizedContent) && (
                <button
                  onClick={downloadAllOptimizedFiles}
                  className="ml-auto px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded text-sm font-medium transition-all duration-300"
                >
                  💾 Download All Optimized
                </button>
              )}
            </div>
          )}

          {/* Selected File Display */}
          {files[selectedFileIndex] && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original File */}
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
                  <div>
                    <h4 className="font-medium text-white">
                      {files[selectedFileIndex].name}
                    </h4>
                    <p className="text-xs text-white/60">
                      {(files[selectedFileIndex].size / 1024).toFixed(1)} KB •{" "}
                      {files[selectedFileIndex].extension.toUpperCase()}
                    </p>
                  </div>
                  <CopyButton
                    text={files[selectedFileIndex].content}
                    label="Original"
                    copyKey={`file-original-${selectedFileIndex}`}
                  />
                </div>
                <div className="p-4 max-h-96 overflow-auto">
                  <pre className="text-sm text-white/90 font-mono leading-6 whitespace-pre-wrap">
                    {files[selectedFileIndex].content}
                  </pre>
                </div>
              </div>

              {/* Optimized File */}
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
                  <h4 className="font-medium text-white">Optimized</h4>
                  <div className="flex gap-2">
                    {files[selectedFileIndex].optimizedContent && (
                      <>
                        <CopyButton
                          text={files[selectedFileIndex].optimizedContent!}
                          label="Optimized"
                          copyKey={`file-optimized-${selectedFileIndex}`}
                        />
                        <button
                          onClick={() =>
                            downloadFile(
                              files[selectedFileIndex].optimizedContent!,
                              `optimized_${files[selectedFileIndex].name}`,
                            )
                          }
                          className="flex items-center gap-2 px-3 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded transition-all duration-300"
                          title="Download optimized file"
                        >
                          💾 Download
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-4 max-h-96 overflow-auto">
                  {isOptimizing ? (
                    <LoadingSpinner />
                  ) : files[selectedFileIndex].optimizedContent ? (
                    <pre className="text-sm text-white/90 font-mono leading-6 whitespace-pre-wrap">
                      {files[selectedFileIndex].optimizedContent}
                    </pre>
                  ) : (
                    <div className="text-center text-white/60 py-8">
                      <div className="text-3xl mb-3">⚡</div>
                      <p>Click 'Optimize Code' to see results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optimization Summary */}
      {hasResults &&
        !isOptimizing &&
        Object.keys(optimizationSummary).length > 0 && (
          <div className="mt-8 bg-green-500/10 border border-green-500/20 rounded-xl p-6">
            <h4 className="text-green-300 font-medium mb-4 flex items-center gap-2">
              ✨ Optimization Summary
            </h4>
            <div className="space-y-4">
              {Object.entries(optimizationSummary).map(
                ([filename, optimizations]) => (
                  <div key={filename} className="bg-white/5 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-2">{filename}</h5>
                    <ul className="space-y-1">
                      {optimizations.map((optimization, index) => (
                        <li
                          key={index}
                          className="text-green-200 text-sm flex items-center gap-2"
                        >
                          <span className="text-green-400">•</span>
                          {optimization}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

      {/* Hidden download link */}
      <a ref={downloadLinkRef} style={{ display: "none" }} />
    </div>
  );
};

export default ResultsDisplay;
