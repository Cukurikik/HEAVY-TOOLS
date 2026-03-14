import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const RepairSchema = z.object({
  inputFile: PdfFileSchema
});
