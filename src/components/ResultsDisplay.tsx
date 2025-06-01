import React, { useState } from "react";
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

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        showCopyFeedback("Copied to clipboard!");
        return;
      }
    } catch (err) {
      console.warn("Clipboard API failed, trying fallback method:", err);
    }

    // Fallback method for when Clipboard API is blocked
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
        showCopyFeedback("Copied to clipboard!");
      } else {
        showCopyFeedback("Copy failed - please copy manually", true);
      }
    } catch (fallbackErr) {
      console.error("All copy methods failed:", fallbackErr);
      showCopyFeedback("Copy not supported - please copy manually", true);
    }
  };

  const showCopyFeedback = (
    message: string,
    isError: boolean = false,
  ): void => {
    // Create a temporary notification
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

    // Remove notification after 3 seconds
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

  const downloadFile = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllAsZip = async (): Promise<void> => {
    try {
      // Import JSZip dynamically
      const JSZip = await import("jszip");
      const zip = new JSZip.default();

      if (files.length > 0) {
        // Add all optimized files
        files.forEach((file) => {
          const content = file.optimizedContent || file.content;
          zip.file(file.path, content);
        });
      } else {
        // Add single optimized file
        zip.file("optimized-code.txt", optimizedCode);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "optimized-code.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showCopyFeedback("ZIP file downloaded!");
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      showCopyFeedback("Error creating ZIP file", true);
    }
  };

  const currentCode =
    originalCode || (files.length > 0 ? files[selectedFileIndex]?.content : "");
  const currentOptimized =
    optimizedCode ||
    (files.length > 0 ? files[selectedFileIndex]?.optimizedContent : "");
  const currentFile = files.length > 0 ? files[selectedFileIndex] : null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <div className="border-b border-white/10">
        <div className="flex">
          <button
            className={`px-6 py-3 font-medium transition-all duration-300 ${
              activeTab === "code"
                ? "bg-primary text-white border-b-2 border-primary"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
            onClick={() => setActiveTab("code")}
            type="button"
          >
            Pasted Code
          </button>
          {files.length > 0 && (
            <button
              className={`px-6 py-3 font-medium transition-all duration-300 ${
                activeTab === "files"
                  ? "bg-primary text-white border-b-2 border-primary"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setActiveTab("files")}
              type="button"
            >
              Files ({files.length})
            </button>
          )}
        </div>
      </div>

      {activeTab === "files" && files.length > 0 && (
        <div className="p-4 border-b border-white/10">
          <select
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-primary focus:outline-none"
            value={selectedFileIndex}
            onChange={(e) => setSelectedFileIndex(parseInt(e.target.value))}
          >
            {files.map((file, index) => (
              <option key={index} value={index} className="bg-gray-800">
                {file.path} ({(file.size / 1024).toFixed(1)} KB)
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid md:grid-cols-2 divide-x divide-white/10">
        <div className="flex flex-col">
          <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-semibold text-white">Original Code</h3>
            {currentCode && (
              <button
                className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded transition-all duration-300"
                onClick={() => copyToClipboard(currentCode)}
                type="button"
              >
                Copy
              </button>
            )}
          </div>
          <div className="flex-1 min-h-[400px]">
            <pre className="h-full p-4 bg-gray-900/50 text-sm text-white/90 font-mono leading-6 overflow-auto whitespace-pre-wrap">
              {currentCode || "No code to display"}
            </pre>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-semibold text-white">Optimized Code</h3>
            <div className="flex gap-2">
              {currentOptimized && (
                <>
                  <button
                    className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded transition-all duration-300"
                    onClick={() => copyToClipboard(currentOptimized)}
                    type="button"
                  >
                    Copy
                  </button>
                  <button
                    className="text-xs px-3 py-1 bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 rounded transition-all duration-300"
                    onClick={() =>
                      downloadFile(
                        currentOptimized,
                        currentFile
                          ? `optimized-${currentFile.name}`
                          : "optimized-code.txt",
                      )
                    }
                    type="button"
                  >
                    Download
                  </button>
                </>
              )}
              {(files.length > 0 || currentOptimized) && (
                <button
                  className="text-xs px-3 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-500/50 rounded transition-all duration-300"
                  onClick={downloadAllAsZip}
                  type="button"
                >
                  ZIP All
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 min-h-[400px] relative">
            {isOptimizing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white/70">Optimizing code...</p>
                </div>
              </div>
            ) : (
              <pre className="h-full p-4 bg-gray-900/50 text-sm text-white/90 font-mono leading-6 overflow-auto whitespace-pre-wrap">
                {currentOptimized || "Click 'Optimize Code' to see results"}
              </pre>
            )}
          </div>
        </div>
      </div>

      {Object.keys(optimizationSummary).length > 0 && (
        <div className="p-4 border-t border-white/10 bg-white/5">
          <h4 className="font-semibold text-primary mb-3">
            Optimization Summary
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {Object.entries(optimizationSummary).map(
              ([filename, suggestions]) => (
                <div key={filename} className="text-sm">
                  <span className="font-medium text-white/90">{filename}:</span>
                  <ul className="mt-1 ml-4 text-white/70">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="list-disc">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
