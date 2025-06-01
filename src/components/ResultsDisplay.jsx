import { useState } from "react";
import "./ResultsDisplay.css";

function ResultsDisplay({ originalCode, optimizedCode, files, isOptimizing }) {
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

  const downloadOptimizedCode = () => {
    if (activeTab === "code" && optimizedCode) {
      const blob = new Blob([optimizedCode], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "optimized-code.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (activeTab === "files" && files.length > 0) {
      // For now, download the selected file
      const selectedFile = files[selectedFileIndex];
      if (selectedFile?.optimizedContent) {
        const blob = new Blob([selectedFile.optimizedContent], {
          type: "text/plain",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `optimized-${selectedFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
          <button
            className="action-button copy-button"
            onClick={() => {
              const textToCopy =
                activeTab === "code"
                  ? optimizedCode
                  : files[selectedFileIndex]?.optimizedContent || "";
              copyToClipboard(textToCopy);
            }}
            disabled={!hasResults}
          >
            Copy
          </button>
          <button
            className="action-button download-button"
            onClick={downloadOptimizedCode}
            disabled={!hasResults}
          >
            Download
          </button>
        </div>
      </div>

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
                    {file.name}
                  </option>
                ))}
              </select>
            </div>

            {files[selectedFileIndex] && (
              <div className="code-comparison">
                <div className="code-section">
                  <h4 className="code-section-title">Original</h4>
                  <pre className="code-display original">
                    <code>{files[selectedFileIndex].content}</code>
                  </pre>
                </div>
                <div className="code-section">
                  <h4 className="code-section-title">Optimized</h4>
                  <pre className="code-display optimized">
                    <code>
                      {files[selectedFileIndex].optimizedContent ||
                        "Not yet optimized"}
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
