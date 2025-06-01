import React, { useState } from "react";
import { CodeInputProps } from "../types";

const CodeInput: React.FC<CodeInputProps> = ({ code, onCodeChange }) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleCodeChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    onCodeChange(e.target.value);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>): void => {
    const pastedData = e.clipboardData.getData("text");
    if (pastedData) {
      onCodeChange(pastedData);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-primary mb-4 text-left">
        Paste Your Code
      </h3>
      <div
        className={`border-2 rounded-xl bg-white/5 overflow-hidden transition-all duration-300 ${
          isActive
            ? "border-primary shadow-lg shadow-primary/20"
            : "border-white/10"
        }`}
      >
        <textarea
          className="w-full min-h-[300px] p-4 bg-transparent border-none text-white font-mono text-sm leading-6 resize-vertical outline-none placeholder:text-white/40"
          placeholder="Paste your code here... (JavaScript, Python, TypeScript, CSS, HTML, etc.)"
          value={code}
          onChange={handleCodeChange}
          onPaste={handlePaste}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          rows={15}
          spellCheck={false}
        />
        <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-t border-white/10">
          <span className="text-xs text-white/60">
            {code.length} characters
          </span>
          {code.length > 0 && (
            <button
              className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded transition-all duration-300"
              onClick={() => onCodeChange("")}
              type="button"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeInput;
