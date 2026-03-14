import { z } from 'zod';
import { AudioFileSchema, ExportFormatSchema } from '../shared/schemas/audio.schemas';

export const ChannelMixerInputSchema = z.object({
  inputFile: AudioFileSchema,
  operation:z.enum(['toMono','toStereo','swapLR','extractL','extractR','midSideEncode','midSideDecode']),outputFormat:ExportFormatSchema,
});

export type ChannelMixerInput = z.infer<typeof ChannelMixerInputSchema>;
