// ============================================================
// FEATURE 27 — ICO / FAVICON CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const IcoConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 10 * 1024 * 1024, 'Max 10 MB'),
  outputFormat: z.enum(['ico', 'png', 'svg'] as [string, ...string[]]) });

export type IcoConverterConfig = z.infer<typeof IcoConverterSchema>;
