import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const ToHtmlSchema = z.object({
  inputFile: PdfFileSchema
});
