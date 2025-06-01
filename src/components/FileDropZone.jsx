import { useState, useRef } from "react";
import "./FileDropZone.css";

function FileDropZone({ onFilesSelected, files }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = async (fileList) => {
    const processedFiles = [];

    for (const file of fileList) {
      if (isCodeFile(file.name)) {
        try {
          const content = await readFileContent(file);
          processedFiles.push({
            name: file.name,
            content: content,
            size: file.size,
            type: file.type,
            extension: getFileExtension(file.name),
          });
        } catch (error) {
          console.error(`Error reading file ${file.name}:`, error);
        }
      }
    }

    onFilesSelected(processedFiles);
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const isCodeFile = (filename) => {
    const codeExtensions = [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".py",
      ".java",
      ".cpp",
      ".c",
      ".cs",
      ".php",
      ".rb",
      ".go",
      ".rust",
      ".swift",
      ".kt",
      ".scala",
      ".r",
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
      ".txt",
      ".sh",
      ".bash",
      ".ps1",
      ".vue",
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
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="drop-content">
          <div className="drop-icon">📁</div>
          <p className="drop-text">
            Drag and drop code files here, or click to select files
          </p>
          <p className="drop-subtext">
            Supports: JS, TS, Python, Java, C++, HTML, CSS, and more
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rust,.swift,.kt,.scala,.r,.html,.css,.scss,.sass,.less,.sql,.json,.xml,.yaml,.yml,.md,.txt,.sh,.bash,.ps1,.vue"
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
                  <span className="file-name">{file.name}</span>
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
