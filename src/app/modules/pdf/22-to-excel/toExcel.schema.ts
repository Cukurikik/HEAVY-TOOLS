import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const ToExcelSchema = z.object({
  inputFile: PdfFileSchema
});
