// Engine: pdf-lib + sharp | Execution: server
import type { PdfOperation } from '../types';

export interface CompressorEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'server';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getCompressorConfig(): CompressorEngineConfig {
  return {
    operation: 'compress',
    engine: 'pdf-lib + sharp',
    execution: 'server',
    description: 'Kompres ukuran PDF',
    defaultOptions: {
      quality: 80
    },
  };
}
