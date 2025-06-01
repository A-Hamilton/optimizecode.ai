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

    handleFiles(allFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
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
    setIsProcessing(true);
    const MAX_FILES = 15;
    const MAX_FILE_SIZE = 500 * 1024; // 500KB
    const processedFiles = [];
    let skippedFiles = 0;
    let oversizedFiles = 0;

    // Sort files by size (smaller first) and limit to MAX_FILES
    const sortedFiles = Array.from(fileList)
      .filter((file) => file.size <= MAX_FILE_SIZE)
      .sort((a, b) => a.size - b.size)
      .slice(0, MAX_FILES);

    oversizedFiles = fileList.length - sortedFiles.length;

    for (const file of sortedFiles) {
      const filepath = file.webkitRelativePath || file.name;
      if (isCodeFile(file.name, filepath)) {
        try {
          const content = await readFileContent(file);
          processedFiles.push({
            name: file.name,
            path: filepath,
            content: content,
            size: file.size,
            type: file.type,
            extension: getFileExtension(file.name),
          });
        } catch (error) {
          console.error(`Error reading file ${file.name}:`, error);
          skippedFiles++;
        }
      } else {
        skippedFiles++;
      }
    }

    // Show feedback about filtered files
    if (skippedFiles > 0 || oversizedFiles > 0) {
      let message = `Processed ${processedFiles.length} files.`;
      if (skippedFiles > 0)
        message += ` Skipped ${skippedFiles} non-code files.`;
      if (oversizedFiles > 0)
        message += ` Excluded ${oversizedFiles} files over 500KB.`;
      console.log(message);
      // You could show this in a toast notification
    }

    // Combine with existing files instead of replacing, but respect total limit
    const totalFiles = [...files, ...processedFiles].slice(0, MAX_FILES);
    onFilesSelected(totalFiles);
    setIsProcessing(false);
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
    // File size limit (500KB)
    const MAX_FILE_SIZE = 500 * 1024;

    // Folders/paths to exclude
    const excludedPaths = [
      "node_modules",
      ".git",
      "dist",
      "build",
      "coverage",
      ".next",
      ".nuxt",
      "vendor",
      "target",
      "bin",
      "obj",
      "packages",
      ".vscode",
      ".idea",
      "__pycache__",
      ".cache",
      "tmp",
      "temp",
    ];

    // Files to exclude
    const excludedFiles = [
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      ".gitignore",
      ".eslintrc",
      ".prettierrc",
      "webpack.config.js",
      "vite.config.js",
      "tsconfig.json",
    ];

    // Check if file is in excluded path
    const isInExcludedPath = excludedPaths.some((path) =>
      filepath.toLowerCase().includes(path.toLowerCase()),
    );

    // Check if file is excluded
    const isExcludedFile = excludedFiles.some(
      (excludedFile) => filename.toLowerCase() === excludedFile.toLowerCase(),
    );

    if (isInExcludedPath || isExcludedFile) {
      return false;
    }

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
      ".php",
      ".rb",
      ".swift",
      ".kt",
      ".scala",
      ".html",
      ".css",
      ".scss",
      ".sass",
      ".less",
      ".sql",
      ".json",
      ".xml",
      ".yaml",
      ".yml",
      ".md",
    ];

    return codeExtensions.some((ext) =>
      filename.toLowerCase().endsWith(ext.toLowerCase()),
    );
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
          <div className="drop-icon">{isProcessing ? "⏳" : "📁"}</div>
          <p className="drop-text">
            {isProcessing
              ? "Processing files..."
              : "Drag and drop files/folders here, or click to select"}
          </p>
          <p className="drop-subtext">
            Supports: JS, TS, Python, Java, C++, HTML, CSS, and more
            <br />
            <small>
              Max 15 files, 500KB each. Excludes node_modules, build folders.
            </small>
          </p>
          <div className="upload-buttons">
            <button
              type="button"
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Files
            </button>
            <button
              type="button"
              className="upload-btn"
              onClick={() => folderInputRef.current?.click()}
            >
              Select Folder
            </button>
          </div>
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
          <h4 className="files-title">Selected Files ({files.length})</h4>
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
