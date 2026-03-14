import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const ToPowerpointSchema = z.object({
  inputFile: PdfFileSchema
});
