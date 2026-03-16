export interface PdfMeta {
  filename: string;
  fileSizeMB: number;
  pageCount: number;
  pdfVersion: string;
  title: string | null;
  author: string | null;
  subject: string | null;
  creator: string | null;
  producer: string | null;
  creationDate: Date | null;
  modificationDate: Date | null;
  isEncrypted: boolean;
  isLinearized: boolean;
  hasAcroForm: boolean;
  hasFlattenedAnnotations: boolean;
  dimensions: { width: number; height: number }[];
}

export type PdfErrorCode =
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'FILE_CORRUPTED'
  | 'PASSWORD_REQUIRED'
  | 'INCORRECT_PASSPHRASE'
  | 'PERMISSION_DENIED'
  | 'PAGE_OUT_OF_RANGE'
  | 'MERGE_FAILED'
  | 'SPLIT_FAILED'
  | 'COMPRESS_FAILED'
  | 'OCR_FAILED'
  | 'OCR_MODEL_MISSING'
  | 'GHOSTSCRIPT_LOAD_FAILED'
  | 'GHOSTSCRIPT_TIMEOUT'
  | 'PDFLIB_ERROR'
  | 'RENDER_FAILED'
  | 'FORM_FIELD_NOT_FOUND'
  | 'SIGNATURE_FAILED'
  | 'WORKER_CRASHED'
  | 'WORKER_TIMEOUT'
  | 'UNKNOWN_ERROR';

export type ProcessingStatus = 'idle' | 'loading' | 'validating' | 'processing' | 'rendering' | 'done' | 'error';

export interface WorkerMessage<T = unknown> {
  type: 'progress' | 'complete' | 'error' | 'log' | 'preview';
  value?: number;
  data?: T;
  message?: string;
  errorCode?: PdfErrorCode;
}

export interface PageRange {
  from: number;
  to: number;
}

export interface PdfPermissions {
  printing: boolean;
  copying: boolean;
  editing: boolean;
  annotating: boolean;
  fillingForms: boolean;
}
