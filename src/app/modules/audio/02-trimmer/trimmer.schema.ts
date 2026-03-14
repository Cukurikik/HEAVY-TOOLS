import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const TrimmerInputSchema = z.object({
  inputFile: AudioFileSchema,
  startTime:z.number().min(0),endTime:z.number().min(0),snapToZero:z.boolean(),outputFormat:ExportFormatSchema,
});

export type TrimmerInput = z.infer<typeof TrimmerInputSchema>;
