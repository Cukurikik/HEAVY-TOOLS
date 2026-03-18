import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { AnitaMessage } from '../types/anita.types';
import { v4 as uuidv4 } from 'uuid';

declare var process: { env: { [key: string]: string } };

@Injectable({
  providedIn: 'root'
})
export class AnitaAiService {
  private systemInstruction = `
    You are ANITA (Artificial Neural Intelligence & Technology Assistant), a world-class AI Coding Assistant.
    Your mission is to help users write, debug, and optimize code in 50+ programming languages.
    
    Personality:
    - Professional, efficient, and highly technical.
    - Proactive and helpful.
    - Uses a slightly "cyberpunk/military" tone when appropriate (e.g., "Ready, Captain!", "System Online").
    
    Capabilities:
    - Write complete, production-ready code.
    - Debug and fix errors in existing code.
    - Explain complex technical concepts.
    - Generate full project structures.
    
    Output Format:
    - Always use Markdown for formatting.
    - Wrap code in appropriate language blocks.
    - If generating a file, specify the filename if possible.
  `;

  constructor(private http: HttpClient) {}

  async sendMessage(message: string, history: AnitaMessage[] = []): Promise<AnitaMessage> {
    const apiKey = 'sk-e391a1e39ed048e1ac26d158b379b857';

    // Prepare messages for Qwen API (OpenAI compatible format)
    const messages = [
      { role: 'system', content: this.systemInstruction },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      });

      // Alibaba Cloud DashScope (Qwen) Compatible API Endpoint
      const url = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';
      
      const body = {
        model: 'qwen-max', 
        messages: messages
      };
      
      const response = await lastValueFrom(
        this.http.post<any>(url, body, { headers })
      );

      if (response && response.choices && response.choices.length > 0) {
        const text = response.choices[0].message.content;
        return {
          id: uuidv4(),
          role: 'assistant',
          content: text,
          timestamp: new Date(),
          codeBlocks: this.extractCodeBlocks(text)
        };
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (error: any) {
      console.error('Error calling Alibaba Cloud Qwen API:', error);
      
      return {
        id: uuidv4(),
        role: 'assistant',
        content: `ERROR: Failed to connect to Qwen API. ${error.message || 'Unknown error'}`,
        timestamp: new Date(),
        codeBlocks: []
      };
    }
  }

  private extractCodeBlocks(text: string) {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks = [];
    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      blocks.push({
        language: match[1] || 'text',
        code: match[2].trim()
      });
    }
    return blocks;
  }
}