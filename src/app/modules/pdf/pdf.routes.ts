import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { mergerFeature } from './01-merger';
import { splitterFeature } from './02-splitter';
import { compressorFeature } from './03-compressor';
import { converterFeature } from './04-converter';
import { ocrFeature } from './05-ocr';
import { watermarkFeature } from './06-watermark';
import { passwordProtectorFeature } from './07-password-protector';
import { unlockerFeature } from './08-unlocker';
import { rotatorFeature } from './09-rotator';
import { cropResizeFeature } from './10-crop-resize';
import { imageExtractorFeature } from './11-image-extractor';
import { textExtractorFeature } from './12-text-extractor';
import { metadataEditorFeature } from './13-metadata-editor';
import { digitalSignerFeature } from './14-digital-signer';
import { redactorFeature } from './15-redactor';
import { annotatorFeature } from './16-annotator';
import { formFillerFeature } from './17-form-filler';
import { pageReordererFeature } from './18-page-reorderer';
import { thumbnailGeneratorFeature } from './19-thumbnail-generator';
import { compareFeature } from './20-compare';
import { toWordFeature } from './21-to-word';
import { toExcelFeature } from './22-to-excel';
import { toPowerpointFeature } from './23-to-powerpoint';
import { toHtmlFeature } from './24-to-html';
import { toImageBatchFeature } from './25-to-image-batch';
import { repairFeature } from './26-repair';
import { flattenerFeature } from './27-flattener';
import { optimizerFeature } from './28-optimizer';
import { bookmarkEditorFeature } from './29-bookmark-editor';
import { batchProcessorFeature } from './30-batch-processor';

