// Engine: LibreOffice | Execution: server
import type { PdfOperation } from '../types';

export interface ConverterEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'server';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getConverterConfig(): ConverterEngineConfig {
  return {
    operation: 'convert',
    engine: 'LibreOffice',
    execution: 'server',
    description: 'Konversi format Office',
    defaultOptions: {
      targetFormat: 'docx'
    },
  };
}
