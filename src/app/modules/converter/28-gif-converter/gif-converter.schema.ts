// ============================================================
// FEATURE 28 — GIF CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const GifConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 100 * 1024 * 1024, 'Max 100 MB'),
  outputFormat: z.enum(['gif', 'apng', 'webp', 'mp4'] as [string, ...string[]]),
});

export type GifConverterConfig = z.infer<typeof GifConverterSchema>;
