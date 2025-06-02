import React, { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useNotificationHelpers } from "../contexts/NotificationContext";

interface CodeExample {
  id: string;
  name: string;
  language: string;
  originalCode: string;
  optimizedCode: string;
  improvements: string[];
  performanceGain: number;
  complexity: string;
  icon: string;
}

const codeExamples: CodeExample[] = [
  {
    id: "javascript-array",
    name: "Array Processing",
    language: "javascript",
    icon: "🟨",
    complexity: "O(n²) → O(n)",
    performanceGain: 47,
    originalCode: `// Inefficient array processing
function processUsers(users) {
  var result = [];
  for (var i = 0; i < users.length; i++) {
    if (users[i].active === true) {
      var user = users[i];
      result.push({
        id: user.id,
        name: user.name,
        email: user.email
      });
    }
  }
  return result;
}`,
    optimizedCode: `// Optimized with modern ES6+ features
const processUsers = (users) =>
  users
    .filter(user => user.active)
    .map(({ id, name, email }) => ({ id, name, email }));`,
    improvements: [
      "Reduced time complexity from O(n²) to O(n)",
      "60% fewer lines of code",
      "Modern ES6+ syntax with destructuring",
      "Functional programming approach",
    ],
  },
  {
    id: "javascript-async",
    name: "Async Operations",
    language: "javascript",
    icon: "⚡",
    complexity: "Callback Hell → Promise Chain",
    performanceGain: 35,
    originalCode: `// Callback hell and poor error handling
function fetchUserData(userId, callback) {
  fetch('/api/users/' + userId)
    .then(response => {
      response.json().then(data => {
        if (data.error) {
          callback(data.error, null);
        } else {
          callback(null, data);
        }
      }).catch(err => callback(err, null));
    })
    .catch(err => callback(err, null));
}`,
    optimizedCode: `// Clean async/await with proper error handling
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    throw new Error(\`Failed to fetch user: \${error.message}\`);
  }
};`,
    improvements: [
      "Eliminated callback hell pattern",
      "Improved error handling with try/catch",
      "Modern async/await syntax",
      "Better readability and maintainability",
    ],
  },
  {
    id: "python-list",
    name: "Python List Processing",
    language: "python",
    icon: "🐍",
    complexity: "O(n²) → O(n)",
    performanceGain: 60,
    originalCode: `# Inefficient list processing with nested loops
def find_matching_pairs(list1, list2):
    matches = []
    for item1 in list1:
        for item2 in list2:
            if item1['id'] == item2['user_id']:
                matches.append({
                    'user': item1,
                    'data': item2
                })
    return matches`,
    optimizedCode: `# Optimized with dictionary lookup for O(n) complexity
def find_matching_pairs(list1, list2):
    user_dict = {item['id']: item for item in list1}
    return [
        {'user': user_dict[item['user_id']], 'data': item}
        for item in list2 
        if item['user_id'] in user_dict
    ]`,
    improvements: [
      "Reduced time complexity from O(n²) to O(n)",
      "60% performance improvement",
      "More pythonic approach with comprehensions",
      "Better memory efficiency",
    ],
  },
];

