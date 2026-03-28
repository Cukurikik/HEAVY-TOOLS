import type { PdfOperation, PdfExecution, PdfEngine } from '../types';
import {
  FileStack,
  Scissors,
  Minimize2,
  RefreshCw,
  ScanText,
  PenTool,
  Highlighter,
  Stamp,
  ShieldCheck,
  Lock,
  Unlock,
  RotateCw,
  Crop,
  FileOutput,
  ArrowUpDown,
  EyeOff,
  ClipboardEdit,
  FileText,
  Table,
  Presentation,
  Image as ImageIcon,
  ImagePlus,
  Globe,
  Info,
  Grid3X3,
  Wrench,
  GitCompare,
  Layers,
  Bookmark,
  Binary,
  LucideIcon
} from 'lucide-react';

export interface PdfToolDef {
  id: PdfOperation;
  name: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  engines: PdfEngine[];
  execution: PdfExecution;
  route: string;
  acceptMultiple: boolean;
}

export const PDF_TOOLS: PdfToolDef[] = [
  { id: 'merge', name: 'PDF Merger', description: 'Gabungkan beberapa file PDF menjadi satu dokumen', icon: FileStack, gradient: 'from-red-500 to-orange-500', engines: ['pdf-lib'], execution: 'client', route: '/pdf/merger', acceptMultiple: true },
  { id: 'split', name: 'PDF Splitter', description: 'Pecah PDF berdasarkan halaman atau range', icon: Scissors, gradient: 'from-orange-500 to-amber-500', engines: ['pdf-lib'], execution: 'client', route: '/pdf/splitter', acceptMultiple: false },
  { id: 'compress', name: 'PDF Compressor', description: 'Kompres ukuran PDF dengan optimasi gambar', icon: Minimize2, gradient: 'from-amber-500 to-yellow-500', engines: ['pdf-lib', 'sharp'], execution: 'server', route: '/pdf/compressor', acceptMultiple: false },
  { id: 'convert', name: 'PDF Converter', description: 'Konversi dari/ke format Office via LibreOffice', icon: RefreshCw, gradient: 'from-yellow-500 to-lime-500', engines: ['libreoffice'], execution: 'server', route: '/pdf/converter', acceptMultiple: false },
  { id: 'ocr', name: 'PDF OCR', description: 'Ekstrak teks dari PDF scan via Tesseract WASM', icon: ScanText, gradient: 'from-lime-500 to-green-500', engines: ['tesseract'], execution: 'client', route: '/pdf/ocr', acceptMultiple: false },
  { id: 'edit', name: 'PDF Editor', description: 'Edit teks dan elemen PDF secara langsung', icon: PenTool, gradient: 'from-green-500 to-emerald-500', engines: ['pdfjs', 'pdf-lib'], execution: 'client', route: '/pdf/editor', acceptMultiple: false },
  { id: 'annotate', name: 'PDF Annotator', description: 'Tambah highlight, catatan, dan gambar di atas PDF', icon: Highlighter, gradient: 'from-emerald-500 to-teal-500', engines: ['pdfjs', 'konva'], execution: 'client', route: '/pdf/annotator', acceptMultiple: false },
  { id: 'watermark', name: 'Watermark Tool', description: 'Tambah watermark teks/gambar ke setiap halaman', icon: Stamp, gradient: 'from-teal-500 to-cyan-500', engines: ['pdf-lib'], execution: 'client', route: '/pdf/watermark', acceptMultiple: false },
  { id: 'digital-signature', name: 'Digital Signature', description: 'Tanda tangan digital PAdES via Web Crypto', icon: ShieldCheck, gradient: 'from-cyan-500 to-sky-500', engines: ['web-crypto', 'pdf-lib'], execution: 'client', route: '/pdf/digital-signature', acceptMultiple: false },
  { id: 'encrypt', name: 'PDF Encrypt', description: 'Enkripsi PDF dengan AES-256 password', icon: Lock, gradient: 'from-sky-500 to-blue-500', engines: ['web-crypto'], execution: 'client', route: '/pdf/encrypt', acceptMultiple: false },
  { id: 'decrypt', name: 'PDF Decrypt', description: 'Buka PDF terenkripsi dengan password', icon: Unlock, gradient: 'from-blue-500 to-indigo-500', engines: ['web-crypto'], execution: 'client', route: '/pdf/decrypt', acceptMultiple: false },
  { id: 'rotate-pages', name: 'Rotate Pages', description: 'Rotasi halaman 90°/180°/270°', icon: RotateCw, gradient: 'from-indigo-500 to-violet-500', engines: ['pdf-lib'], execution: 'client', route: '/pdf/rotate-pages', acceptMultiple: false },
  { id: 'crop-pages', name: 'Crop Pages', description: 'Potong area halaman dengan cropBox', icon: Crop, gradient: 'from-violet-500 to-purple-500', engines: ['pdf-lib'], execution: 'client', route: '/pdf/crop-pages', acceptMultiple: false },
  { id: 'extract-pages', name: 'Extract Pages', description: 'Ekstrak halaman tertentu ke PDF baru', icon: FileOutput, gradient: 'from-purple-500 to-fuchsia-500', engines: ['pdf-lib'], execution: 'client', route: '/pdf/extract-pages', acceptMultiple: false },
  { id: 'reorder-pages', name: 'Reorder Pages', description: 'Susun ulang halaman dengan drag-and-drop', icon: ArrowUpDown, gradient: 'from-fuchsia-500 to-pink-500', engines: ['pdf-lib', 'dnd-kit'], execution: 'client', route: '/pdf/reorder-pages', acceptMultiple: false },
  { id: 'redact', name: 'PDF Redactor', description: 'Sensor informasi sensitif secara permanen', icon: EyeOff, gradient: 'from-pink-500 to-rose-500', engines: ['pdfjs', 'pdf-lib'], execution: 'client', route: '/pdf/redactor', acceptMultiple: false },
  { id: 'form-fill', name: 'Form Filler', description: 'Isi formulir AcroForm PDF interaktif', icon: ClipboardEdit, gradient: 'from-rose-500 to-red-600', engines: ['pdfjs'], execution: 'client', route: '/pdf/form-filler', acceptMultiple: false },
  { id: 'to-word', name: 'PDF to Word', description: 'Konversi PDF ke DOCX via LibreOffice', icon: FileText, gradient: 'from-blue-600 to-blue-800', engines: ['libreoffice', 'mammoth'], execution: 'server', route: '/pdf/to-word', acceptMultiple: false },
  { id: 'to-excel', name: 'PDF to Excel', description: 'Konversi tabel PDF ke XLSX', icon: Table, gradient: 'from-green-600 to-green-800', engines: ['pdf2json', 'libreoffice'], execution: 'server', route: '/pdf/to-excel', acceptMultiple: false },
  { id: 'to-powerpoint', name: 'PDF to PowerPoint', description: 'Konversi PDF ke PPTX via LibreOffice', icon: Presentation, gradient: 'from-orange-600 to-orange-800', engines: ['libreoffice'], execution: 'server', route: '/pdf/to-powerpoint', acceptMultiple: false },
  { id: 'to-image', name: 'PDF to Image', description: 'Render halaman PDF ke PNG/JPEG', icon: ImageIcon, gradient: 'from-purple-600 to-purple-800', engines: ['pdfjs', 'sharp'], execution: 'client', route: '/pdf/to-image', acceptMultiple: false },
  { id: 'from-image', name: 'Image to PDF', description: 'Gabung gambar menjadi satu PDF', icon: ImagePlus, gradient: 'from-teal-600 to-teal-800', engines: ['pdf-lib', 'heic2any'], execution: 'client', route: '/pdf/from-image', acceptMultiple: true },
  { id: 'from-html', name: 'HTML to PDF', description: 'Konversi HTML/URL ke PDF via Puppeteer', icon: Globe, gradient: 'from-slate-600 to-slate-800', engines: ['puppeteer'], execution: 'server', route: '/pdf/from-html', acceptMultiple: false },
  { id: 'metadata-edit', name: 'Metadata Editor', description: 'Edit title, author, subject, keywords', icon: Info, gradient: 'from-gray-500 to-gray-700', engines: ['pdf-lib'], execution: 'client', route: '/pdf/metadata-editor', acceptMultiple: false },
  { id: 'table-extract', name: 'Table Extractor', description: 'Ekstrak tabel terstruktur dari PDF', icon: Grid3X3, gradient: 'from-emerald-600 to-emerald-800', engines: ['pdf2json'], execution: 'server', route: '/pdf/table-extractor', acceptMultiple: false },
  { id: 'repair', name: 'PDF Repair', description: 'Perbaiki PDF rusak via XREF rebuild', icon: Wrench, gradient: 'from-amber-600 to-amber-800', engines: ['pdf-lib'], execution: 'client', route: '/pdf/repair', acceptMultiple: false },
  { id: 'compare', name: 'PDF Compare', description: 'Bandingkan dua PDF dan highlight perbedaan', icon: GitCompare, gradient: 'from-cyan-600 to-cyan-800', engines: ['pdf-parse', 'diff-match-patch'], execution: 'hybrid', route: '/pdf/compare', acceptMultiple: true },
  { id: 'batch-process', name: 'Batch Processor', description: 'Proses multiple PDF sekaligus dengan antrian', icon: Layers, gradient: 'from-violet-600 to-violet-800', engines: ['pdf-lib'], execution: 'client', route: '/pdf/batch-processor', acceptMultiple: true },
  { id: 'bookmarks-edit', name: 'Bookmarks Editor', description: 'Edit outline/bookmarks PDF', icon: Bookmark, gradient: 'from-red-600 to-red-800', engines: ['pdf-lib'], execution: 'client', route: '/pdf/bookmarks-editor', acceptMultiple: false },
  { id: 'xref-analyze', name: 'XREF Analyzer', description: 'Analisis struktur internal XREF table PDF', icon: Binary, gradient: 'from-zinc-500 to-zinc-700', engines: ['pdf-lib', 'pdf-parse'], execution: 'client', route: '/pdf/xref-analyzer', acceptMultiple: false },
];
