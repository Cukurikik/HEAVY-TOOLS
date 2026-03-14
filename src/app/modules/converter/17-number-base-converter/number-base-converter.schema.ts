// ============================================================
// FEATURE 17 — NUMBER BASE CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const NumberBaseConverterSchema = z.object({
  inputText: z.string().min(1, 'Input is required'),
  outputFormat: z.enum(['binary', 'octal', 'decimal', 'hex', 'base32', 'base64'] as [string, ...string[]]) });

export type NumberBaseConverterConfig = z.infer<typeof NumberBaseConverterSchema>;
