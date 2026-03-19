export type PdfOperation =
  | 'merge' | 'split' | 'compress' | 'convert'
  | 'ocr' | 'edit' | 'annotate' | 'watermark'
  | 'digital-signature' | 'encrypt' | 'decrypt'
  | 'rotate-pages' | 'crop-pages' | 'extract-pages' | 'reorder-pages'
  | 'redact' | 'form-fill'
  | 'to-word' | 'to-excel' | 'to-powerpoint' | 'to-image'
  | 'from-image' | 'from-html'
  | 'metadata-edit' | 'table-extract'
  | 'repair' | 'compare' | 'batch-process'
  | 'bookmarks-edit' | 'xref-analyze';

export type PdfExecution = 'client' | 'server' | 'hybrid';

export type PdfEngine =
  | 'pdf-lib' | 'pdfjs' | 'web-crypto' | 'tesseract'
  | 'libreoffice' | 'puppeteer' | 'sharp' | 'pdf2json'
  | 'pdf-parse' | 'mammoth' | 'diff-match-patch'
  | 'konva' | 'dnd-kit' | 'heic2any';

export interface PdfPage {
  index: number;
  width: number;
  height: number;
  rotation: number;
  thumbnailUrl?: string;
}

export interface PdfAnnotation {
  id: string;
  pageIndex: number;
  type: 'highlight' | 'underline' | 'strikethrough' | 'freehand' | 'text' | 'rectangle' | 'redaction';
  color: string;
  position: { x: number; y: number; width: number; height: number };
  content?: string;
}

export interface PdfTask {
  id: string;
  files: File[];
  operation: PdfOperation;
  status: 'idle' | 'processing' | 'success' | 'error';
  progress: number;
  pages: PdfPage[];
  selectedPages: number[];
  annotations: PdfAnnotation[];
  options: Record<string, unknown>;
  resultUrl?: string;
  resultBlob?: Blob;
  error?: string;
  createdAt: Date;
}
