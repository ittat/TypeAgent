"use client";

import { ProjectState } from "@/app/types";
import ProjectEditor from "@/components/editor/project-editor";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";

export default function SourceTab({ state = {} }: { state?: ProjectState }) {
  const { codeDoc: source = {} } = state;

  // const handleDownload = async () => {
  //   if (!source) return;

  //   const zip = new JSZip();

  //   // 将所有文件添加到zip中
  //   Object.entries(source).forEach(([path, content]) => {
  //     zip.file(path, content);
  //   });

  //   // 生成zip文件
  //   const blob = await zip.generateAsync({type: "blob"});

  //   // 创建下载链接并触发下载
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = uuid +'.zip';
  //   document.body.appendChild(a);
  //   a.click();

  //   // 清理
  //   window.URL.revokeObjectURL(url);
  //   document.body.removeChild(a);
  // };

  return (
    <div className="">
      {source && (
        <>
          <ProjectEditor sources={source} />
          {/* <Button onClick={handleDownload}>Download</Button> */}
        </>
      )}
    </div>
  );
}
