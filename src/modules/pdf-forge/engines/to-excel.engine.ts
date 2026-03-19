// Engine: pdf2json + LibreOffice | Execution: server
import type { PdfOperation } from '../types';

export interface ToExcelEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'server';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getToExcelConfig(): ToExcelEngineConfig {
  return {
    operation: 'to-excel',
    engine: 'pdf2json + LibreOffice',
    execution: 'server',
    description: 'Konversi tabel PDF ke XLSX',
    defaultOptions: {
      detectTables: true
    },
  };
}
