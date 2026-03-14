import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const MergerInputSchema = z.object({
  inputFile: AudioFileSchema,
  crossfade:z.boolean(),crossfadeDuration:z.number().min(0).max(3),outputFormat:ExportFormatSchema,
});

export type MergerInput = z.infer<typeof MergerInputSchema>;
