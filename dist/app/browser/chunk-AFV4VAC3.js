import {
  gifConverterFeature
} from "./chunk-ZFJGG2UP.js";
import {
  rawImageConverterFeature
} from "./chunk-EVVT7CQO.js";
import {
  batchConverterFeature
} from "./chunk-75DVCE7C.js";
import {
  ebookConverterFeature
} from "./chunk-AZZND7PW.js";
import {
  archiveConverterFeature
} from "./chunk-MPV7ZJXA.js";
import {
  cadConverterFeature
} from "./chunk-4HQSZUNN.js";
import {
  subtitleConverterFeature
} from "./chunk-3PB6YJPO.js";
import {
  spreadsheetConverterFeature
} from "./chunk-ZN2BHROH.js";
import {
  qrGeneratorFeature
} from "./chunk-ROXZ7TBG.js";
import {
  barcodeGeneratorFeature
} from "./chunk-AAVZG45H.js";
import {
  icoConverterFeature
} from "./chunk-WEURGY4F.js";
import {
  htmlConverterFeature
} from "./chunk-EOLBFRAE.js";
import {
  colorConverterFeature
} from "./chunk-XAPAO476.js";
import {
  unitConverterFeature
} from "./chunk-66M5P67E.js";
import {
  currencyConverterFeature
} from "./chunk-IBADUQTE.js";
import {
  timezoneConverterFeature
} from "./chunk-D2EE552S.js";
import {
  numberBaseConverterFeature
} from "./chunk-OTMZJABC.js";
import {
  encodingConverterFeature
} from "./chunk-VNKZT2ZZ.js";
import {
  fontConverterFeature
} from "./chunk-D6DFP5KR.js";
import {
  documentConverterFeature
} from "./chunk-DYMX3UVB.js";
import {
  imageResizerFeature
} from "./chunk-67L44WMM.js";
import {
  imageCompressorFeature
} from "./chunk-RUQTHBT2.js";
import {
  svgConverterFeature
} from "./chunk-XBBU5XSN.js";
import {
  base64EncoderFeature
} from "./chunk-7S5CSXAD.js";
import {
  jsonConverterFeature
} from "./chunk-XHEQEXLB.js";
import {
  csvConverterFeature
} from "./chunk-ISVHUWIW.js";
import {
  markdownConverterFeature
} from "./chunk-FNDALBAV.js";
import {
  imageConverterFeature
} from "./chunk-QVZIQAWN.js";
import {
  videoConverterFeature
} from "./chunk-UFWVGED5.js";
import {
  audioConverterFeature
} from "./chunk-FKI5HDGO.js";
import {
  provideState
} from "./chunk-KGVNL5XR.js";
import "./chunk-3GKPD7AG.js";
import {
  __spreadValues
} from "./chunk-KWSTWQNB.js";

