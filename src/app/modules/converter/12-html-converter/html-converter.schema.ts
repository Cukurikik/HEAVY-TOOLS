// ============================================================
// FEATURE 12 — HTML CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const HtmlConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 10 * 1024 * 1024, 'Max 10 MB'),
  outputFormat: z.enum(['pdf', 'md', 'txt', 'docx', 'epub'] as [string, ...string[]]) });

export type HtmlConverterConfig = z.infer<typeof HtmlConverterSchema>;
