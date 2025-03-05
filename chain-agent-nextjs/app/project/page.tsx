"use client";

import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTeamData } from "@/hooks/useTeamData";
import { Button } from "@/components/ui/button";
import { TeamName, TeamRole } from "../types";

import ProductManagerImg from "@/public/icons/ProductManager.png";
import ProjectManagerImg from "@/public/icons/ProjectManager.png";
import ArchitectImg from "@/public/icons/Architect.png";
import EngineerImg from "@/public/icons/Engineer.png";
import AnonymityImg from "@/public/icons/user.png";

import DocumentTab from "./components/DocumentTab";
import TimelineTab from "./components/TimelineTab";
import ChatTab from "./components/ChatTab";
import HistoryTab from "./components/HistoryTab";
import SourceTab from "./components/SourceTab";
import PreviewDialog from "./components/PreviewDialog";
import useSWR from "swr";
import { AssistantService } from "@/app/services/assistant";

const TeamRoleAvtImg = {
  [TeamRole.ProductManager]: ProductManagerImg,
  [TeamRole.ProjectManager]: ProjectManagerImg,
  [TeamRole.Architect]: ArchitectImg,
  [TeamRole.Engineer]: EngineerImg,
  // [TeamRole.Anonymity]: require('@/public/icons/Anonymity.png'),
};

const tabs = [
  { id: "Chat", label: "Chat" },
  { id: "Document", label: "Document" },
  // { id: 'Timeline', label: 'Timeline' },
  // { id: 'History', label: 'History' },
  { id: "Source", label: "Source" },
] as const;

export default function ProjectPage() {
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");
  const router = useRouter();
  const { data, isLoading, isError } = useTeamData(uuid || "");
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  const {data:projects} = useSWR('projects',AssistantService.getProjectList)

  const cur_working_role = useMemo((): TeamRole => {
    if (!data || !data.state || !data.state.currentRole)
      return TeamRole.ProductManager;

    if (
      data.state.currentRole.toLocaleLowerCase() ==
      TeamRole.ProjectManager.toLocaleLowerCase()
    )
      return TeamRole.ProjectManager;
    if (
      data.state.currentRole.toLocaleLowerCase() ==
      TeamRole.Architect.toLocaleLowerCase()
    )
      return TeamRole.Architect;
    if (
      data.state.currentRole.toLocaleLowerCase() ==
      TeamRole.Engineer.toLocaleLowerCase()
    )
      return TeamRole.Engineer;

    return TeamRole.ProductManager;
  }, [data, isLoading, isError]);

  console.log(cur_working_role);
  

  if (!uuid)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">缺少uuid参数</div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">加载失败，请稍后重试</div>
      </div>
    );

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">加载中...</div>
      </div>
    );

  if (data?.status == "queue") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">正在处理中...</div>
      </div>
    );
  }

  if (data?.status == "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">{data.message}</div>
        <div className="text-red-500 text-lg">处理失败，请稍后重试</div>
      </div>
    );
  }

  // if(data?.status == "progress" && data.state){
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-gray-500 text-lg">{data.state.status}...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-full">
        {/* 左侧导航栏 */}
        <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
          {/* Logo和标题 */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold">Idea Factory</h1>
            <p className="text-sm text-gray-500">Your AI Project Hub</p>
          </div>

          {/* 主要导航菜单 */}
          <nav className="flex-1 p-4 space-y-2">
          {
            projects?.map((project) => (
              <button
                key={project.uuid}
                onClick={() => router.push(`/project?uuid=${project.uuid}`)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <span>{project.projectName}</span>
              </button>
            ))
          }
     
          </nav>

          {/* 收藏文件列表 */}
          {/* <div className="p-4 border-t border-gray-200">
            <h2 className="text-sm font-semibold mb-2">Favourite Files</h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>The Great Gatsby</span>
                <span className="text-blue-500">★</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Partnership Agreement</span>
                <span className="text-blue-500">★</span>
              </div>
            </div>
          </div> */}

          {/* 底部工作区信息 */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
                AI
              </div>
              <div>
                <div className="text-sm font-medium">Ittat</div>
                <div className="text-xs text-gray-500">TypeAgent Studio</div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1 overflow-auto flex flex-col h-screen">
          {/* 面包屑和标题区 */}
          <div className="bg-white p-6 border-b border-gray-200 pb-0">
            {/* <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <span>Projects</span>
              <span>/</span>
              <span>{data?.state?.projectName}</span>
            </div> */}
            {/* <div> */}

            {data?.status == "progress" && (
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-in-out animate-progress"
                  style={{ width: "100%" }}
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold mb-4">
                  {data?.state?.projectName}
                  <p className="text-sm text-gray-500">{data?.status}</p>
                </h1>

                <p className="text-gray-600 mb-6 text-sm">
                  {data?.state?.projectDesc}{" "}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center space-x-4 justify-between w-full">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Host:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-6 h-6 rounded-full bg-gray-200">
                      <img src={AnonymityImg.src} alt={` avatar`} />
                    </div>
                    <span className="text-xs">User</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Members:</span>
                  <div className="flex space-x-4">
                    {Object.values(TeamRole).map((role) => (
                      <div
                      key={role}
                        className={`flex items-center rounded-full space-x-1 ${cur_working_role === role ? "ring-2 ring-blue-500 ring-offset-2 animate-pulse" : ""}`}
                      >
                        <div className={`w-6 h-6 rounded-full bg-gray-200 `}>
                          <img
                            src={TeamRoleAvtImg[role as TeamRole].src}
                            alt={`${role} avatar`}
                          />
                        </div>
                        <span className="text-xs">
                          {TeamName[role as TeamRole].en}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* <div className="flex items-center space-x-2">
                  <span className="text-sm">Public</span>
                  <Button className="w-12 h-6 bg-blue-600 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                  </Button>
                </div> */}

                  <PreviewDialog status={data?.status} state={data!.state!} />

                  <Button
                    disabled
                    className="px-4 py-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700"
                  >
                    Request
                  </Button>
                </div>
              </div>
            </div>

            {/* 标签页导航 */}
            <div className="mb-0 border-b border-gray-200">
              <nav className="flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 主要内容区 */}
          <div className="p-6 flex-1 overflow-auto ">
            {/* 标签页内容 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === "Document" && <DocumentTab state={data?.state} />}
              {activeTab === "Timeline" && <TimelineTab />}
              {activeTab === "Chat" && (
                <ChatTab messages={data?.state?.chatHistory || []} />
              )}
              {activeTab === "History" && <HistoryTab />}
              {activeTab === "Source" && <SourceTab state={data?.state} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
