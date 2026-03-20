import { z } from 'zod';

export const VIDEO_OPERATIONS = [
  'trimmer', 'merger', 'converter', 'compressor', 'flipper', 'rotator',
  'stabilizer', 'reverse', 'speed-control', 'loop-engine', 'pro-editor',
  'thumbnail-extractor', 'subtitle-burner', 'watermark', 'noise-reducer',
  'color-grader', 'resolution-upscaler', 'frame-interpolator', 'gif-converter',
  'hdr-tonemapper', 'black-white', 'slow-motion', 'timelapse',
  'screen-recorder', 'metadata-editor', 'batch-processor', 'chapter-marker',
  'audio-extractor', 'video-splitter', 'aspect-ratio'
] as const;

export type VideoOperation = typeof VIDEO_OPERATIONS[number];

export const VideoTaskSchema = z.object({
  id: z.string().uuid().default(() => crypto.randomUUID()),
  inputFile: z.instanceof(File).optional(),
  operation: z.enum(VIDEO_OPERATIONS),
  options: z.record(z.string(), z.unknown()),
  outputFormat: z.enum(['mp4', 'webm', 'mov', 'avi', 'mkv', 'gif', 'png', 'mp3']).default('mp4'),
  status: z.enum(['idle', 'loading', 'processing', 'success', 'error']).default('idle'),
  progress: z.number().min(0).max(100).default(0),
  outputUrl: z.string().url().optional(),
  error: z.string().optional(),
  logs: z.array(z.string()).default([]),
  createdAt: z.date().default(() => new Date()),
});

export type VideoTask = z.infer<typeof VideoTaskSchema>;

export interface VideoToolDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  engine: 'FFmpeg WASM' | 'TensorFlow WebGPU' | 'Server child_process' | 'MediaRecorder API' | 'Canvas API';
  execution: 'Client' | 'Server';
}
