'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { PDFDocument } from 'pdf-lib';
import type { PdfTask, PdfOperation, PdfPage } from '../types';

// Removed engine imports in favor of Web Worker

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
        if (task.files.length === 0 && !task.files[0]) return;

        set((state: any) => {
          state.task.status = 'processing';
          state.task.progress = 0;
          state.task.error = undefined;
        });

        try {
          // Dynamic Engine Dispatch via Web Worker (Local First)
          const worker = new Worker(new URL('@/workers/pdf.worker.ts', import.meta.url));

          worker.onmessage = (e: MessageEvent) => {
            const { type, progress, message, resultUrls, error } = e.data;

            if (type === 'LOG') {
              console.log(message);
            } else if (type === 'PROGRESS') {
              updateProgress(progress);
            } else if (type === 'SUCCESS') {
              set((state: any) => {
                state.task.status = 'success';
                state.task.progress = 100;
                state.task.resultUrl = resultUrls[0];
                state.history.push({ ...state.task } as PdfTask);
              });
              worker.terminate();
            } else if (type === 'ERROR') {
              set((state: any) => {
                state.task.status = 'error';
                state.task.error = error || "PDF Processing failed.";
              });
              worker.terminate();
            }
          };

          worker.onerror = (err) => {
            console.error("PDF Worker generic error:", err);
            set((state: any) => {
              state.task.status = 'error';
              state.task.error = "Background Worker Crash. Memory limit or isolation failure.";
            });
            worker.terminate();
          };

          // Blast payload to the isolated worker thread
          worker.postMessage({
            type: 'PROCESS_PDF',
            payload: {
              toolSlug: task.operation,
              file: task.files[0],
              files: task.files,
              options: task.options
            }
          });

        } catch (err: any) {
          console.error("PDF Orchestrator Error:", err);
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
