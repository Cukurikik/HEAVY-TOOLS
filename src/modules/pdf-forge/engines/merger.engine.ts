// Engine: pdf-lib | Execution: client
import type { PdfOperation } from '../types';

export interface MergerEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getMergerConfig(): MergerEngineConfig {
  return {
    operation: 'merge',
    engine: 'pdf-lib',
    execution: 'client',
    description: 'Gabungkan beberapa file PDF',
    defaultOptions: {
      preserveBookmarks: true
    },
  };
}
