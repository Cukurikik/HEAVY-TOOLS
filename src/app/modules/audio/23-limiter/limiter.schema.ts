import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const LimiterInputSchema = z.object({
  inputFile: AudioFileSchema,
  ceiling:z.number().min(-6).max(0),lookaheadMs:z.number().min(0).max(20),release:z.number().min(0.01).max(1),outputFormat: ExportFormatSchema });

export type LimiterInput = z.infer<typeof LimiterInputSchema>;
