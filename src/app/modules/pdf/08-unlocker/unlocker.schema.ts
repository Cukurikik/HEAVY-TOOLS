import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const UnlockerSchema = z.object({
  inputFile: PdfFileSchema
});
