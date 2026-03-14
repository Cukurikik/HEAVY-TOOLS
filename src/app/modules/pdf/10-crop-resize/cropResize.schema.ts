import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const CropResizeSchema = z.object({
  inputFile: PdfFileSchema
});
