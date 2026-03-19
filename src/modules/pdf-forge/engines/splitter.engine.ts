// Engine: pdf-lib | Execution: client
import type { PdfOperation } from '../types';

export interface SplitterEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getSplitterConfig(): SplitterEngineConfig {
  return {
    operation: 'split',
    engine: 'pdf-lib',
    execution: 'client',
    description: 'Pecah PDF berdasarkan halaman',
    defaultOptions: {
      pageRange: '1'
    },
  };
}
