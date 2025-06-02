import React, { useState, useEffect } from "react";
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
}

const codeExamples: CodeExample[] = [
  {
    id: "javascript-array",
    name: "Array Processing",
    language: "javascript",
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
}

// Usage
const users = [
  { id: 1, name: "John", email: "john@example.com", active: true },
  { id: 2, name: "Jane", email: "jane@example.com", active: false },
  { id: 3, name: "Bob", email: "bob@example.com", active: true }
];

const activeUsers = processUsers(users);`,
    optimizedCode: `// Optimized with modern ES6+ features
const processUsers = (users) =>
  users
    .filter(user => user.active)
    .map(({ id, name, email }) => ({ id, name, email }));

// Usage  
const users = [
  { id: 1, name: "John", email: "john@example.com", active: true },
  { id: 2, name: "Jane", email: "jane@example.com", active: false },
  { id: 3, name: "Bob", email: "bob@example.com", active: true }
];

const activeUsers = processUsers(users);`,
    improvements: [
      "Reduced time complexity from O(n²) to O(n)",
      "Decreased code from 15 lines to 4 lines (73% reduction)",
      "Modern ES6+ syntax with destructuring",
      "Functional programming approach",
      "Better readability and maintainability",
    ],
  },
  {
    id: "python-list",
    name: "Python List Processing",
    language: "python",
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
    return matches

# Usage
users = [{'id': 1, 'name': 'John'}, {'id': 2, 'name': 'Jane'}]
data = [{'user_id': 1, 'score': 95}, {'user_id': 2, 'score': 87}]
result = find_matching_pairs(users, data)`,
    optimizedCode: `# Optimized with dictionary lookup for O(n) complexity
def find_matching_pairs(list1, list2):
    user_dict = {item['id']: item for item in list1}
    return [
        {'user': user_dict[item['user_id']], 'data': item}
        for item in list2 
        if item['user_id'] in user_dict
    ]

# Usage
users = [{'id': 1, 'name': 'John'}, {'id': 2, 'name': 'Jane'}]
data = [{'user_id': 1, 'score': 95}, {'user_id': 2, 'score': 87}]
result = find_matching_pairs(users, data)`,
    improvements: [
      "Reduced time complexity from O(n²) to O(n)",
      "60% performance improvement on large datasets",
      "More pythonic approach with list comprehensions",
      "Better memory efficiency",
      "Eliminated nested loop structure",
    ],
  },
  {
    id: "javascript-async",
    name: "Async Operations",
    language: "javascript",
    complexity: "Callback Hell → Clean Async",
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
}

// Usage
fetchUserData(123, function(error, user) {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('User:', user);
  }
});`,
    optimizedCode: `// Clean async/await with proper error handling
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    throw new Error(\`Failed to fetch user: \${error.message}\`);
  }
};

// Usage
try {
  const user = await fetchUserData(123);
  console.log('User:', user);
} catch (error) {
  console.error('Error:', error.message);
}`,
    improvements: [
      "Eliminated callback hell pattern",
      "Improved error handling with try/catch",
      "Modern async/await syntax",
      "Better readability and maintainability",
      "Consistent error handling throughout",
    ],
  },
];

const SimpleOptimizationDemo: React.FC = () => {
  const [activeExample, setActiveExample] = useState(0);
  const [showOptimized, setShowOptimized] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  const { showSuccess } = useNotificationHelpers();

  const currentExample = codeExamples[activeExample];
  const displayCode = showOptimized
    ? currentExample.optimizedCode
    : currentExample.originalCode;

  // Auto-cycle through examples
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExample((prev) => (prev + 1) % codeExamples.length);
      setShowOptimized(false);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulate optimization process
    const steps = [
      { progress: 20, delay: 500 },
      { progress: 45, delay: 800 },
      { progress: 70, delay: 600 },
      { progress: 90, delay: 400 },
      { progress: 100, delay: 300 },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      setOptimizationProgress(step.progress);
    }

    setIsOptimizing(false);
    setShowOptimized(true);
    showSuccess("Code optimized successfully!");
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess("Code copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">
            Try OptimizeCode.ai{" "}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Live Demo
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Experience the power of AI code optimization in real-time. Watch
            automatic examples transform before your eyes, or try your own code
            with our interactive editor!
          </p>
        </div>

        {/* Example Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
            {codeExamples.map((example, index) => (
              <button
                key={example.id}
                onClick={() => {
                  setActiveExample(index);
                  setShowOptimized(false);
                }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeExample === index
                    ? "bg-primary text-white shadow-lg"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {example.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Demo Container */}
        <div className="bg-gray-900/90 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-800/60 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-white/70 text-sm font-medium">
                {showOptimized ? "optimized" : "original"}.
                {currentExample.language === "python" ? "py" : "js"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-white/60">
                {currentExample.complexity}
              </span>
              {showOptimized && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-sm">
                  <span>⚡</span>
                  <span>{currentExample.performanceGain}% faster</span>
                </div>
              )}
            </div>
          </div>

          {/* Code Editor */}
          <div className="relative">
            <Editor
              height="400px"
              language={currentExample.language}
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
                bracketPairColorization: { enabled: true },
              }}
              theme="vs-dark"
            />

            {/* Optimization Overlay */}
            {isOptimizing && (
              <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="w-16 h-16 border-4 border-primary/30 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>

                  <div className="text-white font-semibold text-lg mb-2">
                    🤖 AI is optimizing your code...
                  </div>

                  <div className="w-64 bg-white/10 rounded-full h-2 mb-4">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${optimizationProgress}%` }}
                    ></div>
                  </div>

                  <div className="text-white/70 text-sm">
                    {optimizationProgress < 30 &&
                      "🔍 Analyzing code structure..."}
                    {optimizationProgress >= 30 &&
                      optimizationProgress < 60 &&
                      "⚡ Applying optimizations..."}
                    {optimizationProgress >= 60 &&
                      optimizationProgress < 90 &&
                      "🎨 Improving syntax..."}
                    {optimizationProgress >= 90 && "✨ Finalizing..."}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-800/40 border-t border-white/10">
            <div className="flex items-center gap-4">
              <button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="flex items-center gap-3 px-8 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/30"
              >
                {isOptimizing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Optimizing...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Optimize Code</span>
                  </>
                )}
              </button>

              <div className="text-sm text-white/60">
                {displayCode.split("\n").length} lines • {displayCode.length}{" "}
                characters
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(displayCode)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 border border-white/20 rounded-lg transition-all duration-300"
              >
                <span>📋</span>
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Optimization Results */}
        {showOptimized && (
          <div className="mt-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🚀</span>
              <h3 className="text-green-300 font-semibold text-xl">
                Optimizations Applied
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Improvements List */}
              <div className="md:col-span-2">
                <h4 className="text-white font-medium mb-3">
                  Performance Improvements:
                </h4>
                <ul className="space-y-2">
                  {currentExample.improvements.map((improvement, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-green-200/90 text-sm animate-fade-in-left"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: "both",
                      }}
                    >
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Performance Stats */}
              <div className="text-center">
                <div className="text-4xl font-bold text-green-300 mb-2">
                  +{currentExample.performanceGain}%
                </div>
                <div className="text-green-200/80 text-sm mb-4">
                  Performance Improvement
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/70 text-sm mb-2">Complexity</div>
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
              Ready to Optimize Your Code?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Try our full-featured optimizer with file uploads, advanced
              settings, and comprehensive analysis.
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
    </section>
  );
};

export default SimpleOptimizationDemo;
