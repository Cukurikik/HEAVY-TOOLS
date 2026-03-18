export type VideoOperation =
  | "trimmer"
  | "merger"
  | "converter"
  | "compressor"
  | "flipper"
  | "rotator"
  | "stabilizer"
  | "reverse"
  | "speed-control"
  | "loop-engine"
  | "pro-editor"
  | "thumbnail-extractor"
  | "subtitle-burner"
  | "watermark"
  | "noise-reducer"
  | "color-grader"
  | "resolution-upscaler"
  | "frame-interpolator"
  | "gif-converter"
  | "hdr-tonemapper"
  | "black-white"
  | "slow-motion"
  | "timelapse"
  | "screen-recorder"
  | "metadata-editor"
  | "batch-processor"
  | "chapter-marker"
  | "audio-extractor"
  | "video-splitter"
  | "aspect-ratio"
  | "idle";

export interface VideoTask {
  id: string;
  file: File | null;
  files: File[];
  operation: VideoOperation;
  status: "idle" | "processing" | "success" | "error";
  progress: number;
  resultUrl?: string;
  error?: string;
  options: Record<string, unknown>;
}
