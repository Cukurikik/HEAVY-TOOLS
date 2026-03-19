// Engine: pdf-lib + @dnd-kit | Execution: client
import type { PdfOperation } from '../types';

export interface ReorderPagesEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getReorderPagesConfig(): ReorderPagesEngineConfig {
  return {
    operation: 'reorder-pages',
    engine: 'pdf-lib + @dnd-kit',
    execution: 'client',
    description: 'Susun ulang halaman drag-and-drop',
    defaultOptions: {},
  };
}
