// Engine: pdf-lib | Execution: client
import type { PdfOperation } from '../types';

export interface ExtractPagesEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getExtractPagesConfig(): ExtractPagesEngineConfig {
  return {
    operation: 'extract-pages',
    engine: 'pdf-lib',
    execution: 'client',
    description: 'Ekstrak halaman tertentu',
    defaultOptions: {
      pageRange: '1'
    },
  };
}
