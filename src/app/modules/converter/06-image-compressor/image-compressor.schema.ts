// ============================================================
// FEATURE 06 — IMAGE COMPRESSOR — Zod Schema
// ============================================================
import { z } from 'zod';

export const ImageCompressorSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 50 * 1024 * 1024, 'Max 50 MB'),
  outputFormat: z.enum(['jpeg', 'png', 'webp', 'avif'] as [string, ...string[]]),
});

export type ImageCompressorConfig = z.infer<typeof ImageCompressorSchema>;
