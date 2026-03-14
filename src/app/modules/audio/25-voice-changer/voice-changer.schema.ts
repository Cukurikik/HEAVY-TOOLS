import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const VoiceChangerInputSchema = z.object({
  inputFile: AudioFileSchema,
  activePreset:z.string().optional(),pitch:z.number().min(-12).max(12),outputFormat:ExportFormatSchema,
});

export type VoiceChangerInput = z.infer<typeof VoiceChangerInputSchema>;
