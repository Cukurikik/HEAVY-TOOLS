// Engine: pdf2json | Execution: server
import type { PdfOperation } from '../types';

export interface TableExtractorEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'server';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getTableExtractorConfig(): TableExtractorEngineConfig {
  return {
    operation: 'table-extract',
    engine: 'pdf2json',
    execution: 'server',
    description: 'Ekstrak tabel terstruktur',
    defaultOptions: {
      outputFormat: 'csv'
    },
  };
}
