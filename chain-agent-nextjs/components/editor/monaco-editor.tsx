"use client";

import Editor from "@monaco-editor/react";

interface MonacoEditorProps {
  source: string;
  language?: string;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  onFileChange?: (content: string, path?: string) => void;
  filePath?: string;
}

export function MonacoEditor({
  // sources,
  filePath,
  source,
  language = "typescript",
  readOnly = false,
  showLineNumbers = true,
  onFileChange,
}: MonacoEditorProps) {
  return (
    <Editor
      height="100%"
      language={language}
      path={filePath}
      value={source || ""}
      theme="vs-light"
      options={{
        readOnly,
        lineNumbers: showLineNumbers ? "on" : "off",
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
      onChange={(value) => {
        if (value) {
          onFileChange?.(value, filePath);
        }
      }}
    />
  );
}
