import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const RedactorSchema = z.object({
  inputFile: PdfFileSchema
});
