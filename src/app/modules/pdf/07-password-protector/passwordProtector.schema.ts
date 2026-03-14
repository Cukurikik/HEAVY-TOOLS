import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const PasswordProtectorSchema = z.object({
  inputFile: PdfFileSchema
});
