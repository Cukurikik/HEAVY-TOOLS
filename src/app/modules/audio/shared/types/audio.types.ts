export type ProcessingStatus = 'idle' | 'loading' | 'processing' | 'rendering' | 'done' | 'error';

export type AudioErrorCode =
  | 'FILE_TOO_LARGE' | 'INVALID_FILE_TYPE' | 'FILE_CORRUPTED' | 'AUDIO_CONTEXT_FAILED'
  | 'DECODE_FAILED' | 'ENCODE_FAILED' | 'FFMPEG_LOAD_FAILED' | 'FFMPEG_TIMEOUT'
  | 'WORKER_CRASHED' | 'ONNX_LOAD_FAILED' | 'MODEL_DOWNLOAD_FAILED' | 'INSUFFICIENT_MEMORY'
  | 'MIC_PERMISSION_DENIED' | 'NO_AUDIO_STREAM' | 'INVALID_PARAMS' | 'UNKNOWN_ERROR';

export interface AudioMeta {
  filename: string; fileSizeMB: number; duration: number;
  sampleRate: number; channels: number; bitDepth: number;
  bitrate: number; codec: string; hasVideo: boolean;
}

export interface WaveformData {
  peaks: Float32Array; duration: number; sampleRate: number;
}

export interface WorkerMessage<T = unknown> {
  type: 'progress' | 'complete' | 'error' | 'log';
  value?: number; data?: T; message?: string; errorCode?: AudioErrorCode;
}

export type ExportFormat = 'wav' | 'mp3' | 'aac' | 'ogg' | 'flac' | 'opus' | 'm4a';

export interface AudioChunk {
  startTime: number; endTime: number;
}

export interface BaseAudioState {
  status: ProcessingStatus; progress: number; outputBlob: Blob | null;
  outputSizeMB: number | null; errorCode: AudioErrorCode | null;
  errorMessage: string | null; retryable: boolean;
}
