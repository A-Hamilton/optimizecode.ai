import { useState } from "react";
import "./ResultsDisplay.css";

function ResultsDisplay({
  originalCode,
  optimizedCode,
  files,
  isOptimizing,
  optimizationSummary,
}) {
  const [activeTab, setActiveTab] = useState("code");
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const downloadFile = (content, filename) => {
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

  const downloadAllAsZip = async () => {
    try {
      // Import JSZip dynamically
      const JSZip = await import("jszip");
      const zip = new JSZip.default();

      // Add pasted code if exists
      if (optimizedCode) {
        zip.file("optimized-pasted-code.js", optimizedCode);
      }

      // Add all optimized files
      files.forEach((file) => {
        if (file.optimizedContent) {
          const filename = `optimized-${file.name}`;
          zip.file(filename, file.optimizedContent);
        }
      });

      // Generate and download zip
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "optimized-code-files.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating zip:", error);
      alert("Error creating zip file. Downloading individual files instead.");

      // Fallback: download files individually
      if (optimizedCode) {
        downloadFile(optimizedCode, "optimized-pasted-code.js");
      }
      files.forEach((file) => {
        if (file.optimizedContent) {
          downloadFile(file.optimizedContent, `optimized-${file.name}`);
        }
      });
    }
  };

  const downloadOptimizedCode = () => {
    if (activeTab === "code" && optimizedCode) {
      downloadFile(optimizedCode, "optimized-code.js");
    } else if (activeTab === "files" && files.length > 0) {
      const selectedFile = files[selectedFileIndex];
      if (selectedFile?.optimizedContent) {
        downloadFile(
          selectedFile.optimizedContent,
          `optimized-${selectedFile.name}`,
        );
      }
    }
  };

  const hasResults = optimizedCode || files.some((f) => f.optimizedContent);

  if (isOptimizing) {
    return (
      <div className="results-container">
        <div className="optimizing-state">
          <div className="loading-spinner"></div>
          <h3>Optimizing your code...</h3>
          <p>
            Our AI is analyzing and improving your code. This may take a few
            moments.
          </p>
        </div>
      </div>
    );
  }

  if (!hasResults) {
    return (
      <div className="results-container">
        <div className="no-results">
          <div className="no-results-icon">⚡</div>
          <h3>Ready to optimize</h3>
          <p>
            Paste your code or upload files, then click "Optimize Code" to see
            the magic happen!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h3 className="section-title">Optimized Results</h3>
        <div className="results-actions">
          {(files.some((f) => f.optimizedContent) || optimizedCode) && (
            <button
              className="action-button download-all-button"
              onClick={downloadAllAsZip}
            >
              Download All (.zip)
            </button>
          )}
        </div>
      </div>

      {/* Optimization Summary */}
      {optimizationSummary && Object.keys(optimizationSummary).length > 0 && (
        <div className="optimization-summary">
          <h4 className="summary-title">⚡ Optimizations Applied</h4>
          <div className="summary-content">
            {Object.entries(optimizationSummary).map(
              ([filename, optimizations]) => (
                <div key={filename} className="file-summary">
                  <div className="file-summary-header">
                    <span className="file-summary-name">
                      {filename === "pasted-code"
                        ? "📄 Pasted Code"
                        : `📁 ${filename}`}
                    </span>
                    <span className="optimizations-count">
                      {optimizations.length} improvements
                    </span>
                  </div>
                  <div className="optimizations-grid">
                    {optimizations.map((opt, index) => (
                      <div key={index} className="optimization-tag">
                        ✓ {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      <div className="results-tabs">
        {optimizedCode && (
          <button
            className={`tab-button ${activeTab === "code" ? "active" : ""}`}
            onClick={() => setActiveTab("code")}
          >
            Pasted Code
          </button>
        )}
        {files.length > 0 && (
          <button
            className={`tab-button ${activeTab === "files" ? "active" : ""}`}
            onClick={() => setActiveTab("files")}
          >
            Files ({files.length})
          </button>
        )}
      </div>

      <div className="results-content">
        {activeTab === "code" && optimizedCode && (
          <div className="code-result">
            <div className="code-comparison">
              <div className="code-section">
                <h4 className="code-section-title">Original</h4>
                <pre className="code-display original">
                  <code>{originalCode}</code>
                </pre>
              </div>
              <div className="code-section">
                <h4 className="code-section-title">Optimized</h4>
                <pre className="code-display optimized">
                  <code>{optimizedCode}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === "files" && files.length > 0 && (
          <div className="files-result">
            <div className="file-selector">
              <select
                value={selectedFileIndex}
                onChange={(e) => setSelectedFileIndex(parseInt(e.target.value))}
                className="file-select"
              >
                {files.map((file, index) => (
                  <option key={index} value={index}>
                    {file.path || file.name}{" "}
                    {file.optimizedContent ? "✓" : "⏳"}
                  </option>
                ))}
              </select>

              {files[selectedFileIndex]?.optimizedContent && (
                <div className="file-actions">
                  <button
                    className="file-action-button"
                    onClick={() =>
                      copyToClipboard(files[selectedFileIndex].optimizedContent)
                    }
                    title="Copy this file's optimized code"
                  >
                    Copy
                  </button>
                  <button
                    className="file-action-button"
                    onClick={() =>
                      downloadFile(
                        files[selectedFileIndex].optimizedContent,
                        `optimized-${files[selectedFileIndex].name}`,
                      )
                    }
                    title="Download this file"
                  >
                    Download
                  </button>
                </div>
              )}
            </div>

            {files[selectedFileIndex] && (
              <div className="code-comparison">
                <div className="code-section">
                  <h4 className="code-section-title">
                    Original - {files[selectedFileIndex].name}
                  </h4>
                  <pre className="code-display original">
                    <code>{files[selectedFileIndex].content}</code>
                  </pre>
                </div>
                <div className="code-section">
                  <h4 className="code-section-title">
                    Optimized - {files[selectedFileIndex].name}
                    {files[selectedFileIndex].optimizedContent && (
                      <span className="optimization-status"> ✓ Optimized</span>
                    )}
                  </h4>
                  <pre className="code-display optimized">
                    <code>
                      {files[selectedFileIndex].optimizedContent ||
                        "Processing optimization..."}
                    </code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsDisplay;
