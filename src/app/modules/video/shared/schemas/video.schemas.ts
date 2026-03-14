import { z } from 'zod';

export const VideoFileSchema = z.instanceof(File)
  .refine(f => f.size <= 2_147_483_648, 'File is too large. Maximum size is 2GB.')
  .refine(f => f.type.startsWith('video/'), 'Please upload a valid video file');

export const TimestampSchema = z.number().nonnegative().finite();
export const ProgressSchema = z.number().min(0).max(100);
export const ExportFormatSchema = z.enum(['mp4', 'webm', 'mov', 'avi', 'mkv', 'gif']);
