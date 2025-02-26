import { Role, Memory } from '../types';

const API_BASE_URL = '/api/assistant';

export class AssistantService {
  static async analyzeRequirement(content: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/analyze-requirement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.error('分析需求失败:', error);
      throw error;
    }
  }

  static async getRoles(): Promise<Role[]> {
    const response = await fetch(`${API_BASE_URL}/roles`);
    return response.json();
  }

  static async getMemories(): Promise<Memory[]> {
    const response = await fetch(`${API_BASE_URL}/memory`);
    return response.json();
  }

  static async checkGenerationStatus(): Promise<{
    status: 'idle' | 'generating' | 'error' | 'completed';
    error?: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/check-generation`);
    return response.json();
  }

  static async stopGeneration(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/stop-generation`, {
      method: 'POST',
    });
    return response.json();
  }
}