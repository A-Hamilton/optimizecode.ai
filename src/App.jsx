import { useState } from "react";
import CodeInput from "./components/CodeInput";
import FileDropZone from "./components/FileDropZone";
import ResultsDisplay from "./components/ResultsDisplay";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [files, setFiles] = useState([]);
  const [optimizedCode, setOptimizedCode] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);

  const simulateOptimization = async (inputCode, filename = "") => {
    // Simulate AI optimization - replace with actual AI service
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 1000),
    );

    if (!inputCode || !inputCode.trim()) {
      return "No code provided for optimization.";
    }

    // Mock optimization improvements
    let optimized = inputCode
      .replace(/var /g, "const ")
      .replace(/function\s+(\w+)/g, "const $1 = ")
      .replace(/;\s*\n/g, "\n")
      .replace(/\{\s*\n\s*return/g, "{ return")
      .replace(/console\.log\([^)]*\);?\s*\n?/g, "")
      .replace(/\s+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n");

    // Add some optimization comments
    const fileComment = filename ? `// File: ${filename}\n` : "";
    optimized = `${fileComment}// Optimized by OptimizeCode.ai\n// - Replaced var with const\n// - Modernized function syntax\n// - Removed console.log statements\n// - Cleaned up formatting\n\n${optimized.trim()}`;

    return optimized;
  };

  const optimizeCode = async () => {
    const hasCodeInput = code && code.trim();
    const hasFileInput = files && files.length > 0;

    if (!hasCodeInput && !hasFileInput) {
      alert("Please paste some code or upload files to optimize.");
      return;
    }

    setIsOptimizing(true);

    try {
      // Optimize pasted code
      if (hasCodeInput) {
        console.log("Optimizing pasted code:", code.substring(0, 100) + "...");
        const optimized = await simulateOptimization(code, "pasted-code");
        setOptimizedCode(optimized);
      }

      // Optimize uploaded files
      if (hasFileInput) {
        console.log(
          "Optimizing files:",
          files.map((f) => f.name),
        );
        const optimizedFiles = await Promise.all(
          files.map(async (file) => {
            const optimizedContent = await simulateOptimization(
              file.content,
              file.path,
            );
            return {
              ...file,
              optimizedContent,
            };
          }),
        );
        setFiles(optimizedFiles);
      }
    } catch (error) {
      console.error("Optimization failed:", error);
      alert("Optimization failed. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const resetAll = () => {
    setCode("");
    setFiles([]);
    setOptimizedCode("");
    setIsOptimizing(false);
  };

  const hasInput =
    (code && code.trim().length > 0) || (files && files.length > 0);

  // Debug logging
  console.log("App state:", {
    codeLength: code?.length || 0,
    filesCount: files?.length || 0,
    hasInput,
    isOptimizing,
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">OptimizeCode.ai</h1>
        <p className="app-subtitle">
          AI-powered code optimization for better performance, readability, and
          maintainability
        </p>
      </header>

      <main className="app-main">
        <div className="input-section">
          <CodeInput code={code} onCodeChange={setCode} />

          <div className="section-divider">
            <span>OR</span>
          </div>

          <FileDropZone files={files} onFilesSelected={setFiles} />

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
        />
      </main>

      <footer className="app-footer">
        <p>
          Powered by advanced AI algorithms to make your code cleaner, faster,
          and more maintainable.
        </p>
      </footer>
    </div>
  );
}

export default App;
