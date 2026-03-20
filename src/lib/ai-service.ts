import { DASHSCOPE_MODELS } from "@/lib/ai-models";

interface AIServiceRequest {
  model: string;
  message?: string;
  history?: Array<{ role: string; content: string | any[] }>;
  input?: any;
  parameters?: any;
}

interface AIServiceResponse {
  response: string;
  model: string;
  provider: string;
  category: string;
  success: boolean;
  error?: string;
}

export class AIService {
  private static instance: AIService;
  
  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async callAI(request: AIServiceRequest): Promise<AIServiceResponse> {
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        response: data.response,
        model: data.model,
        provider: data.provider,
        category: data.category,
        success: true
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      return {
        response: "",
        model: request.model,
        provider: "error",
        category: "error",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  // Get models by category for specific tools
  getModelsForTool(toolType: 'code' | 'image' | 'video' | 'pdf' | 'audio'): string[] {
    switch (toolType) {
      case 'code':
        return ['qwen3-max', 'qwen3.5-plus', 'qwen-flash'];
      case 'image':
        return ['qwen-image-2.0-pro', 'qwen-image-max', 'wan2.6-t2i', 'qwen3.5-plus', 'qwen3.5-35b-a3b'];
      case 'video':
        return ['wan2.6-r2v-flash', 'qwen3.5-plus', 'qwen3.5-35b-a3b'];
      case 'pdf':
        return ['qwen3-max', 'qwen3.5-plus', 'qwen-flash'];
      case 'audio':
        return ['qwen-voice-design', 'qwen3-asr-flash', 'qwen3-omni-flash-realtime', 'cosyvoice-v3-plus'];
      default:
        return ['qwen3-max', 'qwen3.5-plus'];
    }
  }

  // Get default model for each tool type
  getDefaultModelForTool(toolType: 'code' | 'image' | 'video' | 'pdf' | 'audio'): string {
    switch (toolType) {
      case 'code':
        return 'qwen3-max';
      case 'image':
        return 'qwen-image-2.0-pro';
      case 'video':
        return 'wan2.6-r2v-flash';
      case 'pdf':
        return 'qwen3-max';
      case 'audio':
        return 'qwen3-asr-flash';
      default:
        return 'qwen3-max';
    }
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();