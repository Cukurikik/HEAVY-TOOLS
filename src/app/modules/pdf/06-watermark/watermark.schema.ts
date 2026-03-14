import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const WatermarkSchema = z.object({
  inputFile: PdfFileSchema
});
