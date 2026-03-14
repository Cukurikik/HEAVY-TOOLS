import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const PitchShifterInputSchema = z.object({
  inputFile: AudioFileSchema,
  semitones:z.number().min(-12).max(12),cents:z.number().min(-100).max(100),outputFormat: ExportFormatSchema });

export type PitchShifterInput = z.infer<typeof PitchShifterInputSchema>;
