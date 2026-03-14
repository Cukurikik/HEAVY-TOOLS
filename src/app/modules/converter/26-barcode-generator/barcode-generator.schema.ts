// ============================================================
// FEATURE 26 — BARCODE GENERATOR — Zod Schema
// ============================================================
import { z } from 'zod';

export const BarcodeGeneratorSchema = z.object({
  inputText: z.string().min(1, 'Input is required'),
  outputFormat: z.enum(['png', 'svg', 'jpeg'] as [string, ...string[]]) });

export type BarcodeGeneratorConfig = z.infer<typeof BarcodeGeneratorSchema>;
