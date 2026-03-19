// Engine: pdf-parse + diff-match-patch | Execution: hybrid
import type { PdfOperation } from '../types';

export interface CompareEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'hybrid';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getCompareConfig(): CompareEngineConfig {
  return {
    operation: 'compare',
    engine: 'pdf-parse + diff-match-patch',
    execution: 'hybrid',
    description: 'Bandingkan dua PDF',
    defaultOptions: {
      granularity: 'word'
    },
  };
}
