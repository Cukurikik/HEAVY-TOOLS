export type ConverterOperation =
  | "image-converter"
  | "video-converter"
  | "audio-converter"
  | "document-converter"
  | "archive-extractor"
  | "archive-creator"
  | "base64"
  | "hex-encoder"
  | "json-yaml"
  | "csv-json"
  | "markdown-html"
  | "xml-json"
  | "color-converter"
  | "unit-converter"
  | "currency-converter"
  | "timezone-converter"
  | "number-system"
  | "encoding-converter"
  | "font-converter"
  | "ebook-converter"
  | "cad-converter"
  | "vector-converter"
  | "heic-converter"
  | "raw-converter"
  | "subtitle-converter"
  | "spreadsheet-converter"
  | "hash-generator"
  | "qr-generator"
  | "barcode-generator"
  | "magic-byte-detector"
  | "idle";

export interface ConverterTask {
  id: string;
  file: File | null;
  files: File[];
  operation: ConverterOperation;
  options: Record<string, unknown>;
  status: "idle" | "processing" | "success" | "error";
  progress: number;
  resultUrls: string[];
  metadata?: Record<string, any>;
  error: string;
}
