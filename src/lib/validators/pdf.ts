import { z } from 'zod';

export const pdfHistorySchema = z.object({
  toolName: z.string().min(1),
  inputFile: z.string().optional(),
  outputFile: z.string().optional(),
  pageCount: z.number().min(1).optional(),
  status: z.enum(['success', 'error']).default('success'),
  errorMessage: z.string().optional(),
});

export const pdfSignatureSchema = z.object({
  name: z.string().min(1).max(50),
  signatureData: z.string().min(1), // Base64 or Blob URL
});

export const pdfWatermarkSchema = z.object({
  name: z.string().min(1).max(50),
  text: z.string().optional(),
  imageUrl: z.string().url().optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Warna harus Hex").optional(),
  opacity: z.number().min(0).max(1).default(0.5),
  rotation: z.number().min(-360).max(360).default(45),
}).refine(data => !!data.text || !!data.imageUrl, {
  message: "Watermark harus berisi teks statis atau Image URL.",
  path: ['text']
});

export const pinCloudPdfSchema = z.object({
  fileId: z.string().uuid(),
  isPinned: z.boolean(),
});
