import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

interface ChatRequest {
  model: string;
  systemPrompt?: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  maxTokens?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { model, systemPrompt, messages, temperature = 0.7, maxTokens = 4096 } = body;

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (model.startsWith('gemini')) {
      return handleGemini(systemPrompt, messages, temperature, maxTokens);
    } else if (model.startsWith('gpt')) {
      return handleOpenAI(model, systemPrompt, messages, temperature, maxTokens);
    } else if (model.startsWith('claude')) {
      return handleClaude(model, systemPrompt, messages, temperature, maxTokens);
    } else {
      return handleEchoMode(model, systemPrompt, messages);
    }
  } catch (error) {
    console.error('LLM API Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function getApiKeyFromSettings(slug: string, envFallback: string): Promise<string | undefined> {
  try {
    const dataPath = require('path').join(process.cwd(), 'data', 'user_settings.json');
    const fs = require('fs/promises');
    const raw = await fs.readFile(dataPath, 'utf-8');
    const settings = JSON.parse(raw);
    const userSettings = Object.values(settings)[0] as Record<string, any>;
    
    // Support the local-user toggle so that if they turn off the integration switch, 
    // it properly falls back instead of forcing an inactive key.
    const isEnabled = userSettings[`${slug}_enabled`] ?? true;
    
    if (isEnabled && userSettings && typeof userSettings[slug] === 'string' && userSettings[slug].trim() !== '') {
      return userSettings[slug].trim();
    }
  } catch (error) {
    // ignore filesystem errors
  }
  return process.env[envFallback];
}

async function handleGemini(sp: string | undefined, msgs: { role: string; content: string }[], temp: number, max: number) {
  const key = await getApiKeyFromSettings('integrasi-google-gemini-api', 'GOOGLE_AI_API_KEY');
  if (!key) return handleEchoMode('gemini-1.5-pro', sp, msgs);

  const contents = msgs.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:streamGenerateContent?alt=sse&key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: sp ? { parts: [{ text: sp }] } : undefined,
        contents,
        generationConfig: { temperature: temp, maxOutputTokens: max },
      }),
    }
  );
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini API Error: ${res.status} ${errText}`);
  }
  return parseSSE(res);
}

async function handleOpenAI(model: string, sp: string | undefined, msgs: { role: string; content: string }[], temp: number, max: number) {
  const key = await getApiKeyFromSettings('integrasi-openai-api-model-gpt-4o-dall-e-3-ma', 'OPENAI_API_KEY');
  if (!key) return handleEchoMode(model, sp, msgs);

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [...(sp ? [{ role: 'system', content: sp }] : []), ...msgs],
      temperature: temp, max_tokens: max, stream: true,
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`OpenAI API Error: ${res.status} ${errText}`);
  }
  return parseSSE(res);
}

async function handleClaude(model: string, sp: string | undefined, msgs: { role: string; content: string }[], temp: number, max: number) {
  const key = await getApiKeyFromSettings('integrasi-anthropic-api-claude-3-5-sonnet', 'ANTHROPIC_API_KEY');
  if (!key) return handleEchoMode(model, sp, msgs);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: model === 'claude-3-5-sonnet' ? 'claude-3-5-sonnet-20241022' : model,
      system: sp, messages: msgs, temperature: temp, max_tokens: max, stream: true,
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Claude API Error: ${res.status} ${errText}`);
  }
  return parseSSE(res);
}

function handleEchoMode(model: string, sp: string | undefined, msgs: { role: string; content: string }[]) {
  const last = msgs[msgs.length - 1]?.content || '';
  const echo =
    `**[API Key Missing for \`${model}\`]**\n\n` +
    `Please configure the API Key in the **Settings** panel for your selected provider.\n` +
    `\nYour message:\n> ${last}`;

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(ctrl) {
      for (const w of echo.split(' ')) {
        ctrl.enqueue(enc.encode(' ' + w));
        await new Promise(r => setTimeout(r, 15));
      }
      ctrl.close();
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

function parseSSE(upstream: Response) {
  const reader = upstream.body!.getReader();
  const dec = new TextDecoder();
  const enc = new TextEncoder();

  const stream = new ReadableStream({
    async pull(ctrl) {
      const { value, done } = await reader.read();
      if (done) { ctrl.close(); return; }
      for (const line of dec.decode(value, { stream: true }).split('\n')) {
        if (!line.startsWith('data: ') || line.includes('[DONE]')) continue;
        try {
          const d = JSON.parse(line.slice(6));
          const t = d.choices?.[0]?.delta?.content || d.candidates?.[0]?.content?.parts?.[0]?.text ||
            (d.type === 'content_block_delta' ? d.delta?.text : null);
          if (t) ctrl.enqueue(enc.encode(t));
        } catch { /* skip */ }
      }
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
