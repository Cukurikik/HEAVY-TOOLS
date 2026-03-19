// Engine: pdf-lib | Execution: client
import type { PdfOperation } from '../types';

export interface WatermarkEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getWatermarkConfig(): WatermarkEngineConfig {
  return {
    operation: 'watermark',
    engine: 'pdf-lib',
    execution: 'client',
    description: 'Tambah watermark teks/gambar',
    defaultOptions: {
      text: 'CONFIDENTIAL',
      opacity: 30,
      fontSize: 48
    },
  };
}
