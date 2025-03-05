"use client";

import { useState } from "react";
import { MonacoEditor } from "./monaco-editor";
import { FileTree, FileTreeNode } from "./file-tree";

type ProjectData = Record<string, string>;

interface ProjectEditorProps {
  sources: ProjectData;
  onChange?: (sources: ProjectData) => void;
}

export default function ProjectEditor({
  sources: initialSources,
  onChange,
}: ProjectEditorProps) {
  const [sources, setSources] = useState<ProjectData>(initialSources);
  const [selectedFile, setSelectedFile] = useState<string>("");

  const handleFileChange = (content: string, path?: string) => {
    if (!path) {
      path = selectedFile;
    }

    const newSources = { ...sources, [path]: content };
    setSources(newSources);
    onChange?.(newSources);
  };

  const handleFileCreate = (path: string, type: "file" | "directory") => {
    if (type === "file") {
      const newSources = { ...sources, [path]: "" };
      setSources(newSources);
      onChange?.(newSources);
    }
  };

  const handleFileRename = (oldPath: string, newPath: string) => {
    if (sources[oldPath]) {
      const newSources = { ...sources };
      newSources[newPath] = sources[oldPath];
      delete newSources[oldPath];
      setSources(newSources);
      onChange?.(newSources);

      if (selectedFile === oldPath) {
        setSelectedFile(newPath);
      }
    }
  };

  const handleFileDelete = (path: string) => {
    const newSources = { ...sources };
    delete newSources[path];
    setSources(newSources);
    onChange?.(newSources);

    if (selectedFile === path) {
      setSelectedFile("");
    }
  };

  return (
    <div className="flex h-[600px] border border-gray-200 rounded-lg overflow-hidden">
      <div className="w-64 border-r border-gray-200 overflow-y-auto p-2 bg-gray-50">
        <FileTree
          //   nodes={fileTree}
          sources={sources}
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
          onFileCreate={handleFileCreate}
          onFileRename={handleFileRename}
          onFileDelete={handleFileDelete}
        />
      </div>
      <div className="flex-1">
        <MonacoEditor
          filePath={selectedFile}
          source={sources[selectedFile]}
          onFileChange={handleFileChange}
        />
      </div>
    </div>
  );
}
