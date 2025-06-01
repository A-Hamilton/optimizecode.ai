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
  const [isGeneratingZip, setIsGeneratingZip] = useState<boolean>(false);
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

  // Create a zip file with all optimized files
  const downloadAllOptimizedFilesAsZip = async (): Promise<void> => {
    const optimizedFiles = files.filter((file) => file.optimizedContent);
    if (optimizedFiles.length === 0) {
      showCopyFeedback("No optimized files to download", true);
      return;
    }

    setIsGeneratingZip(true);

    try {
      // Using JSZip for creating zip files
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Add each optimized file to the zip
      optimizedFiles.forEach((file) => {
        const optimizedFileName = getOptimizedFileName(file.name);
        zip.file(optimizedFileName, file.optimizedContent!);
      });

      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);

      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = `optimized-files-${new Date().toISOString().split("T")[0]}.zip`;
        downloadLinkRef.current.click();
        URL.revokeObjectURL(url);
      }

      showCopyFeedback(
        `Downloaded ${optimizedFiles.length} optimized files as ZIP`,
      );
    } catch (error) {
      console.error("Error creating zip file:", error);
      showCopyFeedback("Failed to create ZIP file", true);
    } finally {
      setIsGeneratingZip(false);
    }
  };

  // Generate better file names for optimized files
  const getOptimizedFileName = (originalName: string): string => {
    const lastDot = originalName.lastIndexOf(".");
    const name =
      lastDot > 0 ? originalName.substring(0, lastDot) : originalName;
    const extension = lastDot > 0 ? originalName.substring(lastDot) : "";

    return `${name}.optimized${extension}`;
  };

  // Check if a file has any optimizations
  const hasOptimizations = (filename: string): boolean => {
    const summary = optimizationSummary[filename];
    return summary && summary.length > 0;
  };

  // Check if code is actually different
  const isCodeDifferent = (original: string, optimized: string): boolean => {
    return original.trim() !== optimized.trim();
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
        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-300 font-medium ${
          isCopied
            ? "bg-green-500/20 border-green-500/30 text-green-300 border"
            : "bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white/80 hover:text-white"
        } ${className}`}
        disabled={!text || isOptimizing}
        title={`Copy ${label}`}
        type="button"
      >
        {isCopied ? (
          <>
            <span className="text-base">✅</span>
            Copied!
          </>
        ) : (
          <>
            <span className="text-base">📋</span>
            Copy {label}
          </>
        )}
      </button>
    );
  };

  const DownloadButton: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    isLoading?: boolean;
  }> = ({ onClick, children, disabled = false, isLoading = false }) => (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 rounded-lg transition-all duration-300 text-blue-300 hover:text-blue-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      title="Download optimized code"
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          Generating...
        </>
      ) : (
        children
      )}
    </button>
  );

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

  const NoOptimizationsMessage: React.FC<{ filename?: string }> = ({
    filename,
  }) => (
    <div className="p-6 text-center border border-yellow-500/30 bg-yellow-500/10 rounded-lg">
      <div className="text-3xl mb-3">⚡</div>
      <h3 className="text-yellow-300 font-medium mb-2">
        No Optimizations Needed
      </h3>
      <p className="text-yellow-200/80 text-sm">
        {filename ? `The file "${filename}"` : "Your code"} is already
        well-optimized! Our AI couldn't find any meaningful improvements to
        make.
      </p>
      <p className="text-yellow-200/60 text-xs mt-2">
        This means your code follows good practices and performance patterns.
      </p>
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
      {/* Header with better spacing */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-primary">
          Optimization Results
        </h3>

        {/* Tab Switcher */}
        {hasCodeInput && hasFileInput && (
          <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("code")}
              className={`px-6 py-2 text-sm font-medium rounded transition-all duration-300 ${
                activeTab === "code"
                  ? "bg-primary text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              Pasted Code
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`px-6 py-2 text-sm font-medium rounded transition-all duration-300 ${
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Original Code */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
              <h4 className="font-semibold text-white text-lg">
                Original Code
              </h4>
              <div className="flex gap-3">
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
              <h4 className="font-semibold text-white text-lg">
                Optimized Code
              </h4>
              <div className="flex gap-3">
                {optimizedCode && (
                  <>
                    <CopyButton
                      text={optimizedCode}
                      label="Optimized"
                      copyKey="optimized"
                    />
                    <DownloadButton
                      onClick={() =>
                        downloadFile(optimizedCode, "optimized_code.js")
                      }
                    >
                      <span className="text-base">💾</span>
                      Download
                    </DownloadButton>
                  </>
                )}
              </div>
            </div>
            <div className="p-4 max-h-96 overflow-auto">
              {isOptimizing ? (
                <LoadingSpinner />
              ) : optimizedCode ? (
                isCodeDifferent(originalCode, optimizedCode) ? (
                  <pre className="text-sm text-white/90 font-mono leading-6 whitespace-pre-wrap">
                    {optimizedCode}
                  </pre>
                ) : (
                  <NoOptimizationsMessage />
                )
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
        <div className="space-y-8">
          {/* File Selector with Download All */}
          {files.length > 0 && (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-white/70 text-sm font-semibold">
                  Select File:
                </span>
                <div className="flex gap-3 flex-wrap">
                  {files.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFileIndex(index)}
                      className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 font-medium ${
                        selectedFileIndex === index
                          ? "bg-primary text-white"
                          : "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
                      }`}
                    >
                      {file.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Download All Button with Better Spacing */}
              {files.some((f) => f.optimizedContent) && (
                <DownloadButton
                  onClick={downloadAllOptimizedFilesAsZip}
                  isLoading={isGeneratingZip}
                >
                  <span className="text-base">📦</span>
                  Download All as ZIP
                </DownloadButton>
              )}
            </div>
          )}

          {/* Selected File Display */}
          {files[selectedFileIndex] && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Original File */}
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
                  <div>
                    <h4 className="font-semibold text-white text-lg">
                      {files[selectedFileIndex].name}
                    </h4>
                    <p className="text-sm text-white/60 mt-1">
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
                  <h4 className="font-semibold text-white text-lg">
                    Optimized Version
                  </h4>
                  <div className="flex gap-3">
                    {files[selectedFileIndex].optimizedContent && (
                      <>
                        <CopyButton
                          text={files[selectedFileIndex].optimizedContent!}
                          label="Optimized"
                          copyKey={`file-optimized-${selectedFileIndex}`}
                        />
                        <DownloadButton
                          onClick={() =>
                            downloadFile(
                              files[selectedFileIndex].optimizedContent!,
                              getOptimizedFileName(
                                files[selectedFileIndex].name,
                              ),
                            )
                          }
                        >
                          <span className="text-base">💾</span>
                          Download
                        </DownloadButton>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-4 max-h-96 overflow-auto">
                  {isOptimizing ? (
                    <LoadingSpinner />
                  ) : files[selectedFileIndex].optimizedContent ? (
                    isCodeDifferent(
                      files[selectedFileIndex].content,
                      files[selectedFileIndex].optimizedContent!,
                    ) ? (
                      <pre className="text-sm text-white/90 font-mono leading-6 whitespace-pre-wrap">
                        {files[selectedFileIndex].optimizedContent}
                      </pre>
                    ) : (
                      <NoOptimizationsMessage
                        filename={files[selectedFileIndex].name}
                      />
                    )
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

      {/* Enhanced Optimization Summary */}
      {hasResults &&
        !isOptimizing &&
        Object.keys(optimizationSummary).length > 0 && (
          <div className="mt-12 bg-green-500/10 border border-green-500/20 rounded-xl p-6">
            <h4 className="text-green-300 font-semibold text-lg mb-6 flex items-center gap-2">
              ✨ Optimization Summary
            </h4>
            <div className="space-y-6">
              {Object.entries(optimizationSummary).map(
                ([filename, optimizations]) => (
                  <div key={filename} className="bg-white/5 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-white font-semibold">{filename}</h5>
                      {optimizations.length === 0 && (
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                          No changes needed
                        </span>
                      )}
                    </div>
                    {optimizations.length > 0 ? (
                      <ul className="space-y-2">
                        {optimizations.map((optimization, index) => (
                          <li
                            key={index}
                            className="text-green-200 text-sm flex items-start gap-3"
                          >
                            <span className="text-green-400 mt-1 flex-shrink-0">
                              •
                            </span>
                            <span>{optimization}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-white/70 text-sm italic">
                        This file is already well-optimized and doesn't require
                        any changes.
                      </p>
                    )}
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
