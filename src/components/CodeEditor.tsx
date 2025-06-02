import React, { useRef, useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useAuth } from "../contexts/AuthContext";
import { useNotificationHelpers } from "../contexts/NotificationContext";

// Monaco Editor global types
declare global {
  interface Window {
    monaco: typeof import("monaco-editor");
  }
}

// Add monaco to global scope
const monaco = (window as any).monaco;

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  language?: string;
  height?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
  showMinimap?: boolean;
  showLineNumbers?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  onLanguageChange?: (language: string) => void;
}

// Language detection patterns
const LANGUAGE_PATTERNS = {
  javascript: [
    /function\s+\w+\s*\(/,
    /const\s+\w+\s*=/,
    /let\s+\w+\s*=/,
    /var\s+\w+\s*=/,
    /=>\s*{/,
    /import\s+.*from/,
    /require\s*\(/,
    /console\.log\s*\(/,
    /document\./,
    /window\./,
  ],
  typescript: [
    /interface\s+\w+/,
    /type\s+\w+\s*=/,
    /class\s+\w+.*implements/,
    /:\s*(string|number|boolean|any)\s*[,;=]/,
    /function\s+\w+\s*\([^)]*:\s*\w+/,
    /import.*from.*['"`]/,
  ],
  python: [
    /def\s+\w+\s*\(/,
    /class\s+\w+.*:/,
    /import\s+\w+/,
    /from\s+\w+\s+import/,
    /if\s+__name__\s*==\s*['"`]__main__['"`]/,
    /print\s*\(/,
    /#.*$/m,
    /:\s*$/m,
  ],
  java: [
    /public\s+class\s+\w+/,
    /private\s+\w+\s+\w+/,
    /public\s+static\s+void\s+main/,
    /import\s+java\./,
    /System\.out\.print/,
    /\w+\[\]\s+\w+/,
    /@Override/,
  ],
  cpp: [
    /#include\s*<.*>/,
    /using\s+namespace\s+std/,
    /int\s+main\s*\(/,
    /std::/,
    /cout\s*<<|cin\s*>>/,
    /#define\s+\w+/,
    /class\s+\w+\s*{/,
  ],
  c: [
    /#include\s*<.*\.h>/,
    /int\s+main\s*\(/,
    /printf\s*\(/,
    /scanf\s*\(/,
    /#define\s+\w+/,
    /struct\s+\w+\s*{/,
  ],
  html: [
    /<html.*>/i,
    /<head.*>/i,
    /<body.*>/i,
    /<div.*>/i,
    /<script.*>/i,
    /<style.*>/i,
    /<!DOCTYPE/i,
  ],
  css: [
    /\w+\s*{[^}]*}/,
    /@media\s*\(/,
    /@import\s+/,
    /color\s*:\s*#?\w+/,
    /font-family\s*:/,
    /background\s*:/,
    /margin\s*:/,
    /padding\s*:/,
  ],
  php: [
    /<\?php/,
    /\$\w+\s*=/,
    /function\s+\w+\s*\(/,
    /class\s+\w+/,
    /echo\s+/,
    /require_once/,
    /include_once/,
  ],
  go: [
    /package\s+\w+/,
    /import\s+\(/,
    /func\s+\w+\s*\(/,
    /type\s+\w+\s+struct/,
    /fmt\.Print/,
    /var\s+\w+\s+\w+/,
  ],
  rust: [
    /fn\s+\w+\s*\(/,
    /let\s+\w+\s*=/,
    /struct\s+\w+/,
    /impl\s+\w+/,
    /use\s+\w+/,
    /println!\s*\(/,
    /match\s+\w+/,
  ],
  ruby: [
    /class\s+\w+/,
    /def\s+\w+/,
    /require\s+['"`]/,
    /puts\s+/,
    /end$/m,
    /@\w+/,
    /:\w+/,
  ],
  swift: [
    /import\s+\w+/,
    /func\s+\w+\s*\(/,
    /class\s+\w+/,
    /var\s+\w+:\s*\w+/,
    /let\s+\w+:\s*\w+/,
    /print\s*\(/,
  ],
};

const SUPPORTED_LANGUAGES = [
  { id: "javascript", name: "JavaScript", extensions: [".js", ".mjs", ".cjs"] },
  { id: "typescript", name: "TypeScript", extensions: [".ts", ".tsx"] },
  { id: "python", name: "Python", extensions: [".py", ".pyw"] },
  { id: "java", name: "Java", extensions: [".java"] },
  { id: "cpp", name: "C++", extensions: [".cpp", ".cc", ".cxx"] },
  { id: "c", name: "C", extensions: [".c", ".h"] },
  { id: "html", name: "HTML", extensions: [".html", ".htm"] },
  { id: "css", name: "CSS", extensions: [".css"] },
  { id: "scss", name: "SCSS", extensions: [".scss"] },
  { id: "json", name: "JSON", extensions: [".json"] },
  { id: "xml", name: "XML", extensions: [".xml"] },
  { id: "php", name: "PHP", extensions: [".php"] },
  { id: "go", name: "Go", extensions: [".go"] },
  { id: "rust", name: "Rust", extensions: [".rs"] },
  { id: "ruby", name: "Ruby", extensions: [".rb"] },
  { id: "swift", name: "Swift", extensions: [".swift"] },
  { id: "plaintext", name: "Plain Text", extensions: [".txt"] },
];

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  language: initialLanguage = "javascript",
  height = "400px",
  options = {},
  showMinimap = true,
  showLineNumbers = true,
  readOnly = false,
  placeholder: _placeholder = "Start typing your code here...",
  onLanguageChange,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { userProfile } = useAuth();
  const { showSuccess, showError } = useNotificationHelpers();

  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [editorOptions, setEditorOptions] =
    useState<editor.IStandaloneEditorConstructionOptions>({
      minimap: { enabled: showMinimap },
      lineNumbers: showLineNumbers ? "on" : "off",
      readOnly,
      fontSize: 14,
      fontFamily:
        '"Monaco", "Menlo", "Ubuntu Mono", "Consolas", "source-code-pro", monospace',
      wordWrap: "on",
      automaticLayout: true,
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showFunctions: true,
        showMethods: true,
        showWords: true,
      },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false,
      },
      parameterHints: {
        enabled: true,
      },
      hover: {
        enabled: true,
      },
      lightbulb: {
        enabled: "on" as any,
      },
      folding: true,
      foldingStrategy: "indentation",
      showFoldingControls: "always",
      bracketPairColorization: {
        enabled: true,
      },
      guides: {
        indentation: true,
        bracketPairs: true,
      },
      renderWhitespace: "selection",
      rulers: [80, 120],
      ...options,
    });

  // Auto-detect language based on code content
  const detectLanguage = useCallback((codeContent: string): string => {
    if (!codeContent.trim()) return "plaintext";

    let maxScore = 0;
    let detectedLanguage = "plaintext";

    Object.entries(LANGUAGE_PATTERNS).forEach(([lang, patterns]) => {
      let score = 0;
      patterns.forEach((pattern) => {
        if (pattern.test(codeContent)) {
          score++;
        }
      });

      if (score > maxScore) {
        maxScore = score;
        detectedLanguage = lang;
      }
    });

    return maxScore > 0 ? detectedLanguage : "plaintext";
  }, []);

  // Handle language detection
  useEffect(() => {
    if (code && code.trim() && !isAutoDetecting) {
      setIsAutoDetecting(true);

      // Debounce language detection
      const timeoutId = setTimeout(() => {
        const detected = detectLanguage(code);
        if (detected !== currentLanguage && detected !== "plaintext") {
          setCurrentLanguage(detected);
          onLanguageChange?.(detected);
          showSuccess(
            `Auto-detected language: ${SUPPORTED_LANGUAGES.find((l) => l.id === detected)?.name || detected}`,
          );
        }
        setIsAutoDetecting(false);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [
    code,
    detectLanguage,
    currentLanguage,
    onLanguageChange,
    showSuccess,
    isAutoDetecting,
  ]);

  // Update editor options when props change
  useEffect(() => {
    setEditorOptions((prev) => ({
      ...prev,
      minimap: { enabled: showMinimap },
      lineNumbers: showLineNumbers ? "on" : "off",
      readOnly,
      ...options,
    }));
  }, [showMinimap, showLineNumbers, readOnly, options]);

  // Handle editor mount
  const handleEditorDidMount = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor) => {
      editorRef.current = editorInstance;

      // Add keyboard shortcuts
      editorInstance.addCommand(
        // Ctrl/Cmd + S to format
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        () => {
          editorInstance.getAction("editor.action.formatDocument")?.run();
          showSuccess("Code formatted successfully!");
        },
      );

      // Add context menu actions
      editorInstance.addAction({
        id: "optimize-code",
        label: "Optimize Code",
        contextMenuGroupId: "modification",
        run: () => {
          const selection = editorInstance.getSelection();
          const selectedText = selection
            ? editorInstance.getModel()?.getValueInRange(selection)
            : "";
          showSuccess(
            `Optimization requested for ${selectedText ? "selected code" : "entire code"}`,
          );
        },
      });

      // Auto-focus editor
      editorInstance.focus();
    },
    [showSuccess],
  );

  // Handle code changes
  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      const newCode = value || "";
      onCodeChange(newCode);

      // Check character limits
      const characterLimit = userProfile?.limits?.maxPasteCharacters ?? 10000;
      if (characterLimit !== -1 && newCode.length > characterLimit) {
        showError(
          `Character limit exceeded! Maximum ${characterLimit.toLocaleString()} characters allowed.`,
          "Character Limit",
        );
      }
    },
    [onCodeChange, userProfile, showError],
  );

  // Language change handler
  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
    showSuccess(
      `Language changed to ${SUPPORTED_LANGUAGES.find((l) => l.id === newLanguage)?.name || newLanguage}`,
    );
  };

  // Format code
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run();
      showSuccess("Code formatted successfully!");
    }
  };

  // Insert example code
  const insertExample = (exampleCode: string) => {
    if (editorRef.current && !code.trim()) {
      onCodeChange(exampleCode);
      setCurrentLanguage(detectLanguage(exampleCode));
      showSuccess("Example code loaded!");
    }
  };

  // Get stats
  const getCodeStats = () => {
    const lines = code.split("\n").length;
    const words = code.split(/\s+/).filter((word) => word.length > 0).length;
    const characters = code.length;

    return { lines, words, characters };
  };

  const stats = getCodeStats();
  const characterLimit = userProfile?.limits?.maxPasteCharacters ?? 10000;
  const isNearLimit =
    characterLimit !== -1 && stats.characters > characterLimit * 0.8;
  const isOverLimit =
    characterLimit !== -1 && stats.characters > characterLimit;

  return (
    <div className="code-editor-container w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-primary">Code Editor</h3>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="language-select" className="text-sm text-white/70">
              Language:
            </label>
            <select
              id="language-select"
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm text-white focus:border-primary focus:outline-none"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option
                  key={lang.id}
                  value={lang.id}
                  className="bg-gray-800 text-white"
                >
                  {lang.name}
                </option>
              ))}
            </select>

            {isAutoDetecting && (
              <div className="flex items-center gap-1 text-xs text-primary">
                <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Detecting...
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={formatCode}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded text-sm text-white/80 hover:text-white transition-all duration-300"
            title="Format code (Ctrl/Cmd + S)"
          >
            🎨 Format
          </button>

          {!code.trim() && (
            <div className="relative group">
              <button className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 rounded text-sm text-blue-300 hover:text-blue-200 transition-all duration-300">
                📝 Examples
              </button>

              {/* Example Dropdown */}
              <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 min-w-48">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() =>
                      insertExample(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`)
                    }
                    className="w-full text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded"
                  >
                    JavaScript - Fibonacci
                  </button>
                  <button
                    onClick={() =>
                      insertExample(`def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))`)
                    }
                    className="w-full text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded"
                  >
                    Python - Quick Sort
                  </button>
                  <button
                    onClick={() =>
                      insertExample(`#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {64, 34, 25, 12, 22, 11, 90};

    // Bubble sort
    for (size_t i = 0; i < numbers.size() - 1; i++) {
        for (size_t j = 0; j < numbers.size() - i - 1; j++) {
            if (numbers[j] > numbers[j + 1]) {
                std::swap(numbers[j], numbers[j + 1]);
            }
        }
    }

    for (int num : numbers) {
        std::cout << num << " ";
    }

    return 0;
}`)
                    }
                    className="w-full text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded"
                  >
                    C++ - Bubble Sort
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div
        className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
          isOverLimit
            ? "border-red-500 shadow-lg shadow-red-500/20"
            : isNearLimit
              ? "border-yellow-500 shadow-lg shadow-yellow-500/20"
              : "border-white/10 hover:border-white/20 focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/20"
        }`}
      >
        <Editor
          height={height}
          language={currentLanguage}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={editorOptions}
          theme="vs-dark"
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white/70">Loading editor...</span>
              </div>
            </div>
          }
        />
      </div>

      {/* Footer Stats */}
      <div className="flex justify-between items-center mt-3 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
        <div className="flex items-center gap-6 text-xs text-white/60">
          <span className="flex items-center gap-1">
            📄 {stats.lines} lines
          </span>
          <span className="flex items-center gap-1">
            💬 {stats.words} words
          </span>
          <span
            className={`flex items-center gap-1 ${
              isOverLimit
                ? "text-red-400"
                : isNearLimit
                  ? "text-yellow-400"
                  : ""
            }`}
          >
            📝 {stats.characters.toLocaleString()} characters
            {characterLimit !== -1 && (
              <span className="ml-1 opacity-75">
                / {characterLimit.toLocaleString()}
              </span>
            )}
          </span>
        </div>

        {/* Advanced Options */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs text-white/60 cursor-pointer">
            <input
              type="checkbox"
              checked={showMinimap}
              onChange={(e) =>
                setEditorOptions((prev) => ({
                  ...prev,
                  minimap: { enabled: e.target.checked },
                }))
              }
              className="w-3 h-3"
            />
            Minimap
          </label>

          <label className="flex items-center gap-1 text-xs text-white/60 cursor-pointer">
            <input
              type="checkbox"
              checked={showLineNumbers}
              onChange={(e) =>
                setEditorOptions((prev) => ({
                  ...prev,
                  lineNumbers: e.target.checked ? "on" : "off",
                }))
              }
              className="w-3 h-3"
            />
            Line numbers
          </label>
        </div>
      </div>

      {/* Limit Warning */}
      {isNearLimit && (
        <div
          className={`mt-3 p-3 rounded-lg border text-sm ${
            isOverLimit
              ? "bg-red-500/10 border-red-500/30 text-red-300"
              : "bg-yellow-500/10 border-yellow-500/30 text-yellow-300"
          }`}
        >
          {isOverLimit ? (
            <>
              ⚠️ Character limit exceeded! Please upgrade your plan or reduce
              the code size.
            </>
          ) : (
            <>
              📊 Approaching character limit. Consider upgrading your plan for
              unlimited characters.
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
