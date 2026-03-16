// ============================================================
// CONVERTER ROUTES — All 30 features registered
// File: src/app/modules/converter/converter.routes.ts
// ============================================================

import { Routes } from "@angular/router";
import { provideState } from "@ngrx/store";
import { imageConverterFeature } from "./01-image-converter/image-converter.store";
import { videoConverterFeature } from "./02-video-converter/video-converter.store";
import { audioConverterFeature } from "./03-audio-converter/audio-converter.store";
import { documentConverterFeature } from "./04-document-converter/document-converter.store";
import { imageResizerFeature } from "./05-image-resizer/image-resizer.store";
import { imageCompressorFeature } from "./06-image-compressor/image-compressor.store";
import { svgConverterFeature } from "./07-svg-converter/svg-converter.store";
import { base64EncoderFeature } from "./08-base64-encoder/base64-encoder.store";
import { jsonConverterFeature } from "./09-json-converter/json-converter.store";
import { csvConverterFeature } from "./10-csv-converter/csv-converter.store";
import { markdownConverterFeature } from "./11-markdown-converter/markdown-converter.store";
import { htmlConverterFeature } from "./12-html-converter/html-converter.store";
import { colorConverterFeature } from "./13-color-converter/color-converter.store";
import { unitConverterFeature } from "./14-unit-converter/unit-converter.store";
import { currencyConverterFeature } from "./15-currency-converter/currency-converter.store";
import { timezoneConverterFeature } from "./16-timezone-converter/timezone-converter.store";
import { numberBaseConverterFeature } from "./17-number-base-converter/number-base-converter.store";
import { encodingConverterFeature } from "./18-encoding-converter/encoding-converter.store";
import { fontConverterFeature } from "./19-font-converter/font-converter.store";
import { ebookConverterFeature } from "./20-ebook-converter/ebook-converter.store";
import { archiveConverterFeature } from "./21-archive-converter/archive-converter.store";
import { cadConverterFeature } from "./22-cad-converter/cad-converter.store";
import { subtitleConverterFeature } from "./23-subtitle-converter/subtitle-converter.store";
import { spreadsheetConverterFeature } from "./24-spreadsheet-converter/spreadsheet-converter.store";
import { qrGeneratorFeature } from "./25-qr-generator/qr-generator.store";
import { barcodeGeneratorFeature } from "./26-barcode-generator/barcode-generator.store";
import { icoConverterFeature } from "./27-ico-converter/ico-converter.store";
import { gifConverterFeature } from "./28-gif-converter/gif-converter.store";
import { rawImageConverterFeature } from "./29-raw-image-converter/raw-image-converter.store";
import { batchConverterFeature } from "./30-batch-converter/batch-converter.store";

function createRoute(
  path: string,
  loadComponent: () => Promise<any>,
  feature: any,
  title: string,
  category: string,
) {
  return {
    path,
    loadComponent,
    providers: [provideState(feature)],
    title,
    data: { category },
  };
}

