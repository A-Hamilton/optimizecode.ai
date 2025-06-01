// Updated for TypeScript migration
export interface CodeFile {
  name: string;
  path: string;
  content: string;
  size: number;
  type: string;
  extension: string;
  optimizedContent?: string;
}

export interface OptimizationSummary {
  [filename: string]: string[];
}

export interface CodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
}

export interface FileDropZoneProps {
  files: CodeFile[];
  onFilesSelected: (files: CodeFile[]) => void;
}

export interface ResultsDisplayProps {
  originalCode: string;
  optimizedCode: string;
  files: CodeFile[];
  isOptimizing: boolean;
  optimizationSummary: OptimizationSummary;
}
