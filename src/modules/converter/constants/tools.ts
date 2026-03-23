import { ConverterToolDef } from "../types";
import {
  Image, Video, AudioLines, FileText, Book,
  FileJson, FileSpreadsheet, Code, Hash, Globe,
  Archive, Box, Binary, Hash as Hash2, FileCode2,
  Palette, Ruler, DollarSign, Clock, Key,
  Camera, Eye, Type, Component, PenTool,
  Subtitles, Grip, QrCode, ScanBarcode, Fingerprint
} from "lucide-react";

export const converterTools: ConverterToolDef[] = [
  // Media Converters
  { id: "image-converter", name: "Image Converter", description: "Convert between JPG, PNG, WEBP, AVIF", icon: Image, gradient: "from-blue-500 to-indigo-500", engine: "image", executionType: "client", route: "/converter/image-converter" },
  { id: "video-converter", name: "Video Converter", description: "Convert between MP4, WEBM, MKV", icon: Video, gradient: "from-red-500 to-rose-500", engine: "video", executionType: "client", route: "/converter/video-converter" },
  { id: "audio-converter", name: "Audio Converter", description: "Convert between MP3, WAV, OGG, FLAC", icon: AudioLines, gradient: "from-purple-500 to-fuchsia-500", engine: "audio", executionType: "client", route: "/converter/audio-converter" },
  { id: "document-converter", name: "Document Converter", description: "Convert Word, Excel, PDF, PPT", icon: FileText, gradient: "from-emerald-500 to-teal-500", engine: "document", executionType: "server", route: "/converter/document-converter" },
  { id: "ebook-converter", name: "Ebook Converter", description: "Convert EPUB, MOBI, PDF, AZW3", icon: Book, gradient: "from-amber-500 to-orange-500", engine: "ebook", executionType: "server", route: "/converter/ebook-converter" },

  // Data Codecs
  { id: "json-yaml", name: "JSON ↔ YAML", description: "Convert objects between JSON and YAML", icon: FileJson, gradient: "from-sky-500 to-cyan-500", engine: "json-yaml", executionType: "client", route: "/converter/json-yaml" },
  { id: "csv-json", name: "CSV ↔ JSON", description: "Convert relational data between CSV and JSON arrays", icon: FileSpreadsheet, gradient: "from-green-500 to-emerald-500", engine: "csv-json", executionType: "client", route: "/converter/csv-json" },
  { id: "xml-json", name: "XML ↔ JSON", description: "Convert object hierarchies between XML and JSON", icon: Code, gradient: "from-orange-500 to-red-500", engine: "xml-json", executionType: "client", route: "/converter/xml-json" },
  { id: "markdown-html", name: "Markdown ↔ HTML", description: "Render Markdown to HTML strings and vice versa", icon: Globe, gradient: "from-slate-500 to-gray-500", engine: "markdown-html", executionType: "client", route: "/converter/markdown-html" },
  { id: "base64", name: "Base64 Encoder", description: "Encode binaries/strings to Base64 and decode back", icon: Hash, gradient: "from-violet-500 to-purple-500", engine: "base64", executionType: "client", route: "/converter/base64" },

  // Archives & Dev
  { id: "archive-extractor", name: "Archive Extractor", description: "Extract contents out of ZIP files instantly", icon: Archive, gradient: "from-yellow-500 to-amber-500", engine: "archive-extractor", executionType: "client", route: "/converter/archive-extractor" },
  { id: "archive-creator", name: "Archive Creator", description: "Pack multiple files into a compressed ZIP", icon: Box, gradient: "from-indigo-500 to-blue-500", engine: "archive-creator", executionType: "client", route: "/converter/archive-creator", acceptsMultiple: true },
  { id: "hex-encoder", name: "Hex Encoder", description: "Convert strings into Hexadecimal values", icon: Binary, gradient: "from-rose-500 to-pink-500", engine: "hex-encoder", executionType: "client", route: "/converter/hex-encoder" },
  { id: "number-system", name: "Number System", description: "Convert Bin, Oct, Dec, Hex values", icon: Hash2, gradient: "from-teal-500 to-cyan-500", engine: "number-system", executionType: "client", route: "/converter/number-system" },
  { id: "encoding-converter", name: "Encoding Converter", description: "Convert texts between UTF-8, ASCII, ISO-8859", icon: FileCode2, gradient: "from-fuchsia-500 to-pink-500", engine: "encoding", executionType: "client", route: "/converter/encoding-converter" },

  // Units & Utility
  { id: "color-converter", name: "Color Converter", description: "Convert colors Hex, RGB, HSL, CMYK", icon: Palette, gradient: "from-pink-500 to-rose-500", engine: "color", executionType: "client", route: "/converter/color-converter" },
  { id: "unit-converter", name: "Unit Converter", description: "Convert lengths, weights, temperatures", icon: Ruler, gradient: "from-blue-500 to-cyan-500", engine: "unit", executionType: "client", route: "/converter/unit-converter" },
  { id: "currency-converter", name: "Currency Converter", description: "Real-time fiat currency exchanges", icon: DollarSign, gradient: "from-emerald-500 to-green-500", engine: "currency", executionType: "server", route: "/converter/currency-converter" },
  { id: "timezone-converter", name: "Timezone Converter", description: "Switch between global GMT timezones", icon: Clock, gradient: "from-indigo-500 to-violet-500", engine: "timezone", executionType: "client", route: "/converter/timezone-converter" },
  { id: "hash-generator", name: "Hash Generator", description: "Generate MD5, SHA-1, SHA-256 strings", icon: Key, gradient: "from-stone-500 to-neutral-500", engine: "hash", executionType: "client", route: "/converter/hash-generator" },

  // Specialized Assets
  { id: "heic-converter", name: "HEIC Converter", description: "Convert Apple HEIC photos to generic JPG/PNG", icon: Camera, gradient: "from-sky-500 to-blue-500", engine: "heic", executionType: "client", route: "/converter/heic-converter", acceptsMultiple: true },
  { id: "raw-converter", name: "RAW Image Converter", description: "Convert DSLR RAW formats (CR2, NEF) to JPG", icon: Eye, gradient: "from-orange-500 to-amber-500", engine: "raw", executionType: "server", route: "/converter/raw-converter" },
  { id: "font-converter", name: "Font Converter", description: "Convert TTF, OTF, WOFF, WOFF2", icon: Type, gradient: "from-purple-500 to-indigo-500", engine: "font", executionType: "server", route: "/converter/font-converter" },
  { id: "cad-converter", name: "CAD Converter", description: "Convert DWG, DXF flat vectors", icon: Component, gradient: "from-zinc-500 to-slate-500", engine: "cad", executionType: "server", route: "/converter/cad-converter" },
  { id: "vector-converter", name: "Vector Converter", description: "Convert SVG to clean EPS/AI maps", icon: PenTool, gradient: "from-cyan-500 to-teal-500", engine: "vector", executionType: "server", route: "/converter/vector-converter" },

  // Advanced
  { id: "subtitle-converter", name: "Subtitle Converter", description: "Convert SRT to VTT or format timing", icon: Subtitles, gradient: "from-lime-500 to-emerald-500", engine: "subtitle", executionType: "client", route: "/converter/subtitle-converter" },
  { id: "spreadsheet-converter", name: "Spreadsheet Converter", description: "Convert XLSX and ODS formats", icon: Grip, gradient: "from-green-500 to-teal-500", engine: "spreadsheet", executionType: "client", route: "/converter/spreadsheet-converter" },
  { id: "qr-generator", name: "QR Generator", description: "Encode URLs/text into a scannable QR Code", icon: QrCode, gradient: "from-indigo-500 to-purple-500", engine: "qr", executionType: "client", route: "/converter/qr-generator" },
  { id: "barcode-generator", name: "Barcode Generator", description: "Generate EAN-13, UPC, Code128 barcodes", icon: ScanBarcode, gradient: "from-red-500 to-rose-500", engine: "barcode", executionType: "client", route: "/converter/barcode-generator" },
  { id: "magic-byte-detector", name: "Magic Byte Detector", description: "Identify file types safely by raw binary signature", icon: Fingerprint, gradient: "from-slate-500 to-gray-500", engine: "magic-byte", executionType: "client", route: "/converter/magic-byte-detector" },
];
