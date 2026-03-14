import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const FlattenerSchema = z.object({
  inputFile: PdfFileSchema
});
