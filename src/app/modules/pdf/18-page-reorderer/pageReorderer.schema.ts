import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const PageReordererSchema = z.object({
  inputFile: PdfFileSchema
});
