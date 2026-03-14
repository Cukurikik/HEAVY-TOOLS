import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const KaraokeInputSchema = z.object({
  inputFile: AudioFileSchema,
  method:z.enum(['midSide','ai']),outputTarget:z.enum(['karaoke','vocals','instrumental']),outputFormat:ExportFormatSchema,
});

export type KaraokeInput = z.infer<typeof KaraokeInputSchema>;
