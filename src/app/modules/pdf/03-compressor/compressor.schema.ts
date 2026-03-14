import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const CompressorSchema = z.object({
  inputFile: PdfFileSchema
});
