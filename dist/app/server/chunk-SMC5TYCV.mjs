import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-UFAUNXOA.mjs";

// src/app/modules/pdf/pdf.routes.ts
var PDF_ROUTES = [
  __spreadValues({ path: "merger", loadComponent: () => import("./chunk-ZKF5OEMC.mjs").then((m) => m.MergerComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/01-merger/index.ts" } : {}),
  __spreadValues({ path: "splitter", loadComponent: () => import("./chunk-FPFOHP7F.mjs").then((m) => m.SplitterComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/02-splitter/index.ts" } : {}),
  __spreadValues({ path: "compressor", loadComponent: () => import("./chunk-ZSQSQ5AB.mjs").then((m) => m.CompressorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/03-compressor/index.ts" } : {}),
  __spreadValues({ path: "converter", loadComponent: () => import("./chunk-WVWV2GJ3.mjs").then((m) => m.ConverterComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/04-converter/index.ts" } : {}),
  __spreadValues({ path: "ocr", loadComponent: () => import("./chunk-5SJ74JNR.mjs").then((m) => m.OcrComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/05-ocr/index.ts" } : {}),
  __spreadValues({ path: "watermark", loadComponent: () => import("./chunk-HB22K7MZ.mjs").then((m) => m.WatermarkComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/06-watermark/index.ts" } : {}),
  __spreadValues({ path: "passwordProtector", loadComponent: () => import("./chunk-S3PA2KD6.mjs").then((m) => m.PasswordProtectorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/07-password-protector/index.ts" } : {}),
  __spreadValues({ path: "unlocker", loadComponent: () => import("./chunk-LOCIE32B.mjs").then((m) => m.UnlockerComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/08-unlocker/index.ts" } : {}),
  __spreadValues({ path: "rotator", loadComponent: () => import("./chunk-YU3OVKAQ.mjs").then((m) => m.RotatorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/09-rotator/index.ts" } : {}),
  __spreadValues({ path: "cropResize", loadComponent: () => import("./chunk-CCUCLDHR.mjs").then((m) => m.CropResizeComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/10-crop-resize/index.ts" } : {}),
  __spreadValues({ path: "imageExtractor", loadComponent: () => import("./chunk-MXW4WWJP.mjs").then((m) => m.ImageExtractorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/11-image-extractor/index.ts" } : {}),
  __spreadValues({ path: "textExtractor", loadComponent: () => import("./chunk-J4J3J2HC.mjs").then((m) => m.TextExtractorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/12-text-extractor/index.ts" } : {}),
  __spreadValues({ path: "metadataEditor", loadComponent: () => import("./chunk-AXPGWHCY.mjs").then((m) => m.MetadataEditorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/13-metadata-editor/index.ts" } : {}),
  __spreadValues({ path: "digitalSigner", loadComponent: () => import("./chunk-XN36IWWT.mjs").then((m) => m.DigitalSignerComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/14-digital-signer/index.ts" } : {}),
  __spreadValues({ path: "redactor", loadComponent: () => import("./chunk-7IRCEAHI.mjs").then((m) => m.RedactorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/15-redactor/index.ts" } : {}),
  __spreadValues({ path: "annotator", loadComponent: () => import("./chunk-OJGYFXG2.mjs").then((m) => m.AnnotatorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/16-annotator/index.ts" } : {}),
  __spreadValues({ path: "formFiller", loadComponent: () => import("./chunk-54Y7SBSV.mjs").then((m) => m.FormFillerComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/17-form-filler/index.ts" } : {}),
  __spreadValues({ path: "pageReorderer", loadComponent: () => import("./chunk-C75NF4RF.mjs").then((m) => m.PageReordererComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/18-page-reorderer/index.ts" } : {}),
  __spreadValues({ path: "thumbnailGenerator", loadComponent: () => import("./chunk-RIVDTR3V.mjs").then((m) => m.ThumbnailGeneratorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/19-thumbnail-generator/index.ts" } : {}),
  __spreadValues({ path: "compare", loadComponent: () => import("./chunk-COZUJWD6.mjs").then((m) => m.CompareComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/20-compare/index.ts" } : {}),
  __spreadValues({ path: "toWord", loadComponent: () => import("./chunk-6HQB7PKB.mjs").then((m) => m.ToWordComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/21-to-word/index.ts" } : {}),
  __spreadValues({ path: "toExcel", loadComponent: () => import("./chunk-EAJQ3OY7.mjs").then((m) => m.ToExcelComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/22-to-excel/index.ts" } : {}),
  __spreadValues({ path: "toPowerpoint", loadComponent: () => import("./chunk-V5MAJSVH.mjs").then((m) => m.ToPowerpointComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/23-to-powerpoint/index.ts" } : {}),
  __spreadValues({ path: "toHtml", loadComponent: () => import("./chunk-HV4PDBJH.mjs").then((m) => m.ToHtmlComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/24-to-html/index.ts" } : {}),
  __spreadValues({ path: "toImageBatch", loadComponent: () => import("./chunk-W6CZIXGX.mjs").then((m) => m.ToImageBatchComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/25-to-image-batch/index.ts" } : {}),
  __spreadValues({ path: "repair", loadComponent: () => import("./chunk-GD4LPXQ4.mjs").then((m) => m.RepairComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/26-repair/index.ts" } : {}),
  __spreadValues({ path: "flattener", loadComponent: () => import("./chunk-6WTPYKMO.mjs").then((m) => m.FlattenerComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/27-flattener/index.ts" } : {}),
  __spreadValues({ path: "optimizer", loadComponent: () => import("./chunk-W36L75BA.mjs").then((m) => m.OptimizerComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/28-optimizer/index.ts" } : {}),
  __spreadValues({ path: "bookmarkEditor", loadComponent: () => import("./chunk-OIADMP2S.mjs").then((m) => m.BookmarkEditorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/29-bookmark-editor/index.ts" } : {}),
  __spreadValues({ path: "batchProcessor", loadComponent: () => import("./chunk-P7GZTMYJ.mjs").then((m) => m.BatchProcessorComponent) }, true ? { \u0275entryName: "src/app/modules/pdf/30-batch-processor/index.ts" } : {})
];
export {
  PDF_ROUTES
};
//# sourceMappingURL=chunk-SMC5TYCV.mjs.map
