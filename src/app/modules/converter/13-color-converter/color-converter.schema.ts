// ============================================================
// FEATURE 13 — COLOR CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const ColorConverterSchema = z.object({
  inputText: z.string().min(1, 'Input is required'),
  outputFormat: z.enum(['hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'lab'] as [string, ...string[]]),
});

export type ColorConverterConfig = z.infer<typeof ColorConverterSchema>;
