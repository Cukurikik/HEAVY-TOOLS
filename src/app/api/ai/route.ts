import { NextRequest } from "next/server";
import { DASHSCOPE_MODELS, getAllModelIds, getApiEndpoint } from "@/lib/ai-models";

const FALLBACK_KEYS = [
  process.env.ALIBABA_CLOUD_API_KEY,
  "sk-baadd0ecc39547d68b00872b10f95e87", // Secondary key
  "sk-4be34075ee564d4d85fd6357f70898e2"  // Tertiary key
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

    if (FALLBACK_KEYS.length === 0) {
      return Response.json({ error: "No API keys configured." }, { status: 500 });
    }

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

    // Iterate through API Keys to implement failover logic
    for (const apiKey of FALLBACK_KEYS) {
      try {
        let endpoint = baseEndpoint;
        let payload: any = {};

        if (apiType === 'standard') {
          const serviceCategory = getModelCategory(model);
          
          if (serviceCategory === 'image' && !model.startsWith("qwen-image")) {
            const endpoint = baseEndpoint + '/services/aigc/text2image/image-synthesis';
            
            // DashScope Image API strictly rejects text LLM hyperparameters
            const { temperature, max_tokens, top_p, enable_thinking, ...validImageParams } = parameters;
            
            payload = {
              model: model,
              input: { prompt: message || "A beautiful landscape" },
              parameters: validImageParams
            };

            const headerOptions = {
              "X-DashScope-Async": "enable",
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            };

            const res = await fetch(endpoint, { method: "POST", headers: headerOptions, body: JSON.stringify(payload) });
            
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              lastError = err.message || res.statusText;
              continue;
            }

            const data = await res.json();
            const taskId = data.output?.task_id;
            
            if (!taskId) {
               lastError = "Missing task_id for image generation.";
               continue;
            }

            // Async Task Polling
            let pollSuccess = false;
            for (let i = 0; i < 15; i++) {
              await new Promise(r => setTimeout(r, 2000));
              const pollRes = await fetch(`${baseEndpoint}/tasks/${taskId}`, {
                headers: { "Authorization": `Bearer ${apiKey}` }
              });
              
              const pollData = await pollRes.json();
              if (pollData.output?.task_status === 'SUCCEEDED') {
                const imgUrl = pollData.output.results?.[0]?.url;
                finalResponse = `![Generated Image](${imgUrl})`;
                pollSuccess = true;
                break;
              } else if (pollData.output?.task_status === 'FAILED') {
                lastError = `Image generation task failed: ${pollData.output?.message}`;
                break;
              }
            }

            if (pollSuccess) {
              success = true;
              break;
            } else {
              lastError = lastError || "Image generation timed out.";
              continue;
            }

          } else {
            // Video / Audio / Standard Text / Qwen-Image handling
            let servicePath = '';
            const { temperature, max_tokens, top_p, enable_thinking, ...validParams } = parameters;

            if (serviceCategory === 'video') {
              servicePath = '/services/aigc/video-generation/video-synthesis';
            } else if (serviceCategory === 'audio') {
              servicePath = model === 'qwen3-asr-flash' ? '/services/audio/asr/generation' : '/services/audio/tts/generation';
            } else if (model.startsWith('qwen-image') || serviceCategory === 'multimodal') {
              servicePath = '/services/aigc/multimodal-generation/generation';
            } else {
              servicePath = '/services/aigc/text-generation/generation';
            }
            
            endpoint = baseEndpoint + servicePath;
            payload = {
              model: model,
              input: serviceCategory === 'audio' ? (messages[0]?.content || {}) : { messages },
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
            
            // Format output based on Qwen-image return structure versus standard text
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
          }

        } else if (apiType === 'openai-compatible') {
          endpoint = baseEndpoint + "/chat/completions";
          payload = {
            model: model,
            messages: messages,
            stream: true, // MANDATORY for DashScope thinking models
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
            continue; // Fallback to next key
          }

          // Consume the SSE stream on the server side to satisfy stream=true requirement
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
          break; // Exit key loop on success
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (!success) {
      return Response.json(
        { error: `All provided API keys exhausted or network failed. Last error: ${lastError}` },
        { status: 502 }
      );
    }

    // Format the markdown response if deep thinking was generated
    if (finalReasoning.trim() !== '') {
      finalResponse = `> **🧠 Logic & Reasoning Engine**\n> \n> ${finalReasoning.trim().replace(/\n/g, '\n> ')}\n\n---\n\n${finalResponse}`;
    }

    if (!finalResponse.trim()) {
      finalResponse = "The logical engine returned an empty sequence. Please try adjusting the parameters or switching models.";
    }

    return Response.json({ 
      response: finalResponse, 
      model: model, 
      provider: "alibaba",
      category: getModelCategory(model),
      apiType: apiType
    });

  } catch (error) {
    console.error("AI Assistant Error:", error);
    return Response.json({ error: "Fatal pipeline error." }, { status: 500 });
  }
}