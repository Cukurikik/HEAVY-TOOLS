// ============================================================
// FEATURE 23 — SUBTITLE CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const SubtitleConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 10 * 1024 * 1024, 'Max 10 MB'),
  outputFormat: z.enum(['srt', 'vtt', 'ass', 'ssa', 'sub', 'sbv'] as [string, ...string[]]),
});

export type SubtitleConverterConfig = z.infer<typeof SubtitleConverterSchema>;
