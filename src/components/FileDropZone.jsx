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

    // Use setTimeout to ensure loading state shows immediately
    setTimeout(async () => {
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
    }, 10);
  };

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setIsProcessing(true);

    // Use setTimeout to ensure loading state shows immediately
    setTimeout(async () => {
      try {
        await handleFiles(selectedFiles);
      } catch (error) {
        console.error("Error processing selected files:", error);
        setIsProcessing(false);
      }
    }, 10);
  };

  const getAllFiles = async (entry, path = "", collected = { count: 0 }) => {
    const files = [];
    const MAX_FILES = 15;
    const MAX_FILE_SIZE = 500 * 1024; // 500KB

    // Early termination for performance
    if (collected.count >= 1000 || files.length >= MAX_FILES) {
      return files;
    }

    if (entry.isFile) {
      collected.count++;
      try {
        const file = await new Promise((resolve) => entry.file(resolve));
        const fullPath = path + file.name;

        if (file.size <= MAX_FILE_SIZE && isCodeFile(file.name, fullPath)) {
          Object.defineProperty(file, "webkitRelativePath", {
            value: fullPath,
            writable: false,
          });
          files.push(file);
        }
      } catch (error) {
        console.error(`Error processing file ${path}${entry.name}:`, error);
      }
    } else if (entry.isDirectory) {
      // Very aggressive directory exclusion for performance
      const excludedDirs = [
        "node_modules",
        ".git",
        "dist",
        "build",
        "__pycache__",
        "coverage",
        ".next",
        ".nuxt",
        "vendor",
        "target",
        "bin",
        "obj",
        "public",
        "assets",
        "static",
        "images",
        "img",
        "fonts",
        "docs",
        "test",
        "tests",
        "__tests__",
        ".github",
        ".vscode",
        ".idea",
        "tmp",
        "temp",
        "logs",
        "backup",
      ];

      const dirName = entry.name.toLowerCase();
      if (excludedDirs.includes(dirName)) {
        return files; // Skip entirely
      }

      try {
        const dirReader = entry.createReader();
        const entries = await new Promise((resolve) => {
          const timeout = setTimeout(() => resolve([]), 1000); // Fast timeout
          dirReader.readEntries((entries) => {
            clearTimeout(timeout);
            resolve(entries);
          });
        });

        // Process files first, skip deep nesting
        for (const childEntry of entries.slice(0, 50)) {
          // Limit entries per directory
          if (files.length >= MAX_FILES) break;
          const childFiles = await getAllFiles(
            childEntry,
            path + entry.name + "/",
            collected,
          );
          files.push(...childFiles);
        }
      } catch (error) {
        console.error(
          `Error reading directory ${path}${entry.name}:`,
          error.message,
        );
      }
    }

    return files.slice(0, MAX_FILES);
  };

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) {
      console.log("❌ No files provided");
      setIsProcessing(false);
      return;
    }

    const MAX_FILES = 15;
    const MAX_FILE_SIZE = 500 * 1024; // 500KB
    const processedFiles = [];
    let skippedFiles = 0;
    let oversizedFiles = 0;

    console.log(`🚀 Starting to process ${fileList.length} files...`);
    console.log(
      `📋 Sample files:`,
      Array.from(fileList)
        .slice(0, 5)
        .map((f) => f.webkitRelativePath || f.name),
    );

    try {
      // AGGRESSIVE filtering for large projects
      let filteredFiles = Array.from(fileList);

      if (fileList.length > 1000) {
        console.log(
          `🔥 Large project detected (${fileList.length} files). Applying aggressive filtering...`,
        );

        // Pre-filter to remove obvious non-code files and folders
        filteredFiles = filteredFiles.filter((file) => {
          const path = (file.webkitRelativePath || file.name).toLowerCase();

          // Skip files in excluded folders
          const excludedFolders = [
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
            "__pycache__",
            ".cache",
            "public",
            "assets",
            "static",
            "images",
            "img",
            "fonts",
            "docs",
            "documentation",
            "test",
            "tests",
            "spec",
            "specs",
            "__tests__",
            ".github",
            ".vscode",
            ".idea",
            "tmp",
            "temp",
            "logs",
            "log",
            "backup",
            "backups",
          ];

          const shouldExclude = excludedFolders.some((folder) => {
            return (
              path.includes(`/${folder}/`) ||
              path.includes(`\\${folder}\\`) ||
              path.startsWith(`${folder}/`) ||
              path.startsWith(`${folder}\\`)
            );
          });

          if (shouldExclude) {
            return false;
          }

          // Only keep known code file extensions
          const codeExtensions = [
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".vue",
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
            ".html",
            ".css",
            ".scss",
            ".sass",
            ".less",
            ".json",
            ".md",
          ];
          const hasCodeExtension = codeExtensions.some((ext) =>
            path.endsWith(ext),
          );

          return hasCodeExtension;
        });

        console.log(
          `📉 Filtered from ${fileList.length} to ${filteredFiles.length} files`,
        );

        // If still too many, take only the most relevant ones
        if (filteredFiles.length > 200) {
          // Prioritize src, components, lib folders
          filteredFiles.sort((a, b) => {
            const aPath = (a.webkitRelativePath || a.name).toLowerCase();
            const bPath = (b.webkitRelativePath || b.name).toLowerCase();

            const highPriorityPaths = [
              "src/",
              "components/",
              "lib/",
              "utils/",
              "hooks/",
              "pages/",
              "app/",
            ];
            const aScore = highPriorityPaths.reduce(
              (score, path) => score + (aPath.includes(path) ? 10 : 0),
              0,
            );
            const bScore = highPriorityPaths.reduce(
              (score, path) => score + (bPath.includes(path) ? 10 : 0),
              0,
            );

            if (aScore !== bScore) return bScore - aScore;
            return a.size - b.size; // Then by size
          });

          filteredFiles = filteredFiles.slice(0, 200);
          console.log(
            `🎯 Further filtered to ${filteredFiles.length} most relevant files`,
          );
        }
      }

      // Use pre-filtered files and filter out oversized ones
      const validSizedFiles = filteredFiles.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          oversizedFiles++;
          return false;
        }
        return true;
      });

      // Prioritize code folders over config/public folders
      const prioritizedFiles = validSizedFiles.sort((a, b) => {
        const aPath = (a.webkitRelativePath || a.name).toLowerCase();
        const bPath = (b.webkitRelativePath || b.name).toLowerCase();

        // High priority paths (src, components, etc.)
        const highPriorityPaths = [
          "/src/",
          "/components/",
          "/lib/",
          "/utils/",
          "/hooks/",
          "/pages/",
          "/app/",
        ];
        const lowPriorityPaths = [
          "/public/",
          "/assets/",
          "/static/",
          "/docs/",
          "/config/",
        ];

        const aHighPriority = highPriorityPaths.some((path) =>
          aPath.includes(path),
        );
        const bHighPriority = highPriorityPaths.some((path) =>
          bPath.includes(path),
        );
        const aLowPriority = lowPriorityPaths.some((path) =>
          aPath.includes(path),
        );
        const bLowPriority = lowPriorityPaths.some((path) =>
          bPath.includes(path),
        );

        // Prioritize high priority paths
        if (aHighPriority && !bHighPriority) return -1;
        if (!aHighPriority && bHighPriority) return 1;

        // Deprioritize low priority paths
        if (aLowPriority && !bLowPriority) return 1;
        if (!aLowPriority && bLowPriority) return -1;

        // Then sort by size (smaller first)
        return a.size - b.size;
      });

      const sortedFiles = prioritizedFiles.slice(0, MAX_FILES * 3); // Check 3x as many to find the best files

      console.log(
        `Processing ${sortedFiles.length} files after size filtering...`,
      );

      // Process files in chunks to avoid blocking UI
      const CHUNK_SIZE = 10;
      for (
        let chunkStart = 0;
        chunkStart < sortedFiles.length && processedFiles.length < MAX_FILES;
        chunkStart += CHUNK_SIZE
      ) {
        const chunk = sortedFiles.slice(chunkStart, chunkStart + CHUNK_SIZE);

        for (const file of chunk) {
          if (processedFiles.length >= MAX_FILES) break;

          const filepath = file.webkitRelativePath || file.name;

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
                console.log(`✓ Processed: ${filepath}`);
              } else {
                skippedFiles++;
              }
            } catch (error) {
              console.error(`× Error reading ${file.name}:`, error);
              skippedFiles++;
            }
          } else {
            skippedFiles++;
          }
        }

        // Allow UI to update between chunks
        if (chunkStart + CHUNK_SIZE < sortedFiles.length) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }

      // Show detailed feedback
      console.log(`\n=== PROCESSING SUMMARY ===`);
      console.log(`Total files submitted: ${fileList.length}`);
      console.log(`Files processed successfully: ${processedFiles.length}`);
      console.log(`Files skipped: ${skippedFiles}`);
      console.log(`Files excluded (over 500KB): ${oversizedFiles}`);
      console.log(`========================\n`);

      if (processedFiles.length === 0) {
        let message;
        if (fileList.length > 10000) {
          message =
            `⚠️ Massive project detected (${fileList.length.toLocaleString()} files)!\n\n` +
            `For projects this large, please select a specific subfolder:\n` +
            `• Select the 'src' folder instead of root\n` +
            `• Or select 'components', 'lib', 'pages' folders\n\n` +
            `This will make processing much faster and find your actual code files.`;
        } else if (fileList.length > 1000) {
          message =
            `Large project (${fileList.length} files) - no code files found after filtering.\n\n` +
            `Try selecting a specific subfolder like 'src' for better results.`;
        } else {
          message = `No valid code files found.\n\nChecked ${fileList.length} files.\n\nSupported: JS, TS, Python, HTML, CSS, and more.`;
        }

        alert(message);
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
    console.log(`🔍 Checking file: ${filepath} (${filename})`);

    // More lenient exclusion - only exclude if CLEARLY in these folders
    const excludedFolders = [
      "node_modules",
      ".git",
      "dist",
      "build",
      "coverage",
      ".next",
      ".nuxt",
      "vendor",
      "target",
      "__pycache__",
      ".cache",
      ".vscode",
      ".idea",
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
    ];

    // Check if file is in excluded folder (more lenient)
    const pathParts = filepath.toLowerCase().split(/[/\\]/);
    const isInExcludedFolder = excludedFolders.some((folder) =>
      pathParts.includes(folder.toLowerCase()),
    );

    // Check if file is excluded (exact filename match)
    const isExcludedFile = excludedFiles.some(
      (excludedFile) => filename.toLowerCase() === excludedFile.toLowerCase(),
    );

    if (isInExcludedFolder) {
      console.log(`❌ Excluded (folder): ${filepath}`);
      return false;
    }

    if (isExcludedFile) {
      console.log(`❌ Excluded (filename): ${filepath}`);
      return false;
    }

    // Code file extensions - be more inclusive
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
    ];

    const isCodeFile = codeExtensions.some((ext) =>
      filename.toLowerCase().endsWith(ext.toLowerCase()),
    );

    if (isCodeFile) {
      console.log(`✅ Accepted: ${filepath}`);
      return true;
    } else {
      console.log(`❓ Not a code file: ${filepath}`);
      return false;
    }
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
          accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rust,.swift,.kt,.scala,.r,.html,.css,.scss,.sass,.less,.sql,.json,.xml,.yaml,.yml,.md,.sh,.bash,.ps1,.vue"
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
