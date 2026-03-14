// ============================================================
// FEATURE 11 — MARKDOWN CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const MarkdownConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 10 * 1024 * 1024, 'Max 10 MB'),
  outputFormat: z.enum(['html', 'pdf', 'docx', 'md', 'txt'] as [string, ...string[]]),
});

export type MarkdownConverterConfig = z.infer<typeof MarkdownConverterSchema>;
