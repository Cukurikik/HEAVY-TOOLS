import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const ToImageBatchSchema = z.object({
  inputFile: PdfFileSchema
});
