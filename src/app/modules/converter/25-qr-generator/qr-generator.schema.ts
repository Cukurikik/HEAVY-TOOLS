// ============================================================
// FEATURE 25 — QR CODE GENERATOR — Zod Schema
// ============================================================
import { z } from 'zod';

export const QrGeneratorSchema = z.object({
  inputText: z.string().min(1, 'Input is required'),
  outputFormat: z.enum(['png', 'svg', 'jpeg'] as [string, ...string[]]),
});

export type QrGeneratorConfig = z.infer<typeof QrGeneratorSchema>;