export const CONVERTER_ROUTES: Routes = [
  createRoute(
    "image-converter",
    () =>
      import("./01-image-converter/image-converter.component").then(
        (m) => m.ImageConverterComponent,
      ),
    imageConverterFeature,
    "Image Converter — Omni-Tool",
    "image",
  ),
  createRoute(
    "video-converter",
    () =>
      import("./02-video-converter/video-converter.component").then(
        (m) => m.VideoConverterComponent,
      ),
    videoConverterFeature,
    "Video Converter — Omni-Tool",
    "video",
  ),
  createRoute(
    "audio-converter",
    () =>
      import("./03-audio-converter/audio-converter.component").then(
        (m) => m.AudioConverterComponent,
      ),
    audioConverterFeature,
    "Audio Converter — Omni-Tool",
    "audio",
  ),
  createRoute(
    "document-converter",
    () =>
      import("./04-document-converter/document-converter.component").then(
        (m) => m.DocumentConverterComponent,
      ),
    documentConverterFeature,
    "Document Converter — Omni-Tool",
    "document",
  ),
  createRoute(
    "image-resizer",
    () =>
      import("./05-image-resizer/image-resizer.component").then(
        (m) => m.ImageResizerComponent,
      ),
    imageResizerFeature,
    "Image Resizer — Omni-Tool",
    "image",
  ),
  createRoute(
    "image-compressor",
    () =>
      import("./06-image-compressor/image-compressor.component").then(
        (m) => m.ImageCompressorComponent,
      ),
    imageCompressorFeature,
    "Image Compressor — Omni-Tool",
    "image",
  ),
  createRoute(
    "svg-converter",
    () =>
      import("./07-svg-converter/svg-converter.component").then(
        (m) => m.SvgConverterComponent,
      ),
    svgConverterFeature,
    "SVG Converter — Omni-Tool",
    "image",
  ),
  createRoute(
    "base64-encoder",
    () =>
      import("./08-base64-encoder/base64-encoder.component").then(
        (m) => m.Base64EncoderComponent,
      ),
    base64EncoderFeature,
    "Base64 Encoder — Omni-Tool",
    "text",
  ),
  createRoute(
    "json-converter",
    () =>
      import("./09-json-converter/json-converter.component").then(
        (m) => m.JsonConverterComponent,
      ),
    jsonConverterFeature,
    "JSON Converter — Omni-Tool",
    "text",
  ),
  createRoute(
    "csv-converter",
    () =>
      import("./10-csv-converter/csv-converter.component").then(
        (m) => m.CsvConverterComponent,
      ),
    csvConverterFeature,
    "CSV Converter — Omni-Tool",
    "text",
  ),
  createRoute(
    "markdown-converter",
    () =>
      import("./11-markdown-converter/markdown-converter.component").then(
        (m) => m.MarkdownConverterComponent,
      ),
    markdownConverterFeature,
    "Markdown Converter — Omni-Tool",
    "text",
  ),
  createRoute(
    "html-converter",
    () =>
      import("./12-html-converter/html-converter.component").then(
        (m) => m.HtmlConverterComponent,
      ),
    htmlConverterFeature,
    "HTML Converter — Omni-Tool",
    "text",
  ),
  createRoute(
    "color-converter",
    () =>
      import("./13-color-converter/color-converter.component").then(
        (m) => m.ColorConverterComponent,
      ),
    colorConverterFeature,
    "Color Converter — Omni-Tool",
    "utility",
  ),
  createRoute(
    "unit-converter",
    () =>
      import("./14-unit-converter/unit-converter.component").then(
        (m) => m.UnitConverterComponent,
      ),
    unitConverterFeature,
    "Unit Converter — Omni-Tool",
    "utility",
  ),
  createRoute(
    "currency-converter",
    () =>
      import("./15-currency-converter/currency-converter.component").then(
        (m) => m.CurrencyConverterComponent,
      ),
    currencyConverterFeature,
    "Currency Converter — Omni-Tool",
    "utility",
  ),
  createRoute(
    "timezone-converter",
    () =>
      import("./16-timezone-converter/timezone-converter.component").then(
        (m) => m.TimezoneConverterComponent,
      ),
    timezoneConverterFeature,
    "Timezone Converter — Omni-Tool",
    "utility",
  ),
  createRoute(
    "number-base-converter",
    () =>
      import("./17-number-base-converter/number-base-converter.component").then(
        (m) => m.NumberBaseConverterComponent,
      ),
    numberBaseConverterFeature,
    "Number Base Converter — Omni-Tool",
    "utility",
  ),
  createRoute(
    "encoding-converter",
    () =>
      import("./18-encoding-converter/encoding-converter.component").then(
        (m) => m.EncodingConverterComponent,
      ),
    encodingConverterFeature,
    "Encoding Converter — Omni-Tool",
    "text",
  ),
  createRoute(
    "font-converter",
    () =>
      import("./19-font-converter/font-converter.component").then(
        (m) => m.FontConverterComponent,
      ),
    fontConverterFeature,
    "Font Converter — Omni-Tool",
    "document",
  ),
  createRoute(
    "ebook-converter",
    () =>
      import("./20-ebook-converter/ebook-converter.component").then(
        (m) => m.EbookConverterComponent,
      ),
    ebookConverterFeature,
    "Ebook Converter — Omni-Tool",
    "document",
  ),
  createRoute(
    "archive-converter",
    () =>
      import("./21-archive-converter/archive-converter.component").then(
        (m) => m.ArchiveConverterComponent,
      ),
    archiveConverterFeature,
    "Archive Converter — Omni-Tool",
    "utility",
  ),
  createRoute(
    "cad-converter",
    () =>
      import("./22-cad-converter/cad-converter.component").then(
        (m) => m.CadConverterComponent,
      ),
    cadConverterFeature,
    "CAD Converter — Omni-Tool",
    "document",
  ),
  createRoute(
    "subtitle-converter",
    () =>
      import("./23-subtitle-converter/subtitle-converter.component").then(
        (m) => m.SubtitleConverterComponent,
      ),
    subtitleConverterFeature,
    "Subtitle Converter — Omni-Tool",
    "video",
  ),
  createRoute(
    "spreadsheet-converter",
    () =>
      import("./24-spreadsheet-converter/spreadsheet-converter.component").then(
        (m) => m.SpreadsheetConverterComponent,
      ),
    spreadsheetConverterFeature,
    "Spreadsheet Converter — Omni-Tool",
    "document",
  ),
  createRoute(
    "qr-generator",
    () =>
      import("./25-qr-generator/qr-generator.component").then(
        (m) => m.QrGeneratorComponent,
      ),
    qrGeneratorFeature,
    "QR Code Generator — Omni-Tool",
    "utility",
  ),
  createRoute(
    "barcode-generator",
    () =>
      import("./26-barcode-generator/barcode-generator.component").then(
        (m) => m.BarcodeGeneratorComponent,
      ),
    barcodeGeneratorFeature,
    "Barcode Generator — Omni-Tool",
    "utility",
  ),
  createRoute(
    "ico-converter",
    () =>
      import("./27-ico-converter/ico-converter.component").then(
        (m) => m.IcoConverterComponent,
      ),
    icoConverterFeature,
    "ICO / Favicon Converter — Omni-Tool",
    "image",
  ),
  createRoute(
    "gif-converter",
    () =>
      import("./28-gif-converter/gif-converter.component").then(
        (m) => m.GifConverterComponent,
      ),
    gifConverterFeature,
    "GIF Converter — Omni-Tool",
    "image",
  ),
  createRoute(
    "raw-image-converter",
    () =>
      import("./29-raw-image-converter/raw-image-converter.component").then(
        (m) => m.RawImageConverterComponent,
      ),
    rawImageConverterFeature,
    "RAW Image Converter — Omni-Tool",
    "image",
  ),
  createRoute(
    "batch-converter",
    () =>
      import("./30-batch-converter/batch-converter.component").then(
        (m) => m.BatchConverterComponent,
      ),
    batchConverterFeature,
    "Batch Converter — Omni-Tool",
    "utility",
  ),
  {
    path: "",
    redirectTo: "image-converter",
    pathMatch: "full",
  },
];
