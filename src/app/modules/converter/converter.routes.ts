// ============================================================
// CONVERTER ROUTES — All 30 features registered
// File: src/app/modules/converter/converter.routes.ts
// ============================================================

import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';

export const CONVERTER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./converter.component').then(m => m.ConverterComponent),
    title: 'Universal Converter — Omni-Tool'
  },
  {
    path: 'image-converter',
    loadComponent: () => import('./01-image-converter/image-converter.component').then(m => m.ImageConverterComponent),
    providers: [provideState(import('./01-image-converter').then(m => m.imageConverterFeature))],
    title: 'Image Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'video-converter',
    loadComponent: () => import('./02-video-converter/video-converter.component').then(m => m.VideoConverterComponent),
    providers: [provideState(import('./02-video-converter').then(m => m.videoConverterFeature))],
    title: 'Video Converter — Omni-Tool',
    data: { category: 'video' }
  },
  {
    path: 'audio-converter',
    loadComponent: () => import('./03-audio-converter/audio-converter.component').then(m => m.AudioConverterComponent),
    providers: [provideState(import('./03-audio-converter').then(m => m.audioConverterFeature))],
    title: 'Audio Converter — Omni-Tool',
    data: { category: 'audio' }
  },
  {
    path: 'document-converter',
    loadComponent: () => import('./04-document-converter/document-converter.component').then(m => m.DocumentConverterComponent),
    providers: [provideState(import('./04-document-converter').then(m => m.documentConverterFeature))],
    title: 'Document Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'image-resizer',
    loadComponent: () => import('./05-image-resizer/image-resizer.component').then(m => m.ImageResizerComponent),
    providers: [provideState(import('./05-image-resizer').then(m => m.imageResizerFeature))],
    title: 'Image Resizer — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'image-compressor',
    loadComponent: () => import('./06-image-compressor/image-compressor.component').then(m => m.ImageCompressorComponent),
    providers: [provideState(import('./06-image-compressor').then(m => m.imageCompressorFeature))],
    title: 'Image Compressor — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'svg-converter',
    loadComponent: () => import('./07-svg-converter/svg-converter.component').then(m => m.SvgConverterComponent),
    providers: [provideState(import('./07-svg-converter').then(m => m.svgConverterFeature))],
    title: 'SVG Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'base64-encoder',
    loadComponent: () => import('./08-base64-encoder/base64-encoder.component').then(m => m.Base64EncoderComponent),
    providers: [provideState(import('./08-base64-encoder').then(m => m.base64EncoderFeature))],
    title: 'Base64 Encoder — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'json-converter',
    loadComponent: () => import('./09-json-converter/json-converter.component').then(m => m.JsonConverterComponent),
    providers: [provideState(import('./09-json-converter').then(m => m.jsonConverterFeature))],
    title: 'JSON Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'csv-converter',
    loadComponent: () => import('./10-csv-converter/csv-converter.component').then(m => m.CsvConverterComponent),
    providers: [provideState(import('./10-csv-converter').then(m => m.csvConverterFeature))],
    title: 'CSV Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'markdown-converter',
    loadComponent: () => import('./11-markdown-converter/markdown-converter.component').then(m => m.MarkdownConverterComponent),
    providers: [provideState(import('./11-markdown-converter').then(m => m.markdownConverterFeature))],
    title: 'Markdown Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'html-converter',
    loadComponent: () => import('./12-html-converter/html-converter.component').then(m => m.HtmlConverterComponent),
    providers: [provideState(import('./12-html-converter').then(m => m.htmlConverterFeature))],
    title: 'HTML Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'color-converter',
    loadComponent: () => import('./13-color-converter/color-converter.component').then(m => m.ColorConverterComponent),
    providers: [provideState(import('./13-color-converter').then(m => m.colorConverterFeature))],
    title: 'Color Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'unit-converter',
    loadComponent: () => import('./14-unit-converter/unit-converter.component').then(m => m.UnitConverterComponent),
    providers: [provideState(import('./14-unit-converter').then(m => m.unitConverterFeature))],
    title: 'Unit Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'currency-converter',
    loadComponent: () => import('./15-currency-converter/currency-converter.component').then(m => m.CurrencyConverterComponent),
    providers: [provideState(import('./15-currency-converter').then(m => m.currencyConverterFeature))],
    title: 'Currency Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'timezone-converter',
    loadComponent: () => import('./16-timezone-converter/timezone-converter.component').then(m => m.TimezoneConverterComponent),
    providers: [provideState(import('./16-timezone-converter').then(m => m.timezoneConverterFeature))],
    title: 'Timezone Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'number-base-converter',
    loadComponent: () => import('./17-number-base-converter/number-base-converter.component').then(m => m.NumberBaseConverterComponent),
    providers: [provideState(import('./17-number-base-converter').then(m => m.numberBaseConverterFeature))],
    title: 'Number Base Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'encoding-converter',
    loadComponent: () => import('./18-encoding-converter/encoding-converter.component').then(m => m.EncodingConverterComponent),
    providers: [provideState(import('./18-encoding-converter').then(m => m.encodingConverterFeature))],
    title: 'Encoding Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'font-converter',
    loadComponent: () => import('./19-font-converter/font-converter.component').then(m => m.FontConverterComponent),
    providers: [provideState(import('./19-font-converter').then(m => m.fontConverterFeature))],
    title: 'Font Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'ebook-converter',
    loadComponent: () => import('./20-ebook-converter/ebook-converter.component').then(m => m.EbookConverterComponent),
    providers: [provideState(import('./20-ebook-converter').then(m => m.ebookConverterFeature))],
    title: 'Ebook Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'archive-converter',
    loadComponent: () => import('./21-archive-converter/archive-converter.component').then(m => m.ArchiveConverterComponent),
    providers: [provideState(import('./21-archive-converter').then(m => m.archiveConverterFeature))],
    title: 'Archive Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'cad-converter',
    loadComponent: () => import('./22-cad-converter/cad-converter.component').then(m => m.CadConverterComponent),
    providers: [provideState(import('./22-cad-converter').then(m => m.cadConverterFeature))],
    title: 'CAD Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'subtitle-converter',
    loadComponent: () => import('./23-subtitle-converter/subtitle-converter.component').then(m => m.SubtitleConverterComponent),
    providers: [provideState(import('./23-subtitle-converter').then(m => m.subtitleConverterFeature))],
    title: 'Subtitle Converter — Omni-Tool',
    data: { category: 'video' }
  },
  {
    path: 'spreadsheet-converter',
    loadComponent: () => import('./24-spreadsheet-converter/spreadsheet-converter.component').then(m => m.SpreadsheetConverterComponent),
    providers: [provideState(import('./24-spreadsheet-converter').then(m => m.spreadsheetConverterFeature))],
    title: 'Spreadsheet Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'qr-generator',
    loadComponent: () => import('./25-qr-generator/qr-generator.component').then(m => m.QrGeneratorComponent),
    providers: [provideState(import('./25-qr-generator').then(m => m.qrGeneratorFeature))],
    title: 'QR Code Generator — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'barcode-generator',
    loadComponent: () => import('./26-barcode-generator/barcode-generator.component').then(m => m.BarcodeGeneratorComponent),
    providers: [provideState(import('./26-barcode-generator').then(m => m.barcodeGeneratorFeature))],
    title: 'Barcode Generator — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'ico-converter',
    loadComponent: () => import('./27-ico-converter/ico-converter.component').then(m => m.IcoConverterComponent),
    providers: [provideState(import('./27-ico-converter').then(m => m.icoConverterFeature))],
    title: 'ICO / Favicon Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'gif-converter',
    loadComponent: () => import('./28-gif-converter/gif-converter.component').then(m => m.GifConverterComponent),
    providers: [provideState(import('./28-gif-converter').then(m => m.gifConverterFeature))],
    title: 'GIF Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'raw-image-converter',
    loadComponent: () => import('./29-raw-image-converter/raw-image-converter.component').then(m => m.RawImageConverterComponent),
    providers: [provideState(import('./29-raw-image-converter').then(m => m.rawImageConverterFeature))],
    title: 'RAW Image Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'batch-converter',
    loadComponent: () => import('./30-batch-converter/batch-converter.component').then(m => m.BatchConverterComponent),
    providers: [provideState(import('./30-batch-converter').then(m => m.batchConverterFeature))],
    title: 'Batch Converter — Omni-Tool',
    data: { category: 'utility' }
  }
];

