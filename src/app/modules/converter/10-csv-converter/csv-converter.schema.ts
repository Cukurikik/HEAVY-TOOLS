// ============================================================
// FEATURE 10 — CSV CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const CsvConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 100 * 1024 * 1024, 'Max 100 MB'),
  outputFormat: z.enum(['json', 'xlsx', 'xml', 'html', 'markdown', 'sql'] as [string, ...string[]]),
});

export type CsvConverterConfig = z.infer<typeof CsvConverterSchema>;
