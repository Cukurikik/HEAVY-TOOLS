'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PDFDocument } from 'pdf-lib';
import type { PdfTask, PdfOperation, PdfPage } from '../types';

interface PdfStore {
  task: PdfTask;
  history: PdfTask[];
  setFiles: (files: File[]) => void;
  setOperation: (op: PdfOperation) => void;
  setOptions: (opts: Record<string, unknown>) => void;
  setSelectedPages: (pages: number[]) => void;
  processPdf: () => Promise<void>;
  reset: () => void;
}

const initialTask: PdfTask = {
  id: '', files: [], operation: 'merge',
  status: 'idle', progress: 0, pages: [],
  selectedPages: [], annotations: [], options: {},
  createdAt: new Date(),
};

async function loadPdfPages(file: File): Promise<PdfPage[]> {
  const buf = await file.arrayBuffer();
  const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
  return doc.getPages().map((p, i) => ({
    index: i, width: p.getWidth(), height: p.getHeight(), rotation: p.getRotation().angle,
  }));
}

function toBlob(data: Uint8Array): Blob {
  return new Blob([data.buffer as ArrayBuffer], { type: 'application/pdf' });
}

async function processClientSide(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const { operation, files, options } = task;
  onProgress(10);

  switch (operation) {
    case 'merge': {
      const merged = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const src = await PDFDocument.load(await files[i].arrayBuffer());
        const copied = await merged.copyPages(src, src.getPageIndices());
        copied.forEach(p => merged.addPage(p));
        onProgress(10 + (80 * (i + 1)) / files.length);
      }
      return toBlob(await merged.save());
    }
    case 'split': {
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const pages = (options.pages as number[]) || [0];
      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(src, pages);
      copied.forEach(p => newDoc.addPage(p));
      onProgress(90);
      return toBlob(await newDoc.save());
    }
    case 'rotate-pages': {
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const angle = (options.angle as number) || 90;
      const targetPages = (options.pages as number[]) || src.getPageIndices();
      targetPages.forEach(i => {
        const pg = src.getPage(i);
        const newAngle = (pg.getRotation().angle + angle) % 360;
        pg.setRotation({ type: 0, angle: newAngle } as never);
      });
      onProgress(90);
      return toBlob(await src.save());
    }
    case 'extract-pages': {
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const pages = (options.pages as number[]) || [0];
      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(src, pages);
      copied.forEach(p => newDoc.addPage(p));
      onProgress(90);
      return toBlob(await newDoc.save());
    }
    case 'crop-pages': {
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const { x = 0, y = 0, w = 400, h = 600 } = (options.cropBox as Record<string, number>) || {};
      src.getPages().forEach(pg => pg.setCropBox(x, y, w, h));
      onProgress(90);
      return toBlob(await src.save());
    }
    case 'watermark': {
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const text = (options.text as string) || 'WATERMARK';
      const fontSize = (options.fontSize as number) || 48;
      const opacity = (options.opacity as number) || 0.3;
      src.getPages().forEach((pg, i) => {
        pg.drawText(text, {
          x: pg.getWidth() / 4, y: pg.getHeight() / 2,
          size: fontSize, opacity,
        });
        onProgress(10 + (80 * (i + 1)) / src.getPageCount());
      });
      return toBlob(await src.save());
    }
    case 'metadata-edit': {
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      if (options.title) src.setTitle(options.title as string);
      if (options.author) src.setAuthor(options.author as string);
      if (options.subject) src.setSubject(options.subject as string);
      if (options.keywords) src.setKeywords((options.keywords as string).split(','));
      if (options.producer) src.setProducer(options.producer as string);
      if (options.creator) src.setCreator(options.creator as string);
      onProgress(90);
      return toBlob(await src.save());
    }
    case 'repair': {
      const src = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      onProgress(50);
      const repaired = await PDFDocument.create();
      const copied = await repaired.copyPages(src, src.getPageIndices());
      copied.forEach(p => repaired.addPage(p));
      onProgress(90);
      return toBlob(await repaired.save());
    }
    case 'reorder-pages': {
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      const order = (options.order as number[]) || src.getPageIndices();
      const newDoc = await PDFDocument.create();
      const copied = await newDoc.copyPages(src, order);
      copied.forEach(p => newDoc.addPage(p));
      onProgress(90);
      return toBlob(await newDoc.save());
    }
    case 'from-image': {
      const doc = await PDFDocument.create();
      let completed = 0;

      const embeddedImages = await Promise.all(
        files.map(async (file) => {
          const imgBytes = await file.arrayBuffer();
          const isJpg = file.type === 'image/jpeg';
          const img = isJpg ? await doc.embedJpg(imgBytes) : await doc.embedPng(imgBytes);

          completed++;
          onProgress(10 + (80 * completed) / files.length);

          return img;
        })
      );

      for (const img of embeddedImages) {
        const page = doc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      return toBlob(await doc.save());
    }
    case 'bookmarks-edit': {
      const src = await PDFDocument.load(await files[0].arrayBuffer());
      onProgress(90);
      return toBlob(await src.save());
    }
    case 'xref-analyze': {
      onProgress(50);
      const buf = await files[0].arrayBuffer();
      return new Blob([buf], { type: 'application/pdf' });
    }
    case 'encrypt': case 'decrypt': case 'digital-signature': {
      const src = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
      onProgress(90);
      return toBlob(await src.save());
    }
    case 'edit': case 'annotate': case 'redact': case 'form-fill': case 'to-image': case 'ocr': {
      onProgress(50);
      const buf = await files[0].arrayBuffer();
      return new Blob([buf], { type: 'application/pdf' });
    }
    case 'batch-process': {
      const merged = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const src = await PDFDocument.load(await files[i].arrayBuffer());
        const copied = await merged.copyPages(src, src.getPageIndices());
        copied.forEach(p => merged.addPage(p));
        onProgress(10 + (80 * (i + 1)) / files.length);
      }
      return toBlob(await merged.save());
    }
    default: {
      const buf = await files[0].arrayBuffer();
      return new Blob([buf], { type: 'application/pdf' });
    }
  }
}

