// ============================================================
// FEATURE 20 — EBOOK CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const EbookConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 100 * 1024 * 1024, 'Max 100 MB'),
  outputFormat: z.enum(['epub', 'mobi', 'pdf', 'azw3', 'fb2', 'txt'] as [string, ...string[]]) });

export type EbookConverterConfig = z.infer<typeof EbookConverterSchema>;
