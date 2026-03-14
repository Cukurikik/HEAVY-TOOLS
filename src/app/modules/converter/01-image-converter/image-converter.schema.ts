// ============================================================
// FEATURE 01 — IMAGE CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const ImageConverterSchema = z.object({
  inputFiles: z.array(
    z.instanceof(File)
      .refine(f => f.size <= 50 * 1024 * 1024, 'Max 50 MB per image')
      .refine(f => f.type.startsWith('image/'), 'Must be an image')
  ).min(1).max(50),
  outputFormat: z.enum(['jpeg', 'png', 'webp', 'avif', 'bmp', 'tiff', 'gif']),
  quality: z.number().int().min(1).max(100),
  colorSpace: z.enum(['srgb', 'grayscale', 'cmyk']),
  preserveExif: z.boolean(),
  lossless: z.boolean(),
});

export type ImageConverterConfig = z.infer<typeof ImageConverterSchema>;
