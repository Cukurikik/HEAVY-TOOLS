// Engine: Web Crypto | Execution: client
import type { PdfOperation } from '../types';

export interface EncryptEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getEncryptConfig(): EncryptEngineConfig {
  return {
    operation: 'encrypt',
    engine: 'Web Crypto',
    execution: 'client',
    description: 'Enkripsi PDF dengan AES-256',
    defaultOptions: {
      password: '',
      algorithm: 'AES-256'
    },
  };
}
