import { z } from 'zod'

// ═══════════════════════════════════════════════════
// Zod Schemas for Converter Tools Validation (Phase 10: Task 96)
// ═══════════════════════════════════════════════════

// ── Image Converter ──
export const ImageConvertSchema = z.object({
  inputFormat: z.enum(['jpeg', 'jpg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'heic', 'heif', 'svg', 'ico', 'raw']),
  outputFormat: z.enum(['jpeg', 'jpg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'svg', 'ico']),
  quality: z.number().min(1).max(100).default(85),
  width: z.number().min(1).max(16384).optional(),
  height: z.number().min(1).max(16384).optional(),
  maintainAspectRatio: z.boolean().default(true),
})

// ── Archive Tools ──
export const ArchiveExtractSchema = z.object({
  archiveFormat: z.enum(['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz']),
  password: z.string().optional(),
  extractAll: z.boolean().default(true),
  selectedFiles: z.array(z.string()).optional(),
})

export const ArchiveCreateSchema = z.object({
  outputFormat: z.enum(['zip', 'tar', 'gz', '7z']),
  compressionLevel: z.number().min(0).max(9).default(6),
  password: z.string().optional(),
})

// ── Text/Data Converters ──
export const Base64Schema = z.object({
  mode: z.enum(['encode', 'decode']),
  input: z.string().min(1),
})

export const JsonYamlSchema = z.object({
  direction: z.enum(['json-to-yaml', 'yaml-to-json']),
  input: z.string().min(1),
  indent: z.number().min(1).max(8).default(2),
})

export const CsvJsonSchema = z.object({
  direction: z.enum(['csv-to-json', 'json-to-csv']),
  input: z.string().min(1),
  delimiter: z.string().default(','),
  hasHeaders: z.boolean().default(true),
})

export const MarkdownHtmlSchema = z.object({
  direction: z.enum(['md-to-html', 'html-to-md']),
  input: z.string().min(1),
  injectTailwind: z.boolean().default(false),
})

export const XmlJsonSchema = z.object({
  direction: z.enum(['xml-to-json', 'json-to-xml']),
  input: z.string().min(1),
})

// ── Color Converter ──
export const ColorConvertSchema = z.object({
  input: z.string().min(1), // e.g., "#FF5733" or "rgb(255,87,51)"
  outputFormat: z.enum(['hex', 'rgb', 'hsl', 'hsv', 'cmyk']),
})

// ── Unit Converter ──
export const UnitConvertSchema = z.object({
  value: z.number(),
  fromUnit: z.string().min(1),
  toUnit: z.string().min(1),
  category: z.enum(['length', 'weight', 'temperature', 'volume', 'area', 'speed', 'time', 'data']),
})

// ── Currency Converter ──
export const CurrencyConvertSchema = z.object({
  amount: z.number().positive(),
  fromCurrency: z.string().length(3), // ISO 4217
  toCurrency: z.string().length(3),
})

// ── Timezone Converter ──
export const TimezoneConvertSchema = z.object({
  datetime: z.string(), // ISO 8601
  fromTimezone: z.string().min(1),
  toTimezone: z.string().min(1),
})

// ── Number System Converter ──
export const NumberSystemSchema = z.object({
  value: z.string().min(1),
  fromBase: z.enum(['2', '8', '10', '16']),
  toBase: z.enum(['2', '8', '10', '16']),
})

// ── Encoding Converter ──
export const EncodingSchema = z.object({
  input: z.string().min(1),
  fromEncoding: z.enum(['utf-8', 'utf-16', 'ascii', 'iso-8859-1', 'shift-jis', 'euc-kr']),
  toEncoding: z.enum(['utf-8', 'utf-16', 'ascii', 'iso-8859-1', 'shift-jis', 'euc-kr']),
})

// ── Subtitle Converter ──
export const SubtitleConvertSchema = z.object({
  inputFormat: z.enum(['srt', 'vtt', 'ass', 'ssa', 'sub']),
  outputFormat: z.enum(['srt', 'vtt', 'ass', 'ssa', 'sub']),
  translateTo: z.string().optional(), // ISO 639-1 language code
})

// ── Hash Generator ──
export const HashGeneratorSchema = z.object({
  input: z.string().min(1),
  algorithm: z.enum(['md5', 'sha1', 'sha256', 'sha384', 'sha512']),
})

// ── QR/Barcode Generator ──
export const QrGeneratorSchema = z.object({
  content: z.string().min(1).max(4296),
  size: z.number().min(64).max(2048).default(256),
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).default('M'),
  foregroundColor: z.string().default('#000000'),
  backgroundColor: z.string().default('#ffffff'),
})

export const BarcodeGeneratorSchema = z.object({
  content: z.string().min(1),
  format: z.enum(['CODE128', 'CODE39', 'EAN13', 'EAN8', 'UPC', 'ITF14']).default('CODE128'),
  width: z.number().min(1).max(4).default(2),
  height: z.number().min(20).max(200).default(100),
})

// ── Cloud Run Trigger Schema ──
export const CloudRunTriggerSchema = z.object({
  operation: z.enum(['cad-converter', 'ebook-converter', 'archive-extractor', 'spreadsheet-converter']),
  inputBucketPath: z.string().min(1),
  outputFormat: z.string().min(1),
  userId: z.string().min(1),
  options: z.record(z.string(), z.unknown()).default({}),
})

// ── Telemetry Schema ──
export const TelemetrySchema = z.object({
  type: z.enum(['usage', 'performance', 'crash', 'browser']),
  operation: z.string().optional(),
  originalFormat: z.string().optional(),
  targetFormat: z.string().optional(),
  durationMs: z.number().optional(),
  fileSizeBytes: z.number().optional(),
  engine: z.enum(['wasm', 'cloud-run']).optional(),
  success: z.boolean().optional(),
  errorStack: z.string().optional(),
  browserInfo: z.record(z.string(), z.unknown()).optional(),
})
