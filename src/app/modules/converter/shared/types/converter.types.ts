// ============================================================
// CONVERTER SHARED TYPES
// File: src/app/modules/converter/shared/types/converter.types.ts
// ============================================================

/** All possible error codes across converter features */
export type ConverterErrorCode =
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'UNSUPPORTED_FORMAT'
  | 'CONVERSION_FAILED'
  | 'FFMPEG_LOAD_FAILED'
  | 'FFMPEG_TIMEOUT'
  | 'WORKER_CRASHED'
  | 'WORKER_TIMEOUT'
  | 'WASM_NOT_AVAILABLE'
  | 'NETWORK_ERROR'
  | 'INVALID_PARAMS'
  | 'OUTPUT_TOO_LARGE'
  | 'COLOR_PARSE_ERROR'
  | 'ENCODING_ERROR'
  | 'UNKNOWN_ERROR';

/** Processing pipeline status */
export type ProcessingStatus =
  | 'idle'
  | 'loading'
  | 'processing'
  | 'done'
  | 'error';

/** Generic message from Web Worker to main thread */
export interface WorkerMessage<T = unknown> {
  type: 'progress' | 'complete' | 'error' | 'log';
  value?: number;
  data?: T;
  message?: string;
  errorCode?: ConverterErrorCode;
}

/** Standard conversion result */
export interface ConversionResult {
  blob: Blob;
  filename: string;
  sizeMB: number;
  format: string;
  duration?: number; // processing time in ms
}

/** Generic file metadata */
export interface FileMeta {
  filename: string;
  sizeMB: number;
  type: string;
  lastModified: number;
}

/** Image file metadata */
export interface ImageMeta extends FileMeta {
  width: number;
  height: number;
  format: string;
}

/** Video file metadata */
export interface VideoMeta extends FileMeta {
  duration: number;
  width: number;
  height: number;
  fps: number;
  codec: string;
  bitrate: number;
}

/** Audio file metadata */
export interface AudioMeta extends FileMeta {
  duration: number;
  sampleRate: number;
  channels: number;
  codec: string;
}

/** Batch file item */
export interface BatchFileItem {
  id: string;
  file: File;
  name: string;
  inputSizeMB: number;
  status: 'queued' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  error: string | null;
}
