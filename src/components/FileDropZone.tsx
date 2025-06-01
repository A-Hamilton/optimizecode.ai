import React, { useState, useRef } from "react";
import { FileDropZoneProps, CodeFile } from "../types";

interface ProcessingStats {
  count: number;
  processed: number;
  skipped: number;
}

interface NotificationProps {
  message: string;
  type: "error" | "warning" | "info";
  onClose: () => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesSelected,
  files,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "warning" | "info";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (
    message: string,
    type: "error" | "warning" | "info" = "info",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const InlineNotification: React.FC<NotificationProps> = ({
    message,
    type,
    onClose,
  }) => {
    const typeStyles = {
      error: "bg-red-500/20 border-red-500/30 text-red-200",
      warning: "bg-yellow-500/20 border-yellow-500/30 text-yellow-200",
      info: "bg-blue-500/20 border-blue-500/30 text-blue-200",
    };

    return (
      <div
        className={`p-3 rounded-lg border mb-4 flex items-center justify-between ${typeStyles[type]}`}
      >
        <span className="text-sm">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-lg leading-none hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      </div>
    );
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
  ): Promise<void> => {
    e.preventDefault();
    setIsDragOver(false);
    setIsProcessing(true);

    setTimeout(async () => {
      try {
        const items = Array.from(e.dataTransfer.items);
        const allFiles: File[] = [];

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

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const selectedFiles = Array.from(e.target.files || []);
    setIsProcessing(true);

    setTimeout(async () => {
      try {
        await handleFiles(selectedFiles);
      } catch (error) {
        console.error("Error processing selected files:", error);
        setIsProcessing(false);
      }
    }, 10);
  };

  // MUCH more aggressive directory exclusion
  const isExcludedDirectory = (dirName: string, fullPath: string): boolean => {
    const lower = dirName.toLowerCase();
    const lowerPath = fullPath.toLowerCase();

    // Absolute exclusions - these directories are NEVER processed
    const absoluteExclusions = [
      // Package managers
      "node_modules",
      "bower_components",
      "jspm_packages",
      "vendor",
      // Version control
      ".git",
      ".svn",
      ".hg",
      ".bzr",
      // Build outputs
      "dist",
      "build",
      "out",
      "target",
      "bin",
      "obj",
      "release",
      "debug",
      // Caches
      ".cache",
      "cache",
      ".sass-cache",
      ".parcel-cache",
      ".webpack",
      ".next",
      ".nuxt",
      ".vuepress",
      ".docusaurus",
      // Test coverage
      "coverage",
      ".coverage",
      ".nyc_output",
      "htmlcov",
      // Python
      "__pycache__",
      ".pytest_cache",
      ".mypy_cache",
      ".tox",
      "venv",
      ".venv",
      "env",
      ".env",
      "virtualenv",
      "__env__",
      ".conda",
      "miniconda3",
      "anaconda3",
      // IDEs
      ".vscode",
      ".idea",
      ".eclipse",
      ".vs",
      ".vscode-test",
      // Logs
      "logs",
      "log",
      ".log",
      // Temp
      "tmp",
      "temp",
      ".tmp",
      ".temp",
      // OS
      ".ds_store",
      "thumbs.db",
      "$recycle.bin",
      "desktop.ini",
      // Static assets (usually not code)
      "public",
      "static",
      "assets",
      "uploads",
      "media",
      "images",
      "img",
      "pics",
      "photos",
      "videos",
      "audio",
      "fonts",
      "icons",
      "favicons",
      // Documentation (usually not source code)
      "docs",
      "doc",
      "documentation",
      "wiki",
      "man",
      "help",
    ];

    // Check if directory name exactly matches or contains excluded terms
    if (
      absoluteExclusions.some(
        (excluded) =>
          lower === excluded ||
          lower.includes(excluded) ||
          lowerPath.includes(`/${excluded}/`) ||
          lowerPath.endsWith(`/${excluded}`),
      )
    ) {
      return true;
    }

    // Exclude hidden directories (starting with .) except for special source directories
    if (lower.startsWith(".")) {
      const allowedHiddenDirs = [
        "src",
        "lib",
        "app",
        "components",
        "pages",
        "utils",
        "helpers",
      ];
      if (!allowedHiddenDirs.some((allowed) => lower.includes(allowed))) {
        return true;
      }
    }

    // Exclude very deep nesting (performance optimization)
    const pathDepth = fullPath.split("/").length;
    if (pathDepth > 8) {
      return true;
    }

    return false;
  };

  const getAllFiles = async (
    entry: any,
    path: string = "",
    collected: ProcessingStats = { count: 0, processed: 0, skipped: 0 },
    depth: number = 0,
  ): Promise<File[]> => {
    const files: File[] = [];
    const MAX_FILES = 20; // Reduced from 15
    const MAX_FILE_SIZE = 300 * 1024; // Reduced to 300KB
    const MAX_DEPTH = 6; // Limit directory depth
    const MAX_TOTAL_PROCESSED = 500; // Stop after processing 500 items

    // Early termination conditions
    if (
      depth > MAX_DEPTH ||
      collected.count >= MAX_TOTAL_PROCESSED ||
      files.length >= MAX_FILES ||
      collected.processed >= 100 // Don't process more than 100 files
    ) {
      return files;
    }

    if (entry.isFile) {
      collected.count++;

      try {
        const file: File = await new Promise((resolve) => entry.file(resolve));
        const fullPath = path + file.name;

        // Quick size and extension check first (fastest)
        if (file.size > MAX_FILE_SIZE) {
          collected.skipped++;
          return files;
        }

        if (isSourceCodeFile(file.name)) {
          collected.processed++;
          Object.defineProperty(file, "webkitRelativePath", {
            value: fullPath,
            writable: false,
          });
          files.push(file);
        } else {
          collected.skipped++;
        }
      } catch (error) {
        console.error(`Error processing file ${path}${entry.name}:`, error);
        collected.skipped++;
      }
    } else if (entry.isDirectory) {
      const fullDirPath = path + entry.name;

      // AGGRESSIVE directory filtering - check BEFORE entering directory
      if (isExcludedDirectory(entry.name, fullDirPath)) {
        collected.skipped++;
        return files; // Skip entire directory tree
      }

      try {
        const directoryReader = entry.createReader();
        const entries: any[] = await new Promise((resolve, reject) => {
          directoryReader.readEntries(resolve, reject);
        });

        // Process subdirectories and files
        for (const subEntry of entries) {
          if (files.length >= MAX_FILES) break; // Stop early if we have enough files

          const subFiles = await getAllFiles(
            subEntry,
            fullDirPath + "/",
            collected,
            depth + 1,
          );
          files.push(...subFiles);
        }
      } catch (error) {
        console.error(`Error processing directory ${fullDirPath}:`, error);
        collected.skipped++;
      }
    }

    return files;
  };

  // Simplified and stricter file extension check
  const isSourceCodeFile = (filename: string): boolean => {
    const lower = filename.toLowerCase();

    // Quick exclusions first
    const quickExclusions = [
      ".min.",
      ".bundle.",
      ".chunk.",
      ".compiled.",
      ".map",
      ".lock",
      ".test.",
      ".spec.",
      ".config.",
      ".conf.",
      "config.",
      ".d.ts",
      ".json",
      ".xml",
      ".yml",
      ".yaml",
      ".toml",
      ".ini",
      ".md",
      ".txt",
      ".log",
      ".env",
      "readme",
      "license",
      "changelog",
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".svg",
      ".ico",
      ".webp",
      ".mp4",
      ".avi",
      ".mov",
      ".mp3",
      ".wav",
      ".zip",
      ".tar",
      ".gz",
    ];

    if (quickExclusions.some((exc) => lower.includes(exc))) {
      return false;
    }

    // Only allow specific source code extensions
    const sourceExtensions = [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".mjs",
      ".cjs", // JavaScript/TypeScript
      ".py",
      ".pyw", // Python
      ".java",
      ".kt",
      ".scala", // JVM languages
      ".c",
      ".cpp",
      ".cc",
      ".h",
      ".hpp", // C/C++
      ".cs",
      ".vb", // .NET
      ".php", // PHP
      ".rb", // Ruby
      ".go", // Go
      ".rs", // Rust
      ".swift", // Swift
      ".dart", // Dart
      ".html",
      ".htm",
      ".css",
      ".scss",
      ".sass", // Web
      ".vue",
      ".svelte", // Frameworks
      ".sql", // SQL
      ".sh",
      ".bash",
      ".ps1",
      ".bat", // Scripts
    ];

    return sourceExtensions.some((ext) => lower.endsWith(ext));
  };

  const handleFiles = async (selectedFiles: File[]): Promise<void> => {
    const codeFiles: CodeFile[] = [];
    let filteredCount = 0;
    let oversizedCount = 0;

    // Process files with stricter limits
    const MAX_PROCESS = 50; // Don't even attempt to process more than 50 files
    const filesToProcess = selectedFiles.slice(0, MAX_PROCESS);

    if (selectedFiles.length > MAX_PROCESS) {
      showNotification(
        `Too many files selected. Processing first ${MAX_PROCESS} files only. Consider uploading specific source directories instead of entire projects.`,
        "warning",
      );
    }

    for (const file of filesToProcess) {
      // Size check
      if (file.size > 300 * 1024) {
        oversizedCount++;
        continue;
      }

      // File type check
      if (!isSourceCodeFile(file.name)) {
        filteredCount++;
        continue;
      }

      try {
        const content = await readFileAsText(file);
        const relativePath = file.webkitRelativePath || file.name;

        // Check for duplicates
        const isDuplicate = files.some(
          (existingFile) => existingFile.path === relativePath,
        );

        if (!isDuplicate) {
          codeFiles.push({
            name: file.name,
            path: relativePath,
            content,
            size: file.size,
            type: file.type || "text/plain",
            extension: file.name.split(".").pop() || "",
          });
        }
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
        filteredCount++;
      }
    }

    // Better notifications
    if (codeFiles.length === 0) {
      showNotification(
        "No source code files found. Make sure you're selecting actual programming files (.js, .py, .java, etc.) and not config/build directories.",
        "warning",
      );
    } else {
      let message = `Found ${codeFiles.length} source code files.`;
      if (filteredCount > 0) {
        message += ` Filtered out ${filteredCount} non-source files.`;
      }
      if (oversizedCount > 0) {
        message += ` Skipped ${oversizedCount} oversized files (>300KB).`;
      }
      showNotification(message, "info");
    }

    // Append new files to existing files
    const updatedFiles = [...files, ...codeFiles];
    onFilesSelected(updatedFiles);
    setIsProcessing(false);
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const removeFile = (indexToRemove: number): void => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    onFilesSelected(updatedFiles);
  };

  const removeAllFiles = (): void => {
    onFilesSelected([]);
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-primary mb-4 text-left">
        Upload Code Files
      </h3>

      {/* Inline Notification */}
      {notification && (
        <InlineNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
            : "border-white/20 bg-white/5 hover:border-primary/50 hover:bg-white/8"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/70">Processing files...</p>
            <p className="text-xs text-white/50">
              Filtering out dependencies and config files
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-lg text-white/80 mb-2">
              Drop files or folders here
            </p>
            <p className="text-sm text-white/60 mb-6">
              <strong>Source code only:</strong> JavaScript, TypeScript, Python,
              Java, C++, HTML, CSS
              <br />
              <span className="text-xs opacity-75">
                <strong>Auto-excluded:</strong> node_modules, build folders,
                config files, images, docs
              </span>
            </p>
            <div className="flex gap-4 justify-center">
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.swift,.kt,.scala,.html,.css,.scss,.sass,.vue,.svelte,.sql,.sh,.bash,.ps1,.dart"
              />
              <input
                type="file"
                multiple
                ref={folderInputRef}
                onChange={handleFileSelect}
                className="hidden"
                {...({ webkitdirectory: "" } as any)}
              />
              <button
                className="btn-secondary"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                Select Files
              </button>
              <button
                className="btn-secondary"
                onClick={() => folderInputRef.current?.click()}
                type="button"
              >
                Select Folder
              </button>
            </div>
            <p className="text-xs text-white/40 mt-4">
              💡 Tip: Upload your <strong>src/</strong> folder instead of the
              entire project for best results
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-semibold text-primary">
              Selected Files ({files.length})
            </h4>
            <button
              className="text-sm px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded transition-all duration-300"
              onClick={removeAllFiles}
              type="button"
            >
              Remove All
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-all duration-300"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90 truncate">
                    {file.path}
                  </p>
                  <p className="text-xs text-white/60">
                    {(file.size / 1024).toFixed(1)} KB •{" "}
                    {file.extension.toUpperCase()}
                  </p>
                </div>
                <button
                  className="ml-3 text-red-400 hover:text-red-300 transition-colors"
                  onClick={() => removeFile(index)}
                  type="button"
                  aria-label={`Remove ${file.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropZone;
