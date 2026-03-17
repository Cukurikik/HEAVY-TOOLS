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
 * AI MUSIC SERVICE (Serverless Cloud Inference)
 * Connects directly to Hugging Face Cloud APIs - NO LOCALHOST REQUIRED.
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
      message: 'Contacting Hugging Face Cloud GPUs...',
      resultUrl: null,
      error: null
    });

    try {
      const url = `https://api-inference.huggingface.co/models/${config.modelType}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (config.hfToken) {
        headers['Authorization'] = `Bearer ${config.hfToken}`;
      }

      this.state.update(s => ({ ...s, progress: 40, message: 'GPU Processing... (This can take 15-30 seconds)' }));

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ inputs: config.prompt }),
        signal: this.abortController.signal
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `HTTP Error ${response.status}: ${response.statusText}`);
      }

      this.state.update(s => ({ ...s, progress: 90, message: 'Downloading Audio Blob...' }));

      const blob = await response.blob();

      // Validation: sometimes HF returns JSON containing "estimated_time" if model is waking up
      if (blob.type === 'application/json') {
         const text = await blob.text();
         const json = JSON.parse(text);
         if (json.estimated_time) {
           throw new Error(`Model is waking up. Try again in ${Math.round(json.estimated_time)} seconds.`);
         }
         throw new Error('Received unexpected JSON response instead of audio.');
      }

      const resultUrl = URL.createObjectURL(blob);

      this.state.set({
        isGenerating: false,
        progress: 100,
        message: 'Generation Success!',
        resultUrl: resultUrl,
        error: null
      });

    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
         // User cancelled
         return;
      }
      const errorMessage = err instanceof Error ? err.message : 'Unknown generation error occurred.';
      this.state.set({
        isGenerating: false,
        progress: 0,
        message: '',
        resultUrl: null,
        error: errorMessage
      });
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
      message: 'Generation cancelled by user.'
    }));
  }

  ngOnDestroy() {
    this.cancel();
  }
}
