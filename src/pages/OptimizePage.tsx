// Updated for TypeScript migration
import React, { useState, useEffect } from 'react';
import { CodeFile } from "../types";
import { useAuth } from '../contexts/AuthContext';
import { PLAN_DETAILS } from '../types/user';
import CodeInput from "../components/CodeInput";
import FileDropZone from "../components/FileDropZone";
import ResultsDisplay from "../components/ResultsDisplay";
import './OptimizePage.css';

const OptimizePage: React.FC = () => {
  const { userProfile, trackUsage, currentUser } = useAuth();
  const [code, setCode] = useState<string>('');
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [optimizedCode, setOptimizedCode] = useState<string>('');
  const [optimizedFiles, setOptimizedFiles] = useState<CodeFile[]>([]);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationSummary, setOptimizationSummary] = useState<Record<string, any>>({});
  const [usageError, setUsageError] = useState<string>('');
  const [notification, setNotification] = useState<{ message: string; type: "error" | "warning" | "info" } | null>(null);

  const showNotification = (message: string, type: "error" | "warning" | "info" = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const hasInput = code.trim() || files.length > 0;
  const canOptimize = hasInput && !isOptimizing && !usageError;

  const getUsageInfo = () => {
    if (!userProfile) return { used: 0, total: 10, percentage: 0, isUnlimited: false };

    const { optimizationsToday } = userProfile.usage;
    const { optimizationsPerDay } = userProfile.limits;
    const isUnlimited = optimizationsPerDay === -1;

    return {
      used: optimizationsToday,
      total: isUnlimited ? '∞' : optimizationsPerDay,
      percentage: isUnlimited ? 0 : Math.min((optimizationsToday / optimizationsPerDay) * 100, 100),
      isUnlimited
    };
  };

  const optimizeCode = async () => {
    if (!hasInput) return;

    // Check usage limits before optimization
    if (!currentUser || !userProfile) {
      setUsageError('Please log in to optimize code');
      return;
    }

    // Check if user has reached their daily limit
    const { optimizationsPerDay, maxPasteCharacters } = userProfile.limits;
    const { optimizationsToday } = userProfile.usage;

    if (optimizationsPerDay !== -1 && optimizationsToday >= optimizationsPerDay) {
      setUsageError(`You've reached your daily limit of ${optimizationsPerDay} optimizations. Upgrade your plan for more optimizations.`);
      return;
    }

    // Check character limit for pasted code
    if (code.trim() && maxPasteCharacters !== -1 && code.length > maxPasteCharacters) {
      setUsageError(`Code is too long (${code.length.toLocaleString()} characters). Your plan allows up to ${maxPasteCharacters.toLocaleString()} characters. Please upgrade or use file upload instead.`);
      return;
    }

    setIsOptimizing(true);
    setUsageError('');
    setOptimizationSummary({});

    try {
      // Track usage for this optimization
      const usageResult = await trackUsage();
      if (!usageResult.success && usageResult.error) {
        setUsageError(usageResult.error);
        setIsOptimizing(false);
        return;
      }

      if (code.trim()) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const optimized = simulateCodeOptimization(code);
        setOptimizedCode(optimized);

        setOptimizationSummary(prev => ({
          ...prev,
          'manual_input': {
            original: code,
            optimized: optimized,
            improvements: getOptimizationImprovements(code, optimized)
          }
        }));
      }

      if (files.length > 0) {
        const optimizedFileResults: CodeFile[] = [];
        const summary: Record<string, any> = {};

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          await new Promise(resolve => setTimeout(resolve, 1000));

          const optimizedContent = simulateCodeOptimization(file.content);
          const optimizedFile: CodeFile = {
            name: `${file.name}.optimized${file.name.substring(file.name.lastIndexOf('.'))}`,
            path: file.path,
            content: optimizedContent
          };

          optimizedFileResults.push(optimizedFile);
          summary[file.name] = {
            original: file.content,
            optimized: optimizedContent,
            improvements: getOptimizationImprovements(file.content, optimizedContent)
          };
        }

        setOptimizedFiles(optimizedFileResults);
        setOptimizationSummary(prev => ({ ...prev, ...summary }));
      }

      showNotification('Code optimization completed successfully!', 'info');
    } catch (error) {
      console.error('Optimization failed:', error);
      setUsageError('Optimization failed. Please try again.');
      showNotification('Optimization failed. Please try again.', 'error');
    } finally {
      setIsOptimizing(false);
    }
  };

  const resetCode = () => {
    setCode('');
    setFiles([]);
    setOptimizedCode('');
    setOptimizedFiles([]);
    setOptimizationSummary({});
    setUsageError('');
    setNotification(null);
  };
    setUsageError('');
  };

  const simulateCodeOptimization = (inputCode: string): string => {
    let optimized = inputCode;
    optimized = optimized.replace(/var /g, 'const ');
    optimized = optimized.replace(/;\s*\n/g, ';\n');
    optimized = optimized.replace(/\{\s*\n\s*/g, '{\n  ');
    optimized = optimized.replace(/\n\s*\}/g, '\n}');
    return optimized;
  };

  const getOptimizationImprovements = (original: string, optimized: string) => {
    const originalLines = original.split('\n').length;
    const optimizedLines = optimized.split('\n').length;

    return {
      linesReduced: Math.max(0, originalLines - optimizedLines),
      sizeReduction: `${Math.round((1 - optimized.length / original.length) * 100)}%`,
      improvements: [
        'Variable declarations optimized',
        'Code formatting improved',
        'Whitespace optimized'
      ]
    };
  };

  const usageInfo = getUsageInfo();
  const isLimitReached = !usageInfo.isUnlimited && usageInfo.used >= (usageInfo.total as number);

  const InlineNotification: React.FC<{ message: string; type: "error" | "warning" | "info"; onClose: () => void }> = ({ message, type, onClose }) => {
    const typeStyles = {
      error: "bg-red-500/20 border-red-500/30 text-red-200",
      warning: "bg-yellow-500/20 border-yellow-500/30 text-yellow-200",
      info: "bg-blue-500/20 border-blue-500/30 text-blue-200"
    };

    return (
      <div className={`notification ${typeStyles[type]}`}>
        <span>{message}</span>
        <button onClick={onClose} className="notification-close">×</button>
      </div>
    );
  };

  return (
    <div className="optimize-page">
      <div className="optimize-container">
        {/* Header with compact plan display */}
        <header className="optimize-header">
          <div className="header-content">
            <div className="title-section">
              <h1>Code Optimizer</h1>
              <p>AI-powered code optimization for better performance, readability, and maintainability</p>
            </div>

            {/* Ultra-Compact Plan Status Bar */}
            <div className="plan-status-bar">
              {currentUser ? (
                <>
                  <div className="plan-info-mini">
                    <span className="plan-text">
                      <span className={`plan-name ${userProfile?.subscription.plan || 'free'}`}>
                        {userProfile?.subscription.plan ? PLAN_DETAILS[userProfile.subscription.plan].name : 'Free'}
                      </span>
                      Plan • Optimizations:
                      <span className={`usage-mini ${isLimitReached ? 'limit-reached' : ''}`}>
                        {usageInfo.used}/{usageInfo.total}
                      </span>
                    </span>
                    {!usageInfo.isUnlimited && (
                      <div className="usage-bar-mini">
                        <div
                          className={`usage-fill-mini ${isLimitReached ? 'limit-reached' : ''}`}
                          style={{ width: `${usageInfo.percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {(userProfile?.subscription.plan === 'free' || isLimitReached) && (
                    <button
                      className="upgrade-btn-mini"
                      onClick={() => window.location.href = '/pricing'}
                    >
                      {isLimitReached ? 'Upgrade Now' : 'Upgrade to Pro'}
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div className="plan-info-mini">
                    <span className="plan-text guest-text">
                      Get unlimited AI code optimization
                    </span>
                  </div>
                  <button
                    className="upgrade-btn-mini"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    Upgrade to Pro
                  </button>
                </>
              )}
            </div>

            {notification && (
              <InlineNotification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
              />
            )}
          </div>
        </header>

        <main className="optimize-main">
          {/* Global Usage Error */}
          {usageError && (
            <div className="usage-error-banner">
              <div className="error-content">
                <svg className="error-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{usageError}</span>
              </div>
              <button
                className="upgrade-btn-inline"
                onClick={() => window.location.href = '/pricing'}
              >
                Upgrade Plan
              </button>
            </div>
          )}

          <div className="input-sections">
            {/* Code Input Section */}
            <div className="input-section code-section">
              <div className="section-header">
                <h2>Paste Your Code</h2>
                <div className="section-tips">
                  <div className="tip-item">
                    <svg className="tip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Drag and drop files below for batch optimization</span>
                  </div>
                  <div className="tip-item">
                    <svg className="tip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>No CTRL+Z to paste</span>
                  </div>
                  <div className="tip-item">
                    <svg className="tip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Multiple programming languages supported</span>
                  </div>
                </div>
              </div>

              <CodeInput
                code={code}
                onCodeChange={setCode}
              />
            </div>

            {/* File Upload Section */}
            <div className="input-section file-section">
              <div className="section-header">
                <h2>Upload Code Files</h2>
                <div className="supported-files">
                  <span className="supported-label">Supported:</span>
                  <div className="file-types">
                    <span className="file-type">.js</span>
                    <span className="file-type">.py</span>
                    <span className="file-type">.java</span>
                    <span className="file-type">.cpp</span>
                    <span className="file-type">+more</span>
                  </div>
                </div>
              </div>

              <FileDropZone
                files={files}
                onFilesChange={setFiles}
                showNotification={showNotification}
              />

              <div className="pro-tip">
                <div className="tip-icon-large">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="tip-content">
                  <h3>💡 Pro Tip</h3>
                  <p>Get performance improvements, cleaner syntax, and security fixes. Use the file upload below for multiple files.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Section */}
          <div className="action-section">
            <div className="primary-action">
              <button
                className={`optimize-btn-primary ${canOptimize ? 'enabled' : 'disabled'}`}
                onClick={optimizeCode}
                disabled={!canOptimize}
              >
                {isOptimizing ? (
                  <>
                    <div className="loading-spinner" />
                    <span>Optimizing Your Code...</span>
                  </>
                ) : (
                  <>
                    <svg className="optimize-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
                    </svg>
                    <span>Optimize Code</span>
                  </>
                )}
              </button>

              {hasInput && !isOptimizing && (
                <button className="reset-btn-secondary" onClick={resetCode}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12a9 9 0 1013.5-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 5l-3-3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Reset
                </button>
              )}
            </div>

            {/* Status Messages */}
            {isOptimizing && (
              <div className="optimization-status">
                <div className="status-content">
                  <div className="status-spinner" />
                  <div className="status-text">
                    <span className="status-title">Analyzing your code...</span>
                    <span className="status-subtitle">This may take a few moments</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Quick Start Tips */}
          <div className="quick-tips-enhanced">
            <h3>
              <svg className="tips-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Quick Start Tips
            </h3>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="tip-text">
                  <h4>Instant Optimization</h4>
                  <p>Paste any code snippet to see instant AI optimization</p>
                </div>
              </div>

              <div className="tip-card">
                <div className="tip-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="tip-text">
                  <h4>15+ Languages</h4>
                  <p>Supports JavaScript, Python, Java, C++, and more</p>
                </div>
              </div>

              <div className="tip-card">
                <div className="tip-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="tip-text">
                  <h4>Security & Performance</h4>
                  <p>Get performance improvements, cleaner syntax, and security fixes</p>
                </div>
              </div>

              <div className="tip-card">
                <div className="tip-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m3 0v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4h16zM10 11h4m-4 4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="tip-text">
                  <h4>Batch Processing</h4>
                  <p>Upload multiple files for efficient batch optimization</p>
                </div>
              </div>
            </div>
          </div>

          {/* Only show results if there are optimizations or we're currently optimizing */}
          {(optimizedCode || optimizedFiles.length > 0 || isOptimizing || Object.keys(optimizationSummary).length > 0) && (
            <ResultsDisplay
              originalCode={code}
              optimizedCode={optimizedCode}
              files={optimizedFiles}
              isOptimizing={isOptimizing}
              optimizationSummary={optimizationSummary}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default OptimizePage;