export type VideoOperation = 
  | "converter"
  | "compressor"
  | "cutter"
  | "merger"
  | "subtitle"
  | "remove-audio"
  | "extract-audio"
  | "watermark"
  | "speed"
  | "reverse"
  | "rotate"
  | "crop"
  | "resize"
  | "frame-extractor"
  | "gif-generator"
  | "thumbnail"
  | "live-stream"
  | "screen-recorder"
  | "webcam-recorder"
  | "filters"
  | "upscaling"
  | "noise-reduction"
  | "stabilization"
  | "auto-subtitle"
  | "scene-detection"
  | "metadata"
  | "encryption"
  | "downloader"
  | "hls-generator"
  | "batch"
  | "idle";

export interface VideoTask {
  id: string;
  file: File | null;
  operation: VideoOperation;
  status: "idle" | "processing" | "success" | "error";
  progress: number;
  resultUrl?: string;
  error?: string;
  options?: any;
}
