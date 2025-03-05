"use client";

import { ProjectState } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";

interface PreviewDialogProps {
  status?: string;
  state: ProjectState;
}

export default function PreviewDialog({ status, state }: PreviewDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={status !== "complete"}
          className="px-4 py-2 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent
        style={{
          width: "800px",
          maxWidth: "800px",
          height: "90%",
          maxHeight: "90%",
        }}
      >
        <DialogHeader>
          <DialogTitle>项目预览</DialogTitle>
        </DialogHeader>
        <div
          className="p-1 "
          style={{
            height: "600px",
          }}
        >
          <SandpackProvider
            className="h-full"
            template="static"
            files={state.codeDoc}
          >
            <SandpackLayout
              className="w-full h-full"
              style={{
                height: "600px",
              }}
            >
              {/* <SandpackCodeEditor /> */}
              <SandpackPreview
                className="w-full h-full flex-1"
                style={{
                  height: "600px",
                }}
                showRefreshButton
                showOpenNewtab
              />
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
