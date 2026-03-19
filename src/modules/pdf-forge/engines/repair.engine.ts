// Engine: pdf-lib XREF | Execution: client
import type { PdfOperation } from '../types';

export interface RepairEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getRepairConfig(): RepairEngineConfig {
  return {
    operation: 'repair',
    engine: 'pdf-lib XREF',
    execution: 'client',
    description: 'Perbaiki PDF rusak via XREF',
    defaultOptions: {
      ignoreEncryption: true
    },
  };
}
