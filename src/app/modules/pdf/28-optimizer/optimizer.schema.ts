import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const OptimizerSchema = z.object({
  inputFile: PdfFileSchema
});
