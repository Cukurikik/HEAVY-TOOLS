import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';

export const PDF_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pdf.component').then(m => m.PdfComponent),
    title: 'PDF Engine — Omni-Tool'
  },
  { 
    path: 'merger', 
    loadChildren: () => Promise.all([
      import('./01-merger'),
      import('./01-merger')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.MergerComponent,
        providers: [provideState(s.mergerFeature)]
      }
    ]),
    title: 'PDF Merger — Omni-Tool'
  },
  { 
    path: 'splitter', 
    loadChildren: () => Promise.all([
      import('./02-splitter'),
      import('./02-splitter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.SplitterComponent,
        providers: [provideState(s.splitterFeature)]
      }
    ]),
    title: 'PDF Splitter — Omni-Tool'
  },
  { 
    path: 'compressor', 
    loadChildren: () => Promise.all([
      import('./03-compressor'),
      import('./03-compressor')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.CompressorComponent,
        providers: [provideState(s.compressorFeature)]
      }
    ]),
    title: 'PDF Compressor — Omni-Tool'
  },
  { 
    path: 'converter', 
    loadChildren: () => Promise.all([
      import('./04-converter'),
      import('./04-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ConverterComponent,
        providers: [provideState(s.converterFeature)]
      }
    ]),
    title: 'PDF Converter — Omni-Tool'
  },
  { 
    path: 'ocr', 
    loadChildren: () => Promise.all([
      import('./05-ocr'),
      import('./05-ocr')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.OcrComponent,
        providers: [provideState(s.ocrFeature)]
      }
    ]),
    title: 'PDF OCR — Omni-Tool'
  },
  { 
    path: 'watermark', 
    loadChildren: () => Promise.all([
      import('./06-watermark'),
      import('./06-watermark')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.WatermarkComponent,
        providers: [provideState(s.watermarkFeature)]
      }
    ]),
    title: 'PDF Watermark — Omni-Tool'
  },
  { 
    path: 'passwordProtector', 
    loadChildren: () => Promise.all([
      import('./07-password-protector'),
      import('./07-password-protector')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.PasswordProtectorComponent,
        providers: [provideState(s.passwordProtectorFeature)]
      }
    ]),
    title: 'PDF Password Protector — Omni-Tool'
  },
  { 
    path: 'unlocker', 
    loadChildren: () => Promise.all([
      import('./08-unlocker'),
      import('./08-unlocker')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.UnlockerComponent,
        providers: [provideState(s.unlockerFeature)]
      }
    ]),
    title: 'PDF Unlocker — Omni-Tool'
  },
  { 
    path: 'rotator', 
    loadChildren: () => Promise.all([
      import('./09-rotator'),
      import('./09-rotator')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.RotatorComponent,
        providers: [provideState(s.rotatorFeature)]
      }
    ]),
    title: 'PDF Rotator — Omni-Tool'
  },
  { 
    path: 'cropResize', 
    loadChildren: () => Promise.all([
      import('./10-crop-resize'),
      import('./10-crop-resize')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.CropResizeComponent,
        providers: [provideState(s.cropResizeFeature)]
      }
    ]),
    title: 'PDF Crop & Resize — Omni-Tool'
  },
  { 
    path: 'imageExtractor', 
    loadChildren: () => Promise.all([
      import('./11-image-extractor'),
      import('./11-image-extractor')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ImageExtractorComponent,
        providers: [provideState(s.imageExtractorFeature)]
      }
    ]),
    title: 'PDF Image Extractor — Omni-Tool'
  },
  { 
    path: 'textExtractor', 
    loadChildren: () => Promise.all([
      import('./12-text-extractor'),
      import('./12-text-extractor')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.TextExtractorComponent,
        providers: [provideState(s.textExtractorFeature)]
      }
    ]),
    title: 'PDF Text Extractor — Omni-Tool'
  },
  { 
    path: 'metadataEditor', 
    loadChildren: () => Promise.all([
      import('./13-metadata-editor'),
      import('./13-metadata-editor')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.MetadataEditorComponent,
        providers: [provideState(s.metadataEditorFeature)]
      }
    ]),
    title: 'PDF Metadata Editor — Omni-Tool'
  },
  { 
    path: 'digitalSigner', 
    loadChildren: () => Promise.all([
      import('./14-digital-signer'),
      import('./14-digital-signer')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.DigitalSignerComponent,
        providers: [provideState(s.digitalSignerFeature)]
      }
    ]),
    title: 'PDF Digital Signer — Omni-Tool'
  },
  { 
    path: 'redactor', 
    loadChildren: () => Promise.all([
      import('./15-redactor'),
      import('./15-redactor')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.RedactorComponent,
        providers: [provideState(s.redactorFeature)]
      }
    ]),
    title: 'PDF Redactor — Omni-Tool'
  },
  { 
    path: 'annotator', 
    loadChildren: () => Promise.all([
      import('./16-annotator'),
      import('./16-annotator')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AnnotatorComponent,
        providers: [provideState(s.annotatorFeature)]
      }
    ]),
    title: 'PDF Annotator — Omni-Tool'
  },
  { 
    path: 'formFiller', 
    loadChildren: () => Promise.all([
      import('./17-form-filler'),
      import('./17-form-filler')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.FormFillerComponent,
        providers: [provideState(s.formFillerFeature)]
      }
    ]),
    title: 'PDF Form Filler — Omni-Tool'
  },
  { 
    path: 'pageReorderer', 
    loadChildren: () => Promise.all([
      import('./18-page-reorderer'),
      import('./18-page-reorderer')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.PageReordererComponent,
        providers: [provideState(s.pageReordererFeature)]
      }
    ]),
    title: 'PDF Page Reorderer — Omni-Tool'
  },
  { 
    path: 'thumbnailGenerator', 
    loadChildren: () => Promise.all([
      import('./19-thumbnail-generator'),
      import('./19-thumbnail-generator')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ThumbnailGeneratorComponent,
        providers: [provideState(s.thumbnailGeneratorFeature)]
      }
    ]),
    title: 'PDF Thumbnail Generator — Omni-Tool'
  },
  { 
    path: 'compare', 
    loadChildren: () => Promise.all([
      import('./20-compare'),
      import('./20-compare')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.CompareComponent,
        providers: [provideState(s.compareFeature)]
      }
    ]),
    title: 'PDF Compare — Omni-Tool'
  },
  { 
    path: 'toWord', 
    loadChildren: () => Promise.all([
      import('./21-to-word'),
      import('./21-to-word')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ToWordComponent,
        providers: [provideState(s.toWordFeature)]
      }
    ]),
    title: 'PDF to Word — Omni-Tool'
  },
  { 
    path: 'toExcel', 
    loadChildren: () => Promise.all([
      import('./22-to-excel'),
      import('./22-to-excel')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ToExcelComponent,
        providers: [provideState(s.toExcelFeature)]
      }
    ]),
    title: 'PDF to Excel — Omni-Tool'
  },
  { 
    path: 'toPowerpoint', 
    loadChildren: () => Promise.all([
      import('./23-to-powerpoint'),
      import('./23-to-powerpoint')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ToPowerpointComponent,
        providers: [provideState(s.toPowerpointFeature)]
      }
    ]),
    title: 'PDF to Powerpoint — Omni-Tool'
  },
  { 
    path: 'toHtml', 
    loadChildren: () => Promise.all([
      import('./24-to-html'),
      import('./24-to-html')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ToHtmlComponent,
        providers: [provideState(s.toHtmlFeature)]
      }
    ]),
    title: 'PDF to HTML — Omni-Tool'
  },
  { 
    path: 'toImageBatch', 
    loadChildren: () => Promise.all([
      import('./25-to-image-batch'),
      import('./25-to-image-batch')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ToImageBatchComponent,
        providers: [provideState(s.toImageBatchFeature)]
      }
    ]),
    title: 'PDF to Image Batch — Omni-Tool'
  },
  { 
    path: 'repair', 
    loadChildren: () => Promise.all([
      import('./26-repair'),
      import('./26-repair')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.RepairComponent,
        providers: [provideState(s.repairFeature)]
      }
    ]),
    title: 'PDF Repair — Omni-Tool'
  },
  { 
    path: 'flattener', 
    loadChildren: () => Promise.all([
      import('./27-flattener'),
      import('./27-flattener')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.FlattenerComponent,
        providers: [provideState(s.flattenerFeature)]
      }
    ]),
    title: 'PDF Flattener — Omni-Tool'
  },
  { 
    path: 'optimizer', 
    loadChildren: () => Promise.all([
      import('./28-optimizer'),
      import('./28-optimizer')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.OptimizerComponent,
        providers: [provideState(s.optimizerFeature)]
      }
    ]),
    title: 'PDF Optimizer — Omni-Tool'
  },
  { 
    path: 'bookmarkEditor', 
    loadChildren: () => Promise.all([
      import('./29-bookmark-editor'),
      import('./29-bookmark-editor')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.BookmarkEditorComponent,
        providers: [provideState(s.bookmarkEditorFeature)]
      }
    ]),
    title: 'PDF Bookmark Editor — Omni-Tool'
  },
  { 
    path: 'batchProcessor', 
    loadChildren: () => Promise.all([
      import('./30-batch-processor'),
      import('./30-batch-processor')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.BatchProcessorComponent,
        providers: [provideState(s.batchProcessorFeature)]
      }
    ]),
    title: 'PDF Batch Processor — Omni-Tool'
  }
];

