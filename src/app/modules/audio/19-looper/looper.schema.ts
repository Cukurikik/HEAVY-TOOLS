import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const AudioLooperInputSchema = z.object({
  inputFile: AudioFileSchema,
  loopStart:z.number().min(0),loopEnd:z.number().min(0),crossfadeDuration:z.number().min(0).max(5),repeatCount:z.number().min(1).max(50),outputFormat: ExportFormatSchema });

export type AudioLooperInput = z.infer<typeof AudioLooperInputSchema>;
