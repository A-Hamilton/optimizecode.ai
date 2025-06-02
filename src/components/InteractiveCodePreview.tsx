import React, { useState, useEffect } from "react";
import { TypewriterText } from "./animations";
import { useConditionalAnimation } from "../hooks/useReducedMotion";

interface CodeExample {
  id: string;
  title: string;
  language: string;
  original: string;
  optimized: string;
  improvements: string[];
  performanceGain: string;
}

const codeExamples: CodeExample[] = [
  {
    id: "javascript",
    title: "JavaScript Optimization",
    language: "javascript",
    original: `// Inefficient array processing
function processUsers(users) {
  var result = [];
  for (var i = 0; i < users.length; i++) {
    if (users[i].active == true) {
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
    optimized: `// Optimized with modern JavaScript
const processUsers = (users) => {
  return users
    .filter(user => user.active)
    .map(({ id, name, email }) => ({
      id,
      name,
      email
    }));
};`,
    improvements: [
      "Reduced from 12 lines to 7 lines",
      "Modern ES6+ syntax",
      "Functional programming approach",
      "Better performance with native methods",
    ],
    performanceGain: "47%",
  },
  {
    id: "python",
    title: "Python Optimization",
    language: "python",
    original: `# Inefficient list processing
def filter_data(data):
    result = []
    for item in data:
        if item['status'] == 'active':
            processed = {}
            processed['id'] = item['id']
            processed['value'] = item['value'] * 2
            result.append(processed)
    return result`,
    optimized: `# Optimized with list comprehension
def filter_data(data):
    return [
        {'id': item['id'], 'value': item['value'] * 2}
        for item in data
        if item['status'] == 'active'
    ]`,
    improvements: [
      "List comprehension for better performance",
      "Reduced lines of code by 60%",
      "More pythonic approach",
      "Improved memory efficiency",
    ],
    performanceGain: "35%",
  },
  {
    id: "react",
    title: "React Component",
    language: "jsx",
    original: `// Inefficient React component
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { users: [] };
  }
  
  componentDidMount() {
    this.fetchUsers();
  }
  
  fetchUsers() {
    fetch('/api/users').then(response => {
      response.json().then(data => {
        this.setState({ users: data });
      });
    });
  }
  
  render() {
    return (
      <div>
        {this.state.users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }
}`,
    optimized: `// Optimized with hooks and async/await
const UserList = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    
    fetchUsers();
  }, []);
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};`,
    improvements: [
      "Modern React hooks",
      "Better error handling",
      "Cleaner async/await syntax",
      "Functional component approach",
    ],
    performanceGain: "23%",
  },
];

interface InteractiveCodePreviewProps {
  className?: string;
}

export const InteractiveCodePreview: React.FC<InteractiveCodePreviewProps> = ({
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<"original" | "optimized">(
    "original",
  );
  const [currentExample, setCurrentExample] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);

  const fadeAnimation = useConditionalAnimation("animate-fade-in");
  const slideAnimation = useConditionalAnimation("animate-slide-in-right");

  const switchTab = (tab: "original" | "optimized") => {
    if (tab === activeTab) return;

    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setShowTypewriter(true);
      setIsAnimating(false);
    }, 150);
  };

  const nextExample = () => {
    setIsAnimating(true);
    setShowTypewriter(false);
    setTimeout(() => {
      setCurrentExample((prev) => (prev + 1) % codeExamples.length);
      setActiveTab("original");
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    setShowTypewriter(true);
  }, [currentExample]);

  const example = codeExamples[currentExample];
  const codeToShow =
    activeTab === "original" ? example.original : example.optimized;

  return (
    <div className={`relative ${className}`}>
      {/* Code Preview Window */}
      <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-primary/20 transition-all duration-500">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-white/10">
          {/* Window Controls */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-gray-700/50 rounded-lg p-1">
            <button
              onClick={() => switchTab("original")}
              className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                activeTab === "original"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              original.{example.language}
              {activeTab === "original" && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-light/20 rounded-md animate-pulse-gentle" />
              )}
            </button>
            <button
              onClick={() => switchTab("optimized")}
              className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                activeTab === "optimized"
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              optimized.{example.language}
              {activeTab === "optimized" && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-md animate-pulse-gentle" />
              )}
            </button>
          </div>

          {/* Performance Badge */}
          <div className="flex items-center gap-2">
            {activeTab === "optimized" && (
              <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-3 py-1 rounded-md text-xs font-semibold animate-bounce-in">
                ⚡ {example.performanceGain} faster
              </div>
            )}
            <button
              onClick={nextExample}
              className="text-white/60 hover:text-white transition-colors duration-200 hover:scale-110"
              title="Next example"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="relative min-h-[300px] overflow-hidden">
          <div
            className={`absolute inset-0 transition-all duration-300 ${
              isAnimating
                ? "opacity-0 transform translate-x-4"
                : "opacity-100 transform translate-x-0"
            }`}
          >
            <pre className="p-6 text-sm leading-relaxed overflow-auto h-full">
              <code className="font-mono text-gray-300">
                {showTypewriter ? (
                  <TypewriterText
                    text={codeToShow}
                    speed={20}
                    cursor={false}
                    className="whitespace-pre-wrap"
                  />
                ) : (
                  <span className="whitespace-pre-wrap">{codeToShow}</span>
                )}
              </code>
            </pre>
          </div>

          {/* Loading overlay during animation */}
          {isAnimating && (
            <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
              <div className="flex items-center gap-2 text-primary">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Improvements Panel */}
        {activeTab === "optimized" && !isAnimating && (
          <div
            className={`bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-t border-green-500/20 p-4 ${slideAnimation}`}
          >
            <h4 className="text-green-300 font-semibold mb-2">
              🚀 Optimizations Applied:
            </h4>
            <ul className="space-y-1">
              {example.improvements.map((improvement, index) => (
                <li
                  key={index}
                  className="text-green-200/80 text-sm flex items-center gap-2 animate-fade-in-left"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Example Selector */}
      <div className="flex justify-center mt-4 gap-2">
        {codeExamples.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (index !== currentExample) {
                setCurrentExample(index);
                setShowTypewriter(false);
                setActiveTab("original");
              }
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentExample
                ? "bg-primary shadow-lg shadow-primary/50 scale-125"
                : "bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`View ${codeExamples[index].title}`}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveCodePreview;
