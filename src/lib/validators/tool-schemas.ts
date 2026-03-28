/**
 * Omni-Tool Universal Zod Validation Schemas (Phase 20)
 * 
 * Strict typing for all payloads going into Web Workers or Cloud Engines.
 * Ensures that corrupt or malformed tasks are rejected before freezing the thread.
 */

import { z } from 'zod';

// ==========================================
// 1. VIDEO STRUCT
// ==========================================
export const VideoTaskSchema = z.object({
  id: z.string().uuid().default(() => crypto.randomUUID()),
  inputFile: z.instanceof(File).optional(), // Can be optional if loading from OPFS
  operation: z.enum([
    'trim', 'merge', 'convert', 'compress', 'flip', 'rotate',
    'stabilize', 'reverse', 'speed', 'loop', 'thumbnail', 'watermark',
    'noise-reducer', 'color-grader', 'resolution-upscaler', 'frame-interpolator',
    'gif-converter', 'hdr-tonemapper', 'black-white', 'slow-motion',
    'timelapse', 'screen-recorder', 'metadata-editor', 'batch-processor',
    'chapter-marker', 'audio-extractor', 'video-splitter', 'aspect-ratio'
  ] as [string, ...string[]]),
  options: z.record(z.string(), z.unknown()).default({}),
  outputFormat: z.enum(['mp4', 'webm', 'mov', 'avi', 'mkv', 'gif'] as [string, ...string[]]).default('mp4'),
  status: z.enum(['idle', 'processing', 'success', 'error']).default('idle'),
  progress: z.number().min(0).max(100).default(0),
  outputUrl: z.string().url().optional(),
  error: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
});

export type VideoTask = z.infer<typeof VideoTaskSchema>;

// ==========================================
// 2. AUDIO STRUCT
// ==========================================
export const AudioTaskSchema = z.object({
  id: z.string().uuid().default(() => crypto.randomUUID()),
  inputFile: z.instanceof(File).optional(),
  operation: z.enum([
    'trim', 'merge', 'convert', 'master', 'split-stems',
    'pitch', 'stretch', 'denoise', 'normalize', 'equalize',
    'compressor', 'reverb', 'silence-remover', 'voice-isolator',
    'bass-booster', 'stereo-panner', 'waveform-visualizer',
    'metadata-editor', 'bpm-detector', 'key-finder', 'batch-processor',
    'audio-splitter', 'podcast-enhancer', 'voice-recorder',
    'spectrum-analyzer', 'fade-editor', 'loop-creator',
    'karaoke-maker', 'spatial-audio'
  ] as [string, ...string[]]),
  options: z.record(z.string(), z.unknown()).default({}),
  outputFormat: z.enum(['mp3', 'wav', 'ogg', 'flac', 'aac'] as [string, ...string[]]).default('mp3'),
  status: z.enum(['idle', 'processing', 'success', 'error']).default('idle'),
  progress: z.number().min(0).max(100).default(0),
  createdAt: z.date().default(() => new Date()),
});

export type AudioTask = z.infer<typeof AudioTaskSchema>;

// ==========================================
// 3. IMAGE STRUCT (NEW Phase 20)
// ==========================================
export const ImageTaskSchema = z.object({
  id: z.string().uuid().default(() => crypto.randomUUID()),
  inputFile: z.instanceof(File).optional(),
  operation: z.enum([
    'converter', 'compressor', 'cropper', 'resizer', 'watermark', 'background-remover',
    'upscaler', 'filters', 'metadata', 'color-picker', 'blur', 'sharpen', 'noise-reduction',
    'black-and-white', 'collage', 'spritesheet', 'gif-maker', 'ico-converter', 'b64-encoder',
    'svg-optimizer', 'pdf-to-image', 'image-to-pdf', 'color-replace', 'meme-generator',
    'split', 'rotate-flip', 'hdr', 'glitch', 'pixelate', 'batch-rename'
  ] as [string, ...string[]]),
  options: z.record(z.string(), z.unknown()).default({}),
  outputFormat: z.enum(['jpg', 'png', 'webp', 'avif', 'tiff', 'gif', 'ico'] as [string, ...string[]]).default('webp'),
  status: z.enum(['idle', 'processing', 'success', 'error']).default('idle'),
  progress: z.number().min(0).max(100).default(0),
  createdAt: z.date().default(() => new Date()),
});

export type ImageTask = z.infer<typeof ImageTaskSchema>;

// ==========================================
// 4. LLM STRUCT
// ==========================================
export const LLMTaskSchema = z.object({
  id: z.string().uuid().default(() => crypto.randomUUID()),
  model: z.enum(['gpt-4o', 'claude-3-5-sonnet', 'gemini-1.5-pro', 'llama-3.1', 'deepseek-r1-local'] as [string, ...string[]]),
  systemPrompt: z.string().optional(),
  userMessage: z.string().min(1),
  context: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system'] as [string, ...string[]]),
    content: z.string(),
  })).default([]),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(1).max(128000).default(4096),
  status: z.enum(['idle', 'streaming', 'success', 'error']).default('idle'),
  response: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
});

export type LLMTask = z.infer<typeof LLMTaskSchema>;
