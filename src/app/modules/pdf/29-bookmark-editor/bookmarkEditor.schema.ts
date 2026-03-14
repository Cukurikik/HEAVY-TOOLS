import { z } from 'zod';
import { PdfFileSchema } from '../shared';

export const BookmarkEditorSchema = z.object({
  inputFile: PdfFileSchema
});
