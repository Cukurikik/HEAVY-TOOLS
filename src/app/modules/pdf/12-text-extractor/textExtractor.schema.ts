import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const TextExtractorSchema = z.object({
  inputFile: PdfFileSchema
});
