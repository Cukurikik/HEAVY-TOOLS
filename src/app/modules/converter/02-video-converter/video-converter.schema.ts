import { z } from 'zod';
export const VideoConverterSchema = z.object({
  inputFile: z.instanceof(File).refine(f => f.size <= 2 * 1024 * 1024 * 1024, 'Max 2 GB'),
  outputFormat: z.enum(['mp4', 'mkv', 'mov', 'avi', 'webm', 'flv', 'wmv', 'gif']),
  crf: z.number().int().min(0).max(51),
  encodingSpeed: z.enum(['ultrafast', 'fast', 'medium', 'slow', 'veryslow']),
  resolution: z.string() });
export type VideoConverterConfig = z.infer<typeof VideoConverterSchema>;
