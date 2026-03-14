// ============================================================
// FEATURE 22 — CAD CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const CadConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 100 * 1024 * 1024, 'Max 100 MB'),
  outputFormat: z.enum(['dxf', 'svg', 'pdf', 'stl', 'obj'] as [string, ...string[]]) });

export type CadConverterConfig = z.infer<typeof CadConverterSchema>;
