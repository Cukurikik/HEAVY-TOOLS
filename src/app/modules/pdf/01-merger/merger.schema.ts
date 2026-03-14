import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const MergerSchema = z.object({
  inputFile: PdfFileSchema
});
