import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const ConverterSchema = z.object({
  inputFile: PdfFileSchema
});
