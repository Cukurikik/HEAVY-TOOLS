import './polyfills.server.mjs';
import {
  icoConverterFeature
} from "./chunk-5CE5MAI7.mjs";
import {
  gifConverterFeature
} from "./chunk-2C6NUFNM.mjs";
import {
  rawImageConverterFeature
} from "./chunk-2FJNLO3E.mjs";
import {
  batchConverterFeature
} from "./chunk-DPVJOSWP.mjs";
import {
  fontConverterFeature
} from "./chunk-O2ZF4QLS.mjs";
import {
  ebookConverterFeature
} from "./chunk-YDVPPVC6.mjs";
import {
  archiveConverterFeature
} from "./chunk-T7HJSZKK.mjs";
import {
  cadConverterFeature
} from "./chunk-4DD6DESZ.mjs";
import {
  subtitleConverterFeature
} from "./chunk-KWAPFZ3T.mjs";
import {
  spreadsheetConverterFeature
} from "./chunk-37WYACT6.mjs";
import {
  qrGeneratorFeature
} from "./chunk-ZVQ7QWG7.mjs";
import {
  barcodeGeneratorFeature
} from "./chunk-OHK2PY4S.mjs";
import {
  markdownConverterFeature
} from "./chunk-SMAW4EWA.mjs";
import {
  htmlConverterFeature
} from "./chunk-5DRIPEWI.mjs";
import {
  colorConverterFeature
} from "./chunk-44P6B6JT.mjs";
import {
  unitConverterFeature
} from "./chunk-GPQRKDQS.mjs";
import {
  currencyConverterFeature
} from "./chunk-KAD3OGSY.mjs";
import {
  timezoneConverterFeature
} from "./chunk-HPDS2753.mjs";
import {
  numberBaseConverterFeature
} from "./chunk-DOJOV4AO.mjs";
import {
  encodingConverterFeature
} from "./chunk-7IXMZTTE.mjs";
import {
  audioConverterFeature
} from "./chunk-6GVHP3RB.mjs";
import {
  documentConverterFeature
} from "./chunk-AOTV77CM.mjs";
import {
  imageResizerFeature
} from "./chunk-JETNDNOI.mjs";
import {
  imageCompressorFeature
} from "./chunk-VWVU4JVZ.mjs";
import {
  svgConverterFeature
} from "./chunk-RZ36SF2X.mjs";
import {
  base64EncoderFeature
} from "./chunk-2CSULTT7.mjs";
import {
  jsonConverterFeature
} from "./chunk-7YGKCKMU.mjs";
import {
  csvConverterFeature
} from "./chunk-F3EXBNWU.mjs";
import {
  imageConverterFeature
} from "./chunk-LDSFBAR7.mjs";
import {
  videoConverterFeature
} from "./chunk-6L6JJE4K.mjs";
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
    loadComponent: () => import("./chunk-QS5PGG4Z.mjs").then((m) => m.ImageConverterComponent),
    providers: [provideState(imageConverterFeature)],
    title: "Image Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, true ? { \u0275entryName: "src/app/modules/converter/01-image-converter/image-converter.component.ts" } : {}),
  __spreadValues({
    path: "video-converter",
    loadComponent: () => import("./chunk-FMDAICLP.mjs").then((m) => m.VideoConverterComponent),
    providers: [provideState(videoConverterFeature)],
    title: "Video Converter \u2014 Omni-Tool",
    data: { category: "video" }
  }, true ? { \u0275entryName: "src/app/modules/converter/02-video-converter/video-converter.component.ts" } : {}),
  __spreadValues({
    path: "audio-converter",
    loadComponent: () => import("./chunk-NFTAVEKV.mjs").then((m) => m.AudioConverterComponent),
    providers: [provideState(audioConverterFeature)],
    title: "Audio Converter \u2014 Omni-Tool",
    data: { category: "audio" }
  }, true ? { \u0275entryName: "src/app/modules/converter/03-audio-converter/audio-converter.component.ts" } : {}),
  __spreadValues({
    path: "document-converter",
    loadComponent: () => import("./chunk-E4WJHWBJ.mjs").then((m) => m.DocumentConverterComponent),
    providers: [provideState(documentConverterFeature)],
    title: "Document Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, true ? { \u0275entryName: "src/app/modules/converter/04-document-converter/document-converter.component.ts" } : {}),
  __spreadValues({
    path: "image-resizer",
    loadComponent: () => import("./chunk-DWB2GJX6.mjs").then((m) => m.ImageResizerComponent),
    providers: [provideState(imageResizerFeature)],
    title: "Image Resizer \u2014 Omni-Tool",
    data: { category: "image" }
  }, true ? { \u0275entryName: "src/app/modules/converter/05-image-resizer/image-resizer.component.ts" } : {}),
  __spreadValues({
    path: "image-compressor",
    loadComponent: () => import("./chunk-BWP7MOIA.mjs").then((m) => m.ImageCompressorComponent),
    providers: [provideState(imageCompressorFeature)],
    title: "Image Compressor \u2014 Omni-Tool",
    data: { category: "image" }
  }, true ? { \u0275entryName: "src/app/modules/converter/06-image-compressor/image-compressor.component.ts" } : {}),
  __spreadValues({
    path: "svg-converter",
    loadComponent: () => import("./chunk-UWGUUAIV.mjs").then((m) => m.SvgConverterComponent),
    providers: [provideState(svgConverterFeature)],
    title: "SVG Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, true ? { \u0275entryName: "src/app/modules/converter/07-svg-converter/svg-converter.component.ts" } : {}),
  __spreadValues({
    path: "base64-encoder",
    loadComponent: () => import("./chunk-UYRN3NFF.mjs").then((m) => m.Base64EncoderComponent),
    providers: [provideState(base64EncoderFeature)],
    title: "Base64 Encoder \u2014 Omni-Tool",
    data: { category: "text" }
  }, true ? { \u0275entryName: "src/app/modules/converter/08-base64-encoder/base64-encoder.component.ts" } : {}),
  __spreadValues({
    path: "json-converter",
    loadComponent: () => import("./chunk-CAG24Z2N.mjs").then((m) => m.JsonConverterComponent),
    providers: [provideState(jsonConverterFeature)],
    title: "JSON Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, true ? { \u0275entryName: "src/app/modules/converter/09-json-converter/json-converter.component.ts" } : {}),
  __spreadValues({
    path: "csv-converter",
    loadComponent: () => import("./chunk-NVBKCPUU.mjs").then((m) => m.CsvConverterComponent),
    providers: [provideState(csvConverterFeature)],
    title: "CSV Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, true ? { \u0275entryName: "src/app/modules/converter/10-csv-converter/csv-converter.component.ts" } : {}),
  __spreadValues({
    path: "markdown-converter",
    loadComponent: () => import("./chunk-4PQ7FEPN.mjs").then((m) => m.MarkdownConverterComponent),
    providers: [provideState(markdownConverterFeature)],
    title: "Markdown Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, true ? { \u0275entryName: "src/app/modules/converter/11-markdown-converter/markdown-converter.component.ts" } : {}),
  __spreadValues({
    path: "html-converter",
    loadComponent: () => import("./chunk-KOT5FRH2.mjs").then((m) => m.HtmlConverterComponent),
    providers: [provideState(htmlConverterFeature)],
    title: "HTML Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, true ? { \u0275entryName: "src/app/modules/converter/12-html-converter/html-converter.component.ts" } : {}),
  __spreadValues({
    path: "color-converter",
    loadComponent: () => import("./chunk-NTSZYMTE.mjs").then((m) => m.ColorConverterComponent),
    providers: [provideState(colorConverterFeature)],
    title: "Color Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/13-color-converter/color-converter.component.ts" } : {}),
  __spreadValues({
    path: "unit-converter",
    loadComponent: () => import("./chunk-2HJK4S3H.mjs").then((m) => m.UnitConverterComponent),
    providers: [provideState(unitConverterFeature)],
    title: "Unit Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/14-unit-converter/unit-converter.component.ts" } : {}),
  __spreadValues({
    path: "currency-converter",
    loadComponent: () => import("./chunk-2LKOQRMM.mjs").then((m) => m.CurrencyConverterComponent),
    providers: [provideState(currencyConverterFeature)],
    title: "Currency Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/15-currency-converter/currency-converter.component.ts" } : {}),
  __spreadValues({
    path: "timezone-converter",
    loadComponent: () => import("./chunk-HVIFFTVE.mjs").then((m) => m.TimezoneConverterComponent),
    providers: [provideState(timezoneConverterFeature)],
    title: "Timezone Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/16-timezone-converter/timezone-converter.component.ts" } : {}),
  __spreadValues({
    path: "number-base-converter",
    loadComponent: () => import("./chunk-V6G6JLJ3.mjs").then((m) => m.NumberBaseConverterComponent),
    providers: [provideState(numberBaseConverterFeature)],
    title: "Number Base Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/17-number-base-converter/number-base-converter.component.ts" } : {}),
  __spreadValues({
    path: "encoding-converter",
    loadComponent: () => import("./chunk-XGBTIA3Z.mjs").then((m) => m.EncodingConverterComponent),
    providers: [provideState(encodingConverterFeature)],
    title: "Encoding Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, true ? { \u0275entryName: "src/app/modules/converter/18-encoding-converter/encoding-converter.component.ts" } : {}),
  __spreadValues({
    path: "font-converter",
    loadComponent: () => import("./chunk-EQGOMTHK.mjs").then((m) => m.FontConverterComponent),
    providers: [provideState(fontConverterFeature)],
    title: "Font Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, true ? { \u0275entryName: "src/app/modules/converter/19-font-converter/font-converter.component.ts" } : {}),
  __spreadValues({
    path: "ebook-converter",
    loadComponent: () => import("./chunk-ZDVHII3R.mjs").then((m) => m.EbookConverterComponent),
    providers: [provideState(ebookConverterFeature)],
    title: "Ebook Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, true ? { \u0275entryName: "src/app/modules/converter/20-ebook-converter/ebook-converter.component.ts" } : {}),
  __spreadValues({
    path: "archive-converter",
    loadComponent: () => import("./chunk-7RTBSFDJ.mjs").then((m) => m.ArchiveConverterComponent),
    providers: [provideState(archiveConverterFeature)],
    title: "Archive Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/21-archive-converter/archive-converter.component.ts" } : {}),
  __spreadValues({
    path: "cad-converter",
    loadComponent: () => import("./chunk-VK6STWXE.mjs").then((m) => m.CadConverterComponent),
    providers: [provideState(cadConverterFeature)],
    title: "CAD Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, true ? { \u0275entryName: "src/app/modules/converter/22-cad-converter/cad-converter.component.ts" } : {}),
  __spreadValues({
    path: "subtitle-converter",
    loadComponent: () => import("./chunk-I3FVE5KD.mjs").then((m) => m.SubtitleConverterComponent),
    providers: [provideState(subtitleConverterFeature)],
    title: "Subtitle Converter \u2014 Omni-Tool",
    data: { category: "video" }
  }, true ? { \u0275entryName: "src/app/modules/converter/23-subtitle-converter/subtitle-converter.component.ts" } : {}),
  __spreadValues({
    path: "spreadsheet-converter",
    loadComponent: () => import("./chunk-JAKPQ23P.mjs").then((m) => m.SpreadsheetConverterComponent),
    providers: [provideState(spreadsheetConverterFeature)],
    title: "Spreadsheet Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, true ? { \u0275entryName: "src/app/modules/converter/24-spreadsheet-converter/spreadsheet-converter.component.ts" } : {}),
  __spreadValues({
    path: "qr-generator",
    loadComponent: () => import("./chunk-Q2IOOHSZ.mjs").then((m) => m.QrGeneratorComponent),
    providers: [provideState(qrGeneratorFeature)],
    title: "QR Code Generator \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/25-qr-generator/qr-generator.component.ts" } : {}),
  __spreadValues({
    path: "barcode-generator",
    loadComponent: () => import("./chunk-HOTQRYS2.mjs").then((m) => m.BarcodeGeneratorComponent),
    providers: [provideState(barcodeGeneratorFeature)],
    title: "Barcode Generator \u2014 Omni-Tool",
    data: { category: "utility" }
  }, true ? { \u0275entryName: "src/app/modules/converter/26-barcode-generator/barcode-generator.component.ts" } : {}),
  __spreadValues({
    path: "ico-converter",
    loadComponent: () => import("./chunk-I42OHEWA.mjs").then((m) => m.IcoConverterComponent),
    providers: [provideState(icoConverterFeature)],
    title: "ICO / Favicon Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, true ? { \u0275entryName: "src/app/modules/converter/27-ico-converter/ico-converter.component.ts" } : {}),
  __spreadValues({
    path: "gif-converter",
    loadComponent: () => import("./chunk-JTOFCPC6.mjs").then((m) => m.GifConverterComponent),
    providers: [provideState(gifConverterFeature)],
    title: "GIF Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, true ? { \u0275entryName: "src/app/modules/converter/28-gif-converter/gif-converter.component.ts" } : {}),
  __spreadValues({
    path: "raw-image-converter",
    loadComponent: () => import("./chunk-ZC7C4UZV.mjs").then((m) => m.RawImageConverterComponent),
    providers: [provideState(rawImageConverterFeature)],
    title: "RAW Image Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, true ? { \u0275entryName: "src/app/modules/converter/29-raw-image-converter/raw-image-converter.component.ts" } : {}),
  __spreadValues({
    path: "batch-converter",
    loadComponent: () => import("./chunk-LEVQP76H.mjs").then((m) => m.BatchConverterComponent),
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
//# sourceMappingURL=chunk-DCE65YVK.mjs.map
