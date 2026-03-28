import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '@/lib/idb-storage';
import { ConverterOperation, ConverterTask } from '../types';

interface ConverterState {
  tasks: ConverterTask[];
  currentTask: ConverterTask | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  progress: number;
  error: string | null;
  operation: ConverterOperation;

  setOperation: (op: ConverterOperation) => void;
  setFile: (file: File | null) => void;
  addFiles: (files: File[]) => void;
  setOptions: (options: Record<string, unknown>) => void;
  
  processConversion: (payload: { toolSlug: ConverterOperation, file: File | null, options?: Record<string, unknown> }) => Promise<void>;
  reset: () => void;
}

const bc = typeof window !== 'undefined' ? new BroadcastChannel('omni-converter-sync') : null;

export const useConverterStore = create<ConverterState>()(
  persist(
    immer((set, get) => {
      if (bc) {
        bc.onmessage = (event) => {
          if (event.data.type === 'SYNC_STATE') {
            const { currentTask, status, progress, operation } = event.data.payload;
            set((state) => {
              // Ignore syncing heavy File objects over broadcast to prevent DOM crashes
              if (currentTask && state.currentTask) state.currentTask.id = currentTask.id;
              state.status = status;
              state.progress = progress;
              state.operation = operation;
            });
          }
        };
      }

      return {
        tasks: [],
        currentTask: {
          id: typeof crypto !== "undefined" ? crypto.randomUUID() : "",
          file: null,
          files: [],
          operation: "idle",
          options: {},
          status: "idle",
          progress: 0,
          resultUrls: [],
          error: ""
        },
        status: 'idle',
        progress: 0,
        error: null,
        operation: 'idle',

        setOperation: (op) => set((state) => { state.operation = op; }),
        setFile: (file) => set((state) => { if (state.currentTask) state.currentTask.file = file; }),
        addFiles: (files) => set((state) => { if (state.currentTask) state.currentTask.files = [...state.currentTask.files, ...files]; }),
        setOptions: (options) => set((state) => { if (state.currentTask) state.currentTask.options = { ...state.currentTask.options, ...options }; }),

        processConversion: async ({ toolSlug, file, options = {} }) => {
          set((state) => {
            state.status = 'loading';
            state.progress = 0;
            state.error = null;
          });

          if (bc) bc.postMessage({ type: 'SYNC_STATE', payload: get() });

          try {
            // Spin up the native web worker strictly dedicated to Converter bounds
            const worker = new Worker(new URL('@/workers/converter.worker.ts', import.meta.url));
            
            worker.postMessage({
              type: 'PROCESS_CONVERSION',
              payload: { toolSlug, file, options }
            });

            worker.onmessage = (e) => {
              if (e.data.type === 'PROGRESS') {
                set((state) => { state.progress = e.data.progress; });
                if (bc) bc.postMessage({ type: 'SYNC_STATE', payload: get() });
              }
              if (e.data.type === 'SUCCESS') {
                set((state) => {
                  state.status = 'success';
                  state.progress = 100;
                  if (state.currentTask) {
                    state.currentTask.status = 'success';
                    state.currentTask.resultUrls = e.data.resultUrls;
                    state.currentTask.metadata = e.data.metadata;
                  }
                });
                if (bc) bc.postMessage({ type: 'SYNC_STATE', payload: get() });
                worker.postMessage({ type: 'TERMINATE' });
              }
              if (e.data.type === 'ERROR') {
                throw new Error(e.data.error);
              }
            };
          } catch (err: any) {
            set((state) => {
              state.status = 'error';
              state.error = err.message || "Unknown JS Worker Parse Failure";
              if (state.currentTask) state.currentTask.status = 'error';
            });
            if (bc) bc.postMessage({ type: 'SYNC_STATE', payload: get() });
          }
        },

        reset: () => set((state) => {
          state.status = 'idle';
          state.progress = 0;
          state.error = null;
          state.currentTask = {
            id: typeof crypto !== "undefined" ? crypto.randomUUID() : "",
            file: null,
            files: [],
            operation: state.operation,
            options: {},
            status: "idle",
            progress: 0,
            resultUrls: [],
            error: ""
          };
          if (bc) bc.postMessage({ type: 'SYNC_STATE', payload: get() });
        }),
      };
    }),
    {
      name: 'converter-store-v1',
      storage: createJSONStorage(() => idbStorage as any),
      partialize: (state) => ({
        operation: state.operation,
      }) as any, // Strict stripping of Files and Blobs preventing IDB serialization crash
    }
  )
);
