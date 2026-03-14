import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const FormFillerSchema = z.object({
  inputFile: PdfFileSchema
});
