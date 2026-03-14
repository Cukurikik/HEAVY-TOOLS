import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const TimeStretchInputSchema = z.object({
  inputFile: AudioFileSchema,
  speed:z.number().min(0.1).max(4),pitchLock:z.boolean(),outputFormat:ExportFormatSchema,
});

export type TimeStretchInput = z.infer<typeof TimeStretchInputSchema>;
