import { z } from 'zod';
import { AudioFileSchema } from '../shared/schemas/audio.schemas';

export const TranscriberInputSchema = z.object({
  inputFile: AudioFileSchema,
  model:z.enum(['tiny','base','small','medium']),language:z.string(),outputFormat:z.enum(['wav','mp3','aac','ogg','flac','opus','m4a']) });

export type TranscriberInput = z.infer<typeof TranscriberInputSchema>;
