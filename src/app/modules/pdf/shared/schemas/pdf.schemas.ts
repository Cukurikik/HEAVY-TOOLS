import { z } from 'zod';

export const PdfFileSchema = z.custom<File>(v => v instanceof File && v.type === 'application/pdf')
  .refine(f => f.size <= 500 * 1024 * 1024, 'File must be under 500 MB');

export const PageRangeSchema = z.object({
  from: z.number().int().min(1),
  to: z.number().int().min(1) }).refine(d => d.to >= d.from, 'End page must be >= start page');

export const PasswordSchema = z.string().min(1).max(128);

export const EncryptionStrengthSchema = z.enum(['AES-128', 'AES-256']);

export const ImageFormatSchema = z.enum(['jpeg', 'png', 'webp']);

export const CompressionLevelSchema = z.enum(['low', 'medium', 'high', 'maximum']);
