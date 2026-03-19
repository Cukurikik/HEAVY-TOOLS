// Engine: Tesseract.js | Execution: client
import type { PdfOperation } from '../types';

export interface OcrEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getOcrConfig(): OcrEngineConfig {
  return {
    operation: 'ocr',
    engine: 'Tesseract.js',
    execution: 'client',
    description: 'Ekstrak teks via Tesseract WASM',
    defaultOptions: {
      language: 'eng'
    },
  };
}
