// ============================================================
// FEATURE 18 — ENCODING CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const EncodingConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 10 * 1024 * 1024, 'Max 10 MB'),
  outputFormat: z.enum(['utf8', 'ascii', 'url', 'html', 'unicode', 'punycode'] as [string, ...string[]]),
});

export type EncodingConverterConfig = z.infer<typeof EncodingConverterSchema>;
