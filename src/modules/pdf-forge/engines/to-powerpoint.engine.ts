// Engine: LibreOffice | Execution: server
import type { PdfOperation } from '../types';

export interface ToPowerpointEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'server';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getToPowerpointConfig(): ToPowerpointEngineConfig {
  return {
    operation: 'to-powerpoint',
    engine: 'LibreOffice',
    execution: 'server',
    description: 'Konversi PDF ke PPTX',
    defaultOptions: {
      slideSize: '16:9'
    },
  };
}
