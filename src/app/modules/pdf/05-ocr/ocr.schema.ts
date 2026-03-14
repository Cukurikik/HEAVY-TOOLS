import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const OcrSchema = z.object({
  inputFile: PdfFileSchema
});
