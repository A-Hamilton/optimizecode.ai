// Updated for TypeScript migration
import React, { useState, useCallback, useRef } from "react";
import { FileDropZoneProps, CodeFile } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useNotificationHelpers } from "../contexts/NotificationContext";

interface NotificationProps {
  message: string;
  type: "error" | "warning" | "info";
  onClose: () => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesSelected,
  files,
}) => {
  const { userProfile } = useAuth();
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "warning" | "info";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Get user plan limits
  const maxFiles = userProfile?.limits?.maxFileUploads || 2;
  const maxFileSize = (userProfile?.limits?.maxFileSize || 1) * 1024 * 1024; // Convert MB to bytes
  const planName = userProfile?.subscription?.plan || "free";

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

  // COMPLETELY REWRITTEN - Foolproof exclusion logic with user plan limits
  const getAllFiles = async (
    entry: FileSystemEntry,
    currentPath: string = "",
  ): Promise<File[]> => {
    const files: File[] = [];
    const MAX_FILES = maxFiles === -1 ? 100 : maxFiles; // Use user limit or reasonable cap for unlimited
    const MAX_FILE_SIZE = maxFileSize;

    if (entry.isFile) {
      try {
        const file: File = await new Promise((resolve) => entry.file(resolve));
        const fullPath = currentPath + file.name;

        // STRICT path checking - if any part of the path contains forbidden terms, REJECT
        if (isPathBlocked(fullPath)) {
          return files; // Skip this file - blocked path
        }

        if (file.size > MAX_FILE_SIZE) {
          console.warn(
            `File ${file.name} exceeds size limit (${(file.size / (1024 * 1024)).toFixed(1)}MB > ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)}MB)`,
          );
          return files; // Skip this file - too large
        }

        if (!isValidSourceFile(file.name)) {
          return files; // Skip this file - invalid type
        }

        Object.defineProperty(file, "webkitRelativePath", {
          value: fullPath,
          writable: false,
        });
        files.push(file);
      } catch (error) {
        console.error(`Error processing file:`, error);
      }
    } else if (entry.isDirectory) {
      const dirPath = currentPath + entry.name + "/";

      // CRITICAL: Check if this directory or any parent directory is blocked
      if (isPathBlocked(dirPath)) {
        console.log(`🚫 BLOCKED DIRECTORY: ${dirPath}`);
        return files; // Skip entire directory and all contents
      }

      try {
        const directoryReader = entry.createReader();
        const entries: any[] = await new Promise((resolve, reject) => {
          directoryReader.readEntries(resolve, reject);
        });

        for (const subEntry of entries) {
          if (files.length >= MAX_FILES) break;

          const subFiles = await getAllFiles(subEntry, dirPath);
          files.push(...subFiles);
        }
      } catch (error) {
        console.error(`Error processing directory ${dirPath}:`, error);
      }
    }

    return files;
  };

  // FOOLPROOF path blocking - checks EVERY part of the path
  const isPathBlocked = (path: string): boolean => {
    const lowerPath = path.toLowerCase();

    // These terms ANYWHERE in the path will block the file/directory
    const blockedTerms = [
      "node_modules",
      "bower_components",
      "vendor",
      "/.git/",
      ".git/",
      "/dist/",
      "/build/",
      "/out/",
      "/target/",
      "/bin/",
      "/obj/",
      "/.cache/",
      "/cache/",
      "/.next/",
      "/.nuxt/",
      "/coverage/",
      "/__pycache__/",
      "/.vscode/",
      "/.idea/",
      "/logs/",
      "/log/",
      "/tmp/",
      "/temp/",
      "/public/",
      "/static/",
      "/assets/",
      "/uploads/",
      "/media/",
      "/images/",
      "/img/",
      "/fonts/",
      "/docs/",
      "/doc/",
      "/documentation/",
    ];

    // Check if path contains any blocked terms
    const isBlocked = blockedTerms.some((term) => lowerPath.includes(term));

    if (isBlocked) {
      console.log(`🚫 Path blocked: ${path}`);
    }

    return isBlocked;
  };

  // Ultra-strict file validation - only accept actual source code
  const isValidSourceFile = (filename: string): boolean => {
    const lower = filename.toLowerCase();

    // Immediate rejections
    const rejected = [
      ".min.",
      ".bundle.",
      ".chunk.",
      ".map",
      ".lock",
      ".test.",
      ".spec.",
      ".config.",
      ".conf.",
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
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".svg",
      ".ico",
      ".mp4",
      ".mp3",
      ".zip",
      ".tar",
      ".gz",
      ".pdf",
    ];

    if (rejected.some((term) => lower.includes(term))) {
      return false;
    }

    // Only allow these exact extensions
    const allowed = [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".mjs",
      ".cjs",
      ".py",
      ".pyw",
      ".java",
      ".kt",
      ".scala",
      ".c",
      ".cpp",
      ".cc",
      ".h",
      ".hpp",
      ".cs",
      ".vb",
      ".php",
      ".rb",
      ".go",
      ".rs",
      ".swift",
      ".dart",
      ".html",
      ".htm",
      ".css",
      ".scss",
      ".sass",
      ".less",
      ".vue",
      ".svelte",
      ".sql",
      ".sh",
      ".bash",
      ".ps1",
    ];

    return allowed.some((ext) => lower.endsWith(ext));
  };

  const handleFiles = async (selectedFiles: File[]): Promise<void> => {
    console.log(`📁 Processing ${selectedFiles.length} files...`);

    // Check file count limit first
    const totalFilesAfterUpload = files.length + selectedFiles.length;
    if (maxFiles !== -1 && totalFilesAfterUpload > maxFiles) {
      showNotification(
        `File limit exceeded! Your ${planName} plan allows up to ${maxFiles} files per optimization. You currently have ${files.length} files and are trying to add ${selectedFiles.length} more.`,
        "error",
      );
      setIsProcessing(false);
      return;
    }

    const codeFiles: CodeFile[] = [];
    let blockedCount = 0;
    let oversizedCount = 0;
    let invalidTypeCount = 0;

    for (const file of selectedFiles) {
      const filePath = file.webkitRelativePath || file.name;

      // Check if we've reached the file limit
      if (maxFiles !== -1 && files.length + codeFiles.length >= maxFiles) {
        blockedCount += selectedFiles.length - selectedFiles.indexOf(file);
        break;
      }

      // Double-check: Block any file that somehow got through with blocked paths
      if (isPathBlocked(filePath)) {
        console.log(`🚫 File blocked by path: ${filePath}`);
        blockedCount++;
        continue;
      }

      // Check file size against user plan limits
      if (file.size > maxFileSize) {
        console.log(
          `🚫 File ${file.name} too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB > ${(maxFileSize / (1024 * 1024)).toFixed(1)}MB`,
        );
        oversizedCount++;
        continue;
      }

      if (!isValidSourceFile(file.name)) {
        invalidTypeCount++;
        continue;
      }

      try {
        const content = await readFileAsText(file);

        // Check for duplicates
        const isDuplicate = files.some(
          (existingFile) => existingFile.path === filePath,
        );

        if (!isDuplicate) {
          codeFiles.push({
            name: file.name,
            path: filePath,
            content,
            size: file.size,
            type: file.type || "text/plain",
            extension: file.name.split(".").pop() || "",
          });
          console.log(`✅ Added: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
        blockedCount++;
      }
    }

    console.log(
      `📊 Results: ${codeFiles.length} source files, ${blockedCount} blocked, ${oversizedCount} oversized, ${invalidTypeCount} invalid type`,
    );

    // Show appropriate messages
    if (codeFiles.length === 0) {
      let errorMessage = `No source code files could be processed.`;
      if (oversizedCount > 0) {
        errorMessage += ` ${oversizedCount} files exceeded the ${(maxFileSize / (1024 * 1024)).toFixed(1)}MB size limit for your ${planName} plan.`;
      }
      if (invalidTypeCount > 0) {
        errorMessage += ` ${invalidTypeCount} files were not recognized as source code.`;
      }
      if (blockedCount > 0) {
        errorMessage += ` ${blockedCount} files were filtered out.`;
      }
      showNotification(errorMessage, "error");
    } else {
      let message = `✅ Added ${codeFiles.length} source code files.`;

      const issueCount = oversizedCount + invalidTypeCount + blockedCount;
      if (issueCount > 0) {
        message += ` (${issueCount} files skipped:`;
        if (oversizedCount > 0) message += ` ${oversizedCount} too large,`;
        if (invalidTypeCount > 0)
          message += ` ${invalidTypeCount} invalid type,`;
        if (blockedCount > 0) message += ` ${blockedCount} filtered out,`;
        message = message.slice(0, -1) + ")"; // Remove last comma and add closing parenthesis
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-primary">
          Upload Code Files
        </h3>
        <div className="text-sm text-white/60">
          {maxFiles === -1 ? (
            <span className="text-green-400">✨ Unlimited files</span>
          ) : (
            <span>
              {files.length}/{maxFiles} files • Max{" "}
              {(maxFileSize / (1024 * 1024)).toFixed(0)}MB each
            </span>
          )}
        </div>
      </div>

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
              Blocking node_modules and dependencies
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-lg text-white/80 mb-2">
              Drop files or folders here
            </p>
            <p className="text-sm text-white/60 mb-6">
              <strong>Source code only:</strong> .js, .py, .java, .cpp, .html,
              .css, etc.
              <br />
              <span className="text-xs opacity-75">
                <strong>Plan limits:</strong>{" "}
                {maxFiles === -1 ? "Unlimited files" : `${maxFiles} files max`}{" "}
                • {(maxFileSize / (1024 * 1024)).toFixed(0)}MB per file
              </span>
              <br />
              <span className="text-xs opacity-75">
                <strong>⚠️ Automatically blocks:</strong> node_modules, build
                folders, config files, images
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
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-200">
                💡 <strong>Pro tip:</strong> Upload your <strong>src/</strong>{" "}
                or <strong>components/</strong> folder instead of the entire
                project to avoid unnecessary files.
              </p>
            </div>
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
