// Engine: PDF.js Canvas | Execution: client
import type { PdfOperation } from '../types';

export interface ToImageEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getToImageConfig(): ToImageEngineConfig {
  return {
    operation: 'to-image',
    engine: 'PDF.js Canvas',
    execution: 'client',
    description: 'Render halaman ke PNG/JPEG',
    defaultOptions: {
      format: 'png',
      scale: 2
    },
  };
}
