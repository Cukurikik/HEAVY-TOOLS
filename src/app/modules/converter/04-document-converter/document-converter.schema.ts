// ============================================================
// FEATURE 04 — DOCUMENT CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const DocumentConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 50 * 1024 * 1024, 'Max 50 MB'),
  outputFormat: z.enum(['docx', 'pdf', 'html', 'txt', 'md', 'rtf', 'odt', 'epub'] as [string, ...string[]]),
});

export type DocumentConverterConfig = z.infer<typeof DocumentConverterSchema>;
