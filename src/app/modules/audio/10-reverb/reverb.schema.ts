import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const ReverbInputSchema = z.object({
  inputFile: AudioFileSchema,
  mode:z.enum(['convolution','algorithmic']),roomSize:z.number().min(0).max(100),decay:z.number().min(0.1).max(10),wetMix:z.number().min(0).max(1),outputFormat:ExportFormatSchema,
});

export type ReverbInput = z.infer<typeof ReverbInputSchema>;
