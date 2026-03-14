import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const BatchProcessorSchema = z.object({
  inputFile: PdfFileSchema
});
