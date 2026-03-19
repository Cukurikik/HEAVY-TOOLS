// Engine: pdf-lib XMP | Execution: client
import type { PdfOperation } from '../types';

export interface MetadataEditorEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getMetadataEditorConfig(): MetadataEditorEngineConfig {
  return {
    operation: 'metadata-edit',
    engine: 'pdf-lib XMP',
    execution: 'client',
    description: 'Edit title, author, subject',
    defaultOptions: {
      title: '',
      author: '',
      subject: '',
      keywords: ''
    },
  };
}
