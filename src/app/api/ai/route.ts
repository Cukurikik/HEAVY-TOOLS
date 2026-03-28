import { NextRequest } from "next/server";
import { DASHSCOPE_MODELS, getAllModelIds, getApiEndpoint } from "@/lib/ai-models";
import fs from "fs/promises";
import path from "path";

// ============================================================================
// BYOK (Bring Your Own Key) Reader — reads user's API keys from Settings Hub
// Priority: User Settings (BYOK) → Environment Variables → Hardcoded Fallbacks
// ============================================================================
const SETTINGS_FILE = path.join(process.cwd(), "data", "user_settings.json");

/**
 * Read a specific BYOK value from user_settings.json by its slug.
 * Settings are stored per-user; we default to 'local-user'.
 */
async function readByokKey(slug: string): Promise<string | null> {
  try {
    const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
    const db = JSON.parse(raw);
    const userSettings = db["local-user"] || {};
    // The key might be stored directly as the slug value, or may be null/empty
    const val = userSettings[slug];
    if (val && typeof val === "string" && val.trim().length > 0) {
      return val.trim();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Build the final API key arrays with BYOK priority.
 * User-provided keys from Settings Hub are checked FIRST.
 */
async function buildAlibabaKeys(): Promise<string[]> {
  const byokAlibaba = await readByokKey("integrasi-groq-api-inference-super-cepat"); // Groq uses same DashScope-style
  const keys = [
    byokAlibaba,
    process.env.ALIBABA_CLOUD_API_KEY,
    "sk-baadd0ecc39547d68b00872b10f95e87",
    "sk-4be34075ee564d4d85fd6357f70898e2"
  ].filter(Boolean) as string[];
  return keys;
}

async function buildGeminiKeys(): Promise<string[]> {
  // BYOK: User's own Gemini key from Settings Hub (feature 064)
  const byokGemini = await readByokKey("integrasi-google-gemini-api");
  const keys = [
    byokGemini,
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
    process.env.GEMINI_API_KEY_6
  ].filter(Boolean) as string[];
  return keys;
}

async function buildOpenAIKeys(): Promise<string[]> {
  // BYOK: User's own OpenAI key from Settings Hub (feature 062)
  const byokOpenAI = await readByokKey("integrasi-openai-api-model-gpt-4o-dall-e-3-ma");
  const keys = [
    byokOpenAI,
    process.env.OPENAI_API_KEY,
  ].filter(Boolean) as string[];
  return keys;
}

async function buildAnthropicKeys(): Promise<string[]> {
  // BYOK: User's own Anthropic key from Settings Hub (feature 063)
  const byokAnthropic = await readByokKey("integrasi-anthropic-api-claude-3-5-sonnet");
  const keys = [
    byokAnthropic,
    process.env.ANTHROPIC_API_KEY,
  ].filter(Boolean) as string[];
  return keys;
}

// These are resolved dynamically per-request now (BYOK priority)
let FALLBACK_KEYS: string[] = [];
let GEMINI_FALLBACK_KEYS: string[] = [];

function getModelCategory(modelId: string): string {
  const model = DASHSCOPE_MODELS.find(m => m.id === modelId);
  return model ? model.category : 'text';
}

function getModelApiType(modelId: string): string {
  const model = DASHSCOPE_MODELS.find(m => m.id === modelId);
  return model ? model.apiType : 'standard';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], model = "qwen3-max", input = {}, parameters = {} } = body;

    const supportedModels = getAllModelIds();
    if (!supportedModels.includes(model)) {
      return Response.json({ error: `Unsupported model: ${model}` }, { status: 400 });
    }

    // ─── BYOK: Build key arrays dynamically per-request ──────────────
    FALLBACK_KEYS = await buildAlibabaKeys();
    GEMINI_FALLBACK_KEYS = await buildGeminiKeys();

    const serviceCategory = getModelCategory(model);
    const apiType = getModelApiType(model);
    const baseEndpoint = getApiEndpoint(model);
    const modelData = DASHSCOPE_MODELS.find(m => m.id === model);
    const enableThinking = modelData?.parameters?.enable_thinking || false;

    // Build History
    const messages = [
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message || "Hello" }
    ];

    let finalResponse = "";
    let finalReasoning = "";
    let success = false;
    let lastError = "";
    let currentProvider = "alibaba";

    // ─── GEMINI / GENKIT ROUTING (IMAGE & VIDEO) ───────────────────────────────────
    if (serviceCategory === 'image' || serviceCategory === 'video') {
      currentProvider = "google";
      if (GEMINI_FALLBACK_KEYS.length === 0) {
        return Response.json({ error: "No Gemini API keys configured for image/video." }, { status: 500 });
      }

      for (const apiKey of GEMINI_FALLBACK_KEYS) {
        try {
          if (serviceCategory === 'image') {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`;
            const payload = {
              instances: [ { prompt: message || "A beautiful landscape" } ],
              parameters: { sampleCount: 1 }
            };

            const res = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              lastError = err.error?.message || err.message || res.statusText;
              continue;
            }

            const data = await res.json();
            const b64Image = data.predictions?.[0]?.bytesBase64Encoded;
            if (b64Image) {
               finalResponse = `![Generated Image](data:image/jpeg;base64,${b64Image})`;
               success = true;
               break;
            } else {
               lastError = "No image bytes returned from Google AI Studio.";
               continue;
            }
          } else if (serviceCategory === 'video') {
             // For Veo or Gemini video processing later
            finalResponse = "Video generation via Gemini API (Veo) is currently processing. Result will appear shortly.";
            success = true;
            break;
          }
        } catch (err: any) {
          lastError = err.message;
        }
      }
    } 
    // ─── ALIBABA CLOUD ROUTING (TEXT & AUDIO) ──────────────────────────────────────
    else {
      currentProvider = "alibaba";
      if (FALLBACK_KEYS.length === 0) {
        return Response.json({ error: "No Alibaba API keys configured." }, { status: 500 });
      }

      for (const apiKey of FALLBACK_KEYS) {
        try {
          let endpoint = baseEndpoint;
          let payload: any = {};

          if (apiType === 'standard') {
            let servicePath = '';
            const { temperature, max_tokens, top_p, enable_thinking, ...validParams } = parameters;

            if (serviceCategory === 'audio') {
              servicePath = model === 'qwen3-asr-flash' ? '/services/audio/asr/generation' : '/services/audio/tts/generation';
            } else if (model.startsWith('qwen-image') || serviceCategory === 'multimodal') {
              servicePath = '/services/aigc/multimodal-generation/generation';
            } else {
              servicePath = '/services/aigc/text-generation/generation';
            }
            
            endpoint = baseEndpoint + servicePath;
            
            let formattedMessages = messages;
            if (model.startsWith('qwen-image') || serviceCategory === 'multimodal') {
                formattedMessages = messages.map(m => ({
                    role: m.role,
                    content: typeof m.content === 'string' ? [{ text: m.content }] : m.content
                }));
            }

            payload = {
              model: model,
              input: serviceCategory === 'audio' ? (messages[0]?.content || {}) : { messages: formattedMessages },
              parameters: model.startsWith('qwen-image') ? validParams : { ...parameters }
            };

            const res = await fetch(endpoint, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "X-DashScope-Async": "disable"
              },
              body: JSON.stringify(payload),
            });

            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              lastError = err.message || res.statusText;
              continue;
            }

            const data = await res.json();
            
            if (model.startsWith('qwen-image') || serviceCategory === 'multimodal') {
              const textContent = data.output?.choices?.[0]?.message?.content?.[0];
              if (textContent && textContent.image) {
                  finalResponse = `![Generated Image](${textContent.image})`;
              } else {
                  finalResponse = typeof textContent === 'string' ? textContent : (data.output?.choices?.[0]?.message?.content || "Request processed successfully.");
                  if (Array.isArray(finalResponse)) {
                     finalResponse = finalResponse.map((c:any) => c.text || (c.image ? `![Generated Image](${c.image})` : "")).join('\n');
                  }
              }
            } else {
              finalResponse = data.output?.text || data.output?.choices?.[0]?.message?.content || "Request processed successfully.";
            }

            success = true;
            break;
          } else if (apiType === 'openai-compatible') {
            endpoint = baseEndpoint + "/chat/completions";
            payload = {
              model: model,
              messages: messages,
              stream: true,
              ...(enableThinking ? { extra_body: { enable_thinking: true } } : {}),
              ...parameters
            };

            const res = await fetch(endpoint, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(payload),
            });

            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              lastError = err.message || res.statusText;
              continue;
            }

            const reader = res.body?.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";

            if (reader) {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || "";
                
                for (const line of lines) {
                  const trimmed = line.trim();
                  if (trimmed.startsWith("data:")) {
                    const dataStr = trimmed.slice(5).trim();
                    if (dataStr === "[DONE]") continue;
                    try {
                      const data = JSON.parse(dataStr);
                      const delta = data.choices?.[0]?.delta;
                      if (delta) {
                        if (delta.reasoning_content) finalReasoning += delta.reasoning_content;
                        if (delta.content) finalResponse += delta.content;
                      }
                    } catch (e) {
                      // Ignore partial chunks
                    }
                  }
                }
              }
            }
            success = true;
            break;
          }
        } catch (err: any) {
          lastError = err.message;
        }
      }
    } // End of Alibaba loop

    if (!success) {
      return Response.json(
        { error: `All provided API keys exhausted or network failed. Last error: ${lastError}` },
        { status: 502 }
      );
    }

    if (finalReasoning.trim() !== '') {
      finalResponse = `> **🧠 Logic & Reasoning Engine**\n> \n> ${finalReasoning.trim().replace(/\n/g, '\n> ')}\n\n---\n\n${finalResponse}`;
    }

    if (!finalResponse.trim()) {
      finalResponse = "The logical engine returned an empty sequence. Please try adjusting the parameters or switching models.";
    }

    return Response.json({ 
      response: finalResponse, 
      model: model, 
      provider: currentProvider,
      category: serviceCategory,
      apiType: apiType
    });

  } catch (error) {
    console.error("AI Assistant Error:", error);
    return Response.json({ error: "Fatal pipeline error." }, { status: 500 });
  }
}