// ============================================================
// FEATURE 07 — SVG CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const SvgConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 10 * 1024 * 1024, 'Max 10 MB'),
  outputFormat: z.enum(['png', 'jpeg', 'webp', 'svg'] as [string, ...string[]]),
});

export type SvgConverterConfig = z.infer<typeof SvgConverterSchema>;
