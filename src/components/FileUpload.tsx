import React, { useState, useCallback, useRef, useEffect } from "react";
import { CodeFile } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useNotificationHelpers } from "../contexts/NotificationContext";

interface FileUploadProps {
  files: CodeFile[];
  onFilesChange: (files: CodeFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  showPreview?: boolean;
  enableDragAndDrop?: boolean;
  allowFolders?: boolean;
}

interface FilePreview {
  file: CodeFile;
  isSelected: boolean;
  hasErrors: boolean;
  errorMessage?: string;
}

const SUPPORTED_EXTENSIONS = [
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
  ".json",
  ".xml",
  ".yaml",
  ".yml",
  ".toml",
];

const BLOCKED_PATTERNS = [
  "node_modules",
  "bower_components",
  "vendor",
  ".git",
  "dist",
  "build",
  "out",
  "target",
  "bin",
  "obj",
  ".cache",
  "cache",
  ".next",
  ".nuxt",
  "coverage",
  "__pycache__",
  ".vscode",
  ".idea",
  "logs",
  "log",
  "tmp",
  "temp",
  "public",
  "static",
  "assets",
  "uploads",
  "media",
  "images",
  "img",
  "fonts",
  "docs",
  "doc",
  "documentation",
];

const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles,
  maxFileSize,
  acceptedFileTypes = SUPPORTED_EXTENSIONS,
  showPreview = true,
  enableDragAndDrop = true,
  allowFolders = true,
}) => {
  const { userProfile } = useAuth();
  const { showSuccess, showError, showWarning } = useNotificationHelpers();

  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "size" | "type">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [previewFile, setPreviewFile] = useState<CodeFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Get user limits
  const actualMaxFiles = maxFiles ?? userProfile?.limits?.maxFileUploads ?? 5;
  const actualMaxFileSize =
    maxFileSize ?? userProfile?.limits?.maxFileSize ?? 5; // MB

  // File processing
  const processFiles = useCallback(
    async (fileList: FileList | File[]): Promise<CodeFile[]> => {
      const processedFiles: CodeFile[] = [];
      const errors: string[] = [];

      for (const file of Array.from(fileList)) {
        try {
          // Check file size
          if (file.size > actualMaxFileSize * 1024 * 1024) {
            errors.push(
              `${file.name}: File too large (${(file.size / 1024 / 1024).toFixed(1)}MB > ${actualMaxFileSize}MB)`,
            );
            continue;
          }

          // Check file type
          const extension = "." + file.name.split(".").pop()?.toLowerCase();
          if (!acceptedFileTypes.includes(extension)) {
            errors.push(`${file.name}: Unsupported file type`);
            continue;
          }

          // Check blocked patterns
          const path = (file as any).webkitRelativePath || file.name;
          if (
            BLOCKED_PATTERNS.some((pattern) =>
              path.toLowerCase().includes(pattern),
            )
          ) {
            continue; // Skip silently for blocked patterns
          }

          // Read file content
          const content = await readFileContent(file);

          // Validate content
          if (content.length === 0) {
            errors.push(`${file.name}: File is empty`);
            continue;
          }

          if (content.length > 500000) {
            // 500KB character limit
            errors.push(`${file.name}: File content too large`);
            continue;
          }

          const codeFile: CodeFile = {
            name: file.name,
            path: path,
            content,
            size: file.size,
            type: file.type || "text/plain",
            extension: extension.substring(1),
          };

          processedFiles.push(codeFile);
        } catch (error) {
          errors.push(`${file.name}: Failed to process file`);
        }
      }

      if (errors.length > 0) {
        showWarning(
          `Some files were skipped: ${errors.slice(0, 3).join(", ")}${errors.length > 3 ? ` and ${errors.length - 3} more` : ""}`,
        );
      }

      return processedFiles;
    },
    [actualMaxFileSize, acceptedFileTypes, showWarning],
  );

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (enableDragAndDrop) {
        setIsDragActive(true);
      }
    },
    [enableDragAndDrop],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (!enableDragAndDrop) return;

      setIsProcessing(true);

      try {
        const items = Array.from(e.dataTransfer.items);
        const allFiles: File[] = [];

        for (const item of items) {
          if (item.kind === "file") {
            const entry = item.webkitGetAsEntry();
            if (entry) {
              const files = await getAllFilesFromEntry(entry);
              allFiles.push(...files);
            }
          }
        }

        await handleFiles(allFiles);
      } catch (error) {
        showError("Failed to process dropped files");
      } finally {
        setIsProcessing(false);
      }
    },
    [enableDragAndDrop, showError],
  );

  const getAllFilesFromEntry = async (
    entry: FileSystemEntry,
  ): Promise<File[]> => {
    const files: File[] = [];

    if (entry.isFile) {
      const file = await new Promise<File>((resolve) => {
        (entry as FileSystemFileEntry).file(resolve);
      });
      files.push(file);
    } else if (entry.isDirectory) {
      const dirReader = (entry as FileSystemDirectoryEntry).createReader();
      const entries = await new Promise<FileSystemEntry[]>(
        (resolve, reject) => {
          dirReader.readEntries(resolve, reject);
        },
      );

      for (const childEntry of entries) {
        const childFiles = await getAllFilesFromEntry(childEntry);
        files.push(...childFiles);
      }
    }

    return files;
  };

  // File selection handlers
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    setIsProcessing(true);
    await handleFiles(Array.from(fileList));
    setIsProcessing(false);

    // Reset input
    e.target.value = "";
  };

  const handleFiles = async (fileList: File[]) => {
    // Check total file limit
    if (
      actualMaxFiles !== -1 &&
      files.length + fileList.length > actualMaxFiles
    ) {
      showError(
        `File limit exceeded! You can upload up to ${actualMaxFiles} files. Currently have ${files.length} files.`,
      );
      return;
    }

    const processedFiles = await processFiles(fileList);

    if (processedFiles.length === 0) {
      showError("No valid files found to upload");
      return;
    }

    // Check for duplicates
    const existingPaths = new Set(files.map((f) => f.path));
    const newFiles = processedFiles.filter((f) => !existingPaths.has(f.path));

    if (newFiles.length === 0) {
      showWarning("All selected files are already uploaded");
      return;
    }

    const updatedFiles = [...files, ...newFiles];
    onFilesChange(updatedFiles);

    showSuccess(
      `Added ${newFiles.length} file${newFiles.length === 1 ? "" : "s"} successfully!`,
    );
  };

  // File management
  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      // Update indices for remaining files
      const updatedSet = new Set<number>();
      newSet.forEach((i) => {
        if (i < index) updatedSet.add(i);
        else if (i > index) updatedSet.add(i - 1);
      });
      return updatedSet;
    });
  };

  const removeSelectedFiles = () => {
    const updatedFiles = files.filter((_, index) => !selectedFiles.has(index));
    onFilesChange(updatedFiles);
    setSelectedFiles(new Set());
    showSuccess(`Removed ${selectedFiles.size} files`);
  };

  const removeAllFiles = () => {
    onFilesChange([]);
    setSelectedFiles(new Set());
    showSuccess("All files removed");
  };

  // File sorting and filtering
  const filteredAndSortedFiles = React.useMemo(() => {
    let filtered = files;

    // Apply search filter
    if (searchTerm) {
      filtered = files.filter(
        (file) =>
          file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.extension.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "size":
          comparison = a.size - b.size;
          break;
        case "type":
          comparison = a.extension.localeCompare(b.extension);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [files, searchTerm, sortBy, sortOrder]);

  // File selection
  const toggleFileSelection = (index: number) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const selectAllFiles = () => {
    setSelectedFiles(new Set(filteredAndSortedFiles.map((_, index) => index)));
  };

  const clearSelection = () => {
    setSelectedFiles(new Set());
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Get file icon
  const getFileIcon = (extension: string): string => {
    const iconMap: { [key: string]: string } = {
      js: "🟨",
      jsx: "🟨",
      ts: "🔷",
      tsx: "🔷",
      py: "🐍",
      java: "☕",
      cpp: "⚡",
      c: "⚡",
      html: "🌐",
      css: "🎨",
      php: "🐘",
      rb: "💎",
      go: "🐹",
      rs: "🦀",
      swift: "🦉",
      kt: "💚",
      json: "📄",
      xml: "📄",
      yml: "📄",
      yaml: "📄",
      sql: "🗃️",
      sh: "🐚",
      bash: "🐚",
    };
    return iconMap[extension] || "📄";
  };

  return (
    <div className="file-upload-container w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-primary">File Upload</h3>
          <div className="text-sm text-white/60">
            {actualMaxFiles === -1 ? (
              <span className="text-green-400">✨ Unlimited files</span>
            ) : (
              <span>
                {files.length}/{actualMaxFiles} files • Max {actualMaxFileSize}
                MB each
              </span>
            )}
          </div>
        </div>

        {files.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">
              {filteredAndSortedFiles.length} of {files.length} files
            </span>
          </div>
        )}
      </div>

      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragActive
            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-105"
            : isProcessing
              ? "border-yellow-500 bg-yellow-500/10"
              : "border-white/20 bg-white/5 hover:border-primary/50 hover:bg-white/8"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/70 font-medium">Processing files...</p>
            <p className="text-xs text-white/50">
              Filtering out dependencies and build files
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-6xl mb-4">{isDragActive ? "🎯" : "📁"}</div>

            <div>
              <h4 className="text-xl font-semibold text-white mb-2">
                {isDragActive ? "Drop files here!" : "Upload Code Files"}
              </h4>
              <p className="text-white/70 mb-4">
                Drag and drop files or folders, or click to select files
              </p>
            </div>

            {/* Supported formats */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-300 font-medium mb-2">
                ✅ Supported formats:
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  "JavaScript",
                  "TypeScript",
                  "Python",
                  "Java",
                  "C++",
                  "C#",
                  "PHP",
                  "Ruby",
                  "Go",
                  "Rust",
                  "Swift",
                  "HTML",
                  "CSS",
                ].map((lang) => (
                  <span
                    key={lang}
                    className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded"
                  >
                    {lang}
                  </span>
                ))}
                <span className="text-blue-200/70">and more...</span>
              </div>
            </div>

            {/* Upload buttons */}
            <div className="flex gap-4 justify-center">
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept={acceptedFileTypes.join(",")}
                className="hidden"
              />
              <input
                type="file"
                multiple
                ref={folderInputRef}
                onChange={handleFileSelect}
                {...(allowFolders ? ({ webkitdirectory: "" } as any) : {})}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-primary hover:bg-primary-dark border border-primary/30 hover:border-primary rounded-lg font-medium transition-all duration-300 hover:scale-105"
                disabled={isProcessing}
              >
                📁 Select Files
              </button>

              {allowFolders && (
                <button
                  onClick={() => folderInputRef.current?.click()}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                  disabled={isProcessing}
                >
                  📂 Select Folder
                </button>
              )}
            </div>

            {/* Pro tip */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-green-300 text-sm">
                💡 <strong>Pro tip:</strong> Upload your{" "}
                <code className="bg-green-500/20 px-2 py-1 rounded">src/</code>{" "}
                or{" "}
                <code className="bg-green-500/20 px-2 py-1 rounded">
                  components/
                </code>{" "}
                folder instead of the entire project to avoid unnecessary files.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-8 space-y-4">
          {/* File Management Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <h4 className="font-semibold text-white">
                Uploaded Files ({files.length})
              </h4>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/40 focus:border-primary focus:outline-none"
                />
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/40">
                  🔍
                </span>
              </div>
            </div>

            {/* File actions */}
            <div className="flex items-center gap-2">
              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split(
                    "-",
                  ) as [typeof sortBy, typeof sortOrder];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm text-white focus:border-primary focus:outline-none"
              >
                <option value="name-asc" className="bg-gray-800">
                  Name A-Z
                </option>
                <option value="name-desc" className="bg-gray-800">
                  Name Z-A
                </option>
                <option value="size-asc" className="bg-gray-800">
                  Size ↑
                </option>
                <option value="size-desc" className="bg-gray-800">
                  Size ↓
                </option>
                <option value="type-asc" className="bg-gray-800">
                  Type A-Z
                </option>
                <option value="type-desc" className="bg-gray-800">
                  Type Z-A
                </option>
              </select>

              {selectedFiles.size > 0 && (
                <button
                  onClick={removeSelectedFiles}
                  className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded text-sm text-red-300 hover:text-red-200 transition-all duration-300"
                >
                  Remove Selected ({selectedFiles.size})
                </button>
              )}

              <button
                onClick={removeAllFiles}
                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded text-sm text-red-300 hover:text-red-200 transition-all duration-300"
              >
                Remove All
              </button>
            </div>
          </div>

          {/* Selection controls */}
          {files.length > 1 && (
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={selectAllFiles}
                className="text-primary hover:text-primary-light transition-colors"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="text-white/60 hover:text-white/80 transition-colors"
              >
                Clear Selection
              </button>
              <span className="text-white/40">|</span>
              <span className="text-white/60">
                {selectedFiles.size} of {files.length} selected
              </span>
            </div>
          )}

          {/* File list */}
          <div className="max-h-80 overflow-y-auto space-y-2 bg-white/5 border border-white/10 rounded-lg p-4">
            {filteredAndSortedFiles.map((file, index) => {
              const originalIndex = files.indexOf(file);
              const isSelected = selectedFiles.has(originalIndex);

              return (
                <div
                  key={`${file.path}-${originalIndex}`}
                  className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-300 hover:bg-white/8 ${
                    isSelected
                      ? "bg-primary/10 border-primary/30"
                      : "bg-white/3 border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Selection checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleFileSelection(originalIndex)}
                    className="w-4 h-4 text-primary bg-white/10 border-white/20 rounded focus:ring-primary focus:ring-2"
                  />

                  {/* File icon */}
                  <div className="text-2xl">{getFileIcon(file.extension)}</div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white truncate">
                        {file.name}
                      </p>
                      <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
                        {file.extension.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 truncate">
                      {file.path} • {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {showPreview && (
                      <button
                        onClick={() => setPreviewFile(file)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-all duration-300"
                        title="Preview file"
                      >
                        👁️
                      </button>
                    )}

                    <button
                      onClick={() => removeFile(originalIndex)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-all duration-300"
                      title="Remove file"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredAndSortedFiles.length === 0 && searchTerm && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-white/60">No files match your search</p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-2 text-primary hover:text-primary-light"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-white/20 max-w-4xl max-h-[80vh] w-full flex flex-col">
            {/* Preview header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {previewFile.name}
                </h3>
                <p className="text-sm text-white/60">
                  {formatFileSize(previewFile.size)} •{" "}
                  {previewFile.extension.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-all duration-300"
              >
                ✕
              </button>
            </div>

            {/* Preview content */}
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-sm text-white/90 font-mono leading-relaxed whitespace-pre-wrap">
                {previewFile.content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
