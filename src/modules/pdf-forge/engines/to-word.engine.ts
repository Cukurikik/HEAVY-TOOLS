// Engine: LibreOffice + mammoth | Execution: server
import type { PdfOperation } from '../types';

export interface ToWordEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'server';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getToWordConfig(): ToWordEngineConfig {
  return {
    operation: 'to-word',
    engine: 'LibreOffice + mammoth',
    execution: 'server',
    description: 'Konversi PDF ke DOCX',
    defaultOptions: {
      preserveLayout: true
    },
  };
}
