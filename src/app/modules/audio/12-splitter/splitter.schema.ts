import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const AudioSplitterInputSchema = z.object({
  inputFile: AudioFileSchema,
  mode:z.enum(['markers','equal','silence','beats']),equalParts:z.number().min(2).max(100),outputFormat: ExportFormatSchema });

export type AudioSplitterInput = z.infer<typeof AudioSplitterInputSchema>;
