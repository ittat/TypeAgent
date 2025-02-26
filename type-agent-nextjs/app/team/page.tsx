'use client';

import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

import { Role, Memory } from '../types';
import { AssistantService } from '../services/assistant';

// 将API调用逻辑移至服务层
const useTeamData = () => {
  const { data: roles, error: rolesError } = useSWR('roles', AssistantService.getRoles, {
    refreshInterval: 2000 // 每2秒刷新一次
  });
  const { data: memories, error: memoriesError } = useSWR('memory', AssistantService.getMemories, {
    refreshInterval: 2000 // 每2秒刷新一次
  });

  return {
    roles,
    memories,
    isLoading: !roles || !memories,
    isError: rolesError || memoriesError
  };
};

// 提取可复用的UI组件
const RequirementCard = ({ requirement }: { requirement: string | null }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-bold mb-4">需求内容</h2>
    <p className="text-gray-700">{requirement || '无需求内容'}</p>
  </div>
);

const RoleCard = ({ role }: { role: Role }) => (
  <div key={role.name} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center space-x-3 mb-2">
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-blue-600 text-sm font-semibold">{role.name[0]}</span>
      </div>
      <div className="flex items-center space-x-2 flex-1">
        <h3 className="font-semibold text-lg">{role.name}</h3>
        <div className={`w-2 h-2 rounded-full ${role.state === 'IDLE' ? 'bg-gray-300' : 'bg-green-500'}`}></div>
      </div>
    </div>
    <p className="text-xs text-gray-400">{role.desc}</p>
  </div>
);

const MemoryCard = ({ memory }: { memory: Memory }) => (
  <div key={memory.timestamp} className="mb-6 border-b pb-4 text-sm">
    <div className="flex justify-between items-center mb-2">
      <span className="font-semibold">{memory.role}</span>
   
      <span className="text-sm text-gray-500">{memory.timestamp}</span>
    </div>
    <span className="font-semibold">{memory.cause_by}</span>
    <ReactMarkdown>{memory.content}</ReactMarkdown>
  </div>
);

export default function TeamPage() {
  const searchParams = useSearchParams();
  const requirement = searchParams.get('requirement');
  const { roles, memories, isLoading, isError } = useTeamData();
  const [mode, setMode] = useState<'Normal' | 'Advanced'>('Normal');
  const { data: generationStatus } = useSWR('generation-status', AssistantService.checkGenerationStatus, {
    refreshInterval: 2000
  });

  if (isError) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 text-lg">加载失败，请稍后重试</div>
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500 text-lg">加载中...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-full">
        {/* 左侧边栏 */}
        <div className="w-1/3 min-w-[300px] bg-white p-6 border-r border-gray-200 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Work Space</h1>
            </div>
     

            <div className="space-y-4">
              <h2 className="text-xl font-bold">团队状态</h2>
              <div className="space-y-3">
                {roles?.map((role: Role) => (
                  <RoleCard key={role.name} role={role} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6 max-w-3xl mx-auto">
            <RequirementCard requirement={requirement} />
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">文档输出</h2>
              </div>
              <div className="prose max-w-none">
                {memories?.map((memory: Memory) => (
                  <MemoryCard key={memory.timestamp} memory={memory} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {generationStatus?.status === 'generating' ?
      <button
        className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl animate-pulse"
        onClick={async () => {
          try {
            await AssistantService.stopGeneration();
          } catch (error) {
            console.error('终止生成失败:', error);
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button> : null}
    </div>
  );
}