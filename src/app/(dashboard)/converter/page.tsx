import { Metadata } from 'next';
import Link from 'next/link';
import {
  Image, Video, Music, FileText, Archive, PackagePlus, Binary, Hash,
  FileJson, FileSpreadsheet, Code, Code2, Palette, Ruler, DollarSign,
  Clock, Calculator, Type, Cog, BookOpen, Compass, Shapes, Smartphone,
  Camera, Captions, Table, Fingerprint, QrCode, Barcode, Wand2,
  ArrowLeftRight, Zap, Sparkles, Layers
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Converter Hub | Omni-Tool',
  description: '30 Conversion Tools — format transforms, encoding, hashing, QR codes & more',
};

const CATEGORIES = [
  {
    label: 'Media Converters',
    color: 'from-amber-500/20 to-yellow-500/20',
    border: 'border-amber-500/30',
    tools: [
      { slug: 'image-converter', name: 'Image Converter', desc: 'PNG, JPG, WebP, AVIF', icon: Image, accent: 'text-amber-400' },
      { slug: 'video-converter', name: 'Video Converter', desc: 'MP4/MKV/WebM/MOV', icon: Video, accent: 'text-amber-400' },
      { slug: 'audio-converter', name: 'Audio Converter', desc: 'MP3/WAV/OGG/FLAC', icon: Music, accent: 'text-amber-400' },
      { slug: 'document-converter', name: 'Document Converter', desc: 'UTF-8 re-encoding', icon: FileText, accent: 'text-amber-400' },
      { slug: 'heic-converter', name: 'HEIC Converter', desc: 'HEIC → JPG (WASM)', icon: Smartphone, accent: 'text-amber-400' },
      { slug: 'raw-converter', name: 'RAW Converter', desc: 'CR2/NEF/ARW (WASM)', icon: Camera, accent: 'text-amber-400' },
    ],
  },
  {
    label: 'Data Formats',
    color: 'from-blue-500/20 to-indigo-500/20',
    border: 'border-blue-500/30',
    tools: [
      { slug: 'json-yaml', name: 'JSON ↔ YAML', desc: 'Bidirectional with nesting', icon: FileJson, accent: 'text-blue-400' },
      { slug: 'csv-json', name: 'CSV → JSON', desc: 'RFC-compliant parser', icon: FileSpreadsheet, accent: 'text-blue-400' },
      { slug: 'xml-json', name: 'XML → JSON', desc: 'Structure to JSON', icon: Code2, accent: 'text-blue-400' },
      { slug: 'markdown-html', name: 'Markdown → HTML', desc: 'Full styled template', icon: Code, accent: 'text-blue-400' },
      { slug: 'subtitle-converter', name: 'Subtitle Converter', desc: 'SRT ↔ VTT bidirectional', icon: Captions, accent: 'text-blue-400' },
      { slug: 'spreadsheet-converter', name: 'Spreadsheet', desc: 'TSV ↔ CSV bidirectional', icon: Table, accent: 'text-blue-400' },
    ],
  },
  {
    label: 'Encoding & Hashing',
    color: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30',
    tools: [
      { slug: 'base64', name: 'Base64 Encoder', desc: 'File to Base64 Data URI', icon: Binary, accent: 'text-green-400' },
      { slug: 'hex-encoder', name: 'Hex Encoder', desc: 'Formatted hex dump', icon: Hash, accent: 'text-green-400' },
      { slug: 'hash-generator', name: 'Hash Generator', desc: 'SHA-1/256/384/512', icon: Fingerprint, accent: 'text-green-400' },
      { slug: 'encoding-converter', name: 'Encoding Converter', desc: 'UTF-8/Latin1/ASCII', icon: Type, accent: 'text-green-400' },
      { slug: 'magic-byte-detector', name: 'Magic Byte Detector', desc: '33 file signatures', icon: Wand2, accent: 'text-green-400' },
    ],
  },
  {
    label: 'Unit & Value Converters',
    color: 'from-purple-500/20 to-violet-500/20',
    border: 'border-purple-500/30',
    tools: [
      { slug: 'color-converter', name: 'Color Converter', desc: 'HEX/RGB/HSL/CMYK', icon: Palette, accent: 'text-purple-400' },
      { slug: 'unit-converter', name: 'Unit Converter', desc: 'Length, weight, volume', icon: Ruler, accent: 'text-purple-400' },
      { slug: 'currency-converter', name: 'Currency Converter', desc: '15 currencies offline', icon: DollarSign, accent: 'text-purple-400' },
      { slug: 'timezone-converter', name: 'Timezone Converter', desc: 'Intl.DateTimeFormat', icon: Clock, accent: 'text-purple-400' },
      { slug: 'number-system', name: 'Number System', desc: 'Dec/Bin/Oct/Hex', icon: Calculator, accent: 'text-purple-400' },
    ],
  },
  {
    label: 'Archive & Generation',
    color: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-500/30',
    tools: [
      { slug: 'archive-extractor', name: 'Archive Extractor', desc: 'ZIP directory parser', icon: Archive, accent: 'text-orange-400' },
      { slug: 'archive-creator', name: 'Archive Creator', desc: 'Create ZIP with CRC32', icon: PackagePlus, accent: 'text-orange-400' },
      { slug: 'qr-generator', name: 'QR Code Generator', desc: 'SVG with finder patterns', icon: QrCode, accent: 'text-orange-400' },
      { slug: 'barcode-generator', name: 'Barcode Generator', desc: 'Code39 SVG barcode', icon: Barcode, accent: 'text-orange-400' },
    ],
  },
  {
    label: 'Specialized (WASM)',
    color: 'from-slate-500/20 to-gray-500/20',
    border: 'border-slate-500/30',
    tools: [
      { slug: 'font-converter', name: 'Font Converter', desc: 'TTF/OTF/WOFF (WASM)', icon: Type, accent: 'text-slate-400' },
      { slug: 'ebook-converter', name: 'eBook Converter', desc: 'EPUB/MOBI (WASM)', icon: BookOpen, accent: 'text-slate-400' },
      { slug: 'cad-converter', name: 'CAD Converter', desc: 'DXF/DWG (WASM)', icon: Compass, accent: 'text-slate-400' },
      { slug: 'vector-converter', name: 'Vector Converter', desc: 'SVG normalization', icon: Shapes, accent: 'text-slate-400' },
    ],
  },
];

export default function ConverterHubPage() {
  return (
    <div className="container mx-auto p-6 space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-yellow-600/20 border border-amber-500/20 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <ArrowLeftRight className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wider uppercase">
              Native Web APIs
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400">
            Converter Hub
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl leading-relaxed">
            30 Format Conversion Tools — encoding, hashing, parsing, archiving, and QR/barcode generation, all running locally.
          </p>
          <div className="flex items-center gap-6 mt-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Web Crypto API</span>
            <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-orange-400" /> Streams API</span>
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-400" /> Zero Dependencies</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      {CATEGORIES.map((cat) => (
        <div key={cat.label} className="space-y-4">
          <h2 className="text-lg font-bold text-slate-300 tracking-wide uppercase flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat.color.replace('/20', '')}`} />
            {cat.label}
            <span className="text-xs text-slate-600 font-normal normal-case ml-2">({cat.tools.length} tools)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cat.tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={`/converter/${tool.slug}`}
                  className={`group flex items-start gap-4 p-5 bg-card/50 backdrop-blur-sm border ${cat.border} rounded-2xl hover:bg-gradient-to-br ${cat.color} hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-700/80 transition-colors">
                    <Icon className={`w-5 h-5 ${tool.accent} transition-colors`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-white transition-colors truncate">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{tool.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
