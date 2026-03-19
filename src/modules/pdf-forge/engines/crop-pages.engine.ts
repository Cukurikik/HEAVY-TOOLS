// Engine: pdf-lib cropBox | Execution: client
import type { PdfOperation } from '../types';

export interface CropPagesEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getCropPagesConfig(): CropPagesEngineConfig {
  return {
    operation: 'crop-pages',
    engine: 'pdf-lib cropBox',
    execution: 'client',
    description: 'Potong area halaman PDF',
    defaultOptions: {
      marginTop: 0,
      marginBottom: 0
    },
  };
}
