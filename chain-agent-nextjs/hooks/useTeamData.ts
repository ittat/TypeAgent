import { AssistantService } from '@/app/services/assistant';
import useSWR from 'swr';

// 将API调用逻辑移至服务层
export const useTeamData = (uuid:string) => {
    const { data , error } = useSWR('roles', ()=> AssistantService.checkGenerationStatus(uuid), {
      refreshInterval: 10000 // 每2秒刷新一次
    });
    // const { data: memories, error: memoriesError } = useSWR('memory', AssistantService.getMemories, {
    //   refreshInterval: 2000 // 每2秒刷新一次
    // });
  
    return {
      // roles,
      // memories,
      // isLoading: !roles || !memories,
      // isError: rolesError || memoriesError
      isLoading:!data,
      isError: error,
      data
    };
  };