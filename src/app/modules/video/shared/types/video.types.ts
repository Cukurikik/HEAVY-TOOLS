// ============================================================
// VIDEO TYPES — Central TypeScript Interfaces
// Used by ALL 30 video tools
// File: src/app/modules/video/shared/types/video.types.ts
// ============================================================

export type ProcessingStatus = 'idle' | 'loading' | 'processing' | 'done' | 'error';

export type TaskStatus = 'queued' | 'processing' | 'done' | 'error' | 'cancelled';

export type VideoOperation =
  | 'trim' | 'merge' | 'convert' | 'compress'
  | 'stabilize' | 'reverse' | 'speed' | 'loop'
  | 'flip' | 'crop' | 'colorGrade' | 'subtitle'
  | 'thumbnail' | 'watermark' | 'extractAudio'
  | 'replaceAudio' | 'denoise' | 'interpolate'
  | 'metadata' | 'split' | 'record' | 'toGif'
  | 'pip' | 'blur' | 'transition' | 'compare'
  | 'slideshow' | 'batch' | 'analyse' | 'upscale';

/** All supported video error codes */
export type VideoErrorCode =
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'FILE_CORRUPTED'
  | 'FILE_READ_ERROR'
  | 'FFMPEG_LOAD_FAILED'
  | 'FFMPEG_TIMEOUT'
  | 'FFMPEG_COMMAND_FAILED'
  | 'FFMPEG_OOM'
  | 'FFMPEG_NO_STREAMS'
  | 'WORKER_INIT_FAILED'
  | 'WORKER_CRASHED'
  | 'WORKER_TRANSFER_FAILED'
  | 'INVALID_TIME_RANGE'
  | 'INVALID_DIMENSIONS'
  | 'INVALID_SPEED'
  | 'INVALID_CRF'
  | 'NO_AUDIO_STREAM'
  | 'SAB_NOT_SUPPORTED'
  | 'WEBGPU_NOT_AVAILABLE'
  | 'OPFS_NOT_AVAILABLE'
  | 'MEDIA_RECORDER_FAILED'
  | 'UNKNOWN_ERROR';

/** Video file metadata */
export interface VideoMeta {
  filename: string;
  fileSizeMB: number;
  duration: number;        // total seconds
  width: number;
  height: number;
  fps: number;
  codec: string;
  audioCodec: string | null;
  audioBitrate: number;    // kbps
  videoBitrate: number;    // kbps
  hasAudio: boolean;
  aspectRatio: string;     // e.g. '16:9'
}

/** Single video track info */
export interface VideoStream {
  index: number;
  codec: string;
  width: number;
  height: number;
  fps: number;
  bitrate: number;
  pixelFormat: string;
  colorSpace: string | null;
  profile: string | null;
  level: string | null;
}

/** Single audio track info */
export interface AudioStream {
  index: number;
  codec: string;
  sampleRate: number;
  channels: number;
  bitrate: number;
  language: string | null;
}

/** Subtitle track info */
export interface SubtitleStream {
  index: number;
  codec: string;
  language: string | null;
  title: string | null;
  isDefault: boolean;
  isForced: boolean;
}

/** Video chapter marker */
export interface Chapter {
  id: number;
  title: string;
  startTime: number;
  endTime: number;
}

/** Processing task (Batch Processor & AppState) */
export interface VideoTask {
  id: string;
  filename: string;
  operation: VideoOperation;
  status: TaskStatus;
  progress: number;
  startedAt: Date | null;
  completedAt: Date | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
}

/** Sidebar navigation item */
export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge: string | null;
  category: 'video' | 'audio' | 'image' | 'tools' | 'system';
}

/** Typed postMessage payload from/to Web Workers */
export interface WorkerMessage<T = unknown> {
  type: 'progress' | 'complete' | 'error' | 'log';
  value?: number;
  data?: T;
  message?: string;
  errorCode?: VideoErrorCode;
}

/** Export panel configuration */
export interface ExportConfig {
  format: 'mp4' | 'webm' | 'mov' | 'avi' | 'mkv' | 'gif' | 'wav' | 'mp3';
  codec: string;
  quality: 'fast' | 'balanced' | 'best';
  filename: string;
}

/** Base state shared by ALL 30 feature stores */
export interface BaseVideoState {
  status: ProcessingStatus;
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
