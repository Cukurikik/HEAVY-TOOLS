import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const AudioWatermarkInputSchema = z.object({
  inputFile: AudioFileSchema,
  mode:z.enum(['embed','detect']),watermarkText:z.string().max(128),strength:z.number().min(0).max(1),outputFormat:ExportFormatSchema,
});

export type AudioWatermarkInput = z.infer<typeof AudioWatermarkInputSchema>;
