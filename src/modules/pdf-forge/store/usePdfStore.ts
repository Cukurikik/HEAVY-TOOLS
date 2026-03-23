'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { PDFDocument } from 'pdf-lib';
import type { PdfTask, PdfOperation, PdfPage } from '../types';

// Import all engine runners
import * as engines from '../engines';

interface PdfState {
  task: PdfTask;
  history: PdfTask[];
  isMounted: boolean;
  setFiles: (files: File[]) => void;
  setOperation: (op: PdfOperation) => void;
  setOptions: (opts: Record<string, unknown>) => void;
  setSelectedPages: (pages: number[]) => void;
  processPdf: () => Promise<void>;
  reset: () => void;
  setMounted: (mounted: boolean) => void;
  updateProgress: (p: number) => void;
}

const initialTask: PdfTask = {
  id: '',
  files: [],
  operation: 'merge',
  status: 'idle',
  progress: 0,
  pages: [],
  selectedPages: [],
  annotations: [],
  options: {},
  createdAt: new Date(),
};

async function loadPdfPages(file: File): Promise<PdfPage[]> {
  const buf = await file.arrayBuffer();
  const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
  return doc.getPages().map((p, i) => ({
    index: i,
    width: p.getWidth(),
    height: p.getHeight(),
    rotation: p.getRotation().angle,
  }));
}

export const usePdfStore = create<PdfState>()(
  persist(
    immer((set, get) => ({
      task: { ...initialTask },
      history: [],
      isMounted: false,

      setMounted: (mounted: any) => set((state: any) => { state.isMounted = mounted; }),

      setFiles: async (files: any) => {
        let pages: PdfPage[] = [];
        if (files.length === 1 && files[0].type === 'application/pdf') {
          try {
            pages = await loadPdfPages(files[0]);
          } catch (e) {
            console.warn('Could not load PDF pages for preview', e);
          }
        }
        
        set((state: any) => {
          state.task.files = files;
          state.task.pages = pages;
          state.task.id = crypto.randomUUID();
          state.task.status = 'idle';
          state.task.progress = 0;
          state.task.error = undefined;
          state.task.resultUrl = undefined;
          state.task.resultBlob = undefined;
        });
      },

      setOperation: (op: any) => set((state: any) => { state.task.operation = op; }),
      
      setOptions: (opts: any) => set((state: any) => {
        state.task.options = { ...state.task.options, ...opts };
      }),
      
      setSelectedPages: (pages: any) => set((state: any) => { state.task.selectedPages = pages; }),
      
      updateProgress: (p: any) => set((state: any) => { state.task.progress = p; }),

      processPdf: async () => {
        const { task, updateProgress } = get();
        if (task.files.length === 0) return;

        set((state: any) => {
          state.task.status = 'processing';
          state.task.progress = 0;
          state.task.error = undefined;
        });

        try {
          // Dynamic Engine Dispatch
          // This maps the task.operation (e.g. 'merge') to the exported engine ('processMerge')
          const engineName = `process${
            task.operation.split('-').map((part: string) => part.charAt(0).toUpperCase() + part.slice(1)).join('')
          }` as keyof typeof engines;

          const engineRunner = engines[engineName] as any;

          if (!engineRunner || typeof engineRunner !== 'function') {
            throw new Error(`Engine for operation '${task.operation}' is not implemented yet.`);
          }

          // Execute the dynamic engine
          const resultBlob = await engineRunner(task, updateProgress);

          if (!resultBlob) {
             throw new Error("Engine returned nothing.");
          }

          const url = URL.createObjectURL(resultBlob);

          set((state: any) => {
            state.task.status = 'success';
            state.task.progress = 100;
            state.task.resultUrl = url;
            state.task.resultBlob = resultBlob;
            state.history.push({ ...state.task } as PdfTask);
          });
        } catch (err: any) {
          console.error("PDF Processing Error:", err);
          set((state: any) => {
            state.task.status = 'error';
            state.task.error = err instanceof Error ? err.message : String(err);
          });
        }
      },

      reset: () => set((state: any) => {
        state.task = { ...initialTask, id: crypto.randomUUID() };
      }),
    })),
    {
      name: 'pdf-store',
      partialize: (state) => ({
        history: state.history.map((h: any) => ({ ...h, files: [], resultBlob: undefined }))
      }),
    }
  )
);
