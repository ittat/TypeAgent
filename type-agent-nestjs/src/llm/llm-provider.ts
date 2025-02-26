import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class LLMProvider {
  private model: any;
  private apiKey: string;
  private initialized = false;
  private logger = new Logger(LLMProvider.name);

  constructor() {
    try {
      this.apiKey = process.env.GOOGLE_API_KEY || '';
      if (!this.apiKey) {
        throw new Error('GOOGLE_API_KEY is required');
      }

      const genAI = new GoogleGenerativeAI(this.apiKey);
      
      this.logger.log("asdsaa", process.env.ISDEV)

      this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' },{
        baseUrl : process.env.ISDEV ? 'http://localhost:4399/gemini-proxy' : undefined,
      });
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize LLM provider:', error);
      throw error;
    }
  }

  public async ask(prompt: string): Promise<string> {
    if (!this.initialized) {
      throw new Error('LLM provider not initialized');
    }
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "NULL";
    }
  }
}