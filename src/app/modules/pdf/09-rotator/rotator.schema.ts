import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const RotatorSchema = z.object({
  inputFile: PdfFileSchema
});
