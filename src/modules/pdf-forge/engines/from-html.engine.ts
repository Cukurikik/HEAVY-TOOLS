// Engine: Puppeteer | Execution: server
import type { PdfOperation } from '../types';

export interface FromHtmlEngineConfig {
  operation: PdfOperation;
  engine: string;
  execution: 'server';
  description: string;
  defaultOptions: Record<string, unknown>;
}

export function getFromHtmlConfig(): FromHtmlEngineConfig {
  return {
    operation: 'from-html',
    engine: 'Puppeteer',
    execution: 'server',
    description: 'Konversi HTML/URL ke PDF',
    defaultOptions: {
      url: 'https://',
      paperFormat: 'A4'
    },
  };
}
