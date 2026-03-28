/**
 * 30-Tier Command Router for the Omni-Converter Engine
 * 
 * Determines whether a tool requires the custom JS Native worker (ArrayBuffer, Crypto, Jszip)
 * or if it should be delegated to the Media WebWorkers (Video/Audio/Image) 
 * or purely Client-Side UI rendered (QR Generator, Base64).
 */

import { ConverterOperation } from "../types";

export type ConverterEngineType = "js-worker" | "video-engine" | "audio-engine" | "image-engine" | "pdf-engine" | "ui-only";

export const getEngineTypeForConverter = (toolSlug: ConverterOperation): ConverterEngineType => {
  switch (toolSlug) {
    // 1. Media Engines (Delegated)
    case "video-converter": return "video-engine";
    case "audio-converter": return "audio-engine";
    case "image-converter": 
    case "heic-converter": 
    case "raw-converter": 
    case "vector-converter": return "image-engine";
    
    // 2. Document/PDF Engines
    case "document-converter":
    case "ebook-converter":
    case "cad-converter": return "pdf-engine";

    // 3. Native JS Background Threads (ZIP, Data Parsing, Hashes)
    case "archive-extractor":
    case "archive-creator":
    case "spreadsheet-converter":
    case "subtitle-converter":
    case "markdown-html":
    case "csv-json":
    case "json-yaml":
    case "xml-json":
    case "hash-generator":
    case "magic-byte-detector":
    case "font-converter":
      return "js-worker";

    // 4. Pure UI Instant Tools (Text-based encodings, Colors, QR)
    case "base64":
    case "hex-encoder":
    case "color-converter":
    case "unit-converter":
    case "currency-converter":
    case "timezone-converter":
    case "number-system":
    case "encoding-converter":
    case "qr-generator":
    case "barcode-generator":
      return "ui-only";

    default:
      return "ui-only";
  }
};
