// ============================================================
// FEATURE 09 — JSON CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const JsonConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 50 * 1024 * 1024, 'Max 50 MB'),
  outputFormat: z.enum(['json', 'csv', 'xml', 'yaml', 'toml'] as [string, ...string[]]),
});

export type JsonConverterConfig = z.infer<typeof JsonConverterSchema>;
