import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { AnitaMessage } from '../types/anita.types';
import { v4 as uuidv4 } from 'uuid';

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

  // Provide a default that is known to work for Qwen (DashScope)
  defaultEndpoint = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';
  
  config = signal({
    apiKey: localStorage.getItem('anita_api_key') || 'sk-e391a1e39ed048e1ac26d158b379b857',
    endpoint: localStorage.getItem('anita_endpoint') || this.defaultEndpoint,
    model: localStorage.getItem('anita_model') || 'qwen-max'
  });

  constructor(private http: HttpClient) {}

  updateConfig(apiKey: string, endpoint: string, model: string) {
    this.config.set({ apiKey, endpoint, model });
    localStorage.setItem('anita_api_key', apiKey);
    localStorage.setItem('anita_endpoint', endpoint);
    localStorage.setItem('anita_model', model);
  }

  async sendMessage(message: string, history: AnitaMessage[] = []): Promise<AnitaMessage> {
    const { apiKey, endpoint, model } = this.config();

    if (!apiKey) {
      return {
        id: uuidv4(),
        role: 'assistant',
        content: `ERROR: API Key is missing. Please configure your API key in settings.`,
        timestamp: new Date(),
        codeBlocks: []
      };
    }

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
      
      const body = {
        model: model, 
        messages: messages
      };
      
      const response = await lastValueFrom(
        this.http.post<any>(endpoint, body, { headers })
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
      console.error('Error calling AI API:', error);
      return {
        id: uuidv4(),
        role: 'assistant',
        content: `ERROR: Failed to connect to AI API. ${error.message || 'Unknown error'}. Please check your endpoint url and API key in settings.`,
        timestamp: new Date(),
        codeBlocks: []
      };
    }
  }

  private extractCodeBlocks(text: string) {
    const codeBlockRegex = /\`\`\`(\w+)?\n([\s\S]*?)\`\`\`/g;
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