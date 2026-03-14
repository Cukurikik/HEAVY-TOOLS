import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-UFAUNXOA.mjs";

// src/app/modules/pdf/pdf.routes.ts
var PDF_ROUTES = [
  __spreadValues({ path: "merger", loadComponent: () => import("./chunk-33ZFSFFW.mjs").then((m) => m.MergerComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/01-merger/index.ts" } : {}),
  __spreadValues({ path: "splitter", loadComponent: () => import("./chunk-E5DMCTDO.mjs").then((m) => m.SplitterComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/02-splitter/index.ts" } : {}),
  __spreadValues({ path: "compressor", loadComponent: () => import("./chunk-4KIV4IVV.mjs").then((m) => m.CompressorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/03-compressor/index.ts" } : {}),
  __spreadValues({ path: "converter", loadComponent: () => import("./chunk-ENHNOXQF.mjs").then((m) => m.ConverterComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/04-converter/index.ts" } : {}),
  __spreadValues({ path: "ocr", loadComponent: () => import("./chunk-YXUL5DUG.mjs").then((m) => m.OcrComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/05-ocr/index.ts" } : {}),
  __spreadValues({ path: "watermark", loadComponent: () => import("./chunk-LUVWDRUL.mjs").then((m) => m.WatermarkComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/06-watermark/index.ts" } : {}),
  __spreadValues({ path: "passwordProtector", loadComponent: () => import("./chunk-YSINXSIE.mjs").then((m) => m.PasswordProtectorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/07-password-protector/index.ts" } : {}),
  __spreadValues({ path: "unlocker", loadComponent: () => import("./chunk-3ZUCYLIH.mjs").then((m) => m.UnlockerComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/08-unlocker/index.ts" } : {}),
  __spreadValues({ path: "rotator", loadComponent: () => import("./chunk-YRGWFSSY.mjs").then((m) => m.RotatorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/09-rotator/index.ts" } : {}),
  __spreadValues({ path: "cropResize", loadComponent: () => import("./chunk-2EH26KUO.mjs").then((m) => m.CropResizeComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/10-crop-resize/index.ts" } : {}),
  __spreadValues({ path: "imageExtractor", loadComponent: () => import("./chunk-VX4TKU2S.mjs").then((m) => m.ImageExtractorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/11-image-extractor/index.ts" } : {}),
  __spreadValues({ path: "textExtractor", loadComponent: () => import("./chunk-IQHIKCNU.mjs").then((m) => m.TextExtractorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/12-text-extractor/index.ts" } : {}),
  __spreadValues({ path: "metadataEditor", loadComponent: () => import("./chunk-YH6OOANB.mjs").then((m) => m.MetadataEditorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/13-metadata-editor/index.ts" } : {}),
  __spreadValues({ path: "digitalSigner", loadComponent: () => import("./chunk-WGJWMZJM.mjs").then((m) => m.DigitalSignerComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/14-digital-signer/index.ts" } : {}),
  __spreadValues({ path: "redactor", loadComponent: () => import("./chunk-KE7FCDE7.mjs").then((m) => m.RedactorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/15-redactor/index.ts" } : {}),
  __spreadValues({ path: "annotator", loadComponent: () => import("./chunk-YQZTPVYU.mjs").then((m) => m.AnnotatorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/16-annotator/index.ts" } : {}),
  __spreadValues({ path: "formFiller", loadComponent: () => import("./chunk-3FOUOFJE.mjs").then((m) => m.FormFillerComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/17-form-filler/index.ts" } : {}),
  __spreadValues({ path: "pageReorderer", loadComponent: () => import("./chunk-ZOIX66DH.mjs").then((m) => m.PageReordererComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/18-page-reorderer/index.ts" } : {}),
  __spreadValues({ path: "thumbnailGenerator", loadComponent: () => import("./chunk-CAQKE3CR.mjs").then((m) => m.ThumbnailGeneratorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/19-thumbnail-generator/index.ts" } : {}),
  __spreadValues({ path: "compare", loadComponent: () => import("./chunk-FJ5APTVW.mjs").then((m) => m.CompareComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/20-compare/index.ts" } : {}),
  __spreadValues({ path: "toWord", loadComponent: () => import("./chunk-CM6DUOMU.mjs").then((m) => m.ToWordComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/21-to-word/index.ts" } : {}),
  __spreadValues({ path: "toExcel", loadComponent: () => import("./chunk-3JE3MSEF.mjs").then((m) => m.ToExcelComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/22-to-excel/index.ts" } : {}),
  __spreadValues({ path: "toPowerpoint", loadComponent: () => import("./chunk-TJUQZMTI.mjs").then((m) => m.ToPowerpointComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/23-to-powerpoint/index.ts" } : {}),
  __spreadValues({ path: "toHtml", loadComponent: () => import("./chunk-Q7CRCOWI.mjs").then((m) => m.ToHtmlComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/24-to-html/index.ts" } : {}),
  __spreadValues({ path: "toImageBatch", loadComponent: () => import("./chunk-G747TAX4.mjs").then((m) => m.ToImageBatchComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/25-to-image-batch/index.ts" } : {}),
  __spreadValues({ path: "repair", loadComponent: () => import("./chunk-FRP5HV6V.mjs").then((m) => m.RepairComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/26-repair/index.ts" } : {}),
  __spreadValues({ path: "flattener", loadComponent: () => import("./chunk-P4QMLG7Y.mjs").then((m) => m.FlattenerComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/27-flattener/index.ts" } : {}),
  __spreadValues({ path: "optimizer", loadComponent: () => import("./chunk-T52Q6JXR.mjs").then((m) => m.OptimizerComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/28-optimizer/index.ts" } : {}),
  __spreadValues({ path: "bookmarkEditor", loadComponent: () => import("./chunk-DHKWGMXV.mjs").then((m) => m.BookmarkEditorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/29-bookmark-editor/index.ts" } : {}),
  __spreadValues({ path: "batchProcessor", loadComponent: () => import("./chunk-QLPOQLX5.mjs").then((m) => m.BatchProcessorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/30-batch-processor/index.ts" } : {})
];
export {
  PDF_ROUTES
};
//# sourceMappingURL=chunk-BJZDL5JI.mjs.map
