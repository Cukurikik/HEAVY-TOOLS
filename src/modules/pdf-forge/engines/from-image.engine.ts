// Engine: pdf-lib | Execution: client
import type { PdfOperation } from '../types';

export interface FromImageEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getFromImageConfig(): FromImageEngineConfig {
  return {
    operation: 'from-image',
    engine: 'pdf-lib',
    execution: 'client',
    description: 'Gabung gambar menjadi PDF',
    defaultOptions: {
      pageSize: 'fit'
    },
  };
}
