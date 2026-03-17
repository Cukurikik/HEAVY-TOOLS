import { Injectable } from '@angular/core';
import { GoogleGenAI } from "@google/genai";
import { AnitaMessage } from '../types/anita.types';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AnitaAiService {
  private ai: GoogleGenAI;
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

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }

  async sendMessage(message: string, history: AnitaMessage[] = []): Promise<AnitaMessage> {
    const chat = this.ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: {
        systemInstruction: this.systemInstruction,
      },
      history: history.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))
    });

    const response = await chat.sendMessage({ message });
    const text = response.text || "I'm sorry, I couldn't process that request.";

    return {
      id: uuidv4(),
      role: 'assistant',
      content: text,
      timestamp: new Date(),
      codeBlocks: this.extractCodeBlocks(text)
    };
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
