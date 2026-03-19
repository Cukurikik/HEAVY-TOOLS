// Engine: PDF.js AcroForm | Execution: client
import type { PdfOperation } from '../types';

export interface FormFillerEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'client';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getFormFillerConfig(): FormFillerEngineConfig {
  return {
    operation: 'form-fill',
    engine: 'PDF.js AcroForm',
    execution: 'client',
    description: 'Isi formulir AcroForm PDF',
    defaultOptions: {
      flattenForm: false
    },
  };
}
