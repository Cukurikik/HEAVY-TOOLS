import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const RecorderInputSchema = z.object({
  inputFile: AudioFileSchema,
  audioSource:z.enum(['mic','system','both']),outputFormat: ExportFormatSchema,sampleRate:z.number().default(48000) });

export type RecorderInput = z.infer<typeof RecorderInputSchema>;
