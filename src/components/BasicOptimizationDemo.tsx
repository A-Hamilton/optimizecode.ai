import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useNotificationHelpers } from "../contexts/NotificationContext";

const BasicOptimizationDemo: React.FC = () => {
  const [showOptimized, setShowOptimized] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { showSuccess } = useNotificationHelpers();

  const originalCode = `// Inefficient nested loop - O(n²) complexity
function findMatchingPairs(list1, list2) {
  const matches = [];
  for (let i = 0; i < list1.length; i++) {
    for (let j = 0; j < list2.length; j++) {
      if (list1[i].id === list2[j].user_id) {
        matches.push({
          user: list1[i],
          data: list2[j]
        });
      }
    }
  }
  return matches;
}

// Example usage
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Bob" }
];

const userData = [
  { user_id: 1, score: 95 },
  { user_id: 2, score: 87 },
  { user_id: 3, score: 92 }
];

const result = findMatchingPairs(users, userData);`;

  const optimizedCode = `// Optimized with Map lookup - O(n) complexity
function findMatchingPairs(list1, list2) {
  const userMap = new Map(list1.map(user => [user.id, user]));
  
  return list2
    .filter(data => userMap.has(data.user_id))
    .map(data => ({
      user: userMap.get(data.user_id),
      data: data
    }));
}

// Example usage
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Bob" }
];

const userData = [
  { user_id: 1, score: 95 },
  { user_id: 2, score: 87 },
  { user_id: 3, score: 92 }
];

const result = findMatchingPairs(users, userData);`;

  const improvements = [
    "Reduced time complexity from O(n²) to O(n)",
    "60% faster execution on large datasets",
    "Better memory efficiency with Map usage",
    "Modern JavaScript functional approach",
    "Eliminated nested loop structure",
  ];

  const handleOptimize = async () => {
    setIsOptimizing(true);

    // Simulate optimization process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsOptimizing(false);
    setShowOptimized(true);
    showSuccess("Code optimized successfully!");
  };

  const displayCode = showOptimized ? optimizedCode : originalCode;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Try OptimizeCode.ai{" "}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Live Demo
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Experience the power of AI code optimization. See how we transform
            inefficient code into optimized, high-performance solutions.
          </p>
        </div>

        {/* Demo Container */}
        <div className="bg-gray-900/90 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-800/60 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-white/70 text-sm">
                {showOptimized ? "optimized" : "original"}_code.js
              </span>
            </div>

            {showOptimized && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-sm">
                <span>⚡</span>
                <span>60% faster</span>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="relative">
            <Editor
              height="400px"
              language="javascript"
              value={displayCode}
              options={{
                minimap: { enabled: false },
                lineNumbers: "on",
                fontSize: 14,
                fontFamily:
                  '"Monaco", "Menlo", "Ubuntu Mono", "Consolas", monospace',
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                readOnly: true,
                smoothScrolling: true,
                renderWhitespace: "selection",
              }}
              theme="vs-dark"
            />

            {/* Optimization Overlay */}
            {isOptimizing && (
              <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <div className="text-white font-semibold text-lg mb-2">
                    🤖 Optimizing your code...
                  </div>
                  <div className="text-white/70 text-sm">
                    Analyzing performance and applying improvements
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-center px-6 py-6 bg-gray-800/40 border-t border-white/10">
            {!showOptimized ? (
              <button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="flex items-center gap-3 px-12 py-4 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/30"
              >
                {isOptimizing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Optimizing...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Optimize Code</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setShowOptimized(false)}
                className="flex items-center gap-3 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg font-medium transition-all duration-300"
              >
                <span>👁️</span>
                <span>View Original</span>
              </button>
            )}
          </div>
        </div>

        {/* Optimization Results */}
        {showOptimized && (
          <div className="mt-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-green-300 mb-2">60%</div>
              <div className="text-green-200 text-xl">
                Performance Improvement
              </div>
              <div className="text-white/60 text-sm mt-2">
                From O(n²) to O(n) complexity
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-green-300 font-semibold text-lg mb-4 flex items-center gap-2">
                  <span>🚀</span>
                  What Got Improved:
                </h4>
                <ul className="space-y-3">
                  {improvements.map((improvement, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-green-200/90 animate-fade-in-left"
                      style={{
                        animationDelay: `${index * 150}ms`,
                        animationFillMode: "both",
                      }}
                    >
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <div className="bg-white/5 rounded-lg p-6 mb-4">
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className="text-white font-medium">Execution Time</div>
                  <div className="text-red-300 text-sm">Before: 150ms</div>
                  <div className="text-green-300 text-sm">After: 60ms</div>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <div className="text-3xl mb-2">🧠</div>
                  <div className="text-white font-medium">Memory Usage</div>
                  <div className="text-red-300 text-sm">Before: 85MB</div>
                  <div className="text-green-300 text-sm">After: 52MB</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 border border-primary/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Optimize Your Code?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Get instant AI-powered optimizations for your JavaScript, Python,
              Java, and more. Upload files or paste code directly.
            </p>
            <a
              href="/optimize-enhanced"
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 text-white"
            >
              <span>🚀</span>
              <span>Start Optimizing Now</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasicOptimizationDemo;
