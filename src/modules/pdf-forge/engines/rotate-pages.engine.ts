// Engine: pdf-lib | Execution: client
import type { PdfOperation } from '../types';

export interface RotatePagesEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getRotatePagesConfig(): RotatePagesEngineConfig {
  return {
    operation: 'rotate-pages',
    engine: 'pdf-lib',
    execution: 'client',
    description: 'Rotasi halaman 90°/180°/270°',
    defaultOptions: {
      angle: '90'
    },
  };
}
