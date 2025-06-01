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
    console.log(
      `Starting optimization for ${filename || "code"}, input length: ${inputCode?.length}`,
    );

    // Simulate AI optimization - replace with actual AI service
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1500 + 800),
    );

    if (!inputCode || typeof inputCode !== "string" || !inputCode.trim()) {
      console.log("No valid code provided for optimization");
      return "// No code provided for optimization.";
    }

    try {
      // Mock optimization improvements
      let optimized = inputCode
        .replace(/var /g, "const ")
        .replace(/let /g, "const ")
        .replace(/function\s+(\w+)/g, "const $1 = ")
        .replace(/;\s*\n/g, "\n")
        .replace(/\{\s*\n\s*return/g, "{ return")
        .replace(/console\.log\([^)]*\);?\s*\n?/g, "")
        .replace(/\s+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\/\/\s*TODO.*/g, "") // Remove TODO comments
        .replace(/\s+$/gm, ""); // Remove trailing whitespace

      // Add some optimization comments
      const fileComment = filename ? `// File: ${filename}\n` : "";
      optimized = `${fileComment}// Optimized by OptimizeCode.ai\n// Improvements made:\n// ✓ Replaced var/let with const where possible\n// ✓ Modernized function syntax\n// ✓ Removed console.log statements\n// ✓ Cleaned up formatting and removed TODO comments\n// ✓ Optimized whitespace\n\n${optimized.trim()}`;

      console.log(
        `Optimization completed for ${filename || "code"}, output length: ${optimized.length}`,
      );
      return optimized;
    } catch (error) {
      console.error("Error during optimization:", error);
      return `// Error during optimization: ${error.message}\n\n${inputCode}`;
    }
  };

  const optimizeCode = async () => {
    const hasCodeInput = code && code.trim().length > 0;
    const hasFileInput = files && files.length > 0;

    console.log("Optimize button clicked", {
      hasCodeInput,
      hasFileInput,
      codeLength: code?.length,
      filesCount: files?.length,
    });

    if (!hasCodeInput && !hasFileInput) {
      alert("Please paste some code or upload files to optimize.");
      return;
    }

    setIsOptimizing(true);
    console.log("Starting optimization...");

    try {
      // Optimize pasted code
      if (hasCodeInput) {
        console.log("Optimizing pasted code:", code.substring(0, 100) + "...");
        const optimized = await simulateOptimization(code, "pasted-code");
        console.log("Pasted code optimized, result length:", optimized?.length);
        setOptimizedCode(optimized);
      }

      // Optimize uploaded files
      if (hasFileInput) {
        console.log(
          "Optimizing files:",
          files.map((f) => f.name),
        );
        const optimizedFiles = await Promise.all(
          files.map(async (file, index) => {
            console.log(
              `Optimizing file ${index + 1}/${files.length}: ${file.name}`,
            );
            const optimizedContent = await simulateOptimization(
              file.content,
              file.path,
            );
            console.log(
              `File ${file.name} optimized, result length:`,
              optimizedContent?.length,
            );
            return {
              ...file,
              optimizedContent,
            };
          }),
        );
        console.log("All files optimized:", optimizedFiles.length);
        setFiles(optimizedFiles);
      }

      console.log("Optimization completed successfully");
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
