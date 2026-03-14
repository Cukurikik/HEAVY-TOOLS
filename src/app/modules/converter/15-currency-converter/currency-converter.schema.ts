// ============================================================
// FEATURE 15 — CURRENCY CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const CurrencyConverterSchema = z.object({
  inputText: z.string().min(1, 'Input is required'),
  outputFormat: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'KRW', 'IDR'] as [string, ...string[]]),
});

export type CurrencyConverterConfig = z.infer<typeof CurrencyConverterSchema>;
