import { EventEmitter } from 'events';

// Phase 6: Plugin Hooks & Event System
export class OmniEventBus extends EventEmitter {
  private hooks: Map<string, Array<{ pluginId: string, priority: number, handler: Function }>> = new Map();

  // Task 60: Hook Conflict Resolver
  // Registering a hook with a priority
  registerHook(eventName: string, pluginId: string, priority: number, handler: Function) {
    if (!this.hooks.has(eventName)) {
      this.hooks.set(eventName, []);
    }

    const eventHooks = this.hooks.get(eventName)!;
    eventHooks.push({ pluginId, priority, handler });

    // Conflict Resolver: Sort by priority descending (highest priority runs first)
    eventHooks.sort((a, b) => b.priority - a.priority);
  }

  // Triggering hooks sequentially for middleware-styled pipelines
  async triggerWaterfal(eventName: string, payload: any): Promise<any> {
    const eventHooks = this.hooks.get(eventName) || [];
    let currentPayload = payload;

    for (const hook of eventHooks) {
      try {
        currentPayload = await hook.handler(currentPayload);
      } catch (err) {
        console.warn(`Plugin ${hook.pluginId} failed on hook ${eventName}:`, err);
        // Continue cascade even if one plugin fails, or abort depending on strictness
      }
    }
    
    return currentPayload;
  }
}

export const eventBus = new OmniEventBus();

// Specific implementation placeholders for defined custom hooks
// Task 52-56
export const CoreHooks = {
  // Dipanggil sebelum ffmpeg di-eksekusi, misalnya plugin menambahkan watermark atau mengubah filter
  onVideoExport: async (bufferOrArgs: any) => eventBus.triggerWaterfal('onVideoExport', bufferOrArgs),
  
  // Dipanggil di dalam node khusus pemrosesan VST fallback backend
  onAudioProcess: async (audioBuffer: any) => eventBus.triggerWaterfal('onAudioProcess', audioBuffer),

  // Modifikasi buffer dokumen PDF
  onPdfRender: async (pdfBuffer: any) => eventBus.triggerWaterfal('onPdfRender', pdfBuffer),

  // Pre-processing system prompt untuk LLM engine
  onLlmPrompt: async (promptConfig: any) => eventBus.triggerWaterfal('onLlmPrompt', promptConfig),

  // Intersepsi mapping file format untuk file-converter
  onFileConvert: async (fileData: any) => eventBus.triggerWaterfal('onFileConvert', fileData),
};

// UI and Frontend APIs are exposed on the client side via state stores
// Task 57 (UI Injection), 58 (Context Menu), 59 (State Access) will be exposed by the client plugin wrapper.
