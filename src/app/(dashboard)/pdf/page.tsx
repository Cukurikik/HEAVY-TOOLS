import { Metadata } from 'next';
import Link from 'next/link';
import {
  Merge, SplitSquareVertical, Minimize2, RefreshCw, FileSearch, FileEdit,
  Highlighter, Stamp, PenTool, Lock, Unlock, RotateCw, Crop, FileOutput,
  ArrowDownUp, EyeOff, FormInput, FileType, Sheet, Presentation, Image,
  ImagePlus, Code, FileText, Table, Wrench, GitCompare, Box, Bookmark,
  Binary, FileCheck, Zap, Sparkles, Layers
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'PDF Engine | Omni-Tool',
  description: '30 PDF Processing Tools powered by pdf-lib — merge, split, compress, sign & more',
};

const CATEGORIES = [
  {
    label: 'Core Operations',
    color: 'from-rose-500/20 to-red-500/20',
    border: 'border-rose-500/30',
    tools: [
      { slug: 'merger', name: 'PDF Merger', desc: 'Combine N PDFs into one', icon: Merge, accent: 'text-rose-400' },
      { slug: 'splitter', name: 'PDF Splitter', desc: 'Extract specific pages', icon: SplitSquareVertical, accent: 'text-rose-400' },
      { slug: 'compressor', name: 'Compressor', desc: 'Optimize with object streams', icon: Minimize2, accent: 'text-rose-400' },
      { slug: 'converter', name: 'Normalizer', desc: 'Full AST re-serialization', icon: RefreshCw, accent: 'text-rose-400' },
      { slug: 'repair', name: 'PDF Repair', desc: 'Fix corrupt files', icon: Wrench, accent: 'text-rose-400' },
    ],
  },
  {
    label: 'Edit & Annotate',
    color: 'from-blue-500/20 to-indigo-500/20',
    border: 'border-blue-500/30',
    tools: [
      { slug: 'editor', name: 'PDF Editor', desc: 'Add text overlay to pages', icon: FileEdit, accent: 'text-blue-400' },
      { slug: 'annotator', name: 'Annotator', desc: 'Highlight and markup', icon: Highlighter, accent: 'text-blue-400' },
      { slug: 'watermark', name: 'Watermark', desc: 'Diagonal text on all pages', icon: Stamp, accent: 'text-blue-400' },
      { slug: 'digital-signature', name: 'Digital Signature', desc: 'Visual stamp with name/date', icon: PenTool, accent: 'text-blue-400' },
      { slug: 'redactor', name: 'Redactor', desc: 'Black-out sensitive areas', icon: EyeOff, accent: 'text-blue-400' },
      { slug: 'form-filler', name: 'Form Filler', desc: 'Auto-fill and flatten forms', icon: FormInput, accent: 'text-blue-400' },
    ],
  },
  {
    label: 'Page Management',
    color: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/30',
    tools: [
      { slug: 'rotate-pages', name: 'Rotate Pages', desc: '90°/180°/270° rotation', icon: RotateCw, accent: 'text-violet-400' },
      { slug: 'crop-pages', name: 'Crop Pages', desc: 'Set CropBox with margin %', icon: Crop, accent: 'text-violet-400' },
      { slug: 'extract-pages', name: 'Extract Pages', desc: '1,3,5-7 range syntax', icon: FileOutput, accent: 'text-violet-400' },
      { slug: 'reorder-pages', name: 'Reorder Pages', desc: 'Custom order or reverse', icon: ArrowDownUp, accent: 'text-violet-400' },
    ],
  },
  {
    label: 'Security',
    color: 'from-red-600/20 to-orange-500/20',
    border: 'border-red-500/30',
    tools: [
      { slug: 'encrypt', name: 'Encrypt', desc: 'Mark with encryption metadata', icon: Lock, accent: 'text-red-400' },
      { slug: 'decrypt', name: 'Decrypt', desc: 'Re-serialize without restrictions', icon: Unlock, accent: 'text-red-400' },
    ],
  },
  {
    label: 'Format Conversion',
    color: 'from-teal-500/20 to-emerald-500/20',
    border: 'border-teal-500/30',
    tools: [
      { slug: 'to-word', name: 'PDF → Word', desc: 'DOCX (requires WASM)', icon: FileType, accent: 'text-teal-400' },
      { slug: 'to-excel', name: 'PDF → Excel', desc: 'XLSX (requires WASM)', icon: Sheet, accent: 'text-teal-400' },
      { slug: 'to-powerpoint', name: 'PDF → PPTX', desc: 'PowerPoint (requires WASM)', icon: Presentation, accent: 'text-teal-400' },
      { slug: 'to-image', name: 'PDF → Image', desc: 'PNG/JPG (requires pdf.js)', icon: Image, accent: 'text-teal-400' },
      { slug: 'from-image', name: 'Image → PDF', desc: 'PNG/JPG to PDF document', icon: ImagePlus, accent: 'text-teal-400' },
      { slug: 'from-html', name: 'HTML → PDF', desc: 'HTML to PDF (requires WASM)', icon: Code, accent: 'text-teal-400' },
      { slug: 'ocr', name: 'OCR Engine', desc: 'Text extraction via Tesseract', icon: FileSearch, accent: 'text-teal-400' },
    ],
  },
  {
    label: 'Analysis & Batch',
    color: 'from-slate-400/20 to-gray-500/20',
    border: 'border-slate-500/30',
    tools: [
      { slug: 'metadata-editor', name: 'Metadata Editor', desc: 'Title, author, keywords', icon: FileText, accent: 'text-slate-400' },
      { slug: 'table-extractor', name: 'Table Extractor', desc: 'Structure analysis as JSON', icon: Table, accent: 'text-slate-400' },
      { slug: 'compare', name: 'PDF Compare', desc: 'Multi-PDF metadata diff', icon: GitCompare, accent: 'text-slate-400' },
      { slug: 'batch-processor', name: 'Batch Processor', desc: 'Merge + compress all inputs', icon: Box, accent: 'text-slate-400' },
      { slug: 'bookmarks-editor', name: 'Bookmarks Editor', desc: 'PDF outline navigation', icon: Bookmark, accent: 'text-slate-400' },
      { slug: 'xref-analyzer', name: 'XRef Analyzer', desc: 'Internal structure analysis', icon: Binary, accent: 'text-slate-400' },
    ],
  },
];

export default function PdfHubPage() {
  return (
    <div className="container mx-auto p-6 space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600/20 via-red-600/10 to-orange-600/20 border border-rose-500/20 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-500/10 via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold tracking-wider uppercase">
              pdf-lib Engine
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-400 to-orange-400">
            PDF Forge
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl leading-relaxed">
            30 PDF Processing Tools — merge, split, compress, sign, watermark, and analyze documents entirely in your browser.
          </p>
          <div className="flex items-center gap-6 mt-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-rose-400" /> PDF/A Compliant</span>
            <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-red-400" /> AST Manipulation</span>
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-orange-400" /> Form Flattening</span>
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
                  href={`/pdf/${tool.slug}`}
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
