// ============================================================
// FEATURE 30 — BATCH CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const BatchConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 2048 * 1024 * 1024, 'Max 2048 MB'),
  outputFormat: z.enum(['auto'] as [string, ...string[]]) });

export type BatchConverterConfig = z.infer<typeof BatchConverterSchema>;
