import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const ImageExtractorSchema = z.object({
  inputFile: PdfFileSchema
});
