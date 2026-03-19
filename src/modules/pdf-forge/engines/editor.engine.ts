// Engine: PDF.js + pdf-lib | Execution: client
import type { PdfOperation } from '../types';

export interface EditorEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getEditorConfig(): EditorEngineConfig {
  return {
    operation: 'edit',
    engine: 'PDF.js + pdf-lib',
    execution: 'client',
    description: 'Edit teks dan elemen PDF',
    defaultOptions: {
      fontsize: 12
    },
  };
}
