import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const CompareSchema = z.object({
  inputFile: PdfFileSchema
});
