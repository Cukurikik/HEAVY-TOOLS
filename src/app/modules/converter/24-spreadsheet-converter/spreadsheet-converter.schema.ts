// ============================================================
// FEATURE 24 — SPREADSHEET CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const SpreadsheetConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 100 * 1024 * 1024, 'Max 100 MB'),
  outputFormat: z.enum(['xlsx', 'csv', 'ods', 'json', 'html', 'pdf'] as [string, ...string[]]) });

export type SpreadsheetConverterConfig = z.infer<typeof SpreadsheetConverterSchema>;
