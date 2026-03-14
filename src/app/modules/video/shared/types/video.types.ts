export interface VideoMeta {
  duration: number;
  width: number;
  height: number;
  codec: string;
  fps?: number;
  bitrate?: number;
  size: number;
}

export type VideoErrorCode = 
  | 'FILE_NOT_FOUND'
  | 'FFMPEG_LOAD_FAILED'
  | 'FFMPEG_COMMAND_FAILED'
  | 'INVALID_META'
  | 'USER_ABORTED'
  | 'UNKNOWN_ERROR';
