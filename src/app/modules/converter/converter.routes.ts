// ============================================================
// CONVERTER ROUTES — All 30 features registered
// File: src/app/modules/converter/converter.routes.ts
// ============================================================

import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { imageConverterFeature } from './01-image-converter/image-converter.store';
import { videoConverterFeature } from './02-video-converter/video-converter.store';
import { audioConverterFeature } from './03-audio-converter/audio-converter.store';
import { documentConverterFeature } from './04-document-converter/document-converter.store';
import { imageResizerFeature } from './05-image-resizer/image-resizer.store';
import { imageCompressorFeature } from './06-image-compressor/image-compressor.store';
import { svgConverterFeature } from './07-svg-converter/svg-converter.store';
import { base64EncoderFeature } from './08-base64-encoder/base64-encoder.store';
import { jsonConverterFeature } from './09-json-converter/json-converter.store';
import { csvConverterFeature } from './10-csv-converter/csv-converter.store';
import { markdownConverterFeature } from './11-markdown-converter/markdown-converter.store';
import { htmlConverterFeature } from './12-html-converter/html-converter.store';
import { colorConverterFeature } from './13-color-converter/color-converter.store';
import { unitConverterFeature } from './14-unit-converter/unit-converter.store';
import { currencyConverterFeature } from './15-currency-converter/currency-converter.store';
import { timezoneConverterFeature } from './16-timezone-converter/timezone-converter.store';
import { numberBaseConverterFeature } from './17-number-base-converter/number-base-converter.store';
import { encodingConverterFeature } from './18-encoding-converter/encoding-converter.store';
import { fontConverterFeature } from './19-font-converter/font-converter.store';
import { ebookConverterFeature } from './20-ebook-converter/ebook-converter.store';
import { archiveConverterFeature } from './21-archive-converter/archive-converter.store';
import { cadConverterFeature } from './22-cad-converter/cad-converter.store';
import { subtitleConverterFeature } from './23-subtitle-converter/subtitle-converter.store';
import { spreadsheetConverterFeature } from './24-spreadsheet-converter/spreadsheet-converter.store';
import { qrGeneratorFeature } from './25-qr-generator/qr-generator.store';
import { barcodeGeneratorFeature } from './26-barcode-generator/barcode-generator.store';
import { icoConverterFeature } from './27-ico-converter/ico-converter.store';
import { gifConverterFeature } from './28-gif-converter/gif-converter.store';
import { rawImageConverterFeature } from './29-raw-image-converter/raw-image-converter.store';
import { batchConverterFeature } from './30-batch-converter/batch-converter.store';





