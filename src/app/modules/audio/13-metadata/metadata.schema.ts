import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const AudioMetadataInputSchema = z.object({
  inputFile: AudioFileSchema,
  title:z.string().max(500).optional(),artist:z.string().max(500).optional(),album:z.string().max(500).optional(),year:z.string().regex(/^\d{4}$/).optional(),outputFormat: ExportFormatSchema });

export type AudioMetadataInput = z.infer<typeof AudioMetadataInputSchema>;
