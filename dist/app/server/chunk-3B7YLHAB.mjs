import './polyfills.server.mjs';
import {
  icoConverterFeature
} from "./chunk-SSKQOMTO.mjs";
import {
  gifConverterFeature
} from "./chunk-YTK4NO3U.mjs";
import {
  rawImageConverterFeature
} from "./chunk-UPCUQ5KO.mjs";
import {
  batchConverterFeature
} from "./chunk-L63KFFBC.mjs";
import {
  fontConverterFeature
} from "./chunk-VDI5MOBN.mjs";
import {
  ebookConverterFeature
} from "./chunk-L3DIAKYV.mjs";
import {
  archiveConverterFeature
} from "./chunk-BUBFDFS2.mjs";
import {
  cadConverterFeature
} from "./chunk-XEMKYBPT.mjs";
import {
  subtitleConverterFeature
} from "./chunk-44FWDISP.mjs";
import {
  spreadsheetConverterFeature
} from "./chunk-P3SNWOM3.mjs";
import {
  qrGeneratorFeature
} from "./chunk-BF7PJVI6.mjs";
import {
  barcodeGeneratorFeature
} from "./chunk-TDHOVF52.mjs";
import {
  markdownConverterFeature
} from "./chunk-ZY2PFLGW.mjs";
import {
  htmlConverterFeature
} from "./chunk-2G2TQ7AU.mjs";
import {
  colorConverterFeature
} from "./chunk-QAMWMUN6.mjs";
import {
  unitConverterFeature
} from "./chunk-X5756WSF.mjs";
import {
  currencyConverterFeature
} from "./chunk-AWPS4ISQ.mjs";
import {
  timezoneConverterFeature
} from "./chunk-7XX5DHKX.mjs";
import {
  numberBaseConverterFeature
} from "./chunk-JIXIAMOH.mjs";
import {
  encodingConverterFeature
} from "./chunk-H6CAHUTI.mjs";
import {
  audioConverterFeature
} from "./chunk-G5KINMM6.mjs";
import {
  documentConverterFeature
} from "./chunk-T2PJMGD3.mjs";
import {
  imageResizerFeature
} from "./chunk-2UPMN7O6.mjs";
import {
  imageCompressorFeature
} from "./chunk-4QZM5YDA.mjs";
import {
  svgConverterFeature
} from "./chunk-RGXZWIJP.mjs";
import {
  base64EncoderFeature
} from "./chunk-OGPOD3GF.mjs";
import {
  jsonConverterFeature
} from "./chunk-5K4B5546.mjs";
import {
  csvConverterFeature
} from "./chunk-R34LEATK.mjs";
import {
  imageConverterFeature
} from "./chunk-ZXPU2NQO.mjs";
import {
  videoConverterFeature
} from "./chunk-UF5UUOGG.mjs";
import {
  provideState
} from "./chunk-GPJTNT77.mjs";
import "./chunk-CX47CWGJ.mjs";
import {
  __spreadValues
} from "./chunk-UFAUNXOA.mjs";

