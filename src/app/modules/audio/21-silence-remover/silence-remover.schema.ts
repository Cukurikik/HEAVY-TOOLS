import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const SilenceRemoverInputSchema = z.object({
  inputFile: AudioFileSchema,
  thresholdDb:z.number().min(-60).max(-10),minSilenceDuration:z.number().min(0.1).max(5),outputFormat: ExportFormatSchema });

export type SilenceRemoverInput = z.infer<typeof SilenceRemoverInputSchema>;
