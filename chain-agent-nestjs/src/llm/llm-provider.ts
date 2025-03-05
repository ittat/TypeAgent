import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';
import { ChatMessage, ChatRole, LLMErrorMessage, LLMModelType } from './llm.types';
import { ChatPromptValueInterface } from '@langchain/core/dist/prompt_values';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { AIMessageChunk } from '@langchain/core/messages';

@Injectable()
export class LLMProvider {
  private model: ChatGoogleGenerativeAI;
  private apiKey: string;
  private initialized = false;
  private logger = new Logger(LLMProvider.name);

  private defaultConfig: GenerationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  constructor() {
    try {
      this.apiKey = process.env.GOOGLE_API_KEY || '';
      if (!this.apiKey) {
        throw new Error(LLMErrorMessage.API_KEY_REQUIRED);
      }

      const genAI = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        modelName: 'gemini-2.0-flash',
        // maxOutputTokens: 2048,
        // temperature: 0.7,
        // topP: 0.8,
        // topK: 40,
        baseUrl: process.env.ISDEV ? 'http://localhost:4399/gemini-proxy' : undefined,
      });
      this.model = genAI;
      
      this.logger.log("asdsaa", process.env.ISDEV)

      // this.model = genAI.getGenerativeModel({ model: LLMModelType.GEMINI_FLASH_LITE },{
        // baseUrl : process.env.ISDEV ? 'http://localhost:4399/gemini-proxy' : undefined,
      // });
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize LLM provider:', error);
      throw error;
    }
  }

  // public async ask(prompt: string, config?: Partial<GenerationConfig>): Promise<string> {
  //   if (!this.initialized) {
  //     throw new Error(LLMErrorMessage.NOT_INITIALIZED);
  //   }

  //   try {
  //     const generationConfig = { ...this.defaultConfig, ...config };
  //     const result = await this.model.generateContent(prompt);
  //     const response = await result.response;
      
  //     if (!response.text) {
  //       throw new Error(LLMErrorMessage.EMPTY_RESPONSE);
  //     }
      
  //     return response.text();
  //   } catch (error) {
  //     this.logger.error(`Error calling Gemini API: ${error.message}`);
  //     throw new Error(`${LLMErrorMessage.LLM_REQUEST_FAILED}: ${error.message}`);
  //   }
  // }



  public async invoke(prompt: ChatPromptValueInterface): Promise<AIMessageChunk> {
    if (!this.initialized) {
      throw new Error(LLMErrorMessage.NOT_INITIALIZED);
    }

    const response =  await this.model.invoke(prompt)

    return response

  }
}