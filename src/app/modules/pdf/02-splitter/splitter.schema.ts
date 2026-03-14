import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const SplitterSchema = z.object({
  inputFile: PdfFileSchema
});