const InteractiveLiveDemo: React.FC = () => {
  const [activeExample, setActiveExample] = useState(0);
  const [isEditable, setIsEditable] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [showOptimized, setShowOptimized] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [customMode, setCustomMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState<{ [key: string]: boolean }>(
    {},
  );

  const { showSuccess, showError } = useNotificationHelpers();
  const optimizationRef = useRef<NodeJS.Timeout>();

  const currentExample = codeExamples[activeExample];
  const displayCode = customMode
    ? userCode
    : showOptimized
      ? currentExample.optimizedCode
      : currentExample.originalCode;

  // Auto-cycle through examples when not in custom mode
  useEffect(() => {
    if (!customMode && !isEditable) {
      const interval = setInterval(() => {
        setActiveExample((prev) => (prev + 1) % codeExamples.length);
        setShowOptimized(false);
        setAnimationStep(0);
      }, 12000);
      return () => clearInterval(interval);
    }
  }, [customMode, isEditable]);

  // Simulate optimization process
  useEffect(() => {
    if (animationStep === 1) {
      const timer = setTimeout(() => {
        setShowOptimized(true);
        setAnimationStep(2);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (animationStep === 2) {
      const timer = setTimeout(() => {
        setAnimationStep(0);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [animationStep]);

  // Trigger optimization animation on example change
  useEffect(() => {
    if (!customMode) {
      const timer = setTimeout(() => {
        setAnimationStep(1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeExample, customMode]);

  const handleExampleChange = (index: number) => {
    setActiveExample(index);
    setShowOptimized(false);
    setAnimationStep(0);
    setCustomMode(false);
    setIsEditable(false);
  };

  const handleOptimizeCode = async () => {
    if (!displayCode.trim()) {
      showError("Please enter some code to optimize");
      return;
    }

    setIsOptimizing(true);

    // Simulate optimization process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsOptimizing(false);
    setShowOptimized(true);
    showSuccess("Code optimized successfully!");
  };

  const handleTryYourCode = () => {
    setCustomMode(true);
    setIsEditable(true);
    setUserCode(
      '// Try your own code here!\nfunction yourFunction() {\n  // Write your code here\n  console.log("Hello, OptimizeCode.ai!");\n}',
    );
    setShowOptimized(false);
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess((prev) => ({ ...prev, [key]: true }));
      setTimeout(
        () => setCopySuccess((prev) => ({ ...prev, [key]: false })),
        2000,
      );
      showSuccess("Code copied to clipboard!");
    } catch (error) {
      showError("Failed to copy code");
    }
  };

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess("Code downloaded successfully!");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">
            Try OptimizeCode.ai{" "}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Live Demo
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            Experience the power of AI code optimization in real-time. Watch
            automatic examples transform before your eyes, or try your own code!
          </p>

          {/* Interactive Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setCustomMode(false)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                !customMode
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              🤖 Auto Examples
            </button>
            <button
              onClick={handleTryYourCode}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                customMode
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              ✏️ Try Your Code
            </button>
          </div>
        </div>

        {/* Example Tabs */}
        {!customMode && (
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
              {codeExamples.map((example, index) => (
                <button
                  key={example.id}
                  onClick={() => handleExampleChange(index)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeExample === index
                      ? "bg-primary text-white transform scale-105 shadow-lg"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="text-lg">{example.icon}</span>
                  <span>{example.name}</span>
                  {activeExample === index && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Demo Interface */}
        <div className="max-w-7xl mx-auto">
          {/* Browser-style Container */}
          <div className="bg-gray-900/90 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            {/* Browser Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-800/60 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-white/70 text-sm font-medium">
                  {customMode
                    ? "custom.js"
                    : `${currentExample.name.toLowerCase().replace(" ", "_")}.${currentExample.language === "python" ? "py" : "js"}`}
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-4">
                {!customMode && (
                  <div className="text-sm text-white/60">
                    {currentExample.complexity}
                  </div>
                )}

                {(showOptimized || customMode) && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-sm font-medium">
                    <span>⚡</span>
                    <span>
                      {customMode ? "40%" : currentExample.performanceGain}%
                      faster
                    </span>
                  </div>
                )}

                {isOptimizing && (
                  <div className="flex items-center gap-2 text-primary text-sm">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Optimizing...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Code Editor */}
            <div className="relative">
              <div
                className={`transition-all duration-500 ${isOptimizing ? "opacity-50" : "opacity-100"}`}
              >
                <Editor
                  height="400px"
                  language={customMode ? "javascript" : currentExample.language}
                  value={displayCode}
                  onChange={(value) => customMode && setUserCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    lineNumbers: "on",
                    fontSize: 14,
                    fontFamily:
                      '"Monaco", "Menlo", "Ubuntu Mono", "Consolas", monospace',
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    readOnly: !isEditable,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    renderWhitespace: "selection",
                    bracketPairColorization: { enabled: true },
                    guides: {
                      indentation: true,
                      bracketPairs: true,
                    },
                  }}
                  theme="vs-dark"
                />
              </div>

              {/* Optimization Overlay */}
              {isOptimizing && (
                <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-white font-medium mb-2">
                      AI is optimizing your code...
                    </div>
                    <div className="text-white/60 text-sm">
                      Analyzing patterns and applying improvements
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-800/40 border-t border-white/10">
              <div className="flex items-center gap-4">
                {customMode && (
                  <button
                    onClick={handleOptimizeCode}
                    disabled={isOptimizing || !userCode.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-300 hover:scale-105"
                  >
                    {isOptimizing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Optimizing...</span>
                      </>
                    ) : (
                      <>
                        <span>⚡</span>
                        <span>Optimize My Code</span>
                      </>
                    )}
                  </button>
                )}

                {!customMode && !isEditable && (
                  <button
                    onClick={() => setIsEditable(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-lg transition-all duration-300"
                  >
                    <span>✏️</span>
                    <span>Edit Code</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(displayCode, "demo")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    copySuccess.demo
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : "bg-white/10 hover:bg-white/20 text-white/80 border border-white/20"
                  }`}
                >
                  <span>{copySuccess.demo ? "✓" : "📋"}</span>
                  <span>{copySuccess.demo ? "Copied!" : "Copy"}</span>
                </button>

                <button
                  onClick={() =>
                    downloadCode(
                      displayCode,
                      `optimized_code.${currentExample.language === "python" ? "py" : "js"}`,
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 border border-white/20 rounded-lg transition-all duration-300"
                >
                  <span>💾</span>
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>

          {/* Optimization Results */}
          {showOptimized && !customMode && (
            <div className="mt-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🚀</span>
                <h3 className="text-green-300 font-semibold text-xl">
                  Optimizations Applied
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-3">
                    Performance Improvements:
                  </h4>
                  <ul className="space-y-2">
                    {currentExample.improvements.map((improvement, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-green-200/90 text-sm animate-fade-in-left"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-green-300 mb-2">
                    +{currentExample.performanceGain}%
                  </div>
                  <div className="text-green-200/80 text-sm mb-4">
                    Performance Improvement
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-2">
                      Complexity Reduction
                    </div>
                    <div className="text-lg font-medium text-white">
                      {currentExample.complexity}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 border border-primary/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Optimize Your Real Code?
              </h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Experience the full power of OptimizeCode.ai with our enhanced
                optimizer. Upload files, get detailed analysis, and optimize
                entire projects.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="/optimize-enhanced"
                  className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 text-white"
                >
                  <span>🚀</span>
                  <span>Try Full Optimizer</span>
                </a>
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 text-white"
                >
                  <span>💰</span>
                  <span>View Pricing</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveLiveDemo;
