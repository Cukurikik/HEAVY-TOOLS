import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const AudioMixerInputSchema = z.object({
  inputFile: AudioFileSchema,
  masterVolume:z.number().min(0).max(2),outputMode:z.enum(['stereo','mono']),outputFormat:ExportFormatSchema,
});

export type AudioMixerInput = z.infer<typeof AudioMixerInputSchema>;
