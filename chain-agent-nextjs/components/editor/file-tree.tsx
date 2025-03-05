"use client";

import { useEffect, useState } from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
type ProjectData = Record<string, string>;
export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
}

interface FileTreeProps {
  sources: ProjectData;
  selectedFile?: string;
  onFileSelect: (path: string) => void;
  onFileCreate: (path: string, type: "file" | "directory") => void;
  onFileRename: (oldPath: string, newPath: string) => void;
  onFileDelete: (path: string) => void;
}

export function FileTree({
  sources,
  selectedFile,
  onFileSelect,
  onFileCreate,
  onFileRename,
  onFileDelete,
}: FileTreeProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState<"file" | "directory">("file");
  const [selectedNode, setSelectedNode] = useState<FileTreeNode | null>(null);
  const [nodes, setNodes] = useState<FileTreeNode[]>([]);

  useEffect(() => {
    const buildFileTree = (sources: Record<string, string>) => {
      const tree: FileTreeNode[] = [];
      const paths = Object.keys(sources);

      paths.forEach((path) => {
        const parts = path.split("/");
        let currentLevel = tree;

        parts.forEach((part, index) => {
          const isLast = index === parts.length - 1;
          const existingNode = currentLevel.find((node) => node.name === part);

          if (existingNode) {
            if (isLast) {
              existingNode.type = "file";
            }
            currentLevel = existingNode.children || [];
          } else {
            const newNode: FileTreeNode = {
              name: part,
              path: parts.slice(0, index + 1).join("/"),
              type: isLast ? "file" : "directory",
              children: isLast ? undefined : [],
            };
            currentLevel.push(newNode);
            currentLevel = newNode.children || [];
          }
        });
      });

      return tree;
    };

    setNodes(buildFileTree(sources));
  }, [sources]);

  const handleCreateSubmit = () => {
    if (selectedNode && newItemName) {
      const newPath = `${selectedNode.path}/${newItemName}`;
      onFileCreate(newPath, newItemType);
      setIsCreateDialogOpen(false);
      setNewItemName("");
    }
  };

  const handleRenameSubmit = () => {
    if (selectedNode && newItemName) {
      const dirPath = selectedNode.path.split("/").slice(0, -1).join("/");
      const newPath = `${dirPath}/${newItemName}`;
      onFileRename(selectedNode.path, newPath);
      setIsRenameDialogOpen(false);
      setNewItemName("");
    }
  };

  const renderTree = (nodes: FileTreeNode[], level = 0) => {
    return (
      <ul className={cn("list-none", level > 0 ? "ml-4" : "")}>
        {nodes.map((node) => (
          <li key={node.path} className="py-[2px]">
            <ContextMenu.Root>
              <ContextMenu.Trigger>
                <div
                  className={cn(
                    "flex items-center cursor-pointer px-2 py-[2px] rounded text-sm text-gray-700 select-none",
                    "hover:bg-gray-100/70",
                    selectedFile === node.path &&
                      "bg-blue-100/50 text-blue-800",
                  )}
                  onClick={() =>
                    node.type === "file" && onFileSelect(node.path)
                  }
                >
                  <span className="mr-1.5 w-4 h-4 flex items-center justify-center opacity-70">
                    {node.type === "directory" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-4 h-4 text-blue-600"
                      >
                        <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h2.879a1.5 1.5 0 0 1 1.06.44l1.122 1.12A1.5 1.5 0 0 0 9.62 4H12.5A1.5 1.5 0 0 1 14 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-9Z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-4 h-4 text-gray-400"
                      >
                        <path d="M4 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.414A2 2 0 0 0 13.414 6L12 4.586A2 2 0 0 0 10.586 4H4Z" />
                      </svg>
                    )}
                  </span>
                  <span className="truncate">{node.name}</span>
                </div>
              </ContextMenu.Trigger>
              <ContextMenu.Content className="min-w-[180px] bg-white rounded-lg py-1.5 shadow-lg border border-gray-200/50">
                {node.type === "directory" && (
                  <ContextMenu.Item
                    className="px-2.5 py-1.5 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                    onClick={() => {
                      setSelectedNode(node);
                      setIsCreateDialogOpen(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                    </svg>
                    新建文件/文件夹
                  </ContextMenu.Item>
                )}
                <ContextMenu.Item
                  className="px-2.5 py-1.5 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                  onClick={() => {
                    setSelectedNode(node);
                    setNewItemName(node.name);
                    setIsRenameDialogOpen(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                    <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                  </svg>
                  重命名
                </ContextMenu.Item>
                <ContextMenu.Item
                  className="px-2.5 py-1.5 text-sm cursor-pointer hover:bg-red-50 hover:text-red-600 flex items-center gap-2"
                  onClick={() => onFileDelete(node.path)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 6.05 6Zm4 0a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10.05 6Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  删除
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.Root>
            {node.children && renderTree(node.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      {renderTree(nodes)}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              新建文件/文件夹
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={newItemType === "file" ? "default" : "outline"}
                size="sm"
                onClick={() => setNewItemType("file")}
                className="flex-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 mr-2"
                >
                  <path d="M4 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.414A2 2 0 0 0 13.414 6L12 4.586A2 2 0 0 0 10.586 4H4Z" />
                </svg>
                文件
              </Button>
              <Button
                variant={newItemType === "directory" ? "default" : "outline"}
                size="sm"
                onClick={() => setNewItemType("directory")}
                className="flex-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 mr-2"
                >
                  <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h2.879a1.5 1.5 0 0 1 1.06.44l1.122 1.12A1.5 1.5 0 0 0 9.62 4H12.5A1.5 1.5 0 0 1 14 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-9Z" />
                </svg>
                文件夹
              </Button>
            </div>
            <Input
              placeholder="输入名称"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="h-9"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                取消
              </Button>
              <Button size="sm" onClick={handleCreateSubmit}>
                确定
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">重命名</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="输入新名称"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="h-9"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRenameDialogOpen(false)}
              >
                取消
              </Button>
              <Button size="sm" onClick={handleRenameSubmit}>
                确定
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
