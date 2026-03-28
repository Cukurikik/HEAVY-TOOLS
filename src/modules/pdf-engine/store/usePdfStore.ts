import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { idbStorage } from '@/lib/idb-storage';
import { useSettingsStore } from '@/store/useSettingsStore';

// ═══════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════

export interface PdfTask {
  id: string;
  file: File | null;
  files: File[];
  operation: string; // The Tool Slug (e.g. 'merger', 'compressor', 'watermark')
  status: 'idle' | 'loading' | 'processing' | 'success' | 'error';
  progress: number;
  options: Record<string, unknown>;
  resultUrl?: string; // object URL to downloading result
  error?: string;
}

interface PdfStore {
  task: PdfTask;
  workerLogs: string[];
  setFile: (file: File) => void;
  addFiles: (files: File[]) => void;
  setOperation: (operation: string) => void;
  setOptions: (options: Record<string, unknown>) => void;
  processPdf: () => Promise<void>;
  reset: () => void;
}

const initialTask: PdfTask = {
  id: '',
  file: null,
  files: [],
  operation: 'idle',
  status: 'idle',
  progress: 0,
  options: {},
};

// ═══════════════════════════════════════════════════
// Zustand Store (with IDB Persist)
// ═══════════════════════════════════════════════════

export const usePdfStore = create<PdfStore>()(
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

      processPdf: async () => {
        const { task } = get();

        // Some operations use multiple files ('merger'), some use single file.
        if (!task.file && task.files.length === 0) return;

        set((state) => {
          state.task.status = 'processing';
          state.task.progress = 0;
          state.task.error = undefined;
          state.workerLogs = ['Initialization PDF Processing Routine...'];
        });

        try {
          const worker = new Worker(new URL('@/workers/pdf.worker.ts', import.meta.url));

          worker.onmessage = (e: MessageEvent) => {
            const { type, status, progress, message, resultUrls, error } = e.data;

            if (type === 'STATUS') {
              // Internal lifecycle hooks
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
            console.error('PDF Worker generic error:', err);
            set((state) => {
              state.task.status = 'error';
              state.task.error = 'Background PDF Worker Crash. Memory limit or isolation failure.';
            });
            worker.terminate();
          };

          // ⚡ Access Global Settings from the Settings Brain
          const settings = useSettingsStore.getState().settings || {};
          const workerPoolLimit = settings['jumlah-maksimal-web-worker-pool-auto-os-cores'] ?? 50;
          const hardwareAcceleration = settings['pilihan-hardware-acceleration-auto-webgpu-str'] ?? 'Auto';

          worker.postMessage({
            type: 'PROCESS_PDF',
            payload: {
              toolSlug: task.operation,
              file: task.file,
              files: task.files,
              options: {
                ...task.options,
                _omniEngineConfig: {
                  workerPoolLimit,
                  hardwareAcceleration,
                }
              },
            },
          });

        } catch (error) {
          console.error('PDF orchestrator error:', error);
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
      name: 'pdf-store',
      storage: createJSONStorage(() => idbStorage),
      // Crucial: File/Blob cannot be serialized synchronously by native JSON
      // therefore must be dropped prior to commit.
      partialize: (state) => ({ task: { ...state.task, file: null, files: [] } }),
    }
  )
);

// ═══════════════════════════════════════════════════
// BroadcastChannel: Cross-Tab Synchronization
// ═══════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  const channel = new BroadcastChannel('omni-pdf-store-sync');
  
  // Track to avoid infinite loops when reacting to other tabs
  let isApplyingRemoteState = false;

  usePdfStore.subscribe((state) => {
    if (!isApplyingRemoteState) {
      // Broadcast state with non-serializable properties nullified natively
      channel.postMessage({
        type: 'SYNC',
        payload: { task: { ...state.task, file: null, files: [] } },
      });
    }
  });

  channel.onmessage = (event) => {
    if (event.data?.type === 'SYNC') {
      isApplyingRemoteState = true;
      // Re-hydrate state from remote tab directly into the UI mapping
      usePdfStore.setState(event.data.payload, false);
      
      // Use microtask queue ensuring UI binds before we reopen channels
      queueMicrotask(() => {
        isApplyingRemoteState = false;
      });
    }
  };
}
