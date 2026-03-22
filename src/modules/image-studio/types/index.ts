import { z } from 'zod';

export const ImageTaskSchema = z.object({
  id: z.string().uuid().default(() => crypto.randomUUID()),
  inputFile: z.instanceof(File),
  operation: z.enum([
    'convert', 'resize', 'compress', 'crop', 'rotate', 'flip',
    'brightness', 'contrast', 'hsl', 'blur', 'sharpen', 
    'upscale', 'remove-bg', 'heic', 'watermark', 'text', 'collage',
    'denoise', 'exif', 'histogram', 'picker', 'svg', 'raw', 'qr',
    'batch-resize', 'face-blur', 'base64', 'enhance', 'palette',
    'screenshot-to-code', 'sprite'
  ]),
  options: z.record(z.string(), z.unknown()),
  outputFormat: z.enum(['jpeg', 'png', 'webp', 'gif', 'svg']).default('jpeg'),
  status: z.enum(['idle', 'processing', 'success', 'error']).default('idle'),
  progress: z.number().min(0).max(100).default(0),
  outputUrl: z.string().url().optional(),
  error: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
});

export type ImageTask = z.infer<typeof ImageTaskSchema>;

// Filter Adjustments state used by Filter Studio & WebGL
export interface ImageAdjustments {
  brightness: number;  // -100 to 100
  contrast: number;    // -100 to 100
  saturation: number;  // -100 to 100
  hue: number;         // -180 to 180
  blur: number;        // 0 to 100
  sharpen: number;     // 0 to 100
}
