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
    loadChildren: () => Promise.all([
      import('./01-image-converter/image-converter.component'),
      import('./01-image-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ImageConverterComponent,
        providers: [provideState(s.imageConverterFeature)]
      }
    ]),
    title: 'Image Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'video-converter',
    loadChildren: () => Promise.all([
      import('./02-video-converter/video-converter.component'),
      import('./02-video-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.VideoConverterComponent,
        providers: [provideState(s.videoConverterFeature)]
      }
    ]),
    title: 'Video Converter — Omni-Tool',
    data: { category: 'video' }
  },
  {
    path: 'audio-converter',
    loadChildren: () => Promise.all([
      import('./03-audio-converter/audio-converter.component'),
      import('./03-audio-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioConverterComponent,
        providers: [provideState(s.audioConverterFeature)]
      }
    ]),
    title: 'Audio Converter — Omni-Tool',
    data: { category: 'audio' }
  },
  {
    path: 'document-converter',
    loadChildren: () => Promise.all([
      import('./04-document-converter/document-converter.component'),
      import('./04-document-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.DocumentConverterComponent,
        providers: [provideState(s.documentConverterFeature)]
      }
    ]),
    title: 'Document Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'image-resizer',
    loadChildren: () => Promise.all([
      import('./05-image-resizer/image-resizer.component'),
      import('./05-image-resizer')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ImageResizerComponent,
        providers: [provideState(s.imageResizerFeature)]
      }
    ]),
    title: 'Image Resizer — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'image-compressor',
    loadChildren: () => Promise.all([
      import('./06-image-compressor/image-compressor.component'),
      import('./06-image-compressor')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ImageCompressorComponent,
        providers: [provideState(s.imageCompressorFeature)]
      }
    ]),
    title: 'Image Compressor — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'svg-converter',
    loadChildren: () => Promise.all([
      import('./07-svg-converter/svg-converter.component'),
      import('./07-svg-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.SvgConverterComponent,
        providers: [provideState(s.svgConverterFeature)]
      }
    ]),
    title: 'SVG Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'base64-encoder',
    loadChildren: () => Promise.all([
      import('./08-base64-encoder/base64-encoder.component'),
      import('./08-base64-encoder')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.Base64EncoderComponent,
        providers: [provideState(s.base64EncoderFeature)]
      }
    ]),
    title: 'Base64 Encoder — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'json-converter',
    loadChildren: () => Promise.all([
      import('./09-json-converter/json-converter.component'),
      import('./09-json-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.JsonConverterComponent,
        providers: [provideState(s.jsonConverterFeature)]
      }
    ]),
    title: 'JSON Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'csv-converter',
    loadChildren: () => Promise.all([
      import('./10-csv-converter/csv-converter.component'),
      import('./10-csv-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.CsvConverterComponent,
        providers: [provideState(s.csvConverterFeature)]
      }
    ]),
    title: 'CSV Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'markdown-converter',
    loadChildren: () => Promise.all([
      import('./11-markdown-converter/markdown-converter.component'),
      import('./11-markdown-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.MarkdownConverterComponent,
        providers: [provideState(s.markdownConverterFeature)]
      }
    ]),
    title: 'Markdown Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'html-converter',
    loadChildren: () => Promise.all([
      import('./12-html-converter/html-converter.component'),
      import('./12-html-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.HtmlConverterComponent,
        providers: [provideState(s.htmlConverterFeature)]
      }
    ]),
    title: 'HTML Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'color-converter',
    loadChildren: () => Promise.all([
      import('./13-color-converter/color-converter.component'),
      import('./13-color-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ColorConverterComponent,
        providers: [provideState(s.colorConverterFeature)]
      }
    ]),
    title: 'Color Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'unit-converter',
    loadChildren: () => Promise.all([
      import('./14-unit-converter/unit-converter.component'),
      import('./14-unit-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.UnitConverterComponent,
        providers: [provideState(s.unitConverterFeature)]
      }
    ]),
    title: 'Unit Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'currency-converter',
    loadChildren: () => Promise.all([
      import('./15-currency-converter/currency-converter.component'),
      import('./15-currency-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.CurrencyConverterComponent,
        providers: [provideState(s.currencyConverterFeature)]
      }
    ]),
    title: 'Currency Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'timezone-converter',
    loadChildren: () => Promise.all([
      import('./16-timezone-converter/timezone-converter.component'),
      import('./16-timezone-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.TimezoneConverterComponent,
        providers: [provideState(s.timezoneConverterFeature)]
      }
    ]),
    title: 'Timezone Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'number-base-converter',
    loadChildren: () => Promise.all([
      import('./17-number-base-converter/number-base-converter.component'),
      import('./17-number-base-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.NumberBaseConverterComponent,
        providers: [provideState(s.numberBaseConverterFeature)]
      }
    ]),
    title: 'Number Base Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'encoding-converter',
    loadChildren: () => Promise.all([
      import('./18-encoding-converter/encoding-converter.component'),
      import('./18-encoding-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.EncodingConverterComponent,
        providers: [provideState(s.encodingConverterFeature)]
      }
    ]),
    title: 'Encoding Converter — Omni-Tool',
    data: { category: 'text' }
  },
  {
    path: 'font-converter',
    loadChildren: () => Promise.all([
      import('./19-font-converter/font-converter.component'),
      import('./19-font-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.FontConverterComponent,
        providers: [provideState(s.fontConverterFeature)]
      }
    ]),
    title: 'Font Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'ebook-converter',
    loadChildren: () => Promise.all([
      import('./20-ebook-converter/ebook-converter.component'),
      import('./20-ebook-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.EbookConverterComponent,
        providers: [provideState(s.ebookConverterFeature)]
      }
    ]),
    title: 'Ebook Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'archive-converter',
    loadChildren: () => Promise.all([
      import('./21-archive-converter/archive-converter.component'),
      import('./21-archive-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ArchiveConverterComponent,
        providers: [provideState(s.archiveConverterFeature)]
      }
    ]),
    title: 'Archive Converter — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'cad-converter',
    loadChildren: () => Promise.all([
      import('./22-cad-converter/cad-converter.component'),
      import('./22-cad-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.CadConverterComponent,
        providers: [provideState(s.cadConverterFeature)]
      }
    ]),
    title: 'CAD Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'subtitle-converter',
    loadChildren: () => Promise.all([
      import('./23-subtitle-converter/subtitle-converter.component'),
      import('./23-subtitle-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.SubtitleConverterComponent,
        providers: [provideState(s.subtitleConverterFeature)]
      }
    ]),
    title: 'Subtitle Converter — Omni-Tool',
    data: { category: 'video' }
  },
  {
    path: 'spreadsheet-converter',
    loadChildren: () => Promise.all([
      import('./24-spreadsheet-converter/spreadsheet-converter.component'),
      import('./24-spreadsheet-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.SpreadsheetConverterComponent,
        providers: [provideState(s.spreadsheetConverterFeature)]
      }
    ]),
    title: 'Spreadsheet Converter — Omni-Tool',
    data: { category: 'document' }
  },
  {
    path: 'qr-generator',
    loadChildren: () => Promise.all([
      import('./25-qr-generator/qr-generator.component'),
      import('./25-qr-generator')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.QrGeneratorComponent,
        providers: [provideState(s.qrGeneratorFeature)]
      }
    ]),
    title: 'QR Code Generator — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'barcode-generator',
    loadChildren: () => Promise.all([
      import('./26-barcode-generator/barcode-generator.component'),
      import('./26-barcode-generator')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.BarcodeGeneratorComponent,
        providers: [provideState(s.barcodeGeneratorFeature)]
      }
    ]),
    title: 'Barcode Generator — Omni-Tool',
    data: { category: 'utility' }
  },
  {
    path: 'ico-converter',
    loadChildren: () => Promise.all([
      import('./27-ico-converter/ico-converter.component'),
      import('./27-ico-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.IcoConverterComponent,
        providers: [provideState(s.icoConverterFeature)]
      }
    ]),
    title: 'ICO / Favicon Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'gif-converter',
    loadChildren: () => Promise.all([
      import('./28-gif-converter/gif-converter.component'),
      import('./28-gif-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.GifConverterComponent,
        providers: [provideState(s.gifConverterFeature)]
      }
    ]),
    title: 'GIF Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'raw-image-converter',
    loadChildren: () => Promise.all([
      import('./29-raw-image-converter/raw-image-converter.component'),
      import('./29-raw-image-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.RawImageConverterComponent,
        providers: [provideState(s.rawImageConverterFeature)]
      }
    ]),
    title: 'RAW Image Converter — Omni-Tool',
    data: { category: 'image' }
  },
  {
    path: 'batch-converter',
    loadChildren: () => Promise.all([
      import('./30-batch-converter/batch-converter.component'),
      import('./30-batch-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.BatchConverterComponent,
        providers: [provideState(s.batchConverterFeature)]
      }
    ]),
    title: 'Batch Converter — Omni-Tool',
    data: { category: 'utility' }
  }
];

