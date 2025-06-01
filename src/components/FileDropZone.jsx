import { useState, useRef } from "react";
import "./FileDropZone.css";

function FileDropZone({ onFilesSelected, files }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    setIsProcessing(true);

    try {
      const items = Array.from(e.dataTransfer.items);
      const allFiles = [];

      // Handle both files and folders
      for (const item of items) {
        if (item.kind === "file") {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            const files = await getAllFiles(entry);
            allFiles.push(...files);
          }
        }
      }

      await handleFiles(allFiles);
    } catch (error) {
      console.error("Error processing dropped files:", error);
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setIsProcessing(true);
    try {
      await handleFiles(selectedFiles);
    } catch (error) {
      console.error("Error processing selected files:", error);
      setIsProcessing(false);
    }
  };

  const getAllFiles = async (entry, path = "") => {
    const files = [];
    const MAX_FILES = 15;
    const MAX_FILE_SIZE = 500 * 1024; // 500KB

    if (entry.isFile) {
      const file = await new Promise((resolve) => entry.file(resolve));
      const fullPath = path + file.name;

      if (isCodeFile(file.name, fullPath) && file.size <= MAX_FILE_SIZE) {
        Object.defineProperty(file, "webkitRelativePath", {
          value: fullPath,
          writable: false,
        });
        files.push(file);
      }
    } else if (entry.isDirectory) {
      // Skip excluded directories
      const excludedDirs = [
        "node_modules",
        ".git",
        "dist",
        "build",
        "coverage",
        ".next",
        ".nuxt",
      ];
      if (
        excludedDirs.some((dir) =>
          entry.name.toLowerCase().includes(dir.toLowerCase()),
        )
      ) {
        return files;
      }

      const dirReader = entry.createReader();
      const entries = await new Promise((resolve) => {
        dirReader.readEntries(resolve);
      });

      for (const childEntry of entries) {
        if (files.length >= MAX_FILES) break;
        const childFiles = await getAllFiles(
          childEntry,
          path + entry.name + "/",
        );
        files.push(...childFiles.slice(0, MAX_FILES - files.length));
      }
    }

    return files.slice(0, MAX_FILES);
  };

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) {
      console.log("No files provided");
      setIsProcessing(false);
      return;
    }

    const MAX_FILES = 15;
    const MAX_FILE_SIZE = 500 * 1024; // 500KB
    const processedFiles = [];
    let skippedFiles = 0;
    let oversizedFiles = 0;

    console.log(`Starting to process ${fileList.length} files...`);

    try {
      // First, filter out oversized files and sort by size
      const validSizedFiles = Array.from(fileList).filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          console.log(
            `File too large: ${file.name} (${formatFileSize(file.size)})`,
          );
          oversizedFiles++;
          return false;
        }
        return true;
      });

      // Sort by size (smaller first) and limit total files
      const sortedFiles = validSizedFiles
        .sort((a, b) => a.size - b.size)
        .slice(0, MAX_FILES);

      console.log(
        `Processing ${sortedFiles.length} files after size filtering...`,
      );

      // Process each file
      for (let i = 0; i < sortedFiles.length; i++) {
        const file = sortedFiles[i];
        const filepath = file.webkitRelativePath || file.name;

        console.log(`[${i + 1}/${sortedFiles.length}] Checking: ${filepath}`);

        if (isCodeFile(file.name, filepath)) {
          try {
            const content = await readFileContent(file);
            if (content && content.trim()) {
              processedFiles.push({
                name: file.name,
                path: filepath,
                content: content,
                size: file.size,
                type: file.type,
                extension: getFileExtension(file.name),
              });
              console.log(`✓ Successfully processed: ${filepath}`);
            } else {
              console.log(`× Empty file skipped: ${filepath}`);
              skippedFiles++;
            }
          } catch (error) {
            console.error(`× Error reading file ${file.name}:`, error);
            skippedFiles++;
          }
        } else {
          skippedFiles++;
        }
      }

      // Show detailed feedback
      console.log(`\n=== PROCESSING SUMMARY ===`);
      console.log(`Total files submitted: ${fileList.length}`);
      console.log(`Files processed successfully: ${processedFiles.length}`);
      console.log(`Files skipped (non-code/empty): ${skippedFiles}`);
      console.log(`Files excluded (over 500KB): ${oversizedFiles}`);
      console.log(`========================\n`);

      if (processedFiles.length === 0) {
        console.warn("No valid code files found!");
        alert(
          `No valid code files found in the selected folder. \n\nChecked ${fileList.length} files but found no supported code files.\n\nSupported: JS, TS, Python, HTML, CSS, and more.\nExcluded: node_modules, build folders, config files.`,
        );
      }

      // Combine with existing files, but respect total limit
      const totalFiles = [...files, ...processedFiles].slice(0, MAX_FILES);
      console.log(`Final file count: ${totalFiles.length}`);
      onFilesSelected(totalFiles);
    } catch (error) {
      console.error("Error processing files:", error);
      alert(`Error processing files: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const isCodeFile = (filename, filepath = "") => {
    // Folders/paths to exclude (be more specific about paths)
    const excludedPaths = [
      "/node_modules/",
      "\\node_modules\\",
      "/.git/",
      "\\.git\\",
      "/dist/",
      "\\dist\\",
      "/build/",
      "\\build\\",
      "/coverage/",
      "\\coverage\\",
      "/.next/",
      "\\.next\\",
      "/.nuxt/",
      "\\.nuxt\\",
      "/vendor/",
      "\\vendor\\",
      "/target/",
      "\\target\\",
      "/__pycache__/",
      "\\__pycache__\\",
      "/.cache/",
      "\\.cache\\",
      "/.vscode/",
      "\\.vscode\\",
      "/.idea/",
      "\\.idea\\",
    ];

    // Files to exclude (exact matches)
    const excludedFiles = [
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "composer.lock",
      ".gitignore",
      ".eslintrc.js",
      ".eslintrc.cjs",
      ".prettierrc",
      "webpack.config.js",
      "vite.config.js",
      "tsconfig.json",
      "babel.config.js",
      ".env",
      ".env.local",
      ".env.development",
      ".env.production",
    ];

    // Check if file is in excluded path (more precise matching)
    const normalizedPath = filepath.replace(/\\/g, "/").toLowerCase();
    const isInExcludedPath = excludedPaths.some((path) => {
      const normalizedExcludedPath = path.replace(/\\/g, "/").toLowerCase();
      return normalizedPath.includes(normalizedExcludedPath);
    });

    // Check if file is excluded (exact filename match)
    const isExcludedFile = excludedFiles.some(
      (excludedFile) => filename.toLowerCase() === excludedFile.toLowerCase(),
    );

    if (isInExcludedPath || isExcludedFile) {
      console.log(
        `Excluded file: ${filepath} (${isInExcludedPath ? "path" : "filename"})`,
      );
      return false;
    }

    // Code file extensions
    const codeExtensions = [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".vue",
      ".svelte",
      ".py",
      ".java",
      ".cpp",
      ".c",
      ".cs",
      ".go",
      ".rs",
      ".rust",
      ".php",
      ".rb",
      ".swift",
      ".kt",
      ".scala",
      ".html",
      ".htm",
      ".css",
      ".scss",
      ".sass",
      ".less",
      ".styl",
      ".sql",
      ".json",
      ".xml",
      ".yaml",
      ".yml",
      ".md",
      ".txt",
      ".sh",
      ".bash",
      ".ps1",
      ".bat",
      ".cmd",
    ];

    const isCodeFile = codeExtensions.some((ext) =>
      filename.toLowerCase().endsWith(ext.toLowerCase()),
    );

    if (isCodeFile) {
      console.log(`Accepted code file: ${filepath}`);
    } else {
      console.log(`Not a code file: ${filepath}`);
    }

    return isCodeFile;
  };

  const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="file-drop-container">
      <h3 className="section-title">Upload Code Files</h3>

      <div
        className={`file-drop-zone ${isDragOver ? "drag-over" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-content">
          {isProcessing ? (
            <div className="processing-state">
              <div className="loading-spinner"></div>
              <p className="drop-text">Processing files...</p>
              <p className="drop-subtext">
                Reading and filtering code files...
              </p>
            </div>
          ) : (
            <>
              <div className="drop-icon">📁</div>
              <p className="drop-text">
                Drag and drop files/folders here, or click to select
              </p>
              <p className="drop-subtext">
                Supports: JS, TS, Python, Java, C++, HTML, CSS, and more
                <br />
                <small>
                  Max 15 files, 500KB each. Excludes node_modules, build
                  folders.
                </small>
              </p>
              <div className="upload-buttons">
                <button
                  type="button"
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  Select Files
                </button>
                <button
                  type="button"
                  className="upload-btn"
                  onClick={() => folderInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  Select Folder
                </button>
              </div>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rust,.swift,.kt,.scala,.r,.html,.css,.scss,.sass,.less,.sql,.json,.xml,.yaml,.yml,.md,.txt,.sh,.bash,.ps1,.vue"
          onChange={handleFileSelect}
          className="file-input-hidden"
        />
        <input
          ref={folderInputRef}
          type="file"
          webkitdirectory=""
          multiple
          onChange={handleFileSelect}
          className="file-input-hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="selected-files">
          <div className="files-header">
            <h4 className="files-title">Selected Files ({files.length})</h4>
            <button
              className="clear-all-files"
              onClick={() => onFilesSelected([])}
              type="button"
              title="Clear all files"
            >
              Clear All
            </button>
          </div>
          <div className="files-list">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-info">
                  <span className="file-name">{file.path}</span>
                  <span className="file-details">
                    {file.extension.toUpperCase()} • {formatFileSize(file.size)}
                  </span>
                </div>
                <button
                  className="remove-file"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilesSelected(files.filter((_, i) => i !== index));
                  }}
                  type="button"
                  title="Remove this file"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileDropZone;
