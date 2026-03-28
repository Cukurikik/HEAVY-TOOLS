import PdfToolInterface from "@/modules/pdf-forge/components/PdfToolInterface";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const PDF_TOOLS_DATA: Record<string, { title: string; description: string; gradient: string; isMulti?: boolean }> = {
  'merger':             { title: "PDF Merger", description: "Gabungkan multiple PDF menjadi satu dokumen.", gradient: "from-red-500 to-orange-500", isMulti: true },
  'splitter':           { title: "PDF Splitter", description: "Pecah PDF menjadi halaman-halaman terpisah.", gradient: "from-rose-500 to-pink-500" },
  'compressor':         { title: "PDF Compressor", description: "Kompresi ukuran file PDF tanpa kehilangan kualitas.", gradient: "from-amber-500 to-yellow-500" },
  'converter':          { title: "PDF Converter", description: "Konversi dokumen ke/dari format PDF.", gradient: "from-teal-500 to-emerald-500" },
  'ocr':                { title: "OCR Engine", description: "Ekstrak teks dari scan/gambar PDF via Tesseract WASM.", gradient: "from-blue-500 to-indigo-500" },
  'editor':             { title: "PDF Editor", description: "Edit teks dan elemen di dalam dokumen PDF.", gradient: "from-violet-500 to-purple-500" },
  'annotator':          { title: "PDF Annotator", description: "Tambahkan catatan, highlight, dan markup di PDF.", gradient: "from-cyan-500 to-blue-500" },
  'watermark':          { title: "PDF Watermark", description: "Tambah watermark teks/gambar ke setiap halaman.", gradient: "from-fuchsia-500 to-pink-500" },
  'digital-signature':  { title: "Digital Signature", description: "Tanda tangani PDF secara digital dengan sertifikat.", gradient: "from-emerald-500 to-green-500" },
  'encrypt':            { title: "PDF Encrypt", description: "Lindungi PDF dengan password AES-256.", gradient: "from-red-600 to-rose-500" },
  'decrypt':            { title: "PDF Decrypt", description: "Hapus proteksi password dari PDF.", gradient: "from-orange-500 to-amber-500" },
  'rotate-pages':       { title: "Rotate Pages", description: "Putar halaman PDF 90°/180°/270°.", gradient: "from-sky-500 to-blue-500" },
  'crop-pages':         { title: "Crop Pages", description: "Pangkas area halaman PDF secara presisi.", gradient: "from-lime-500 to-green-500" },
  'extract-pages':      { title: "Extract Pages", description: "Ambil halaman tertentu dari dokumen PDF.", gradient: "from-indigo-500 to-violet-500" },
  'reorder-pages':      { title: "Reorder Pages", description: "Susun ulang urutan halaman PDF.", gradient: "from-pink-500 to-rose-500" },
  'redactor':           { title: "PDF Redactor", description: "Hapus informasi sensitif secara permanen.", gradient: "from-red-700 to-red-500" },
  'form-filler':        { title: "Form Filler", description: "Isi formulir PDF interaktif secara programatik.", gradient: "from-blue-600 to-cyan-500" },
  'to-word':            { title: "PDF to Word", description: "Konversi PDF ke DOCX dengan layout preservation.", gradient: "from-blue-500 to-sky-500" },
  'to-excel':           { title: "PDF to Excel", description: "Ekstrak tabel PDF ke format XLSX.", gradient: "from-green-500 to-emerald-500" },
  'to-powerpoint':      { title: "PDF to PowerPoint", description: "Konversi PDF ke format presentasi PPTX.", gradient: "from-orange-500 to-red-500" },
  'to-image':           { title: "PDF to Image", description: "Render halaman PDF sebagai PNG/JPG.", gradient: "from-purple-500 to-indigo-500" },
  'from-image':         { title: "Image to PDF", description: "Konversi gambar menjadi dokumen PDF.", gradient: "from-teal-500 to-cyan-500", isMulti: true },
  'from-html':          { title: "HTML to PDF", description: "Konversi halaman HTML/URL menjadi PDF.", gradient: "from-yellow-500 to-orange-500" },
  'metadata-editor':    { title: "Metadata Editor", description: "Edit informasi metadata dokumen PDF.", gradient: "from-gray-500 to-zinc-500" },
  'table-extractor':    { title: "Table Extractor", description: "Ekstrak tabel data terstruktur dari halaman PDF.", gradient: "from-emerald-500 to-teal-500" },
  'repair':             { title: "PDF Repair", description: "Perbaiki file PDF yang corrupt atau rusak.", gradient: "from-red-500 to-rose-600" },
  'compare':            { title: "PDF Compare", description: "Bandingkan dua dokumen PDF side-by-side.", gradient: "from-violet-500 to-fuchsia-500", isMulti: true },
  'batch-processor':    { title: "Batch Processor", description: "Proses multiple PDF sekaligus.", gradient: "from-cyan-500 to-teal-500", isMulti: true },
  'bookmarks-editor':   { title: "Bookmarks Editor", description: "Edit navigasi bookmarks/outline PDF.", gradient: "from-amber-500 to-orange-500" },
  'xref-analyzer':      { title: "XRef Analyzer", description: "Inspeksi internal cross-reference table PDF.", gradient: "from-slate-500 to-gray-500" },
};

export default async function PdfToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const toolConf = PDF_TOOLS_DATA[tool] || { title: "PDF Engine", description: "Advanced Client-Side PDF Processing", gradient: "from-red-500 to-orange-500" };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2 text-sm text-zinc-400 font-medium mb-4">
        <Link href="/pdf" className="hover:text-white transition-colors">PDF Tools</Link>
        <ChevronRight className="w-4 h-4 text-zinc-600" />
        <span className="text-rose-400 capitalize">{tool.replace(/-/g, ' ')}</span>
      </div>
      
      <PdfToolInterface 
        toolId={tool}
        title={toolConf.title}
        description={toolConf.description}
        gradient={toolConf.gradient}
        acceptMultiple={toolConf.isMulti}
      />
    </div>
  );
}
