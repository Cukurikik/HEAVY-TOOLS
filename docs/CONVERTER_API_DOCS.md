# Converter Tools — API Documentation

> Auto-generated specification for all 30 Converter Tool endpoints.  
> All tools use client-side processing via Web Workers (Layer 3) unless marked ☁️ Server.

---

## Architecture Overview

```
Client (Browser)
  ├─ useConverterStore.processConversion()
  │    ├─ data-converter.worker.ts   → JSON/YAML/CSV/XML/MD/Subtitle/Spreadsheet/MagicByte
  │    ├─ file-converter.worker.ts   → Image/Video/Audio/Document/HEIC/Font/eBook/RAW/Vector/CAD
  │    ├─ archive.worker.ts          → Archive Extract/Create
  │    └─ hash.worker.ts             → Hash/Base64/Hex/Number/Encoding/Color/Unit/Currency/TZ/QR/Barcode
  │
Server (API Routes)
  ├─ /api/converter/currency         → Frankfurter proxy + DB cache
  ├─ /api/converter/ai/*             → Gemini AI proxy (OCR, Translate, Describe, NLP, Code, DataMap)
  ├─ /api/converter/upload-url       → Firebase signed upload URL
  ├─ /api/converter/download-url     → Firebase signed download URL
  └─ /api/converter/events           → SSE real-time status stream
```

---

## Tool Specifications

### 1. Image Converter ⚡
**Engine:** `image-converter.engine.ts` → `file-converter.worker.ts`  
**Accepts:** JPEG, PNG, GIF, WebP, BMP, TIFF, HEIC, SVG, ICO, RAW  
**Options:**
```json
{
  "outputFormat": "webp",
  "quality": 85,
  "width": 1920,
  "height": 1080,
  "maintainAspectRatio": true
}
```

### 2. Video Converter ⚡
**Engine:** `video-converter.engine.ts` → `file-converter.worker.ts`  
**Accepts:** MP4, WebM, MKV, MOV, AVI  
**Options:**
```json
{
  "outputFormat": "mp4",
  "codec": "h264",
  "crf": 23,
  "resolution": "1920x1080"
}
```

### 3. Audio Converter ⚡
**Engine:** `audio-converter.engine.ts` → `file-converter.worker.ts`  
**Accepts:** MP3, WAV, OGG, FLAC, AAC  
**Options:**
```json
{
  "outputFormat": "mp3",
  "bitrate": 320,
  "sampleRate": 44100
}
```

### 4. Document Converter ☁️
**Engine:** `document-converter.engine.ts` → `file-converter.worker.ts`  
**Accepts:** DOCX, XLSX, PPTX, PDF, TXT  
**Options:**
```json
{
  "outputFormat": "pdf",
  "preserveFormatting": true
}
```

### 5. Archive Extractor ⚡
**Engine:** `archive-extractor.engine.ts` → `archive.worker.ts`  
**Accepts:** ZIP, RAR, 7z, TAR, GZ, BZ2, XZ  
**Options:**
```json
{
  "password": "",
  "extractAll": true,
  "selectedFiles": []
}
```

### 6. Archive Creator ⚡
**Engine:** `archive-creator.engine.ts` → `archive.worker.ts`  
**Accepts:** Multiple files  
**Options:**
```json
{
  "outputFormat": "zip",
  "compressionLevel": 6,
  "password": ""
}
```

### 7. Base64 ⚡
**Engine:** `base64.engine.ts` → `hash.worker.ts`  
**Options:**
```json
{
  "direction": "encode",
  "directInput": "Hello World"
}
```

### 8. Hex Encoder ⚡
**Engine:** `hex-encoder.engine.ts` → `hash.worker.ts`  
**Options:**
```json
{
  "direction": "encode",
  "directInput": "Hello",
  "separator": " "
}
```

### 9. JSON ↔ YAML ⚡
**Engine:** `json-yaml.engine.ts` → `data-converter.worker.ts`  
**Options:**
```json
{
  "direction": "json-to-yaml",
  "indent": 2,
  "directInput": "{\"key\": \"value\"}"
}
```

