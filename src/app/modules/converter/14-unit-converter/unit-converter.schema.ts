// ============================================================
// FEATURE 14 — UNIT CONVERTER — Zod Schema
// ============================================================
import { z } from 'zod';

export const UnitConverterSchema = z.object({
  inputText: z.string().min(1, 'Input is required'),
  outputFormat: z.enum(['length', 'weight', 'temperature', 'area', 'volume', 'speed', 'data', 'time'] as [string, ...string[]]) });

export type UnitConverterConfig = z.infer<typeof UnitConverterSchema>;
