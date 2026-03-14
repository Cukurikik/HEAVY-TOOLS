// ============================================================
// FEATURE 08 — BASE64 ENCODER / DECODER — Zod Schema
// ============================================================
import { z } from 'zod';

export const Base64EncoderSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 50 * 1024 * 1024, 'Max 50 MB'),
  outputFormat: z.enum(['base64', 'text', 'file'] as [string, ...string[]]) });

export type Base64EncoderConfig = z.infer<typeof Base64EncoderSchema>;
