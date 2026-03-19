// Engine: PDF.js + pdf-lib | Execution: client
import type { PdfOperation } from '../types';

export interface RedactorEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getRedactorConfig(): RedactorEngineConfig {
  return {
    operation: 'redact',
    engine: 'PDF.js + pdf-lib',
    execution: 'client',
    description: 'Sensor informasi sensitif',
    defaultOptions: {
      redactColor: 'black'
    },
  };
}
