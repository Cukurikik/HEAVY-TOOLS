import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const EqualizerInputSchema = z.object({
  inputFile: AudioFileSchema,
  mode:z.enum(['graphic','parametric']),outputFormat: ExportFormatSchema });

export type EqualizerInput = z.infer<typeof EqualizerInputSchema>;
