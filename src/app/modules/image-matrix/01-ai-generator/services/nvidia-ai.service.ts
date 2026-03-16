import { Injectable, signal, OnDestroy } from '@angular/core';

export interface NvidiaAiState {
  isGenerating: boolean;
  progress: number;
  message: string;
  resultUrl: string | null;
  error: string | null;
}

export interface NvidiaAiConfig {
  prompt: string;
  aspectRatio: '1:1' | '16:9' | '9:16';
  negativePrompt?: string;
}

/**
 * NVIDIA AI SERVICE (Stable Diffusion 3.5 Large via NVIDIA NIM)
 * Connects directly to NVIDIA Cloud Infrastructure for Enterprise-grade Generation.
 */
@Injectable({ providedIn: 'root' })
export class NvidiaAiService implements OnDestroy {
  // Hardcoded API Key as requested by the User for this specific instance
  private readonly API_KEY = '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';
  private readonly INFERENCE_URL = 'https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-3.5-large';

  readonly state = signal<NvidiaAiState>({
    isGenerating: false,
    progress: 0,
    message: '',
    resultUrl: null,
    error: null
  });

  private abortController: AbortController | null = null;

  async generateImage(config: NvidiaAiConfig) {
    if (this.state().isGenerating) return;

    // Revoke previous URL to prevent memory leaks
    if (this.state().resultUrl) {
      URL.revokeObjectURL(this.state().resultUrl!);
    }

    this.abortController = new AbortController();

    this.state.set({
      isGenerating: true,
      progress: 10,
      message: 'Initialising NVIDIA A100/H100 Cloud GPU...',
      resultUrl: null,
      error: null
    });

    try {
      this.state.update(s => ({ ...s, progress: 30, message: 'Processing text prompt with Stable Diffusion 3.5 Large...' }));

      const payload = {
        prompt: config.prompt,
        negative_prompt: config.negativePrompt || 'blurry, low quality, deformed, artifacts',
        aspect_ratio: config.aspectRatio,
        cfg_scale: 4.5,
        steps: 40,
        seed: Math.floor(Math.random() * 4294967295),
        output_format: 'png'
      };

      const response = await fetch(this.INFERENCE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: this.abortController.signal
      });

      this.state.update(s => ({ ...s, progress: 70, message: 'Awaiting tensor computations & decoding image...' }));

      if (!response.ok) {
        let errText = await response.text();
        try {
          const jsonError = JSON.parse(errText);
          errText = jsonError.detail || jsonError.message || errText;
        } catch (parseError) {
          console.warn('Could not parse NVIDIA error JSON:', parseError);
        }
        throw new Error(`NVIDIA API Error ${response.status}: ${errText}`);
      }

      const rawJson = await response.json();
      
      this.state.update(s => ({ ...s, progress: 90, message: 'Downloading High-Res output...' }));

      // NVIDIA NIM generally returns base64 either as direct base64 string or within a data array
      let base64Data = '';
      if (rawJson.data && rawJson.data.length > 0 && rawJson.data[0].b64_json) {
          base64Data = rawJson.data[0].b64_json;
      } else if (rawJson.image) {
          base64Data = rawJson.image;
      } else if (rawJson.b64_json) {
          base64Data = rawJson.b64_json;
      } else {
         throw new Error('Unexpected response format from NVIDIA API. Base64 data not found.');
      }

      // Convert Base64 to Blob
      const blob = this.b64toBlob(base64Data, 'image/png');
      const resultUrl = URL.createObjectURL(blob);

      this.state.set({
        isGenerating: false,
        progress: 100,
        message: 'Generation Complete! 🚀',
        resultUrl: resultUrl,
        error: null
      });

    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
         return; // Cancelled
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
    this.state.update(s => ({
      ...s,
      isGenerating: false,
      message: 'Generation cancelled by user.'
    }));
  }

  ngOnDestroy() {
    this.cancel();
    if (this.state().resultUrl) {
      URL.revokeObjectURL(this.state().resultUrl!);
    }
  }

  private b64toBlob(b64Data: string, contentType = '', sliceSize = 512): Blob {
    // Remove data URL scheme if present (e.g. "data:image/png;base64,")
    const base64Str = b64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    const byteCharacters = atob(base64Str);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }
}
