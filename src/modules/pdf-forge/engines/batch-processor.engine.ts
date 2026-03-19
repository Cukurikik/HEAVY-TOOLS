// Engine: pdf-lib + Queue | Execution: client
import type { PdfOperation } from '../types';

export interface BatchProcessorEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getBatchProcessorConfig(): BatchProcessorEngineConfig {
  return {
    operation: 'batch-process',
    engine: 'pdf-lib + Queue',
    execution: 'client',
    description: 'Proses multiple PDF sekaligus',
    defaultOptions: {
      batchOperation: 'merge'
    },
  };
}
