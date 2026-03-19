// Engine: Web Crypto | Execution: client
import type { PdfOperation } from '../types';

export interface DecryptEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getDecryptConfig(): DecryptEngineConfig {
  return {
    operation: 'decrypt',
    engine: 'Web Crypto',
    execution: 'client',
    description: 'Buka PDF terenkripsi',
    defaultOptions: {
      password: ''
    },
  };
}
