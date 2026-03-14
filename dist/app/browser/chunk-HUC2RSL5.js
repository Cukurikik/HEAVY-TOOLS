import {
  __spreadValues
} from "./chunk-KWSTWQNB.js";

// src/app/modules/pdf/pdf.routes.ts
var PDF_ROUTES = [
  __spreadValues({ path: "merger", loadComponent: () => import("./chunk-EMCMEVJP.js").then((m) => m.MergerComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/01-merger/index.ts" } : {}),
  __spreadValues({ path: "splitter", loadComponent: () => import("./chunk-QKADL3TE.js").then((m) => m.SplitterComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/02-splitter/index.ts" } : {}),
  __spreadValues({ path: "compressor", loadComponent: () => import("./chunk-6Y3FA7FI.js").then((m) => m.CompressorComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/03-compressor/index.ts" } : {}),
  __spreadValues({ path: "converter", loadComponent: () => import("./chunk-3AKKA27I.js").then((m) => m.ConverterComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/04-converter/index.ts" } : {}),
  __spreadValues({ path: "ocr", loadComponent: () => import("./chunk-H5WPYNRW.js").then((m) => m.OcrComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/05-ocr/index.ts" } : {}),
  __spreadValues({ path: "watermark", loadComponent: () => import("./chunk-27TGFSXZ.js").then((m) => m.WatermarkComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/06-watermark/index.ts" } : {}),
  __spreadValues({ path: "passwordProtector", loadComponent: () => import("./chunk-WNV6YCIN.js").then((m) => m.PasswordProtectorComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/07-password-protector/index.ts" } : {}),
  __spreadValues({ path: "unlocker", loadComponent: () => import("./chunk-ILZWF652.js").then((m) => m.UnlockerComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/08-unlocker/index.ts" } : {}),
  __spreadValues({ path: "rotator", loadComponent: () => import("./chunk-KRHOLL3T.js").then((m) => m.RotatorComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/09-rotator/index.ts" } : {}),
  __spreadValues({ path: "cropResize", loadComponent: () => import("./chunk-WHT46ZFU.js").then((m) => m.CropResizeComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/10-crop-resize/index.ts" } : {}),
  __spreadValues({ path: "imageExtractor", loadComponent: () => import("./chunk-AZY6SOMP.js").then((m) => m.ImageExtractorComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/11-image-extractor/index.ts" } : {}),
  __spreadValues({ path: "textExtractor", loadComponent: () => import("./chunk-DZ26LI2F.js").then((m) => m.TextExtractorComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/12-text-extractor/index.ts" } : {}),
  __spreadValues({ path: "metadataEditor", loadComponent: () => import("./chunk-7SRGQXF6.js").then((m) => m.MetadataEditorComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/13-metadata-editor/index.ts" } : {}),
  __spreadValues({ path: "digitalSigner", loadComponent: () => import("./chunk-3W3GPLLK.js").then((m) => m.DigitalSignerComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/14-digital-signer/index.ts" } : {}),
  __spreadValues({ path: "redactor", loadComponent: () => import("./chunk-XWPFLXG4.js").then((m) => m.RedactorComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/15-redactor/index.ts" } : {}),
  __spreadValues({ path: "annotator", loadComponent: () => import("./chunk-LYZNLVY2.js").then((m) => m.AnnotatorComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/16-annotator/index.ts" } : {}),
  __spreadValues({ path: "formFiller", loadComponent: () => import("./chunk-TVAW5W7O.js").then((m) => m.FormFillerComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/17-form-filler/index.ts" } : {}),
  __spreadValues({ path: "pageReorderer", loadComponent: () => import("./chunk-VDZ7P4EK.js").then((m) => m.PageReordererComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/18-page-reorderer/index.ts" } : {}),
  __spreadValues({ path: "thumbnailGenerator", loadComponent: () => import("./chunk-LD5WPFK2.js").then((m) => m.ThumbnailGeneratorComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/19-thumbnail-generator/index.ts" } : {}),
  __spreadValues({ path: "compare", loadComponent: () => import("./chunk-OF4Q46KG.js").then((m) => m.CompareComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/20-compare/index.ts" } : {}),
  __spreadValues({ path: "toWord", loadComponent: () => import("./chunk-SWS2VGKY.js").then((m) => m.ToWordComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/21-to-word/index.ts" } : {}),
  __spreadValues({ path: "toExcel", loadComponent: () => import("./chunk-JRGVZU2J.js").then((m) => m.ToExcelComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/22-to-excel/index.ts" } : {}),
  __spreadValues({ path: "toPowerpoint", loadComponent: () => import("./chunk-PXHJNVUF.js").then((m) => m.ToPowerpointComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/23-to-powerpoint/index.ts" } : {}),
  __spreadValues({ path: "toHtml", loadComponent: () => import("./chunk-37FEMMTS.js").then((m) => m.ToHtmlComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/24-to-html/index.ts" } : {}),
  __spreadValues({ path: "toImageBatch", loadComponent: () => import("./chunk-NRYD5PVH.js").then((m) => m.ToImageBatchComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/25-to-image-batch/index.ts" } : {}),
  __spreadValues({ path: "repair", loadComponent: () => import("./chunk-L3LAAUCS.js").then((m) => m.RepairComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/26-repair/index.ts" } : {}),
  __spreadValues({ path: "flattener", loadComponent: () => import("./chunk-I6HHTQPY.js").then((m) => m.FlattenerComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/27-flattener/index.ts" } : {}),
  __spreadValues({ path: "optimizer", loadComponent: () => import("./chunk-5JSXHCMO.js").then((m) => m.OptimizerComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/28-optimizer/index.ts" } : {}),
  __spreadValues({ path: "bookmarkEditor", loadComponent: () => import("./chunk-WA4EY7OZ.js").then((m) => m.BookmarkEditorComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/29-bookmark-editor/index.ts" } : {}),
  __spreadValues({ path: "batchProcessor", loadComponent: () => import("./chunk-NVO3YO6F.js").then((m) => m.BatchProcessorComponent) }, false ? { \u0275entryName: "src/app/modules/pdf/30-batch-processor/index.ts" } : {})
];
export {
  PDF_ROUTES
};
//# sourceMappingURL=chunk-HUC2RSL5.js.map
