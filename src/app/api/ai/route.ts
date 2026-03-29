import { NextRequest } from "next/server";
import { DASHSCOPE_MODELS, getAllModelIds, getApiEndpoint } from "@/lib/ai-models";

const FALLBACK_KEYS = [
  process.env.ALIBABA_CLOUD_API_KEY,
  process.env.ALIBABA_CLOUD_API_KEY_2,
  process.env.ALIBABA_CLOUD_API_KEY_3
].filter(Boolean) as string[];

const GEMINI_FALLBACK_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
  process.env.GEMINI_API_KEY_6
].filter(Boolean) as string[];

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