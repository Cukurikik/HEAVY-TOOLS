import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const NormalizerInputSchema = z.object({
  inputFile: AudioFileSchema,
  mode:z.enum(['peak','rms','lufs']),targetLevel:z.number(),outputFormat:ExportFormatSchema,
});

export type NormalizerInput = z.infer<typeof NormalizerInputSchema>;
