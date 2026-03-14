// ============================================================
// FEATURE 19 — FONT CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const FontConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 20 * 1024 * 1024, 'Max 20 MB'),
  outputFormat: z.enum(['ttf', 'otf', 'woff', 'woff2', 'eot'] as [string, ...string[]]),
});

export type FontConverterConfig = z.infer<typeof FontConverterSchema>;
