import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>OptimizeCode.ai</h1>
        <p>
          Welcome to OptimizeCode.ai - Your AI-powered code optimization
          platform
        </p>
        <div className="demo-section">
          <button
            className="demo-button"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
          <p className="demo-text">
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
