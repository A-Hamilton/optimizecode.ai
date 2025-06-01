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

  const simulateOptimization = async (inputCode) => {
    // Simulate AI optimization - replace with actual AI service
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock optimization improvements
    let optimized = inputCode
      .replace(/var /g, "const ")
      .replace(/function\s+(\w+)/g, "const $1 = ")
      .replace(/;\s*\n/g, "\n")
      .replace(/\{\s*\n\s*return/g, "{ return")
      .replace(/console\.log\([^)]*\);?\s*\n?/g, "");

    // Add some optimization comments
    optimized = `// Optimized by OptimizeCode.ai\n// - Replaced var with const\n// - Modernized function syntax\n// - Removed console.log statements\n// - Cleaned up formatting\n\n${optimized}`;

    return optimized;
  };

  const optimizeCode = async () => {
    if (!code.trim() && files.length === 0) {
      alert("Please paste some code or upload files to optimize.");
      return;
    }

    setIsOptimizing(true);

    try {
      // Optimize pasted code
      if (code.trim()) {
        const optimized = await simulateOptimization(code);
        setOptimizedCode(optimized);
      }

      // Optimize uploaded files
      if (files.length > 0) {
        const optimizedFiles = await Promise.all(
          files.map(async (file) => ({
            ...file,
            optimizedContent: await simulateOptimization(file.content),
          })),
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

  const hasInput = code.trim() || files.length > 0;

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
