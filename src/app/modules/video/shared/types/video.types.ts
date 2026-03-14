export type ProcessingStatus = 'idle' | 'loading' | 'processing' | 'done' | 'error';
export type TaskStatus = 'queued' | 'processing' | 'done' | 'error' | 'cancelled';
export type VideoOperation = 'trim' | 'merge' | 'convert' | 'compress' | 'stabilize' | 'reverse' | 'speed' | 'loop' | 'flip' | 'crop' | 'colorGrade' | 'subtitle' | 'thumbnail' | 'watermark' | 'extractAudio' | 'replaceAudio' | 'denoise' | 'interpolate' | 'metadata' | 'split' | 'record' | 'toGif' | 'pip' | 'blur' | 'transition' | 'compare' | 'slideshow' | 'batch' | 'analyse' | 'upscale';

export type VideoErrorCode =
  | 'FILE_TOO_LARGE' | 'INVALID_FILE_TYPE' | 'FILE_CORRUPTED' | 'FILE_READ_ERROR'
  | 'FFMPEG_LOAD_FAILED' | 'FFMPEG_TIMEOUT' | 'FFMPEG_COMMAND_FAILED' | 'FFMPEG_OOM' | 'FFMPEG_NO_STREAMS'
  | 'WORKER_INIT_FAILED' | 'WORKER_CRASHED' | 'WORKER_TRANSFER_FAILED'
  | 'INVALID_TIME_RANGE' | 'INVALID_DIMENSIONS' | 'INVALID_SPEED' | 'INVALID_CRF'
  | 'NO_AUDIO_STREAM' | 'SAB_NOT_SUPPORTED' | 'WEBGPU_NOT_AVAILABLE' | 'OPFS_NOT_AVAILABLE'
  | 'MEDIA_RECORDER_FAILED' | 'PERMISSION_DENIED' | 'UNKNOWN_ERROR';

export interface VideoMeta {
  filename: string; fileSizeMB: number; duration: number;
  width: number; height: number; fps: number;
  codec: string; audioCodec: string | null;
  audioBitrate: number; videoBitrate: number;
  bitrate: number; sampleRate: number | null;
  hasAudio: boolean; aspectRatio: string;
}

export interface BaseVideoState {
  status: ProcessingStatus; progress: number; outputBlob: Blob | null;
  outputSizeMB: number | null; errorCode: VideoErrorCode | null;
  errorMessage: string | null; retryable: boolean;
}

export interface WorkerMessage<T = unknown> {
  type: 'progress' | 'complete' | 'error' | 'log';
  value?: number; data?: T; message?: string; errorCode?: VideoErrorCode;
}

export interface ExportConfig {
  format: 'mp4' | 'webm' | 'mov' | 'avi' | 'mkv' | 'gif' | 'wav' | 'mp3';
  codec: string; quality: 'fast' | 'balanced' | 'best'; filename: string;
}
