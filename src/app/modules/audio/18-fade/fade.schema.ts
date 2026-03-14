import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const AudioFadeInputSchema = z.object({
  inputFile: AudioFileSchema,
  fadeInDuration:z.number().min(0).max(30),fadeOutDuration:z.number().min(0).max(30),curve:z.enum(['linear','logarithmic','sCurve']),outputFormat:ExportFormatSchema,
});

export type AudioFadeInput = z.infer<typeof AudioFadeInputSchema>;
