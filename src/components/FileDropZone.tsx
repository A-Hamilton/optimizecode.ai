import React, { useState, useRef } from "react";
import { FileDropZoneProps, CodeFile } from "../types";

interface ProcessingStats {
  count: number;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesSelected,
  files,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

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

    // Use setTimeout to ensure loading state shows immediately
    setTimeout(async () => {
      try {
        const items = Array.from(e.dataTransfer.items);
        const allFiles: File[] = [];

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

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const selectedFiles = Array.from(e.target.files || []);
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

  const getAllFiles = async (
    entry: any,
    path: string = "",
    collected: ProcessingStats = { count: 0 },
  ): Promise<File[]> => {
    const files: File[] = [];
    const MAX_FILES = 15;
    const MAX_FILE_SIZE = 500 * 1024; // 500KB

    // Early termination for performance
    if (collected.count >= 1000 || files.length >= MAX_FILES) {
      return files;
    }

    if (entry.isFile) {
      collected.count++;
      try {
        const file: File = await new Promise((resolve) => entry.file(resolve));
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
      // Enhanced directory exclusion for better performance and relevance
      const excludedDirs = [
        "node_modules",
        ".git",
        ".svn",
        ".hg",
        "dist",
        "build",
        "out",
        "target",
        "bin",
        "obj",
        "__pycache__",
        ".pytest_cache",
        "coverage",
        ".coverage",
        ".nyc_output",
        ".next",
        ".nuxt",
        ".vscode",
        ".idea",
        ".eclipse",
        "vendor",
        "logs",
        "log",
        "tmp",
        "temp",
        "cache",
        ".cache",
        "public",
        "static",
        "assets",
        "images",
        "img",
        "fonts",
        "media",
        "uploads",
        ".sass-cache",
        ".parcel-cache",
        ".webpack",
        "bower_components",
        "jspm_packages",
        ".meteor",
        ".venv",
        "venv",
        "env",
        ".env",
        "virtualenv",
        "__env__",
        ".tox",
        ".mypy_cache",
        ".pytest_cache",
        ".DS_Store",
        "Thumbs.db",
      ];

      // Skip if it's an excluded directory (case-insensitive and contains check)
      const dirName = entry.name.toLowerCase();
      if (
        excludedDirs.some(
          (dir) =>
            dirName === dir.toLowerCase() ||
            dirName.includes(dir.toLowerCase()),
        )
      ) {
        return files;
      }

      // Skip hidden directories (starting with .)
      if (
        dirName.startsWith(".") &&
        !["src", "lib", "app"].some((allowed) => dirName.includes(allowed))
      ) {
        return files;
      }

      try {
        const directoryReader = entry.createReader();
        const entries: any[] = await new Promise((resolve, reject) => {
          directoryReader.readEntries(resolve, reject);
        });

        for (const subEntry of entries) {
          const subFiles = await getAllFiles(
            subEntry,
            path + entry.name + "/",
            collected,
          );
          files.push(...subFiles);

          // Safety check to prevent infinite processing
          if (files.length >= MAX_FILES) {
            break;
          }
        }
      } catch (error) {
        console.error(
          `Error processing directory ${path}${entry.name}:`,
          error,
        );
      }
    }

    return files;
  };

  const isCodeFile = (filename: string, fullPath: string): boolean => {
    // Enhanced exclusion patterns for better filtering
    const excludePatterns = [
      ".test.",
      ".spec.",
      ".config.",
      ".min.",
      ".bundle.",
      ".lock",
      ".map",
      ".d.ts",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      ".gitignore",
      ".gitattributes",
      ".env",
      ".env.local",
      ".env.production",
      ".env.development",
      "README",
      "CHANGELOG",
      "LICENSE",
      "CONTRIBUTING",
      ".eslintrc",
      ".prettierrc",
      "tsconfig.json",
      "jsconfig.json",
      "webpack.config",
      "vite.config",
      "rollup.config",
      "babel.config",
      ".babelrc",
      "jest.config",
      "cypress.config",
      "tailwind.config",
      "postcss.config",
      "docker",
      "dockerfile",
      ".dockerignore",
      "makefile",
      "procfile",
      ".DS_Store",
      "thumbs.db",
    ];

    const lowerFilename = filename.toLowerCase();
    if (
      excludePatterns.some((pattern) =>
        lowerFilename.includes(pattern.toLowerCase()),
      )
    ) {
      return false;
    }

    // Enhanced code extensions with better categorization
    const codeExtensions = [
      // JavaScript/TypeScript
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".mjs",
      ".cjs",
      // Python
      ".py",
      ".pyw",
      ".pyx",
      ".pyi",
      // Java/JVM
      ".java",
      ".kt",
      ".scala",
      ".groovy",
      ".clj",
      // C/C++
      ".c",
      ".cpp",
      ".cc",
      ".cxx",
      ".h",
      ".hpp",
      ".hxx",
      // C#/.NET
      ".cs",
      ".vb",
      ".fs",
      // Web
      ".html",
      ".htm",
      ".css",
      ".scss",
      ".sass",
      ".less",
      ".stylus",
      ".vue",
      ".svelte",
      ".astro",
      // PHP
      ".php",
      ".phtml",
      ".php3",
      ".php4",
      ".php5",
      // Ruby
      ".rb",
      ".rbw",
      ".rake",
      ".gemspec",
      // Go
      ".go",
      // Rust
      ".rs",
      // Swift
      ".swift",
      // Dart
      ".dart",
      // Other languages
      ".lua",
      ".pl",
      ".pm",
      ".r",
      ".m",
      ".matlab",
      ".sh",
      ".bash",
      ".zsh",
      ".fish",
      ".ps1",
      ".bat",
      ".cmd",
      // Data/Config (relevant to coding)
      ".json",
      ".xml",
      ".yaml",
      ".yml",
      ".toml",
      ".ini",
      ".sql",
      ".graphql",
      ".gql",
      // Templates
      ".mustache",
      ".handlebars",
      ".hbs",
      ".ejs",
      ".pug",
      ".jade",
    ];

    return codeExtensions.some((ext) => lowerFilename.endsWith(ext));
  };

  const handleFiles = async (selectedFiles: File[]): Promise<void> => {
    const codeFiles: CodeFile[] = [];

    for (const file of selectedFiles) {
      // Enhanced filtering: skip very large files, non-code files
      if (file.size > 500 * 1024) continue; // Skip files larger than 500KB
      if (!isCodeFile(file.name, file.webkitRelativePath || file.name))
        continue;

      try {
        const content = await readFileAsText(file);
        const relativePath = file.webkitRelativePath || file.name;

        // Check for duplicates in existing files
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
      }
    }

    // Alert if no valid files found
    if (codeFiles.length === 0) {
      alert(
        "No valid code files found. Please select files with supported extensions (.js, .py, .java, .html, .css, etc.)",
      );
    }

    // Alert if project seems massive
    if (selectedFiles.length > 200 && codeFiles.length < 10) {
      alert(
        "Large project detected. Only the most relevant code files have been processed for better performance.",
      );
    }

    // FIXED: Append new files to existing files instead of replacing
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
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-lg text-white/80 mb-2">
              Drop files or folders here
            </p>
            <p className="text-sm text-white/60 mb-6">
              Supports JavaScript, TypeScript, Python, Java, HTML, CSS, and more
              <br />
              <span className="text-xs opacity-75">
                Automatically filters out node_modules, build folders, and
                config files
              </span>
            </p>
            <div className="flex gap-4 justify-center">
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.swift,.kt,.scala,.html,.css,.scss,.sass,.less,.vue,.svelte,.json,.xml,.yaml,.yml,.sql,.sh,.bash,.ps1,.r,.m,.dart,.lua,.pl,.groovy"
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
