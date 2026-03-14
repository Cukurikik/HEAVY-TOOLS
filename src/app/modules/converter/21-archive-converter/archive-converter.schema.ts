// ============================================================
// FEATURE 21 — ARCHIVE CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const ArchiveConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 500 * 1024 * 1024, 'Max 500 MB'),
  outputFormat: z.enum(['zip', 'tar', 'gz', '7z'] as [string, ...string[]]),
});

export type ArchiveConverterConfig = z.infer<typeof ArchiveConverterSchema>;
