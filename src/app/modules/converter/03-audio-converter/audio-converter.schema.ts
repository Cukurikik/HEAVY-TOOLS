// ============================================================
// FEATURE 03 — AUDIO FORMAT CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const AudioConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 500 * 1024 * 1024, 'Max 500 MB'),
  outputFormat: z.enum(['mp3', 'wav', 'aac', 'ogg', 'flac', 'opus', 'm4a'] as [string, ...string[]]) });

export type AudioConverterConfig = z.infer<typeof AudioConverterSchema>;
