import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ConverterTask } from '../types';
import * as engines from '../engines';

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
        if (task.files.length === 0 && !task.options.directInput) return; // Some inputs omit files for direct text (e.g. hash)

        set((state) => {
          state.task.status = 'processing';
          state.task.progress = 0;
          state.task.error = undefined;
        });

        try {
          // Dynamic engine dispatcher lookup based on snake or dash case -> camelCase
          const funcName = `process${task.operation.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}`;
          
          const engineFunc = (engines as any)[funcName];
          if (!engineFunc) {
            throw new Error(`Engine logic missing for converter operation [${funcName}]`);
          }

          const onProgress = (p: number) => {
            set((state) => {
              state.task.progress = Math.min(Math.round(p), 99);
            });
          };

          const result = await engineFunc(task, onProgress);
          
          let outputs: string[] = [];
          
          // Result can be a Blob or Array of Blobs or primitive strings (for hashes/colors)
          if (Array.isArray(result)) {
            outputs = result.map(b => b instanceof Blob ? URL.createObjectURL(b) : String(b));
          } else if (result instanceof Blob) {
            outputs = [URL.createObjectURL(result)];
          } else {
            outputs = [String(result)];
          }

          set((state) => {
            state.task.status = 'success';
            state.task.progress = 100;
            state.task.outputUrls = outputs;
          });
          
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
