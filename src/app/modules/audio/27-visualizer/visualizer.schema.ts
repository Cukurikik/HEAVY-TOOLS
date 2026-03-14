import { z } from 'zod';
import { AudioFileSchema } from '../shared/schemas/audio.schemas';

export const AudioVisualizerInputSchema = z.object({
  inputFile: AudioFileSchema,
  style:z.enum(['bars','waveform','circle','particles','spectrogram']),fps:z.number(),outputFormat:z.enum(['wav','mp3','aac','ogg','flac','opus','m4a']) });

export type AudioVisualizerInput = z.infer<typeof AudioVisualizerInputSchema>;