// src/app/modules/converter/converter.routes.ts
var CONVERTER_ROUTES = [
  __spreadValues({
    path: "image-converter",
    loadComponent: () => import("./chunk-ZX5UVKJB.js").then((m) => m.ImageConverterComponent),
    providers: [provideState(imageConverterFeature)],
    title: "Image Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, false ? { \u0275entryName: "src/app/modules/converter/01-image-converter/image-converter.component.ts" } : {}),
  __spreadValues({
    path: "video-converter",
    loadComponent: () => import("./chunk-LK4LTCNR.js").then((m) => m.VideoConverterComponent),
    providers: [provideState(videoConverterFeature)],
    title: "Video Converter \u2014 Omni-Tool",
    data: { category: "video" }
  }, false ? { \u0275entryName: "src/app/modules/converter/02-video-converter/video-converter.component.ts" } : {}),
  __spreadValues({
    path: "audio-converter",
    loadComponent: () => import("./chunk-CWNPYHHL.js").then((m) => m.AudioConverterComponent),
    providers: [provideState(audioConverterFeature)],
    title: "Audio Converter \u2014 Omni-Tool",
    data: { category: "audio" }
  }, false ? { \u0275entryName: "src/app/modules/converter/03-audio-converter/audio-converter.component.ts" } : {}),
  __spreadValues({
    path: "document-converter",
    loadComponent: () => import("./chunk-ZKITLZ3L.js").then((m) => m.DocumentConverterComponent),
    providers: [provideState(documentConverterFeature)],
    title: "Document Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, false ? { \u0275entryName: "src/app/modules/converter/04-document-converter/document-converter.component.ts" } : {}),
  __spreadValues({
    path: "image-resizer",
    loadComponent: () => import("./chunk-C64TB7P7.js").then((m) => m.ImageResizerComponent),
    providers: [provideState(imageResizerFeature)],
    title: "Image Resizer \u2014 Omni-Tool",
    data: { category: "image" }
  }, false ? { \u0275entryName: "src/app/modules/converter/05-image-resizer/image-resizer.component.ts" } : {}),
  __spreadValues({
    path: "image-compressor",
    loadComponent: () => import("./chunk-E6LXMH2P.js").then((m) => m.ImageCompressorComponent),
    providers: [provideState(imageCompressorFeature)],
    title: "Image Compressor \u2014 Omni-Tool",
    data: { category: "image" }
  }, false ? { \u0275entryName: "src/app/modules/converter/06-image-compressor/image-compressor.component.ts" } : {}),
  __spreadValues({
    path: "svg-converter",
    loadComponent: () => import("./chunk-GGD2GPWU.js").then((m) => m.SvgConverterComponent),
    providers: [provideState(svgConverterFeature)],
    title: "SVG Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, false ? { \u0275entryName: "src/app/modules/converter/07-svg-converter/svg-converter.component.ts" } : {}),
  __spreadValues({
    path: "base64-encoder",
    loadComponent: () => import("./chunk-VQ4JNQST.js").then((m) => m.Base64EncoderComponent),
    providers: [provideState(base64EncoderFeature)],
    title: "Base64 Encoder \u2014 Omni-Tool",
    data: { category: "text" }
  }, false ? { \u0275entryName: "src/app/modules/converter/08-base64-encoder/base64-encoder.component.ts" } : {}),
  __spreadValues({
    path: "json-converter",
    loadComponent: () => import("./chunk-XDH6AQZ6.js").then((m) => m.JsonConverterComponent),
    providers: [provideState(jsonConverterFeature)],
    title: "JSON Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, false ? { \u0275entryName: "src/app/modules/converter/09-json-converter/json-converter.component.ts" } : {}),
  __spreadValues({
    path: "csv-converter",
    loadComponent: () => import("./chunk-NA2ZYSV6.js").then((m) => m.CsvConverterComponent),
    providers: [provideState(csvConverterFeature)],
    title: "CSV Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, false ? { \u0275entryName: "src/app/modules/converter/10-csv-converter/csv-converter.component.ts" } : {}),
  __spreadValues({
    path: "markdown-converter",
    loadComponent: () => import("./chunk-BFGBET2G.js").then((m) => m.MarkdownConverterComponent),
    providers: [provideState(markdownConverterFeature)],
    title: "Markdown Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, false ? { \u0275entryName: "src/app/modules/converter/11-markdown-converter/markdown-converter.component.ts" } : {}),
  __spreadValues({
    path: "html-converter",
    loadComponent: () => import("./chunk-7YQ7UX57.js").then((m) => m.HtmlConverterComponent),
    providers: [provideState(htmlConverterFeature)],
    title: "HTML Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, false ? { \u0275entryName: "src/app/modules/converter/12-html-converter/html-converter.component.ts" } : {}),
  __spreadValues({
    path: "color-converter",
    loadComponent: () => import("./chunk-JBQ7B3IK.js").then((m) => m.ColorConverterComponent),
    providers: [provideState(colorConverterFeature)],
    title: "Color Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, false ? { \u0275entryName: "src/app/modules/converter/13-color-converter/color-converter.component.ts" } : {}),
  __spreadValues({
    path: "unit-converter",
    loadComponent: () => import("./chunk-N4MJB5KT.js").then((m) => m.UnitConverterComponent),
    providers: [provideState(unitConverterFeature)],
    title: "Unit Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, false ? { \u0275entryName: "src/app/modules/converter/14-unit-converter/unit-converter.component.ts" } : {}),
  __spreadValues({
    path: "currency-converter",
    loadComponent: () => import("./chunk-45HLPYMC.js").then((m) => m.CurrencyConverterComponent),
    providers: [provideState(currencyConverterFeature)],
    title: "Currency Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, false ? { \u0275entryName: "src/app/modules/converter/15-currency-converter/currency-converter.component.ts" } : {}),
  __spreadValues({
    path: "timezone-converter",
    loadComponent: () => import("./chunk-E5BCXNXO.js").then((m) => m.TimezoneConverterComponent),
    providers: [provideState(timezoneConverterFeature)],
    title: "Timezone Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, false ? { \u0275entryName: "src/app/modules/converter/16-timezone-converter/timezone-converter.component.ts" } : {}),
  __spreadValues({
    path: "number-base-converter",
    loadComponent: () => import("./chunk-UGOW6SIJ.js").then((m) => m.NumberBaseConverterComponent),
    providers: [provideState(numberBaseConverterFeature)],
    title: "Number Base Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, false ? { \u0275entryName: "src/app/modules/converter/17-number-base-converter/number-base-converter.component.ts" } : {}),
  __spreadValues({
    path: "encoding-converter",
    loadComponent: () => import("./chunk-PD4SSYXZ.js").then((m) => m.EncodingConverterComponent),
    providers: [provideState(encodingConverterFeature)],
    title: "Encoding Converter \u2014 Omni-Tool",
    data: { category: "text" }
  }, false ? { \u0275entryName: "src/app/modules/converter/18-encoding-converter/encoding-converter.component.ts" } : {}),
  __spreadValues({
    path: "font-converter",
    loadComponent: () => import("./chunk-QYHHJAY5.js").then((m) => m.FontConverterComponent),
    providers: [provideState(fontConverterFeature)],
    title: "Font Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, false ? { \u0275entryName: "src/app/modules/converter/19-font-converter/font-converter.component.ts" } : {}),
  __spreadValues({
    path: "ebook-converter",
    loadComponent: () => import("./chunk-2NCVEZNA.js").then((m) => m.EbookConverterComponent),
    providers: [provideState(ebookConverterFeature)],
    title: "Ebook Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, false ? { \u0275entryName: "src/app/modules/converter/20-ebook-converter/ebook-converter.component.ts" } : {}),
  __spreadValues({
    path: "archive-converter",
    loadComponent: () => import("./chunk-BEXKYTKN.js").then((m) => m.ArchiveConverterComponent),
    providers: [provideState(archiveConverterFeature)],
    title: "Archive Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, false ? { \u0275entryName: "src/app/modules/converter/21-archive-converter/archive-converter.component.ts" } : {}),
  __spreadValues({
    path: "cad-converter",
    loadComponent: () => import("./chunk-S3HOREKP.js").then((m) => m.CadConverterComponent),
    providers: [provideState(cadConverterFeature)],
    title: "CAD Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, false ? { \u0275entryName: "src/app/modules/converter/22-cad-converter/cad-converter.component.ts" } : {}),
  __spreadValues({
    path: "subtitle-converter",
    loadComponent: () => import("./chunk-64N6IR3Z.js").then((m) => m.SubtitleConverterComponent),
    providers: [provideState(subtitleConverterFeature)],
    title: "Subtitle Converter \u2014 Omni-Tool",
    data: { category: "video" }
  }, false ? { \u0275entryName: "src/app/modules/converter/23-subtitle-converter/subtitle-converter.component.ts" } : {}),
  __spreadValues({
    path: "spreadsheet-converter",
    loadComponent: () => import("./chunk-PA5CWDDV.js").then((m) => m.SpreadsheetConverterComponent),
    providers: [provideState(spreadsheetConverterFeature)],
    title: "Spreadsheet Converter \u2014 Omni-Tool",
    data: { category: "document" }
  }, false ? { \u0275entryName: "src/app/modules/converter/24-spreadsheet-converter/spreadsheet-converter.component.ts" } : {}),
  __spreadValues({
    path: "qr-generator",
    loadComponent: () => import("./chunk-R6TOPGWV.js").then((m) => m.QrGeneratorComponent),
    providers: [provideState(qrGeneratorFeature)],
    title: "QR Code Generator \u2014 Omni-Tool",
    data: { category: "utility" }
  }, false ? { \u0275entryName: "src/app/modules/converter/25-qr-generator/qr-generator.component.ts" } : {}),
  __spreadValues({
    path: "barcode-generator",
    loadComponent: () => import("./chunk-YIHQDNUD.js").then((m) => m.BarcodeGeneratorComponent),
    providers: [provideState(barcodeGeneratorFeature)],
    title: "Barcode Generator \u2014 Omni-Tool",
    data: { category: "utility" }
  }, false ? { \u0275entryName: "src/app/modules/converter/26-barcode-generator/barcode-generator.component.ts" } : {}),
  __spreadValues({
    path: "ico-converter",
    loadComponent: () => import("./chunk-U3EABADG.js").then((m) => m.IcoConverterComponent),
    providers: [provideState(icoConverterFeature)],
    title: "ICO / Favicon Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, false ? { \u0275entryName: "src/app/modules/converter/27-ico-converter/ico-converter.component.ts" } : {}),
  __spreadValues({
    path: "gif-converter",
    loadComponent: () => import("./chunk-O6GTCRCH.js").then((m) => m.GifConverterComponent),
    providers: [provideState(gifConverterFeature)],
    title: "GIF Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, false ? { \u0275entryName: "src/app/modules/converter/28-gif-converter/gif-converter.component.ts" } : {}),
  __spreadValues({
    path: "raw-image-converter",
    loadComponent: () => import("./chunk-HBQ6VGMB.js").then((m) => m.RawImageConverterComponent),
    providers: [provideState(rawImageConverterFeature)],
    title: "RAW Image Converter \u2014 Omni-Tool",
    data: { category: "image" }
  }, false ? { \u0275entryName: "src/app/modules/converter/29-raw-image-converter/raw-image-converter.component.ts" } : {}),
  __spreadValues({
    path: "batch-converter",
    loadComponent: () => import("./chunk-JF3HB623.js").then((m) => m.BatchConverterComponent),
    providers: [provideState(batchConverterFeature)],
    title: "Batch Converter \u2014 Omni-Tool",
    data: { category: "utility" }
  }, false ? { \u0275entryName: "src/app/modules/converter/30-batch-converter/batch-converter.component.ts" } : {}),
  {
    path: "",
    redirectTo: "image-converter",
    pathMatch: "full"
  }
];
export {
  CONVERTER_ROUTES
};
//# sourceMappingURL=chunk-AFV4VAC3.js.map