export const PDF_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pdf.component').then(m => m.PdfComponent),
    title: 'PDF Engine — Omni-Tool'
  },
  { 
    path: 'merger', 
    loadComponent: () => import('./01-merger').then(m => m.MergerComponent),
    providers: [provideState(mergerFeature)],
    title: 'PDF Merger — Omni-Tool'
  },
  { 
    path: 'splitter', 
    loadComponent: () => import('./02-splitter').then(m => m.SplitterComponent),
    providers: [provideState(splitterFeature)],
    title: 'PDF Splitter — Omni-Tool'
  },
  { 
    path: 'compressor', 
    loadComponent: () => import('./03-compressor').then(m => m.CompressorComponent),
    providers: [provideState(compressorFeature)],
    title: 'PDF Compressor — Omni-Tool'
  },
  { 
    path: 'converter', 
    loadComponent: () => import('./04-converter').then(m => m.ConverterComponent),
    providers: [provideState(converterFeature)],
    title: 'PDF Converter — Omni-Tool'
  },
  { 
    path: 'ocr', 
    loadComponent: () => import('./05-ocr').then(m => m.OcrComponent),
    providers: [provideState(ocrFeature)],
    title: 'PDF OCR — Omni-Tool'
  },
  { 
    path: 'watermark', 
    loadComponent: () => import('./06-watermark').then(m => m.WatermarkComponent),
    providers: [provideState(watermarkFeature)],
    title: 'PDF Watermark — Omni-Tool'
  },
  { 
    path: 'passwordProtector', 
    loadComponent: () => import('./07-password-protector').then(m => m.PasswordProtectorComponent),
    providers: [provideState(passwordProtectorFeature)],
    title: 'PDF Password Protector — Omni-Tool'
  },
  { 
    path: 'unlocker', 
    loadComponent: () => import('./08-unlocker').then(m => m.UnlockerComponent),
    providers: [provideState(unlockerFeature)],
    title: 'PDF Unlocker — Omni-Tool'
  },
  { 
    path: 'rotator', 
    loadComponent: () => import('./09-rotator').then(m => m.RotatorComponent),
    providers: [provideState(rotatorFeature)],
    title: 'PDF Rotator — Omni-Tool'
  },
  { 
    path: 'cropResize', 
    loadComponent: () => import('./10-crop-resize').then(m => m.CropResizeComponent),
    providers: [provideState(cropResizeFeature)],
    title: 'PDF Crop & Resize — Omni-Tool'
  },
  { 
    path: 'imageExtractor', 
    loadComponent: () => import('./11-image-extractor').then(m => m.ImageExtractorComponent),
    providers: [provideState(imageExtractorFeature)],
    title: 'PDF Image Extractor — Omni-Tool'
  },
  { 
    path: 'textExtractor', 
    loadComponent: () => import('./12-text-extractor').then(m => m.TextExtractorComponent),
    providers: [provideState(textExtractorFeature)],
    title: 'PDF Text Extractor — Omni-Tool'
  },
  { 
    path: 'metadataEditor', 
    loadComponent: () => import('./13-metadata-editor').then(m => m.MetadataEditorComponent),
    providers: [provideState(metadataEditorFeature)],
    title: 'PDF Metadata Editor — Omni-Tool'
  },
  { 
    path: 'digitalSigner', 
    loadComponent: () => import('./14-digital-signer').then(m => m.DigitalSignerComponent),
    providers: [provideState(digitalSignerFeature)],
    title: 'PDF Digital Signer — Omni-Tool'
  },
  { 
    path: 'redactor', 
    loadComponent: () => import('./15-redactor').then(m => m.RedactorComponent),
    providers: [provideState(redactorFeature)],
    title: 'PDF Redactor — Omni-Tool'
  },
  { 
    path: 'annotator', 
    loadComponent: () => import('./16-annotator').then(m => m.AnnotatorComponent),
    providers: [provideState(annotatorFeature)],
    title: 'PDF Annotator — Omni-Tool'
  },
  { 
    path: 'formFiller', 
    loadComponent: () => import('./17-form-filler').then(m => m.FormFillerComponent),
    providers: [provideState(formFillerFeature)],
    title: 'PDF Form Filler — Omni-Tool'
  },
  { 
    path: 'pageReorderer', 
    loadComponent: () => import('./18-page-reorderer').then(m => m.PageReordererComponent),
    providers: [provideState(pageReordererFeature)],
    title: 'PDF Page Reorderer — Omni-Tool'
  },
  { 
    path: 'thumbnailGenerator', 
    loadComponent: () => import('./19-thumbnail-generator').then(m => m.ThumbnailGeneratorComponent),
    providers: [provideState(thumbnailGeneratorFeature)],
    title: 'PDF Thumbnail Generator — Omni-Tool'
  },
  { 
    path: 'compare', 
    loadComponent: () => import('./20-compare').then(m => m.CompareComponent),
    providers: [provideState(compareFeature)],
    title: 'PDF Compare — Omni-Tool'
  },
  { 
    path: 'toWord', 
    loadComponent: () => import('./21-to-word').then(m => m.ToWordComponent),
    providers: [provideState(toWordFeature)],
    title: 'PDF to Word — Omni-Tool'
  },
  { 
    path: 'toExcel', 
    loadComponent: () => import('./22-to-excel').then(m => m.ToExcelComponent),
    providers: [provideState(toExcelFeature)],
    title: 'PDF to Excel — Omni-Tool'
  },
  { 
    path: 'toPowerpoint', 
    loadComponent: () => import('./23-to-powerpoint').then(m => m.ToPowerpointComponent),
    providers: [provideState(toPowerpointFeature)],
    title: 'PDF to Powerpoint — Omni-Tool'
  },
  { 
    path: 'toHtml', 
    loadComponent: () => import('./24-to-html').then(m => m.ToHtmlComponent),
    providers: [provideState(toHtmlFeature)],
    title: 'PDF to HTML — Omni-Tool'
  },
  { 
    path: 'toImageBatch', 
    loadComponent: () => import('./25-to-image-batch').then(m => m.ToImageBatchComponent),
    providers: [provideState(toImageBatchFeature)],
    title: 'PDF to Image Batch — Omni-Tool'
  },
  { 
    path: 'repair', 
    loadComponent: () => import('./26-repair').then(m => m.RepairComponent),
    providers: [provideState(repairFeature)],
    title: 'PDF Repair — Omni-Tool'
  },
  { 
    path: 'flattener', 
    loadComponent: () => import('./27-flattener').then(m => m.FlattenerComponent),
    providers: [provideState(flattenerFeature)],
    title: 'PDF Flattener — Omni-Tool'
  },
  { 
    path: 'optimizer', 
    loadComponent: () => import('./28-optimizer').then(m => m.OptimizerComponent),
    providers: [provideState(optimizerFeature)],
    title: 'PDF Optimizer — Omni-Tool'
  },
  { 
    path: 'bookmarkEditor', 
    loadComponent: () => import('./29-bookmark-editor').then(m => m.BookmarkEditorComponent),
    providers: [provideState(bookmarkEditorFeature)],
    title: 'PDF Bookmark Editor — Omni-Tool'
  },
  { 
    path: 'batchProcessor', 
    loadComponent: () => import('./30-batch-processor').then(m => m.BatchProcessorComponent),
    providers: [provideState(batchProcessorFeature)],
    title: 'PDF Batch Processor — Omni-Tool'
  }
];

