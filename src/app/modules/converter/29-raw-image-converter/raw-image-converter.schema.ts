// ============================================================
// FEATURE 29 — RAW IMAGE CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const RawImageConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 50 * 1024 * 1024, 'Max 50 MB'),
  outputFormat: z.enum(['jpeg', 'tiff', 'png'] as [string, ...string[]]) });

export type RawImageConverterConfig = z.infer<typeof RawImageConverterSchema>;
