import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const ThumbnailGeneratorSchema = z.object({
  inputFile: PdfFileSchema
});