### 10. CSV ↔ JSON ⚡
**Engine:** `csv-json.engine.ts` → `data-converter.worker.ts`  
**Options:**
```json
{
  "direction": "csv-to-json",
  "delimiter": ",",
  "directInput": "name,age\nAlice,30"
}
```

### 11. Markdown ↔ HTML ⚡
**Engine:** `markdown-html.engine.ts` → `data-converter.worker.ts`  
**Options:**
```json
{
  "direction": "md-to-html",
  "directInput": "# Hello World"
}
```

### 12. XML ↔ JSON ⚡
**Engine:** `xml-json.engine.ts` → `data-converter.worker.ts`  
**Options:**
```json
{
  "direction": "xml-to-json",
  "directInput": "<root><item>value</item></root>"
}
```

### 13. Color Converter ⚡
**Engine:** `color-converter.engine.ts` → `hash.worker.ts`  
**Options:**
```json
{
  "inputFormat": "hex",
  "outputFormat": "rgb",
  "directInput": "#FF5733"
}
```

### 14. Unit Converter ⚡
**Engine:** `unit-converter.engine.ts` → `hash.worker.ts`  
**Options:**
```json
{
  "category": "length",
  "fromUnit": "km",
  "toUnit": "miles",
  "directInput": "10"
}
```

### 15. Currency Converter ☁️
**Engine:** `currency-converter.engine.ts` → `hash.worker.ts`  
**API:** `GET /api/converter/currency?from=USD&to=IDR&amount=100`  
**Options:**
```json
{
  "fromCurrency": "USD",
  "toCurrency": "IDR",
  "directInput": "100"
}
```

### 16. Timezone Converter ⚡
**Engine:** `timezone-converter.engine.ts` → `hash.worker.ts`  
**Options:**
```json
{
  "fromTimezone": "America/New_York",
  "toTimezone": "Asia/Jakarta",
  "directInput": "2025-01-01T12:00:00"
}
```

### 17. Number System ⚡
**Engine:** `number-system.engine.ts` → `hash.worker.ts`  
**Options:**
```json
{
  "fromBase": 10,
  "toBase": 16,
  "directInput": "255"
}
```

### 18. Encoding Converter ⚡
**Engine:** `encoding-converter.engine.ts` → `hash.worker.ts`  
**Options:**
```json
{
  "encoding": "utf-8",
  "directInput": "Hello"
}
```

### 19. Font Converter ☁️
**Engine:** `font-converter.engine.ts` → `file-converter.worker.ts`  
**Accepts:** TTF, OTF, WOFF, WOFF2  
**Options:**
```json
{
  "outputFormat": "woff2"
}
```

### 20. eBook Converter ☁️
**Engine:** `ebook-converter.engine.ts` → `file-converter.worker.ts`  
**Accepts:** EPUB, MOBI, AZW3, PDF, FB2  
**Options:**
```json
{
  "outputFormat": "epub"
}
```

### 21. CAD Converter ☁️
**Engine:** `cad-converter.engine.ts` → `file-converter.worker.ts`  
**Accepts:** DWG, DXF, STEP, IGES  
**Options:**
```json
{
  "outputFormat": "pdf"
}
```

### 22. Vector Converter ☁️
**Engine:** `vector-converter.engine.ts` → `file-converter.worker.ts`  
**Accepts:** SVG, AI, EPS, PDF  
**Options:**
```json
{
  "outputFormat": "svg"
}
```

### 23. HEIC Converter ⚡
**Engine:** `heic-converter.engine.ts` → `file-converter.worker.ts`  
**Accepts:** HEIC, HEIF  
**Options:**
```json
{
  "outputFormat": "jpeg",
  "quality": 90
}
```

### 24. RAW Converter ☁️
**Engine:** `raw-converter.engine.ts` → `file-converter.worker.ts`  
**Accepts:** CR2, NEF, ARW, ORF, DNG, RAF  
**Options:**
```json
{
  "outputFormat": "jpeg",
  "quality": 95
}
```

### 25. Subtitle Converter ⚡
**Engine:** `subtitle-converter.engine.ts` → `data-converter.worker.ts`  
**Accepts:** SRT, VTT, ASS, SSA  
**Options:**
```json
{
  "outputFormat": "vtt"
}
```