// src/app/modules/converter/converter.routes.ts
var CONVERTER_ROUTES = [
  __spreadValues({
    path: "image-converter",
    loadComponent: () => import("./chunk-FALPNVEA.mjs").then((m) => m.ImageConverterComponent),
    providers: [provideState(imageConverterFeature)],
    title: "Image Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, true ? { \u0275entryName: "src/app/modules/converter/01-image-converter/image-converter.component.ts" } : {}),
  __spreadValues({
    path: "video-converter",
    loadComponent: () => import("./chunk-JD4WZ4K6.mjs").then((m) => m.VideoConverterComponent),
    providers: [provideState(videoConverterFeature)],
    title: "Video Converter \u2014 Omni-Tool",
    data: { category: "video" }
  }, true ? { \u0275entryName: "src/app/modules/converter/02-video-converter/video-converter.component.ts" } : {}),
  __spreadValues({
    path: "audio-converter",
    loadComponent: () => import("./chunk-A5H3MZTW.mjs").then((m) => m.AudioConverterComponent),
    providers: [provideState(audioConverterFeature)],
    title: "Audio Converter \u2014 Omni-Tool",
    data: { category: "audio" }
  }, true ? { \u0275entryName: "src/app/modules/converter/03-audio-converter/audio-converter.component.ts" } : {}),
  __spreadValues({
    path: "document-converter",
    loadComponent: () => import("./chunk-EXJOXBG2.mjs").then((m) => m.DocumentConverterComponent),
    providers: [provideState(documentConverterFeature)],
    title: "Document Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, true ? { \u0275entryName: "src/app/modules/converter/04-document-converter/document-converter.component.ts" } : {}),
  __spreadValues({
    path: "image-resizer",
    loadComponent: () => import("./chunk-TYTDYPUN.mjs").then((m) => m.ImageResizerComponent),
    providers: [provideState(imageResizerFeature)],
    title: "Image Resizer \u2014 Omni-Tool",
    data: { category: "image" }
  }, true ? { \u0275entryName: "src/app/modules/converter/05-image-resizer/image-resizer.component.ts" } : {}),
  __spreadValues({
    path: "image-compressor",
    loadComponent: () => import("./chunk-OOGP3C26.mjs").then((m) => m.ImageCompressorComponent),
    providers: [provideState(imageCompressorFeature)],
    title: "Image Compressor \u2014 Omni-Tool",
    data: { category: "image" }
  }, true ? { \u0275entryName: "src/app/modules/converter/06-image-compressor/image-compressor.component.ts" } : {}),
  __spreadValues({
    path: "svg-converter",
    loadComponent: () => import("./chunk-7M5ZUUYP.mjs").then((m) => m.SvgConverterComponent),
    providers: [provideState(svgConverterFeature)],
    title: "SVG Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, true ? { \u0275entryName: "src/app/modules/converter/07-svg-converter/svg-converter.component.ts" } : {}),
  __spreadValues({
    path: "base64-encoder",
    loadComponent: () => import("./chunk-AJKODXQL.mjs").then((m) => m.Base64EncoderComponent),
    providers: [provideState(base64EncoderFeature)],
    title: "Base64 Encoder \u2014 Omni-Tool",
    data: { category: "text" }
  }, true ? { \u0275entryName: "src/app/modules/converter/08-base64-encoder/base64-encoder.component.ts" } : {}),
  __spreadValues({
    path: "json-converter",
    loadComponent: () => import("./chunk-UOBZITXW.mjs").then((m) => m.JsonConverterComponent),
    providers: [provideState(jsonConverterFeature)],
    title: "JSON Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, true ? { \u0275entryName: "src/app/modules/converter/09-json-converter/json-converter.component.ts" } : {}),
  __spreadValues({
    path: "csv-converter",
    loadComponent: () => import("./chunk-VZNADATX.mjs").then((m) => m.CsvConverterComponent),
    providers: [provideState(csvConverterFeature)],
    title: "CSV Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, true ? { \u0275entryName: "src/app/modules/converter/10-csv-converter/csv-converter.component.ts" } : {}),
  __spreadValues({
    path: "markdown-converter",
    loadComponent: () => import("./chunk-CBJQDMJY.mjs").then((m) => m.MarkdownConverterComponent),
    providers: [provideState(markdownConverterFeature)],
    title: "Markdown Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, true ? { \u0275entryName: "src/app/modules/converter/11-markdown-converter/markdown-converter.component.ts" } : {}),
  __spreadValues({
    path: "html-converter",
    loadComponent: () => import("./chunk-XKELWT4Z.mjs").then((m) => m.HtmlConverterComponent),
    providers: [provideState(htmlConverterFeature)],
    title: "HTML Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, true ? { \u0275entryName: "src/app/modules/converter/12-html-converter/html-converter.component.ts" } : {}),
  __spreadValues({
    path: "color-converter",
    loadComponent: () => import("./chunk-AYJ4CAV3.mjs").then((m) => m.ColorConverterComponent),
    providers: [provideState(colorConverterFeature)],
    title: "Color Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/13-color-converter/color-converter.component.ts" } : {}),
  __spreadValues({
    path: "unit-converter",
    loadComponent: () => import("./chunk-CZNWBI4M.mjs").then((m) => m.UnitConverterComponent),
    providers: [provideState(unitConverterFeature)],
    title: "Unit Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/14-unit-converter/unit-converter.component.ts" } : {}),
  __spreadValues({
    path: "currency-converter",
    loadComponent: () => import("./chunk-EQFM47HS.mjs").then((m) => m.CurrencyConverterComponent),
    providers: [provideState(currencyConverterFeature)],
    title: "Currency Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/15-currency-converter/currency-converter.component.ts" } : {}),
  __spreadValues({
    path: "timezone-converter",
    loadComponent: () => import("./chunk-U7TT42FX.mjs").then((m) => m.TimezoneConverterComponent),
    providers: [provideState(timezoneConverterFeature)],
    title: "Timezone Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/16-timezone-converter/timezone-converter.component.ts" } : {}),
  __spreadValues({
    path: "number-base-converter",
    loadComponent: () => import("./chunk-HVBUMO6L.mjs").then((m) => m.NumberBaseConverterComponent),
    providers: [provideState(numberBaseConverterFeature)],
    title: "Number Base Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/17-number-base-converter/number-base-converter.component.ts" } : {}),
  __spreadValues({
    path: "encoding-converter",
    loadComponent: () => import("./chunk-XIKEXBOG.mjs").then((m) => m.EncodingConverterComponent),
    providers: [provideState(encodingConverterFeature)],
    title: "Encoding Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, true ? { \u0275entryName: "src/app/modules/converter/18-encoding-converter/encoding-converter.component.ts" } : {}),
  __spreadValues({
    path: "font-converter",
    loadComponent: () => import("./chunk-3G3YC2VH.mjs").then((m) => m.FontConverterComponent),
    providers: [provideState(fontConverterFeature)],
    title: "Font Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, true ? { \u0275entryName: "src/app/modules/converter/19-font-converter/font-converter.component.ts" } : {}),
  __spreadValues({
    path: "ebook-converter",
    loadComponent: () => import("./chunk-E3XXJASP.mjs").then((m) => m.EbookConverterComponent),
    providers: [provideState(ebookConverterFeature)],
    title: "Ebook Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, true ? { \u0275entryName: "src/app/modules/converter/20-ebook-converter/ebook-converter.component.ts" } : {}),
  __spreadValues({
    path: "archive-converter",
    loadComponent: () => import("./chunk-A2UZYTVM.mjs").then((m) => m.ArchiveConverterComponent),
    providers: [provideState(archiveConverterFeature)],
    title: "Archive Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/21-archive-converter/archive-converter.component.ts" } : {}),
  __spreadValues({
    path: "cad-converter",
    loadComponent: () => import("./chunk-ZNB44Y7M.mjs").then((m) => m.CadConverterComponent),
    providers: [provideState(cadConverterFeature)],
    title: "CAD Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, true ? { \u0275entryName: "src/app/modules/converter/22-cad-converter/cad-converter.component.ts" } : {}),
  __spreadValues({
    path: "subtitle-converter",
    loadComponent: () => import("./chunk-HUMDUIF5.mjs").then((m) => m.SubtitleConverterComponent),
    providers: [provideState(subtitleConverterFeature)],
    title: "Subtitle Converter \u2014 Omni-Tool",
    data: { category: "video" }
  }, true ? { \u0275entryName: "src/app/modules/converter/23-subtitle-converter/subtitle-converter.component.ts" } : {}),
  __spreadValues({
    path: "spreadsheet-converter",
    loadComponent: () => import("./chunk-OP3IJJ7D.mjs").then((m) => m.SpreadsheetConverterComponent),
    providers: [provideState(spreadsheetConverterFeature)],
    title: "Spreadsheet Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, true ? { \u0275entryName: "src/app/modules/converter/24-spreadsheet-converter/spreadsheet-converter.component.ts" } : {}),
  __spreadValues({
    path: "qr-generator",
    loadComponent: () => import("./chunk-MBNRTNG3.mjs").then((m) => m.QrGeneratorComponent),
    providers: [provideState(qrGeneratorFeature)],
    title: "QR Code Generator \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/25-qr-generator/qr-generator.component.ts" } : {}),
  __spreadValues({
    path: "barcode-generator",
    loadComponent: () => import("./chunk-MEERJ7TV.mjs").then((m) => m.BarcodeGeneratorComponent),
    providers: [provideState(barcodeGeneratorFeature)],
    title: "Barcode Generator \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/26-barcode-generator/barcode-generator.component.ts" } : {}),
  __spreadValues({
    path: "ico-converter",
    loadComponent: () => import("./chunk-SRJKGRCB.mjs").then((m) => m.IcoConverterComponent),
    providers: [provideState(icoConverterFeature)],
    title: "ICO / Favicon Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, true ? { \u0275entryName: "src/app/modules/converter/27-ico-converter/ico-converter.component.ts" } : {}),
  __spreadValues({
    path: "gif-converter",
    loadComponent: () => import("./chunk-GDA37NT2.mjs").then((m) => m.GifConverterComponent),
    providers: [provideState(gifConverterFeature)],
    title: "GIF Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, true ? { \u0275entryName: "src/app/modules/converter/28-gif-converter/gif-converter.component.ts" } : {}),
  __spreadValues({
    path: "raw-image-converter",
    loadComponent: () => import("./chunk-7NI7JUFV.mjs").then((m) => m.RawImageConverterComponent),
    providers: [provideState(rawImageConverterFeature)],
    title: "RAW Image Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, true ? { \u0275entryName: "src/app/modules/converter/29-raw-image-converter/raw-image-converter.component.ts" } : {}),
  __spreadValues({
    path: "batch-converter",
    loadComponent: () => import("./chunk-QIPI4CRE.mjs").then((m) => m.BatchConverterComponent),
    providers: [provideState(batchConverterFeature)],
    title: "Batch Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/30-batch-converter/batch-converter.component.ts" } : {}),
  {
    path: "",
    redirectTo: "image-converter",
    pathMatch: "full"
  }
];
export {
  CONVERTER_ROUTES
};
//# sourceMappingURL=chunk-3B7YLHAB.mjs.map
