import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const NoiseRemoverInputSchema = z.object({
  inputFile: AudioFileSchema,
  algorithm:z.enum(['spectral','ai','ffmpeg']),strength:z.number().min(0).max(1),outputFormat:ExportFormatSchema,
});

export type NoiseRemoverInput = z.infer<typeof NoiseRemoverInputSchema>;
