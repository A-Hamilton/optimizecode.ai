import React, { useState, useEffect } from "react";
import { TypewriterText } from "./animations";
import { useNotificationHelpers } from "../contexts/NotificationContext";

interface DemoExample {
  id: string;
  name: string;
  language: string;
  code: string;
  optimized: string;
  improvements: string[];
  performanceGain: number;
}

const demoExamples: DemoExample[] = [
  {
    id: "js-array",
    name: "Array Processing",
    language: "javascript",
    code: `function filterActiveUsers(users) {
  var result = [];
  for (var i = 0; i < users.length; i++) {
    if (users[i].status === 'active') {
      result.push(users[i]);
    }
  }
  return result;
}`,
    optimized: `const filterActiveUsers = (users) => 
  users.filter(user => user.status === 'active');`,
    improvements: [
      "Reduced from 8 lines to 2 lines",
      "Modern ES6+ syntax",
      "Native array methods for better performance",
      "Functional programming approach",
    ],
    performanceGain: 45,
  },
  {
    id: "js-async",
    name: "Async Operations",
    language: "javascript",
    code: `function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    fetch('/api/users/' + userId)
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            resolve(data);
          });
        } else {
          reject(new Error('Failed to fetch'));
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}`,
    optimized: `const fetchUserData = async (userId) => {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};`,
    improvements: [
      "Modern async/await syntax",
      "Template literals for cleaner strings",
      "Simplified error handling",
      "Reduced complexity",
    ],
    performanceGain: 30,
  },
  {
    id: "py-list",
    name: "Python List Processing",
    language: "python",
    code: `def process_numbers(numbers):
    result = []
    for num in numbers:
        if num > 0:
            result.append(num * 2)
    return result`,
    optimized: `def process_numbers(numbers):
    return [num * 2 for num in numbers if num > 0]`,
    improvements: [
      "List comprehension for better performance",
      "More pythonic approach",
      "Reduced lines of code",
      "Improved readability",
    ],
    performanceGain: 35,
  },
];

export const InteractiveDemoWidget: React.FC = () => {
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedExample, setSelectedExample] = useState<DemoExample | null>(
    null,
  );
  const [currentStep, setCurrentStep] = useState<
    "input" | "optimizing" | "result"
  >("input");
  const [improvements, setImprovements] = useState<string[]>([]);
  const [performanceGain, setPerformanceGain] = useState(0);
  const [showTypewriter, setShowTypewriter] = useState(false);

  const { showSuccess, showInfo } = useNotificationHelpers();

  const selectExample = (example: DemoExample) => {
    setSelectedExample(example);
    setInputCode(example.code);
    setOutputCode("");
    setCurrentStep("input");
    setShowTypewriter(false);
    showInfo(`Loaded ${example.name} example`, "Example Loaded");
  };

  const optimizeCode = async () => {
    if (!inputCode.trim()) {
      showInfo("Please enter some code to optimize", "No Code Provided");
      return;
    }

    setIsOptimizing(true);
    setCurrentStep("optimizing");

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Use selected example or simulate optimization
    if (selectedExample) {
      setOutputCode(selectedExample.optimized);
      setImprovements(selectedExample.improvements);
      setPerformanceGain(selectedExample.performanceGain);
    } else {
      // Basic optimization simulation for custom code
      const optimized = inputCode
        .replace(/var /g, "const ")
        .replace(/function\s+(\w+)/g, "const $1 = ")
        .replace(/;\s*\n/g, ";\n");

      setOutputCode(optimized);
      setImprovements([
        "Updated variable declarations",
        "Modern function syntax",
        "Code structure improved",
      ]);
      setPerformanceGain(Math.floor(Math.random() * 30) + 15);
    }

    setCurrentStep("result");
    setShowTypewriter(true);
    setIsOptimizing(false);
    showSuccess("Code optimized successfully!", "Optimization Complete");
  };

  const resetDemo = () => {
    setInputCode("");
    setOutputCode("");
    setSelectedExample(null);
    setCurrentStep("input");
    setImprovements([]);
    setPerformanceGain(0);
    setShowTypewriter(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Quick Examples */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Quick Examples - Click to try:
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {demoExamples.map((example, index) => (
            <button
              key={example.id}
              onClick={() => selectExample(example)}
              className={`px-4 py-2 rounded-lg border transition-all duration-300 text-sm font-medium
                ${
                  selectedExample?.id === example.id
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:border-primary/50"
                }
                animate-fade-in-up hover:scale-105`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="mr-2">
                {example.language === "javascript" ? "🟨" : "🐍"}
              </span>
              {example.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Demo Interface */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">📝 Your Code</h3>
            {inputCode && (
              <button
                onClick={resetDemo}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="relative">
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste your code here... or select an example above"
              className="w-full h-64 p-4 bg-gray-900/50 border border-white/20 rounded-lg text-white font-mono text-sm resize-none focus:border-primary focus:outline-none transition-all duration-300"
              disabled={isOptimizing}
            />
            {currentStep === "input" && inputCode && (
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={optimizeCode}
                  disabled={isOptimizing}
                  className="bg-primary hover:bg-primary-dark px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                >
                  ✨ Optimize Code
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">⚡ Optimized Code</h3>
            {currentStep === "result" && (
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-semibold">
                  +{performanceGain}% performance
                </span>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="w-full h-64 p-4 bg-gray-900/50 border border-white/20 rounded-lg overflow-auto">
              {currentStep === "input" && (
                <div className="h-full flex items-center justify-center text-white/40">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🤖</div>
                    <p>Your optimized code will appear here</p>
                  </div>
                </div>
              )}

              {currentStep === "optimizing" && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-3 h-3 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-3 h-3 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-white/70">
                      AI is optimizing your code...
                    </p>
                    <p className="text-sm text-white/50 mt-1">
                      Analyzing patterns and applying improvements
                    </p>
                  </div>
                </div>
              )}

              {currentStep === "result" && (
                <pre className="text-white font-mono text-sm whitespace-pre-wrap">
                  {showTypewriter ? (
                    <TypewriterText
                      text={outputCode}
                      speed={15}
                      cursor={false}
                    />
                  ) : (
                    outputCode
                  )}
                </pre>
              )}
            </div>
          </div>

          {/* Improvements Panel */}
          {currentStep === "result" && improvements.length > 0 && (
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 animate-fade-in-up">
              <h4 className="text-green-300 font-semibold mb-3 flex items-center gap-2">
                🚀 Improvements Applied:
              </h4>
              <ul className="space-y-2">
                {improvements.map((improvement, index) => (
                  <li
                    key={index}
                    className="text-green-200/90 text-sm flex items-start gap-2 animate-fade-in-left"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      {currentStep === "result" && (
        <div
          className="text-center mt-12 animate-fade-in-up"
          style={{ animationDelay: "800ms" }}
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 border border-primary/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              🎉 Amazing Results! Ready for More?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              This is just a taste of what OptimizeCode.ai can do. Get unlimited
              optimizations, batch file processing, and advanced AI features
              with our full platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => (window.location.href = "/optimize")}
                className="bg-primary hover:bg-primary-dark px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
              >
                🚀 Try Full Platform
              </button>
              <button
                onClick={() => (window.location.href = "/pricing")}
                className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                💰 View Pricing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveDemoWidget;
