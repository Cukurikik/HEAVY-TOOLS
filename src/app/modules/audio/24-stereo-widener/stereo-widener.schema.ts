import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const StereoWidenerInputSchema = z.object({
  inputFile: AudioFileSchema,
  width:z.number().min(0).max(200),outputFormat: ExportFormatSchema });

export type StereoWidenerInput = z.infer<typeof StereoWidenerInputSchema>;
