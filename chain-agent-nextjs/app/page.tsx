'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AssistantService } from './services/assistant';

export default function Home() {
  const router = useRouter();
  const [requirement, setRequirement] = useState('');

  const handleSubmit = async () => {
    if (!requirement.trim()) return;

    try {
      const res =  await AssistantService.analyzeRequirement(requirement);
      router.push(`/project?uuid=${res.uuid}`);
    } catch (error) {
      console.error('提交需求失败:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Type Agent
            </h1>
            <p className="text-gray-300 text-lg">Sites beyond imagination, one prompt away.</p>
          </div>
          
          <div className="w-full space-y-6">
            <div className="space-y-2">
              <textarea
                id="requirement"
                className="w-full h-32 px-6 py-4 bg-white/5 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                placeholder="生成一个吃豆豆游戏页面"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "生成一个吃豆豆游戏页面",
                  "创建一个在线聊天应用",
                  "设计一个简单的待办事项应用",
                  "制作一个天气预报网站",
                  "开发一个在线计算器"
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setRequirement(prompt)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-300 transform hover:scale-[1.02] hover:shadow-lg"
            >
              Generate →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
