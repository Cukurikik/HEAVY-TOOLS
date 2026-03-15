import { Injectable, signal, OnDestroy } from '@angular/core';

export interface AiMusicState {
  isGenerating: boolean;
  progress: number;
  message: string;
  resultUrl: string | null;
  error: string | null;
}

export interface AiMusicConfig {
  prompt: string;
  duration: number;
  modelType: 'facebook/musicgen-small' | 'cvssp/audioldm-s-full-v2';
  hfToken?: string;
}

/**
 * AI MUSIC SERVICE (Multi-Tier Cloud Inference)
 *
 * Strategy:
 *   1. Try server-side proxy (/api/hf-inference/) — NO CORS issues
 *   2. Fallback to direct HF API call — works when server proxy unavailable
 *   3. Final fallback to alternative CORS proxies
 *
 * This eliminates the single-point-of-failure from using corsproxy.io.
 */
@Injectable({ providedIn: 'root' })
export class AiMusicService implements OnDestroy {

  // Expose state via Signals for the UI
  readonly state = signal<AiMusicState>({
    isGenerating: false,
    progress: 0,
    message: '',
    resultUrl: null,
    error: null
  });

  private abortController: AbortController | null = null;

  async generate(config: AiMusicConfig) {
    if (this.state().isGenerating) return;

    this.abortController = new AbortController();

    // Reset State
    this.state.set({
      isGenerating: true,
      progress: 10,
      message: '🔗 Connecting to AI Cloud...',
      resultUrl: null,
      error: null
    });

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (config.hfToken) {
        headers['Authorization'] = `Bearer ${config.hfToken}`;
      }

      const requestBody = JSON.stringify({ inputs: config.prompt });

      // ══════════════════════════════════════════════════
      // TIER 1: Server-side proxy (most reliable, no CORS)
      // ══════════════════════════════════════════════════
      let response: Response | null = null;
      let lastError = '';

      try {
        this.state.update(s => ({
          ...s,
          progress: 20,
          message: '🖥️ Using Server Proxy...'
        }));

        const proxyUrl = `/api/hf-inference/${config.modelType}`;
        response = await this.fetchWithTimeout(proxyUrl, {
          method: 'POST',
          headers,
          body: requestBody,
          signal: this.abortController!.signal
        }, 120_000);

        if (!response.ok) {
          const errText = await response.text();
          lastError = this.parseHfError(errText, response.status);
          response = null; // Mark as failed, try next tier
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') throw err;
        lastError = err instanceof Error ? err.message : 'Server proxy unavailable';
        response = null;
      }

      // ══════════════════════════════════════════════════
      // TIER 2: Direct HF API (works if no CORS restriction)
      // ══════════════════════════════════════════════════
      if (!response) {
        try {
          this.state.update(s => ({
            ...s,
            progress: 30,
            message: '☁️ Trying Direct HF API...'
          }));

          const directUrl = `https://api-inference.huggingface.co/models/${config.modelType}`;
          response = await this.fetchWithTimeout(directUrl, {
            method: 'POST',
            headers,
            body: requestBody,
            signal: this.abortController!.signal
          }, 120_000);

          if (!response.ok) {
            const errText = await response.text();
            lastError = this.parseHfError(errText, response.status);
            response = null;
          }
        } catch (err: unknown) {
          if (err instanceof DOMException && err.name === 'AbortError') throw err;
          lastError = err instanceof Error ? err.message : 'Direct API failed';
          response = null;
        }
      }

      // ══════════════════════════════════════════════════
      // TIER 3: Alternative CORS proxies (last resort)
      // ══════════════════════════════════════════════════
      if (!response) {
        const corsProxies = [
          `https://corsproxy.io/?${encodeURIComponent(`https://api-inference.huggingface.co/models/${config.modelType}`)}`,
          `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api-inference.huggingface.co/models/${config.modelType}`)}`,
        ];

        for (const proxyUrl of corsProxies) {
          try {
            this.state.update(s => ({
              ...s,
              progress: 35,
              message: '🌐 Trying Alternative Proxy...'
            }));

            response = await this.fetchWithTimeout(proxyUrl, {
              method: 'POST',
              headers,
              body: requestBody,
              signal: this.abortController!.signal
            }, 120_000);

            if (response.ok) break; // Success!

            const errText = await response.text();
            lastError = this.parseHfError(errText, response.status);
            response = null;
          } catch (err: unknown) {
            if (err instanceof DOMException && err.name === 'AbortError') throw err;
            lastError = err instanceof Error ? err.message : 'CORS proxy failed';
            response = null;
          }
        }
      }

      // ══════════════════════════════════════════════════
      // ALL TIERS FAILED
      // ══════════════════════════════════════════════════
      if (!response) {
        throw new Error(
          lastError ||
          'All connection methods failed. Please check your internet connection and try again.'
        );
      }

      // ══════════════════════════════════════════════════
      // PROCESS SUCCESSFUL RESPONSE
      // ══════════════════════════════════════════════════
      this.state.update(s => ({
        ...s,
        progress: 70,
        message: '🎵 GPU Processing... (15-60 seconds)'
      }));

      const blob = await response.blob();

      // Validation: sometimes HF returns JSON containing "estimated_time" if model is waking up
      if (blob.type === 'application/json' || blob.size < 1000) {
        try {
          const text = await blob.text();
          const json = JSON.parse(text);
          if (json.estimated_time) {
            throw new Error(
              `⏳ Model is loading/cold-starting. Estimated wait: ~${Math.round(json.estimated_time)} seconds. Please try again in a moment.`
            );
          }
          if (json.error) {
            throw new Error(`HF API Error: ${json.error}`);
          }
        } catch (parseErr) {
          if (parseErr instanceof Error && parseErr.message.includes('Model is loading')) {
            throw parseErr;
          }
          if (parseErr instanceof Error && parseErr.message.includes('HF API Error')) {
            throw parseErr;
          }
          // If JSON parse fails, the blob might actually be valid audio — continue
        }
      }

      this.state.update(s => ({
        ...s,
        progress: 90,
        message: '📥 Downloading Audio...'
      }));

      const resultUrl = URL.createObjectURL(blob);

      this.state.set({
        isGenerating: false,
        progress: 100,
        message: '✅ Generation Success!',
        resultUrl: resultUrl,
        error: null
      });

    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // User cancelled
        this.state.update(s => ({
          ...s,
          isGenerating: false,
          message: '🚫 Generation cancelled.'
        }));
        return;
      }
      const errorMessage = err instanceof Error ? err.message : 'Unknown generation error.';
      this.state.set({
        isGenerating: false,
        progress: 0,
        message: '',
        resultUrl: null,
        error: errorMessage
      });
    }
  }

  /**
   * Fetch with configurable timeout
   */
  private fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs: number
  ): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Request timed out after ${timeoutMs / 1000}s`));
      }, timeoutMs);

      fetch(url, options)
        .then(res => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  /**
   * Parse Hugging Face error responses into user-friendly messages
   */
  private parseHfError(text: string, status: number): string {
    try {
      const json = JSON.parse(text);
      if (json.error) return json.error;
      if (json.estimated_time) {
        return `Model is cold-starting. Try again in ~${Math.round(json.estimated_time)}s.`;
      }
    } catch {
      // Not JSON
    }

    switch (status) {
      case 401: return 'Invalid or missing HF API Token. Please provide a valid token.';
      case 403: return 'Access denied. This model may require a valid API token.';
      case 404: return 'Model not found on Hugging Face.';
      case 429: return 'Rate limit exceeded. Please wait a moment and try again.';
      case 500:
      case 502:
      case 503:
        return 'Hugging Face servers are temporarily unavailable. Please try again later.';
      default:
        return text || `HTTP Error ${status}`;
    }
  }

  cancel() {
    if (this.abortController) {
      this.abortController.abort();
    }
    const currentUrl = this.state().resultUrl;
    if (currentUrl) URL.revokeObjectURL(currentUrl);

    this.state.update(s => ({
      ...s,
      isGenerating: false,
      message: '🚫 Generation cancelled by user.'
    }));
  }

  ngOnDestroy() {
    this.cancel();
  }
}