### 26. Spreadsheet Converter ⚡
**Engine:** `spreadsheet-converter.engine.ts` → `data-converter.worker.ts`  
**Accepts:** XLSX, CSV, JSON, ODS, HTML  
**Options:**
```json
{
  "outputFormat": "csv",
  "sheetIndex": 0
}
```

### 27. QR Generator ⚡
**Engine:** `qr-generator.engine.ts` → `hash.worker.ts`  
**Options:**
```json
{
  "directInput": "https://example.com",
  "size": 256,
  "errorCorrection": "M"
}
```

### 28. Barcode Generator ⚡
**Engine:** `barcode-generator.engine.ts` → `hash.worker.ts`  
**Options:**
```json
{
  "directInput": "1234567890",
  "format": "CODE128",
  "width": 2,
  "height": 100
}
```

### 29. Hash Generator ⚡
**Engine:** `hash-generator.engine.ts` → `hash.worker.ts`  
**Options:**
```json
{
  "algorithm": "SHA-256",
  "outputFormat": "hex",
  "directInput": "Hello World"
}
```

### 30. Magic Byte Detector ⚡
**Engine:** `magic-byte-detector.engine.ts` → `data-converter.worker.ts`  
**Accepts:** Any file  
**Output:** Detected MIME type, magic bytes hex, file signature info

---

## Server Actions (Phase 3)

| # | Action | File |
|---|--------|------|
| 21 | `saveConverterHistory()` | `converter-actions.ts` |
| 22 | `getConverterHistory()` | `converter-actions.ts` |
| 23 | `deleteConverterHistory()` | `converter-actions.ts` |
| 24 | `saveConverterPreset()` | `converter-actions.ts` |
| 25 | `getConverterPresets()` | `converter-actions.ts` |
| 26 | `deleteConverterPreset()` | `converter-actions.ts` |
| 27 | `pinConvertedFile()` | `converter-actions.ts` |
| 28 | `unpinConvertedFile()` | `converter-actions.ts` |
| 29 | `fetchCurrencyRates()` | `converter-actions.ts` |
| 30 | `fetchTimezoneData()` | `converter-actions.ts` |

## Quota Actions (Phase 7)

| # | Action | File |
|---|--------|------|
| 61 | `checkFileSizeLimit()` | `quota-actions.ts` |
| 62 | `checkBatchLimit()` | `quota-actions.ts` |
| 63 | `checkAdvancedFormatAccess()` | `quota-actions.ts` |
| 64 | `deductConverterCredits()` | `quota-actions.ts` |
| 65 | `getConverterQuota()` | `quota-actions.ts` |
| 69 | `shouldApplyWatermark()` | `quota-actions.ts` |
| 70 | `getConverterFeatureFlags()` | `quota-actions.ts` |

---

## API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/converter/health` | GET | Health check |
| `/api/converter/detect-mime` | POST | MIME type detection |
| `/api/converter/currency` | GET | Currency rates (Frankfurter proxy) |
| `/api/converter/upload-url` | POST | Firebase signed upload URL |
| `/api/converter/download-url` | POST | Firebase signed download URL |
| `/api/converter/cleanup` | POST | Cleanup expired files |
| `/api/converter/events` | GET | SSE real-time stream |
| `/api/converter/telemetry` | POST | Usage analytics |
| `/api/converter/log-error` | POST | Error logging |
| `/api/converter/cloud-run-trigger` | POST | Cloud Run job trigger |
| `/api/converter/cloud-status` | GET | Cloud Run job status |
| `/api/converter/ai/ocr` | POST | AI OCR (Gemini) |
| `/api/converter/ai/translate` | POST | AI Translation (Gemini) |
| `/api/converter/ai/describe` | POST | AI File Description (Gemini) |
| `/api/converter/ai/nlp` | POST | AI NLP Processing (Gemini) |
| `/api/converter/ai/code` | POST | AI Code Generation (Gemini) |
| `/api/converter/ai/data-map` | POST | AI Data Mapping (Gemini) |
