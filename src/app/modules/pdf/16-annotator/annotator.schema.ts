import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const AnnotatorSchema = z.object({
  inputFile: PdfFileSchema
});
