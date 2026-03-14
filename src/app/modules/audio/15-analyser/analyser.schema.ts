import { z } from 'zod';
import { AudioFileSchema } from '../shared/schemas/audio.schemas';

export const AudioAnalyserInputSchema = z.object({
  inputFile: AudioFileSchema,
  activeTab:z.enum(['waveform','spectrogram','spectrum','loudness']).optional() });

export type AudioAnalyserInput = z.infer<typeof AudioAnalyserInputSchema>;