export const CONVERTER_ROUTES: Routes = [
  {
    path: 'image-converter',
    loadComponent: () => import('./01-image-converter/image-converter.component').then(m => m.ImageConverterComponent),
    providers: [provideState(imageConverterFeature)],
    title: 'Image Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'video-converter',
    loadComponent: () => import('./02-video-converter/video-converter.component').then(m => m.VideoConverterComponent),
    providers: [provideState(videoConverterFeature)],
    title: 'Video Converter — Omni-Tool',
    data: { category: 'video' }
  },
  {
    path: 'audio-converter',
    loadComponent: () => import('./03-audio-converter/audio-converter.component').then(m => m.AudioConverterComponent),
    providers: [provideState(audioConverterFeature)],
    title: 'Audio Converter — Omni-Tool',
    data: { category: 'audio' }
  },
  {
    path: 'document-converter',
    loadComponent: () => import('./04-document-converter/document-converter.component').then(m => m.DocumentConverterComponent),
    providers: [provideState(documentConverterFeature)],
    title: 'Document Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'image-resizer',
    loadComponent: () => import('./05-image-resizer/image-resizer.component').then(m => m.ImageResizerComponent),
    providers: [provideState(imageResizerFeature)],
    title: 'Image Resizer — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'image-compressor',
    loadComponent: () => import('./06-image-compressor/image-compressor.component').then(m => m.ImageCompressorComponent),
    providers: [provideState(imageCompressorFeature)],
    title: 'Image Compressor — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'svg-converter',
    loadComponent: () => import('./07-svg-converter/svg-converter.component').then(m => m.SvgConverterComponent),
    providers: [provideState(svgConverterFeature)],
    title: 'SVG Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'base64-encoder',
    loadComponent: () => import('./08-base64-encoder/base64-encoder.component').then(m => m.Base64EncoderComponent),
    providers: [provideState(base64EncoderFeature)],
    title: 'Base64 Encoder — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'json-converter',
    loadComponent: () => import('./09-json-converter/json-converter.component').then(m => m.JsonConverterComponent),
    providers: [provideState(jsonConverterFeature)],
    title: 'JSON Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'csv-converter',
    loadComponent: () => import('./10-csv-converter/csv-converter.component').then(m => m.CsvConverterComponent),
    providers: [provideState(csvConverterFeature)],
    title: 'CSV Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'markdown-converter',
    loadComponent: () => import('./11-markdown-converter/markdown-converter.component').then(m => m.MarkdownConverterComponent),
    providers: [provideState(markdownConverterFeature)],
    title: 'Markdown Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'html-converter',
    loadComponent: () => import('./12-html-converter/html-converter.component').then(m => m.HtmlConverterComponent),
    providers: [provideState(htmlConverterFeature)],
    title: 'HTML Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'color-converter',
    loadComponent: () => import('./13-color-converter/color-converter.component').then(m => m.ColorConverterComponent),
    providers: [provideState(colorConverterFeature)],
    title: 'Color Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'unit-converter',
    loadComponent: () => import('./14-unit-converter/unit-converter.component').then(m => m.UnitConverterComponent),
    providers: [provideState(unitConverterFeature)],
    title: 'Unit Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'currency-converter',
    loadComponent: () => import('./15-currency-converter/currency-converter.component').then(m => m.CurrencyConverterComponent),
    providers: [provideState(currencyConverterFeature)],
    title: 'Currency Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'timezone-converter',
    loadComponent: () => import('./16-timezone-converter/timezone-converter.component').then(m => m.TimezoneConverterComponent),
    providers: [provideState(timezoneConverterFeature)],
    title: 'Timezone Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'number-base-converter',
    loadComponent: () => import('./17-number-base-converter/number-base-converter.component').then(m => m.NumberBaseConverterComponent),
    providers: [provideState(numberBaseConverterFeature)],
    title: 'Number Base Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'encoding-converter',
    loadComponent: () => import('./18-encoding-converter/encoding-converter.component').then(m => m.EncodingConverterComponent),
    providers: [provideState(encodingConverterFeature)],
    title: 'Encoding Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'font-converter',
    loadComponent: () => import('./19-font-converter/font-converter.component').then(m => m.FontConverterComponent),
    providers: [provideState(fontConverterFeature)],
    title: 'Font Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'ebook-converter',
    loadComponent: () => import('./20-ebook-converter/ebook-converter.component').then(m => m.EbookConverterComponent),
    providers: [provideState(ebookConverterFeature)],
    title: 'Ebook Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'archive-converter',
    loadComponent: () => import('./21-archive-converter/archive-converter.component').then(m => m.ArchiveConverterComponent),
    providers: [provideState(archiveConverterFeature)],
    title: 'Archive Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'cad-converter',
    loadComponent: () => import('./22-cad-converter/cad-converter.component').then(m => m.CadConverterComponent),
    providers: [provideState(cadConverterFeature)],
    title: 'CAD Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'subtitle-converter',
    loadComponent: () => import('./23-subtitle-converter/subtitle-converter.component').then(m => m.SubtitleConverterComponent),
    providers: [provideState(subtitleConverterFeature)],
    title: 'Subtitle Converter — Omni-Tool',
    data: { category: 'video' }
  },
  {
    path: 'spreadsheet-converter',
    loadComponent: () => import('./24-spreadsheet-converter/spreadsheet-converter.component').then(m => m.SpreadsheetConverterComponent),
    providers: [provideState(spreadsheetConverterFeature)],
    title: 'Spreadsheet Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'qr-generator',
    loadComponent: () => import('./25-qr-generator/qr-generator.component').then(m => m.QrGeneratorComponent),
    providers: [provideState(qrGeneratorFeature)],
    title: 'QR Code Generator — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'barcode-generator',
    loadComponent: () => import('./26-barcode-generator/barcode-generator.component').then(m => m.BarcodeGeneratorComponent),
    providers: [provideState(barcodeGeneratorFeature)],
    title: 'Barcode Generator — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'ico-converter',
    loadComponent: () => import('./27-ico-converter/ico-converter.component').then(m => m.IcoConverterComponent),
    providers: [provideState(icoConverterFeature)],
    title: 'ICO / Favicon Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'gif-converter',
    loadComponent: () => import('./28-gif-converter/gif-converter.component').then(m => m.GifConverterComponent),
    providers: [provideState(gifConverterFeature)],
    title: 'GIF Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'raw-image-converter',
    loadComponent: () => import('./29-raw-image-converter/raw-image-converter.component').then(m => m.RawImageConverterComponent),
    providers: [provideState(rawImageConverterFeature)],
    title: 'RAW Image Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'batch-converter',
    loadComponent: () => import('./30-batch-converter/batch-converter.component').then(m => m.BatchConverterComponent),
    providers: [provideState(batchConverterFeature)],
    title: 'Batch Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: '',
    loadComponent: () => import('./converter.component').then(m => m.ConverterComponent),
    pathMatch: 'full'
  }
];

