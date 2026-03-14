import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const MetadataEditorSchema = z.object({
  inputFile: PdfFileSchema
});
