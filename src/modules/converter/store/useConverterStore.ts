import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ConverterTask } from '../types';
import * as engines from '../engines';
import { useSettingsStore } from '@/store/useSettingsStore';

// ═══════════════════════════════════════════════════
// Worker Routing Map — matches spec Layer 3
// ═══════════════════════════════════════════════════
const DATA_OPS = new Set([
  'json-yaml', 'csv-json', 'xml-json', 'markdown-html',
  'subtitle-converter', 'spreadsheet-converter', 'magic-byte-detector',
]);
const FILE_OPS = new Set([
  'image-converter', 'video-converter', 'audio-converter',
  'document-converter', 'heic-converter', 'font-converter',
  'ebook-converter', 'raw-converter', 'vector-converter', 'cad-converter',
]);
const ARCHIVE_OPS = new Set(['archive-extractor', 'archive-creator']);
// Everything else goes to hash.worker

function getWorkerForOperation(op: string): Worker | null {
  if (typeof Worker === 'undefined') return null; // SSR safety

  try {
    if (DATA_OPS.has(op)) {
      return new Worker(new URL('../workers/data-converter.worker.ts', import.meta.url));
    }
    if (FILE_OPS.has(op)) {
      return new Worker(new URL('../workers/file-converter.worker.ts', import.meta.url));
    }
    if (ARCHIVE_OPS.has(op)) {
      return new Worker(new URL('../workers/archive.worker.ts', import.meta.url));
    }
    // Default: hash/encoding/generator worker
    return new Worker(new URL('../workers/hash.worker.ts', import.meta.url));
  } catch {
    // Worker creation failed (e.g., bundler issue) — fallback to main thread
    return null;
  }
}

// ═══════════════════════════════════════════════════
// Reconstruct result from worker message
// ═══════════════════════════════════════════════════
function reconstructWorkerResult(data: any): string[] {
  if (data.resultType === 'blob') {
    const blob = new Blob([data.result], { type: data.mimeType || 'application/octet-stream' });
    return [URL.createObjectURL(blob)];
  }
  if (data.resultType === 'blobArray') {
    return data.result.map((item: any) => {
      if (item.buffer) {
        const blob = new Blob([item.buffer], { type: item.type || 'application/octet-stream' });
        return URL.createObjectURL(blob);
      }
      return item.value || '';
    });
  }
  if (data.resultType === 'string') {
    return [data.result];
  }
  if (data.resultType === 'array') {
    return data.result.map(String);
  }
  return [String(data.result)];
}

// ═══════════════════════════════════════════════════
// Main-thread fallback (original logic)
// ═══════════════════════════════════════════════════
async function processOnMainThread(
  task: ConverterTask,
  onProgress: (p: number) => void
): Promise<string[]> {
  const funcName = `process${task.operation.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}`;
  const engineFunc = (engines as any)[funcName];
  if (!engineFunc) {
    throw new Error(`Engine logic missing for converter operation [${funcName}]`);
  }

  const result = await engineFunc(task, onProgress);

  if (Array.isArray(result)) {
    return result.map((b: any) => b instanceof Blob ? URL.createObjectURL(b) : String(b));
  } else if (result instanceof Blob) {
    return [URL.createObjectURL(result)];
  }
  return [String(result)];
}

// ═══════════════════════════════════════════════════
// Store
// ═══════════════════════════════════════════════════
interface ConverterState {
  task: ConverterTask;
  setFiles: (files: File[]) => void;
  setOptions: (options: Record<string, unknown>) => void;
  setOperation: (operation: string) => void;
  processConversion: () => Promise<void>;
  reset: () => void;
}

const initialState: ConverterTask = {
  id: '',
  files: [],
  operation: 'idle',
  options: {},
  outputFormat: '',
  status: 'idle',
  progress: 0,
  outputUrls: [],
  createdAt: new Date(),
};

export const useConverterStore = create<ConverterState>()(
  persist(
    immer((set, get) => ({
      task: initialState,

      setFiles: (files) =>
        set((state) => {
          state.task.files = files;
          state.task.id = crypto.randomUUID();
          state.task.status = 'idle';
          state.task.error = undefined;
          state.task.outputUrls = [];
          state.task.progress = 0;
        }),

      setOptions: (opts) =>
        set((state) => {
          state.task.options = { ...state.task.options, ...opts };
        }),

      setOperation: (op) =>
        set((state) => {
          state.task.operation = op;
        }),

      processConversion: async () => {
        const { task } = get();
        if (task.files.length === 0 && !task.options.directInput) return;

        set((state) => {
          state.task.status = 'processing';
          state.task.progress = 0;
          state.task.error = undefined;
        });

        try {
          // ⚡ Access Global Settings from the Settings Brain
          const settings = useSettingsStore.getState().settings || {};
          const workerPoolLimit = settings['jumlah-maksimal-web-worker-pool-auto-os-cores'] ?? 50;
          const hardwareAcceleration = settings['pilihan-hardware-acceleration-auto-webgpu-str'] ?? 'Auto';
          const enrichedTask = {
            ...task,
            options: {
              ...task.options,
              _omniEngineConfig: {
                workerPoolLimit,
                hardwareAcceleration,
              }
            }
          };

          const worker = getWorkerForOperation(task.operation);

          if (worker) {
            // ── Worker Path (offloaded from main thread) ──
            const outputs = await new Promise<string[]>((resolve, reject) => {
              worker.onmessage = (e) => {
                const { type: msgType } = e.data;

                if (msgType === 'PROGRESS') {
                  set((state) => {
                    state.task.progress = Math.min(Math.round(e.data.progress), 99);
                  });
                } else if (msgType === 'DONE') {
                  worker.terminate();
                  resolve(reconstructWorkerResult(e.data));
                } else if (msgType === 'ERROR') {
                  worker.terminate();
                  reject(new Error(e.data.error));
                }
              };

              worker.onerror = (err) => {
                worker.terminate();
                reject(new Error(err.message || 'Worker crashed'));
              };

              // Serialize task for transfer (Files are Transferable via structured clone)
              worker.postMessage({
                type: 'PROCESS',
                payload: { operation: task.operation, task: enrichedTask },
              });
            });

            set((state) => {
              state.task.status = 'success';
              state.task.progress = 100;
              state.task.outputUrls = outputs;
            });
          } else {
            // ── Main-thread fallback (SSR or Worker unsupported) ──
            const onProgress = (p: number) => {
              set((state) => {
                state.task.progress = Math.min(Math.round(p), 99);
              });
            };

            const outputs = await processOnMainThread(enrichedTask, onProgress);

            set((state) => {
              state.task.status = 'success';
              state.task.progress = 100;
              state.task.outputUrls = outputs;
            });
          }
        } catch (error: any) {
          console.error(`Converter Processing Error (${task.operation}):`, error);
          set((state) => {
            state.task.status = 'error';
            state.task.error = error.message || 'Engine failed to process conversion.';
          });
        }
      },

      reset: () =>
        set((state) => {
          state.task.outputUrls.forEach(url => {
            if (url.startsWith('blob:')) URL.revokeObjectURL(url);
          });
          state.task = { ...initialState };
        }),
    })),
    {
      name: 'converter-store',
      partialize: (state) => ({}), // Don't persist temporary blobs
    }
  )
);
