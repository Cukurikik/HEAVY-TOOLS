// Engine: Web Crypto + pdf-lib | Execution: client
import type { PdfOperation } from '../types';

export interface DigitalSignatureEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getDigitalSignatureConfig(): DigitalSignatureEngineConfig {
  return {
    operation: 'digital-signature',
    engine: 'Web Crypto + pdf-lib',
    execution: 'client',
    description: 'Tanda tangan digital PAdES',
    defaultOptions: {
      signerName: '',
      reason: 'Approval'
    },
  };
}
