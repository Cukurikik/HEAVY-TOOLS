// ============================================================
// FEATURE 16 — TIMEZONE CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const TimezoneConverterSchema = z.object({
  inputText: z.string().min(1, 'Input is required'),
  outputFormat: z.enum(['UTC', 'EST', 'PST', 'CET', 'JST', 'IST', 'WIB'] as [string, ...string[]]),
});

export type TimezoneConverterConfig = z.infer<typeof TimezoneConverterSchema>;
