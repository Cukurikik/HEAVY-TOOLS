import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const AudioBatchInputSchema = z.object({
  inputFile: AudioFileSchema,
  operation:z.enum(['convert','normalize','compress','trim-silence','metadata']),outputFormat:ExportFormatSchema,
});

export type AudioBatchInput = z.infer<typeof AudioBatchInputSchema>;
