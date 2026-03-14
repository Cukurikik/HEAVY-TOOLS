import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const DigitalSignerSchema = z.object({
  inputFile: PdfFileSchema
});
