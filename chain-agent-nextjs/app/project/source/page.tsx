"use client"
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useTeamData } from '@/hooks/useTeamData';
import ProjectEditor from '@/components/editor/project-editor';
import { Button } from '@/components/ui/button';
import JSZip from 'jszip';

function SourcePage() {
    const searchParams = useSearchParams();
    const uuid = searchParams.get('uuid');


    const { data, isLoading, isError } = useTeamData(uuid || "");

    const [source, setSource] = useState<Record<string,string>>()

    

    useEffect(()=>{
      if(!isLoading && data && data?.state.result?.state){
        setSource(data.state.result.state.codeDoc||{})
      }
    },[data,isLoading,isError])

    
    if(!data?.state.result?.state){
      return <div>loading...</div>
    }

    const handleDownload = async () => {
      if (!source) return;
      
      const zip = new JSZip();
      
      // 将所有文件添加到zip中
      Object.entries(source).forEach(([path, content]) => {
        zip.file(path, content);
      });
      
      // 生成zip文件
      const blob = await zip.generateAsync({type: "blob"});
      
      // 创建下载链接并触发下载
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = uuid +'.zip';
      document.body.appendChild(a);
      a.click();
      
      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    };



  return (
    source && <>
    <ProjectEditor  sources={source} />
    <Button onClick={handleDownload}>Download</Button>
    </>
  )
}

export default SourcePage