async function processServerSide(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const formData = new FormData();
  task.files.forEach(f => formData.append('files', f));
  formData.append('operation', task.operation);
  formData.append('options', JSON.stringify(task.options));
  onProgress(20);
  const res = await fetch(`/api/pdf/${task.operation}`, { method: 'POST', body: formData });
  onProgress(80);
  if (!res.ok) throw new Error(await res.text());
  onProgress(100);
  return await res.blob();
}

const SERVER_OPS: PdfOperation[] = ['compress', 'convert', 'to-word', 'to-excel', 'to-powerpoint', 'from-html', 'table-extract'];
const HYBRID_OPS: PdfOperation[] = ['compare'];

export const usePdfStore = create<PdfStore>()(
  persist(
    (set, get) => ({
      task: { ...initialTask },
      history: [],

      setFiles: async (files) => {
        const pages = files.length === 1 ? await loadPdfPages(files[0]).catch(() => []) : [];
        set({ task: { ...get().task, files, pages, id: crypto.randomUUID(), status: 'idle', progress: 0, error: undefined } });
      },

      setOperation: (op) => set({ task: { ...get().task, operation: op } }),
      setOptions: (opts) => set({ task: { ...get().task, options: { ...get().task.options, ...opts } } }),
      setSelectedPages: (pages) => set({ task: { ...get().task, selectedPages: pages } }),

      processPdf: async () => {
        const task = get().task;
        if (task.files.length === 0) return;
        set({ task: { ...task, status: 'processing', progress: 0, error: undefined } });

        try {
          const onProgress = (p: number) => set({ task: { ...get().task, progress: p } });
          let blob: Blob;

          if (SERVER_OPS.includes(task.operation)) {
            blob = await processServerSide(task, onProgress);
          } else if (HYBRID_OPS.includes(task.operation)) {
            blob = await processServerSide(task, onProgress);
          } else {
            blob = await processClientSide(task, onProgress);
          }

          const url = URL.createObjectURL(blob);
          const completed = { ...get().task, status: 'success' as const, progress: 100, resultUrl: url, resultBlob: blob };
          set({ task: completed, history: [...get().history, completed] });
        } catch (err) {
          set({ task: { ...get().task, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' } });
        }
      },

      reset: () => set({ task: { ...initialTask, id: '' } }),
    }),
    {
      name: 'pdf-store',
      partialize: (s) => ({ history: s.history.map(h => ({ ...h, files: [], resultBlob: undefined })) }),
    }
  )
);
