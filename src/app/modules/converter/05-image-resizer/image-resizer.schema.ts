// ============================================================
// FEATURE 05 — IMAGE RESIZER — Zod Schema
// ============================================================
import { z } from 'zod';

export const ImageResizerSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 50 * 1024 * 1024, 'Max 50 MB'),
  outputFormat: z.enum(['original', 'jpeg', 'png', 'webp'] as [string, ...string[]]) });

export type ImageResizerConfig = z.infer<typeof ImageResizerSchema>;
