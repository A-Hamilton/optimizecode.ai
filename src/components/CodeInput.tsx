// Updated for TypeScript migration
import React, { useState, useRef } from "react";
import { CodeInputProps } from "../types";
import { useAuth } from "../contexts/AuthContext";

const CodeInput: React.FC<CodeInputProps> = ({ code, onCodeChange }) => {
  // Make useAuth safe by handling potential provider issues
  let userProfile = null;
  try {
    const auth = useAuth();
    userProfile = auth?.userProfile;
  } catch (error) {
    // If AuthProvider is not available, use default limits
    console.warn("AuthProvider not available, using default limits");
  }
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCodeChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const newValue = e.target.value;
    // Default to free plan limits if no user profile available
    const characterLimit = userProfile?.limits?.maxPasteCharacters ?? 10000;

    // Allow unlimited for unlimited plans
    if (characterLimit === -1 || newValue.length <= characterLimit) {
      onCodeChange(newValue);
    } else {
      // Show feedback that limit was reached
      showFeedback(
        `Character limit reached (${characterLimit.toLocaleString()} max)`,
      );
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>): void => {
    const pastedData = e.clipboardData.getData("text");
    // Default to free plan limits if no user profile available
    const characterLimit = userProfile?.limits?.maxPasteCharacters ?? 10000;

    if (pastedData) {
      if (characterLimit === -1 || pastedData.length <= characterLimit) {
        onCodeChange(pastedData);
        showFeedback("Code pasted successfully!");
      } else {
        e.preventDefault();
        showFeedback(
          `Paste too large! Limit: ${characterLimit.toLocaleString()} characters, tried to paste: ${pastedData.length.toLocaleString()}`,
        );
      }
    }
  };

  const copyToClipboard = async (): Promise<void> => {
    if (!code) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older browsers
        if (textareaRef.current) {
          textareaRef.current.select();
          document.execCommand("copy");
        }
      }

      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const showFeedback = (message: string): void => {
    // Create temporary notification
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #22c55e;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 2000);
  };

  const formatCode = (): void => {
    if (!code) return;

    // Simple code formatting (basic indentation)
    const formatted = code
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .replace(/\{/g, " {\n  ")
      .replace(/\}/g, "\n}")
      .replace(/;/g, ";\n");

    onCodeChange(formatted);
    showFeedback("Code formatted!");
  };

  const getLanguageFromCode = (): string => {
    if (!code) return "text";

    // Simple language detection
    if (
      code.includes("function") ||
      code.includes("const ") ||
      code.includes("let ")
    )
      return "javascript";
    if (code.includes("def ") || code.includes("import ")) return "python";
    if (code.includes("public class") || code.includes("private "))
      return "java";
    if (code.includes("<html") || code.includes("<!DOCTYPE")) return "html";
    if (code.includes(".class") || code.includes("color:")) return "css";

    return "text";
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Paste Your Code</h3>
        <div className="flex items-center gap-2">
          {code && (
            <>
              <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                {getLanguageFromCode()}
              </span>
              <button
                onClick={formatCode}
                className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded transition-all duration-300 text-white/80 hover:text-white"
                title="Format code"
              >
                Format
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className={`border-2 rounded-xl bg-white/5 overflow-hidden transition-all duration-300 group ${
          isFocused
            ? "border-primary shadow-lg shadow-primary/20 bg-white/8"
            : isActive
              ? "border-primary/60 shadow-md shadow-primary/10"
              : "border-white/10 hover:border-white/20"
        }`}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="w-full min-h-[300px] p-4 bg-transparent border-none text-white font-mono text-sm leading-6 resize-vertical outline-none placeholder:text-white/40"
          placeholder="Paste your code here... (JavaScript, Python, TypeScript, CSS, HTML, etc.)

💡 Tips:
• Drag and drop files below for batch optimization
• Use Ctrl+V to paste
• Multiple programming languages supported"
          value={code}
          onChange={handleCodeChange}
          onPaste={handlePaste}
          onFocus={() => {
            setIsActive(true);
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsActive(false);
            setIsFocused(false);
          }}
          rows={15}
          spellCheck={false}
          aria-label="Code input area"
        />

        {/* Bottom Bar */}
        <div className="flex justify-between items-center px-4 py-3 bg-white/5 border-t border-white/10">
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-white/60">
            <span className="flex items-center gap-1">
              📝 {code.length} characters
            </span>
            <span className="flex items-center gap-1">
              📄 {code.split("\n").length} lines
            </span>
            {code && (
              <span className="flex items-center gap-1">
                🔤 {code.split(" ").filter((word) => word.length > 0).length}{" "}
                words
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {code.length > 0 && (
              <>
                <button
                  onClick={copyToClipboard}
                  className={`text-xs px-3 py-1 border rounded transition-all duration-300 flex items-center gap-1 ${
                    copySuccess
                      ? "bg-green-500/20 border-green-500/30 text-green-300"
                      : "bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-white/80 hover:text-white"
                  }`}
                  title="Copy to clipboard"
                  type="button"
                >
                  {copySuccess ? <>✓ Copied</> : <>📋 Copy</>}
                </button>
                <button
                  className="text-xs px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded transition-all duration-300 text-red-300 hover:text-red-200"
                  onClick={() => onCodeChange("")}
                  type="button"
                  title="Clear all code"
                >
                  🗑️ Clear
                </button>
              </>
            )}
          </div>
        </div>

        {/* Loading indicator for when typing */}
        {code && (
          <div
            className={`absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ${isFocused ? "animate-pulse" : "opacity-50"}`}
          />
        )}
      </div>

      {/* Help Text */}
      {!code && (
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-blue-400 text-lg">💡</span>
            <div>
              <h4 className="text-blue-300 font-medium mb-2">
                Quick Start Tips:
              </h4>
              <ul className="text-blue-200/80 text-sm space-y-1">
                <li>• Paste any code snippet to see instant AI optimization</li>
                <li>• Supports 15+ programming languages</li>
                <li>
                  • Get performance improvements, cleaner syntax, and security
                  fixes
                </li>
                <li>• Use the file upload below for multiple files</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeInput;
