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
    loadComponent: () => import('./01-merger').then(m => m.MergerComponent),
    providers: [provideState(import('./01-merger').then(m => m.mergerFeature))],
    title: 'PDF Merger — Omni-Tool'
  },
  { 
    path: 'splitter', 
    loadComponent: () => import('./02-splitter').then(m => m.SplitterComponent),
    providers: [provideState(import('./02-splitter').then(m => m.splitterFeature))],
    title: 'PDF Splitter — Omni-Tool'
  },
  { 
    path: 'compressor', 
    loadComponent: () => import('./03-compressor').then(m => m.CompressorComponent),
    providers: [provideState(import('./03-compressor').then(m => m.compressorFeature))],
    title: 'PDF Compressor — Omni-Tool'
  },
  { 
    path: 'converter', 
    loadComponent: () => import('./04-converter').then(m => m.ConverterComponent),
    providers: [provideState(import('./04-converter').then(m => m.converterFeature))],
    title: 'PDF Converter — Omni-Tool'
  },
  { 
    path: 'ocr', 
    loadComponent: () => import('./05-ocr').then(m => m.OcrComponent),
    providers: [provideState(import('./05-ocr').then(m => m.ocrFeature))],
    title: 'PDF OCR — Omni-Tool'
  },
  { 
    path: 'watermark', 
    loadComponent: () => import('./06-watermark').then(m => m.WatermarkComponent),
    providers: [provideState(import('./06-watermark').then(m => m.watermarkFeature))],
    title: 'PDF Watermark — Omni-Tool'
  },
  { 
    path: 'passwordProtector', 
    loadComponent: () => import('./07-password-protector').then(m => m.PasswordProtectorComponent),
    providers: [provideState(import('./07-password-protector').then(m => m.passwordProtectorFeature))],
    title: 'PDF Password Protector — Omni-Tool'
  },
  { 
    path: 'unlocker', 
    loadComponent: () => import('./08-unlocker').then(m => m.UnlockerComponent),
    providers: [provideState(import('./08-unlocker').then(m => m.unlockerFeature))],
    title: 'PDF Unlocker — Omni-Tool'
  },
  { 
    path: 'rotator', 
    loadComponent: () => import('./09-rotator').then(m => m.RotatorComponent),
    providers: [provideState(import('./09-rotator').then(m => m.rotatorFeature))],
    title: 'PDF Rotator — Omni-Tool'
  },
  { 
    path: 'cropResize', 
    loadComponent: () => import('./10-crop-resize').then(m => m.CropResizeComponent),
    providers: [provideState(import('./10-crop-resize').then(m => m.cropResizeFeature))],
    title: 'PDF Crop & Resize — Omni-Tool'
  },
  { 
    path: 'imageExtractor', 
    loadComponent: () => import('./11-image-extractor').then(m => m.ImageExtractorComponent),
    providers: [provideState(import('./11-image-extractor').then(m => m.imageExtractorFeature))],
    title: 'PDF Image Extractor — Omni-Tool'
  },
  { 
    path: 'textExtractor', 
    loadComponent: () => import('./12-text-extractor').then(m => m.TextExtractorComponent),
    providers: [provideState(import('./12-text-extractor').then(m => m.textExtractorFeature))],
    title: 'PDF Text Extractor — Omni-Tool'
  },
  { 
    path: 'metadataEditor', 
    loadComponent: () => import('./13-metadata-editor').then(m => m.MetadataEditorComponent),
    providers: [provideState(import('./13-metadata-editor').then(m => m.metadataEditorFeature))],
    title: 'PDF Metadata Editor — Omni-Tool'
  },
  { 
    path: 'digitalSigner', 
    loadComponent: () => import('./14-digital-signer').then(m => m.DigitalSignerComponent),
    providers: [provideState(import('./14-digital-signer').then(m => m.digitalSignerFeature))],
    title: 'PDF Digital Signer — Omni-Tool'
  },
  { 
    path: 'redactor', 
    loadComponent: () => import('./15-redactor').then(m => m.RedactorComponent),
    providers: [provideState(import('./15-redactor').then(m => m.redactorFeature))],
    title: 'PDF Redactor — Omni-Tool'
  },
  { 
    path: 'annotator', 
    loadComponent: () => import('./16-annotator').then(m => m.AnnotatorComponent),
    providers: [provideState(import('./16-annotator').then(m => m.annotatorFeature))],
    title: 'PDF Annotator — Omni-Tool'
  },
  { 
    path: 'formFiller', 
    loadComponent: () => import('./17-form-filler').then(m => m.FormFillerComponent),
    providers: [provideState(import('./17-form-filler').then(m => m.formFillerFeature))],
    title: 'PDF Form Filler — Omni-Tool'
  },
  { 
    path: 'pageReorderer', 
    loadComponent: () => import('./18-page-reorderer').then(m => m.PageReordererComponent),
    providers: [provideState(import('./18-page-reorderer').then(m => m.pageReordererFeature))],
    title: 'PDF Page Reorderer — Omni-Tool'
  },
  { 
    path: 'thumbnailGenerator', 
    loadComponent: () => import('./19-thumbnail-generator').then(m => m.ThumbnailGeneratorComponent),
    providers: [provideState(import('./19-thumbnail-generator').then(m => m.thumbnailGeneratorFeature))],
    title: 'PDF Thumbnail Generator — Omni-Tool'
  },
  { 
    path: 'compare', 
    loadComponent: () => import('./20-compare').then(m => m.CompareComponent),
    providers: [provideState(import('./20-compare').then(m => m.compareFeature))],
    title: 'PDF Compare — Omni-Tool'
  },
  { 
    path: 'toWord', 
    loadComponent: () => import('./21-to-word').then(m => m.ToWordComponent),
    providers: [provideState(import('./21-to-word').then(m => m.toWordFeature))],
    title: 'PDF to Word — Omni-Tool'
  },
  { 
    path: 'toExcel', 
    loadComponent: () => import('./22-to-excel').then(m => m.ToExcelComponent),
    providers: [provideState(import('./22-to-excel').then(m => m.toExcelFeature))],
    title: 'PDF to Excel — Omni-Tool'
  },
  { 
    path: 'toPowerpoint', 
    loadComponent: () => import('./23-to-powerpoint').then(m => m.ToPowerpointComponent),
    providers: [provideState(import('./23-to-powerpoint').then(m => m.toPowerpointFeature))],
    title: 'PDF to Powerpoint — Omni-Tool'
  },
  { 
    path: 'toHtml', 
    loadComponent: () => import('./24-to-html').then(m => m.ToHtmlComponent),
    providers: [provideState(import('./24-to-html').then(m => m.toHtmlFeature))],
    title: 'PDF to HTML — Omni-Tool'
  },
  { 
    path: 'toImageBatch', 
    loadComponent: () => import('./25-to-image-batch').then(m => m.ToImageBatchComponent),
    providers: [provideState(import('./25-to-image-batch').then(m => m.toImageBatchFeature))],
    title: 'PDF to Image Batch — Omni-Tool'
  },
  { 
    path: 'repair', 
    loadComponent: () => import('./26-repair').then(m => m.RepairComponent),
    providers: [provideState(import('./26-repair').then(m => m.repairFeature))],
    title: 'PDF Repair — Omni-Tool'
  },
  { 
    path: 'flattener', 
    loadComponent: () => import('./27-flattener').then(m => m.FlattenerComponent),
    providers: [provideState(import('./27-flattener').then(m => m.flattenerFeature))],
    title: 'PDF Flattener — Omni-Tool'
  },
  { 
    path: 'optimizer', 
    loadComponent: () => import('./28-optimizer').then(m => m.OptimizerComponent),
    providers: [provideState(import('./28-optimizer').then(m => m.optimizerFeature))],
    title: 'PDF Optimizer — Omni-Tool'
  },
  { 
    path: 'bookmarkEditor', 
    loadComponent: () => import('./29-bookmark-editor').then(m => m.BookmarkEditorComponent),
    providers: [provideState(import('./29-bookmark-editor').then(m => m.bookmarkEditorFeature))],
    title: 'PDF Bookmark Editor — Omni-Tool'
  },
  { 
    path: 'batchProcessor', 
    loadComponent: () => import('./30-batch-processor').then(m => m.BatchProcessorComponent),
    providers: [provideState(import('./30-batch-processor').then(m => m.batchProcessorFeature))],
    title: 'PDF Batch Processor — Omni-Tool'
  }
];

