// Engine: PDF.js + Konva.js | Execution: client
import type { PdfOperation } from '../types';

export interface AnnotatorEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getAnnotatorConfig(): AnnotatorEngineConfig {
  return {
    operation: 'annotate',
    engine: 'PDF.js + Konva.js',
    execution: 'client',
    description: 'Tambah highlight dan catatan',
    defaultOptions: {
      color: '#FFFF00'
    },
  };
}
