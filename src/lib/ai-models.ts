export interface AIModel {
  id: string;
  name: string;
  description: string;
  category: 'text' | 'image' | 'video' | 'audio' | 'multimodal';
  capabilities: string[];
  apiType: 'standard' | 'openai-compatible';
  parameters?: {
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    enable_thinking?: boolean;
  };
}

// Comprehensive DashScope model registry with correct API types
export const DASHSCOPE_MODELS: AIModel[] = [
  // Text Generation Models
  {
    id: "qwen3-max",
    name: "Qwen3-Max",
    description: "Most capable Qwen3 model with deep thinking enabled",
    category: "text",
    capabilities: ["text-generation", "reasoning", "deep-thinking"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8, enable_thinking: true }
  },
  {
    id: "qwen3-max-preview",
    name: "Qwen3-Max-Preview",
    description: "Preview version of Qwen3-Max with latest features",
    category: "text",
    capabilities: ["text-generation", "reasoning", "deep-thinking"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8, enable_thinking: true }
  },

  // New Flash Models - OpenAI Compatible API
  {
    id: "qwen3.5-flash",
    name: "Qwen3.5-Flash",
    description: "Ultra-fast multimodal model with reasoning capabilities",
    category: "multimodal",
    capabilities: ["text-generation", "image-understanding", "multimodal", "reasoning"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8, enable_thinking: true }
  },
  {
    id: "qwen3-vl-flash",
    name: "Qwen3-VL-Flash",
    description: "Vision-language flash model for image understanding",
    category: "multimodal",
    capabilities: ["image-understanding", "vision-language", "reasoning"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8, enable_thinking: true }
  },

  // Large Parameter Models - OpenAI Compatible API
  {
    id: "qwen3.5-35b-a3b",
    name: "Qwen3.5-35B-A3B",
    description: "Large parameter multimodal model (35B) with advanced reasoning",
    category: "multimodal",
    capabilities: ["text-generation", "image-understanding", "multimodal", "reasoning"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8, enable_thinking: true }
  },
  {
    id: "qwen3.5-27b",
    name: "Qwen3.5-27B",
    description: "Large parameter multimodal model (27B) with reasoning",
    category: "multimodal",
    capabilities: ["text-generation", "image-understanding", "multimodal", "reasoning"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8, enable_thinking: true }
  },
  {
    id: "qwen3.5-122b-a10b",
    name: "Qwen3.5-122B-A10B",
    description: "Massive parameter multimodal model (122B) with advanced capabilities",
    category: "multimodal",
    capabilities: ["text-generation", "image-understanding", "multimodal", "reasoning"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8, enable_thinking: true }
  },

  // VL Models - OpenAI Compatible API
  {
    id: "qwen3-vl-32b-instruct",
    name: "Qwen3-VL-32B-Instruct",
    description: "32B vision-language instruction-tuned model",
    category: "multimodal",
    capabilities: ["image-understanding", "vision-language", "instruction-following"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8 }
  },
  {
    id: "qvq-max",
    name: "QVQ-Max",
    description: "Maximum capability vision-question answering model",
    category: "multimodal",
    capabilities: ["image-understanding", "vision-question-answering", "reasoning"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8, enable_thinking: true }
  },

  // Coder Models - OpenAI Compatible API
  {
    id: "qwen3-coder-next",
    name: "Qwen3-Coder-Next",
    description: "Next-generation code generation model",
    category: "text",
    capabilities: ["code-generation", "programming", "text-generation"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8 }
  },
  {
    id: "qwen3-coder-flash",
    name: "Qwen3-Coder-Flash",
    description: "Fast code generation model",
    category: "text",
    capabilities: ["code-generation", "programming", "text-generation"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8 }
  },

  // Smaller Models - OpenAI Compatible API
  {
    id: "qwen3-8b",
    name: "Qwen3-8B",
    description: "8B parameter general-purpose model",
    category: "text",
    capabilities: ["text-generation", "general-purpose"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8 }
  },
  {
    id: "qwen3-4b",
    name: "Qwen3-4B",
    description: "4B parameter lightweight model",
    category: "text",
    capabilities: ["text-generation", "lightweight"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8 }
  },
  {
    id: "qwen3-1.7b",
    name: "Qwen3-1.7B",
    description: "1.7B parameter ultra-lightweight model",
    category: "text",
    capabilities: ["text-generation", "ultra-lightweight"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8, enable_thinking: true }
  },
  {
    id: "qwen3-0.6b",
    name: "Qwen3-0.6B",
    description: "0.6B parameter minimal model",
    category: "text",
    capabilities: ["text-generation", "minimal"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8 }
  },

  // Plus/Turbo Models - OpenAI Compatible API
  {
    id: "qwen-plus",
    name: "Qwen-Plus",
    description: "Balanced performance model with reasoning",
    category: "text",
    capabilities: ["text-generation", "reasoning", "balanced"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8, enable_thinking: true }
  },
  {
    id: "qwen-plus-latest",
    name: "Qwen-Plus-Latest",
    description: "Latest version of Qwen-Plus with newest features",
    category: "text",
    capabilities: ["text-generation", "reasoning", "balanced", "latest"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8, enable_thinking: true }
  },
  {
    id: "qwen-turbo",
    name: "Qwen-Turbo",
    description: "Fast and cost-effective model",
    category: "text",
    capabilities: ["text-generation", "fast", "cost-effective"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8, enable_thinking: true }
  },

  // Legacy Models - OpenAI Compatible API
  {
    id: "qwen2.5-14b-instruct-1m",
    name: "Qwen2.5-14B-Instruct-1M",
    description: "14B parameter instruction-tuned model with 1M context",
    category: "text",
    capabilities: ["text-generation", "instruction-following", "long-context"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8 }
  },
  {
    id: "qwen2.5-omni-7b",
    name: "Qwen2.5-Omni-7B",
    description: "Voice and Text output compatible streaming model",
    category: "text",
    capabilities: ["text-generation", "voice", "streaming"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 8192, temperature: 0.7, top_p: 0.8 }
  },
  {
    id: "qwen-mt-lite",
    name: "Qwen-MT-Lite",
    description: "Translation tuned fast lightweight model",
    category: "text",
    capabilities: ["text-generation", "translation"],
    apiType: "openai-compatible",
    parameters: { max_tokens: 4096, temperature: 0.3, top_p: 0.8 }
  },

  // Image Generation Models - Google Gemini API
  {
    id: "imagen-3.0-generate-001",
    name: "Imagen 3 Pro",
    description: "State-of-the-art image generation from Google",
    category: "image",
    capabilities: ["image-generation", "high-resolution", "detailed-prompts"],
    apiType: "standard",
    parameters: { temperature: 0.7, top_p: 0.8 }
  },

  // Video Generation Models - Google Gemini API
  {
    id: "veo-2.0-generate-001",
    name: "Veo 2.0 (Gemini)",
    description: "State-of-the-art video generation by Google",
    category: "video",
    capabilities: ["video-generation", "high-quality"],
    apiType: "standard",
    parameters: { temperature: 0.7, top_p: 0.8 }
  },

  // Audio Models - Standard API
  {
    id: "qwen-voice-design",
    name: "Qwen-Voice-Design",
    description: "Custom voice creation and design",
    category: "audio",
    capabilities: ["voice-design", "custom-voice", "tts-customization"],
    apiType: "standard",
    parameters: { temperature: 0.7, top_p: 0.8 }
  },
  {
    id: "qwen3-asr-flash",
    name: "Qwen3-ASR-Flash",
    description: "Speech recognition with automatic language detection",
    category: "audio",
    capabilities: ["speech-recognition", "asr", "language-detection"],
    apiType: "standard",
    parameters: { temperature: 0.7, top_p: 0.8 }
  },
  {
    id: "qwen3-omni-flash-realtime",
    name: "Qwen3-Omni-Flash-Realtime",
    description: "Real-time voice conversation with multimodal support",
    category: "audio",
    capabilities: ["realtime-conversation", "voice-chat", "multimodal"],
    apiType: "standard",
    parameters: { temperature: 0.7, top_p: 0.8 }
  },
  {
    id: "cosyvoice-v3-plus",
    name: "CosyVoice-V3-Plus",
    description: "High-quality text-to-speech synthesis",
    category: "audio",
    capabilities: ["text-to-speech", "tts", "voice-synthesis"],
    apiType: "standard",
    parameters: { temperature: 0.7, top_p: 0.8 }
  }
];

// Get models by category
export function getModelsByCategory(category: AIModel['category']): AIModel[] {
  return DASHSCOPE_MODELS.filter(model => model.category === category);
}

// Get all model IDs
export function getAllModelIds(): string[] {
  return DASHSCOPE_MODELS.map(model => model.id);
}

// Get API endpoint based on model type
export function getApiEndpoint(modelId: string): string {
  const model = DASHSCOPE_MODELS.find(m => m.id === modelId);
  if (!model) {
    return "https://dashscope-intl.aliyuncs.com/api/v1";
  }

  switch (model.apiType) {
    case "standard":
      return "https://dashscope-intl.aliyuncs.com/api/v1";
    case "openai-compatible":
      return "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
    default:
      return "https://dashscope-intl.aliyuncs.com/api/v1";
  }
}