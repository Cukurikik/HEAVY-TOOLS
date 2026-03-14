import { z } from 'zod';

export const AudioFileSchema = z.instanceof(File)
  .refine(f => f.size <= 500 * 1024 * 1024, 'File is too large. Maximum 500MB.')
  .refine(f => {
    const ext = f.name.split('.').pop()?.toLowerCase() || '';
    const validExts = ['mp3','wav','flac','ogg','aac','opus','m4a','webm','mp4','wma'];
    return f.type.startsWith('audio/') || f.type.startsWith('video/') || validExts.includes(ext);
  }, 'Invalid audio file type');

export const ExportFormatSchema = z.enum(['wav', 'mp3', 'aac', 'ogg', 'flac', 'opus', 'm4a']);
export const TimestampSchema = z.number().nonnegative().finite();
