import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const ToWordSchema = z.object({
  inputFile: PdfFileSchema
});
