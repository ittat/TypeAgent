// LLM模型类型
export enum LLMModelType {
  GEMINI_FLASH_LITE = 'gemini-2.0-flash-lite',
}

// 聊天消息角色类型
export enum ChatRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

// 错误消息类型
export enum LLMErrorMessage {
  API_KEY_REQUIRED = 'GOOGLE_API_KEY is required',
  NOT_INITIALIZED = 'LLM provider not initialized',
  EMPTY_RESPONSE = 'Empty response from Gemini API',
  CHAT_REQUEST_FAILED = 'Chat request failed',
  LLM_REQUEST_FAILED = 'LLM request failed',
}

// 聊天消息类型
export type ChatMessage = {
  role: ChatRole;
  content: string;
};