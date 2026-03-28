import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { idbStorage } from '@/lib/idb-storage';

// ═══════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════

export interface ImageTask {
  id: string;
  file: File | null;
  files: File[];
  operation: string; // The Tool Slug (e.g. 'compressor')
  status: 'idle' | 'loading' | 'processing' | 'success' | 'error';
  progress: number;
  options: Record<string, unknown>;
  resultUrl?: string;
  error?: string;
  outputFormat?: string;
}

interface ImageStore {
  task: ImageTask;
  workerLogs: string[];
  setFile: (file: File) => void;
  addFiles: (files: File[]) => void;
  setOperation: (operation: string) => void;
  setOptions: (options: Record<string, unknown>) => void;
  setOutputFormat: (format: string) => void;
  processImage: () => Promise<void>;
  reset: () => void;
}

const initialTask: ImageTask = {
  id: '',
  file: null,
  files: [],
  operation: 'idle',
  status: 'idle',
  progress: 0,
  options: {},
  outputFormat: 'webp',
};

// ═══════════════════════════════════════════════════
// Zustand Store (with strict Immer mutations)
// ═══════════════════════════════════════════════════

export const useImageStore = create<ImageStore>()(
  persist(
    immer((set, get) => ({
      task: { ...initialTask },
      workerLogs: [],

      setFile: (file) =>
        set((state) => {
          state.task.file = file;
          state.task.id = crypto.randomUUID();
          state.task.status = 'idle';
          state.task.progress = 0;
          state.task.resultUrl = undefined;
          state.task.error = undefined;
          state.workerLogs = [];
        }),

      addFiles: (files) =>
        set((state) => {
          state.task.files.push(...files);
          if (!state.task.file) state.task.file = files[0];
          state.task.id = state.task.id || crypto.randomUUID();
          state.task.status = 'idle';
          state.task.progress = 0;
          state.task.resultUrl = undefined;
          state.task.error = undefined;
        }),

      setOperation: (operation) =>
        set((state) => {
          state.task.operation = operation;
          state.task.options = {}; // Reset options when changing tool
        }),

      setOptions: (options) =>
        set((state) => {
          state.task.options = { ...state.task.options, ...options };
        }),

      setOutputFormat: (format) =>
        set((state) => {
          state.task.outputFormat = format;
        }),

      processImage: async () => {
        const { task } = get();

        if (!task.file || task.operation === 'idle') return;

        set((state) => {
          state.task.status = 'processing';
          state.task.progress = 0;
          state.task.error = undefined;
          state.workerLogs = [];
        });

        try {
          // Native APIs placeholder routing
          if (['b64-encoder', 'color-picker', 'batch-rename'].includes(task.operation)) {
            throw new Error(`Tool [${task.operation}] executes via DOM Native APIs, not WASM.`);
          }

          if (task.operation === 'background-remover' || task.operation === 'upscaler') {
            throw new Error(`Tool [${task.operation}] executes via ONNX Worker, not FFmpeg.`);
          }

          // Spawn the robust FFmpeg WASM Dedicated Sub-thread
          const worker = new Worker(new URL('@/workers/image.worker.ts', import.meta.url));

          worker.onmessage = (e: MessageEvent) => {
            const { type, status, progress, message, resultUrls, error } = e.data;

            if (type === 'STATUS') {
              // Internal lifecycle
            } else if (type === 'LOG') {
              set((state) => {
                state.workerLogs.push(message);
              });
            } else if (type === 'PROGRESS') {
              set((state) => {
                state.task.progress = progress;
              });
            } else if (type === 'SUCCESS') {
              set((state) => {
                state.task.status = 'success';
                state.task.progress = 100;
                state.task.resultUrl = resultUrls[0];
              });
              worker.terminate();
            } else if (type === 'ERROR') {
              set((state) => {
                state.task.status = 'error';
                state.task.error = error || 'Processing failed.';
              });
              worker.terminate();
            }
          };

          worker.onerror = (err) => {
            console.error('Image Worker generic error:', err);
            set((state) => {
              state.task.status = 'error';
              state.task.error = 'Background Image Worker Crash. Memory limit or isolation failure.';
            });
            worker.terminate();
          };

          worker.postMessage({
            type: 'PROCESS_IMAGE',
            payload: {
              toolSlug: task.operation,
              file: task.file,
              options: task.options,
              outputFormat: task.outputFormat || 'webp',
            },
          });
        } catch (error) {
          console.error('Image orchestrator error:', error);
          set((state) => {
            state.task.status = 'error';
            state.task.error = error instanceof Error ? error.message : 'Engine spawn failure.';
          });
        }
      },

      reset: () =>
        set((state) => {
          state.task = { ...initialTask };
          state.workerLogs = [];
        }),
    })),
    {
      name: 'image-store',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ task: { ...state.task, file: null, files: [] } }), // Avoid serializing File objects into IDB
    }
  )
);

// ═══════════════════════════════════════════════════
// BroadcastChannel: Cross-Tab Synchronization
// ═══════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  const channel = new BroadcastChannel('omni-image-store-sync');
  
  // To avoid infinite broadcast loops, track when we are currently applying a remote state
  let isApplyingRemoteState = false;

  useImageStore.subscribe((state) => {
    if (!isApplyingRemoteState) {
      // Broadcast the strictly partialized state
      channel.postMessage({
        type: 'SYNC',
        payload: { task: { ...state.task, file: null, files: [] } },
      });
    }
  });

  channel.onmessage = (event) => {
    if (event.data?.type === 'SYNC') {
      isApplyingRemoteState = true;
      // Re-hydrate state from another tab
      useImageStore.setState(event.data.payload, false);
      
      // Use microtask queue to reset the flag after all listeners fire
      queueMicrotask(() => {
        isApplyingRemoteState = false;
      });
    }
  };
}
