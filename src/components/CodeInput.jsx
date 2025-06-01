import React, { useState } from "react";
import "./CodeInput.css";

function CodeInput({ onCodeChange, code }) {
  const [isActive, setIsActive] = useState(false);

  const handleCodeChange = (e) => {
    onCodeChange(e.target.value);
  };

  const handlePaste = (e) => {
    // Handle paste events
    const pastedData = e.clipboardData.getData("text");
    if (pastedData) {
      onCodeChange(pastedData);
    }
  };

  return (
    <div className="code-input-container">
      <h3 className="section-title">Paste Your Code</h3>
      <div className={`code-input-wrapper ${isActive ? "active" : ""}`}>
        <textarea
          className="code-input"
          placeholder="Paste your code here... (JavaScript, Python, TypeScript, CSS, HTML, etc.)"
          value={code}
          onChange={handleCodeChange}
          onPaste={handlePaste}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          rows={15}
          spellCheck={false}
        />
        <div className="code-input-footer">
          <span className="character-count">{code.length} characters</span>
          {code.length > 0 && (
            <button
              className="clear-button"
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
}

export default CodeInput;
