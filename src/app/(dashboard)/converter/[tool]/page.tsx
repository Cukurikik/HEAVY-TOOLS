import { ConverterToolInterface } from "@/modules/converter-engine/components/ConverterToolInterface";
import { ConverterOperation } from "@/modules/converter-engine/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const CONVERTER_TOOLS_DATA: Record<string, { title: string; description: string; isMulti?: boolean }> = {
  // 1. Extreme Parsers (Hash & Binary)
  'magic-byte-detector': { title: "Magic Byte Sniffer", description: "Bongkar header heksadesimal 16-byte pertama untuk forensik struktur data murni." },
  'hash-generator': { title: "GB-Tier Hash Generator", description: "Enkripsi satu arah SHA-256 hingga 10GB file menggunakan stream WebCrypto API Native." },
  'base64': { title: "Base64 Encoder", description: "Transkrip binary objek ke Base64 UTF-8 string tanpa batasan panjang byte memori." },
  'hex-encoder': { title: "Hex Dump Encoder", description: "Terjemahkan file raw murni ke tabel pemetaan heksadesimal memori V8." },
  
  // 2. Archive & OPFS
  'archive-extractor': { title: "OPFS Archive Extractor", description: "Destruksi mount ZIP, RAR, TAR berukuran masif dan simpan bypass ke OPFS Browser lokal." },
  'archive-creator': { title: "Bulk Archive Creator", description: "Satukan ratusan file ke dalam kontainer ZIP solid state array compression tanpa NodeJS." },
  
  // 3. Document Transform
  'markdown-html': { title: "Markdown to HTML", description: "Compile skema MD AST parser ke DOM Node strings dengan resolusi tinggi." },
  'csv-json': { title: "CSV / JSON Swapper", description: "Pivot dan transform dataset relasional menjadi struktur berorientasi objek instan." },
  'json-yaml': { title: "JSON / YAML Switcher", description: "Perubahan arsitektur konfigurasi lintasan bahasa JSON & YAML." },
  'xml-json': { title: "XML to JSON", description: "Ubah markup parsial lawas XML menjadi JSON modern super cepat." },
  
  // 4. Media Proxy Overrides
  'heic-converter': { title: "HEIC/RAW Destructor", description: "Hancurkan kompresi hardware Apple HEIC ke JPG universal tanpa server Mac via WASM." },
  'image-converter': { title: "Universal Image API", description: "Jembatan proxy peretas konversi lintas raster." },
  'video-converter': { title: "Video Matrix Injector", description: "Tunnel ke FFmpeg matrix convert video." },
  'audio-converter': { title: "Audio Hub Stream", description: "Tunnel ke FFmpeg matrix convert audio." },
  
  // 5. Utilities
  'color-converter': { title: "Deep Color Profile Converter", description: "Translasikan model ruang HSV, HSL, RGB, CMYK murni kalkulasi persisi floating-point." },
  'unit-converter': { title: "Scientific Unit Converter", description: "Skala transformasi matematika sistem Imperial vs Metrik ISO absolute." },
  'timezone-converter': { title: "TZ Delta Calculator", description: "Tentukan selisih epoch ms berdasarkan tz database lintasan bumi realtime." },
  'qr-generator': { title: "QR Payload Encoder", description: "Rakit 2D Barcode Data Payload berdasar standar Reed-Solomon Error Correction." },
  'barcode-generator': { title: "1D Barcode Stripper", description: "Suntik string serial menjadi CODE128 vector bars presisi scanner." }
};

export default async function ConverterToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const toolConf = CONVERTER_TOOLS_DATA[tool] || { title: "Converter Edge Node", description: "Local Parameter Parsing Runtime" };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2 text-sm text-slate-500 font-medium mb-4">
        <Link href="/converter" className="hover:text-white transition-colors">Omni-Converter Data Layer</Link>
        <ChevronRight className="w-4 h-4 text-emerald-600" />
        <span className="text-emerald-400 capitalize">{tool.replace(/-/g, ' ')}</span>
      </div>
      
      <ConverterToolInterface 
        toolId={tool as ConverterOperation} 
        title={toolConf.title}
        description={toolConf.description}
        isMultiFile={toolConf.isMulti}
      />
    </div>
  );
}
