import { WorkflowState } from '../types';

const API_BASE_URL = '/api/workflow';

export class AssistantService {
  static async analyzeRequirement(content: string) {
    try {
      const response =  await fetch(`${API_BASE_URL}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requirement:content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('分析需求成功:', data);
      return data as {
        uuid: string;
        status: string;
        message?: string;
      };
    } catch (error) {
      console.error('分析需求失败:', error);
      throw error;
    }
  }

  // static async getRoles(): Promise<Role[]> {
  //   const response = await fetch(`${API_BASE_URL}/roles`);
  //   return response.json();
  // }

  // static async getMemories(): Promise<Memory[]> {
  //   const response = await fetch(`${API_BASE_URL}/memory`);
  //   return response.json();
  // }

  static async checkGenerationStatus(uuid:string) {
    const response = await fetch(`${API_BASE_URL}/status/${uuid}`);
    const data = await response.json();

    return data as {

      status: string;
      
      state:{
        uuid: string;
        status: string;
        result?: WorkflowState;
      }
    };
  }

  // todo
  // static async stopGeneration(): Promise<{ success: boolean; message: string }> {
  //   const response = await fetch(`${API_BASE_URL}/stop-generation`, {
  //     method: 'POST',
  //   });
  //   return response.json();
  // }
}