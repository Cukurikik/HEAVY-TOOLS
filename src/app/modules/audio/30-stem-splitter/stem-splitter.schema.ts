import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const StemSplitterInputSchema = z.object({
  inputFile: AudioFileSchema,
  model:z.enum(['demucs-v4','htdemucs','spleeter-2stem']),outputFormat:ExportFormatSchema,
});

export type StemSplitterInput = z.infer<typeof StemSplitterInputSchema>;
