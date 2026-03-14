import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const AudioConverterInputSchema = z.object({
  inputFile: AudioFileSchema,
  targetFormat:ExportFormatSchema,bitrate:z.number(),sampleRate:z.number(),outputFormat:ExportFormatSchema,
});

export type AudioConverterInput = z.infer<typeof AudioConverterInputSchema>;
