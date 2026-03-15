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
  modelType: 'musicgen' | 'ace-step' | 'audioldm';
}

/**
 * AI MUSIC SERVICE (FastAPI + WebSocket Integration)
 * Matches the Enterprise Python Architecture, connects to ws://localhost:8000
 */
@Injectable({ providedIn: 'root' })
export class AiMusicService implements OnDestroy {
  
  private ws: WebSocket | null = null;
  private readonly WS_URL = 'ws://localhost:8000/api/ai-music/ws';
  
  // Expose state via Signals for the UI
  readonly state = signal<AiMusicState>({
    isGenerating: false,
    progress: 0,
    message: '',
    resultUrl: null,
    error: null
  });

  generate(config: AiMusicConfig) {
    if (this.state().isGenerating) return;

    // Reset State
    this.state.set({
      isGenerating: true,
      progress: 0,
      message: 'Connecting to Omni AI Engine Server...',
      resultUrl: null,
      error: null
    });

    const clientId = crypto.randomUUID();
    
    try {
      this.ws = new WebSocket(`${this.WS_URL}/${clientId}`);
      
      this.ws.onopen = () => {
        this.state.update(s => ({ ...s, message: 'Connected to GPU Server. Sending Prompt...' }));
        this.ws?.send(JSON.stringify(config));
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          this.state.update(s => ({
            ...s,
            progress: data.progress ?? s.progress,
            message: data.message ?? s.message,
            resultUrl: data.result_url ?? s.resultUrl,
            error: data.status === 'error' ? data.message : null
          }));
          
          if (data.status === 'completed' || data.status === 'error') {
            this.state.update(s => ({ ...s, isGenerating: false }));
            this.cleanupWebSocket();
          }
          
        } catch (e) {
          console.error('Failed to parse WS message', e);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        this.state.set({
          isGenerating: false,
          progress: 0,
          message: '',
          resultUrl: null,
          error: 'Failed to connect to AI Server. Is the Python Backend running on port 8000?'
        });
        this.cleanupWebSocket();
      };
      
      this.ws.onclose = () => {
        this.state.update(s => ({ ...s, isGenerating: false }));
      };
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown connection error occurred.';
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
    this.cleanupWebSocket();
    this.state.update(s => ({
      ...s,
      isGenerating: false,
      message: 'Generation cancelled by user.'
    }));
  }

  private cleanupWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  ngOnDestroy() {
    this.cleanupWebSocket();
  }
}
