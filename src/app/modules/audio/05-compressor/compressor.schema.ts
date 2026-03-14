import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const DynamicsCompressorInputSchema = z.object({
  inputFile: AudioFileSchema,
  threshold:z.number().min(-60).max(0),ratio:z.number().min(1).max(20),attack:z.number().min(0.001).max(1),release:z.number().min(0.01).max(1),knee:z.number().min(0).max(40),makeupGain:z.number().min(-12).max(24),outputFormat:ExportFormatSchema,
});

export type DynamicsCompressorInput = z.infer<typeof DynamicsCompressorInputSchema>;
