import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const AudioReverserInputSchema = z.object({
  inputFile: AudioFileSchema,
  mode:z.enum(['full','region']),outputFormat: ExportFormatSchema });

export type AudioReverserInput = z.infer<typeof AudioReverserInputSchema>;
