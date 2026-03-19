// Engine: pdf-lib + pdf-parse | Execution: client
import type { PdfOperation } from '../types';

export interface XrefAnalyzerEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getXrefAnalyzerConfig(): XrefAnalyzerEngineConfig {
  return {
    operation: 'xref-analyze',
    engine: 'pdf-lib + pdf-parse',
    execution: 'client',
    description: 'Analisis struktur internal PDF',
    defaultOptions: {
      showRawData: false
    },
  };
}
