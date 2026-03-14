import { z } from 'zod';

export const ImageTaskSchema = z.object({
  id: z.string().uuid(),
  inputFile: z.instanceof(File).optional(),
  operation: z.enum([
    'generate', 'enhance', 'restore', 'remove-bg', 'auto-enhance', 'auto-crop',
    'convert', 'resize', 'crop', 'rotate', 'split', 'compress',
    'palette', 'glitch', 'pixelate', 'lut', 'colorize',
    'watermark', 'blur', 'meme', 'collage', 'gif', 'exif'
  ]),
  options: z.record(z.string(), z.unknown()).optional(),
  status: z.enum(['idle', 'processing', 'success', 'error']),
  progress: z.number().min(0).max(100),
  outputBlobUrl: z.string().optional(),
  error: z.string().optional(),
  createdAt: z.date(),
});

export type ImageTask = z.infer<typeof ImageTaskSchema>;
