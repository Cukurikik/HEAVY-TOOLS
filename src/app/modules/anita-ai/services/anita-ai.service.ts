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
    // Get API key from environment variable during build time or window object in browser
    // Added null check for process.env to prevent runtime errors
    const apiKey = typeof window !== 'undefined' 
      ? (window as any)['ALIBABA_CLOUD_API_KEY'] || (window as any)['GEMINI_API_KEY']
      : (process.env && (process.env['ALIBABA_CLOUD_API_KEY'] || process.env['GEMINI_API_KEY']));
      
    if (!apiKey) {
      throw new Error('ALIBABA_CLOUD_API_KEY is not configured');
    }

    // Prepare the messages array including system instruction and history
    const messages = [
      { role: 'system', content: this.systemInstruction },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    try {
      // Using Google Generative AI API via proxy
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      });

      // Call to Google's API 
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey;
      
      const body = {
        contents: [{
          parts: [{
            text: message
          }]
        }],
        safetySettings: [
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      };
      
      const response = await lastValueFrom(
        this.http.post<any>(url, body, { headers })
      );

      if (response && response.candidates && response.candidates.length > 0) {
        const text = response.candidates[0].content.parts[0].text;
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
      
      // Return an error message as an AnitaMessage
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