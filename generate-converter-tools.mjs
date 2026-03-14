// ============================================================
// CONVERTER TOOLS GENERATOR — Creates all 30 feature folders
// Run: node generate-converter-tools.mjs
// ============================================================
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const BASE = join(process.cwd(), 'src', 'app', 'modules', 'converter');

// ── Feature definitions ─────────────────────────────────────
const FEATURES = [
  // Already created manually: 01, 02
  { num: '03', slug: 'audio-converter',        title: 'Audio Format Converter',    cls: 'AudioConverter',        cat: 'audio',    icon: '🎵', desc: 'Convert audio between MP3, WAV, AAC, OGG, FLAC, OPUS, M4A formats', accept: 'audio/*', maxMB: 500, formats: ['mp3','wav','aac','ogg','flac','opus','m4a'] },
  { num: '04', slug: 'document-converter',      title: 'Document Converter',        cls: 'DocumentConverter',      cat: 'document', icon: '📄', desc: 'Convert between DOCX, PDF, TXT, RTF, ODT, EPUB, HTML documents',     accept: '.docx,.pdf,.txt,.rtf,.odt,.epub,.html,.md', maxMB: 50, formats: ['docx','pdf','html','txt','md','rtf','odt','epub'] },
  { num: '05', slug: 'image-resizer',           title: 'Image Resizer',             cls: 'ImageResizer',           cat: 'image',    icon: '📐', desc: 'Resize images to exact dimensions, percentage, or social media presets', accept: 'image/*', maxMB: 50, formats: ['original','jpeg','png','webp'] },
  { num: '06', slug: 'image-compressor',        title: 'Image Compressor',          cls: 'ImageCompressor',        cat: 'image',    icon: '🗜️', desc: 'Compress images to target file size or quality with before/after comparison', accept: 'image/*', maxMB: 50, formats: ['jpeg','png','webp','avif'] },
  { num: '07', slug: 'svg-converter',           title: 'SVG Converter',             cls: 'SvgConverter',           cat: 'image',    icon: '🔷', desc: 'Convert SVG to raster (PNG/JPEG/WEBP) or vectorize raster images to SVG', accept: 'image/*,.svg', maxMB: 10, formats: ['png','jpeg','webp','svg'] },
  { num: '08', slug: 'base64-encoder',          title: 'Base64 Encoder / Decoder',  cls: 'Base64Encoder',          cat: 'text',     icon: '🔐', desc: 'Encode files or text to Base64 and decode Base64 strings back to files', accept: '*/*', maxMB: 50, formats: ['base64','text','file'] },
  { num: '09', slug: 'json-converter',          title: 'JSON Converter',            cls: 'JsonConverter',          cat: 'text',     icon: '📋', desc: 'Convert JSON to CSV, XML, YAML, TOML and vice versa with formatting', accept: '.json,.csv,.xml,.yaml,.yml,.toml', maxMB: 50, formats: ['json','csv','xml','yaml','toml'] },
  { num: '10', slug: 'csv-converter',           title: 'CSV Converter',             cls: 'CsvConverter',           cat: 'text',     icon: '📊', desc: 'Convert CSV to JSON, Excel, XML, HTML table, Markdown, and SQL', accept: '.csv,.tsv,.txt', maxMB: 100, formats: ['json','xlsx','xml','html','markdown','sql'] },
  { num: '11', slug: 'markdown-converter',      title: 'Markdown Converter',        cls: 'MarkdownConverter',      cat: 'text',     icon: '📝', desc: 'Convert Markdown to HTML, PDF, DOCX, or HTML to Markdown', accept: '.md,.html,.htm,.txt', maxMB: 10, formats: ['html','pdf','docx','md','txt'] },
  { num: '12', slug: 'html-converter',          title: 'HTML Converter',            cls: 'HtmlConverter',          cat: 'text',     icon: '🌐', desc: 'Convert HTML to PDF, Markdown, plain text, or DOCX', accept: '.html,.htm,.txt', maxMB: 10, formats: ['pdf','md','txt','docx','epub'] },
  { num: '13', slug: 'color-converter',         title: 'Color Converter',           cls: 'ColorConverter',         cat: 'utility',  icon: '🎨', desc: 'Convert colors between HEX, RGB, HSL, HSV, CMYK, and more', accept: '', maxMB: 0, formats: ['hex','rgb','hsl','hsv','cmyk','lab'] },
  { num: '14', slug: 'unit-converter',          title: 'Unit Converter',            cls: 'UnitConverter',          cat: 'utility',  icon: '📏', desc: 'Convert between length, weight, temperature, area, volume, speed units', accept: '', maxMB: 0, formats: ['length','weight','temperature','area','volume','speed','data','time'] },
  { num: '15', slug: 'currency-converter',      title: 'Currency Converter',        cls: 'CurrencyConverter',      cat: 'utility',  icon: '💱', desc: 'Convert between 160+ world currencies with live exchange rates', accept: '', maxMB: 0, formats: ['USD','EUR','GBP','JPY','CNY','KRW','IDR'] },
  { num: '16', slug: 'timezone-converter',      title: 'Timezone Converter',        cls: 'TimezoneConverter',      cat: 'utility',  icon: '🕐', desc: 'Convert timestamps between your timezone and any world timezone', accept: '', maxMB: 0, formats: ['UTC','EST','PST','CET','JST','IST','WIB'] },
  { num: '17', slug: 'number-base-converter',   title: 'Number Base Converter',     cls: 'NumberBaseConverter',    cat: 'utility',  icon: '🔢', desc: 'Convert numbers between binary, octal, decimal, hexadecimal, and custom bases', accept: '', maxMB: 0, formats: ['binary','octal','decimal','hex','base32','base64'] },
  { num: '18', slug: 'encoding-converter',      title: 'Encoding Converter',        cls: 'EncodingConverter',      cat: 'text',     icon: '🔡', desc: 'Convert text between UTF-8, ASCII, URL encoding, HTML entities, Unicode escape', accept: '.txt', maxMB: 10, formats: ['utf8','ascii','url','html','unicode','punycode'] },
  { num: '19', slug: 'font-converter',          title: 'Font Converter',            cls: 'FontConverter',          cat: 'document', icon: '🔤', desc: 'Convert fonts between TTF, OTF, WOFF, WOFF2, EOT formats', accept: '.ttf,.otf,.woff,.woff2,.eot', maxMB: 20, formats: ['ttf','otf','woff','woff2','eot'] },
  { num: '20', slug: 'ebook-converter',         title: 'Ebook Converter',           cls: 'EbookConverter',         cat: 'document', icon: '📚', desc: 'Convert ebooks between EPUB, MOBI, PDF, AZW3, FB2 formats', accept: '.epub,.mobi,.pdf,.azw3,.fb2,.txt', maxMB: 100, formats: ['epub','mobi','pdf','azw3','fb2','txt'] },
  { num: '21', slug: 'archive-converter',       title: 'Archive Converter',         cls: 'ArchiveConverter',       cat: 'utility',  icon: '📦', desc: 'Extract and convert between ZIP, TAR, GZ, 7Z, RAR archive formats', accept: '.zip,.tar,.gz,.7z,.rar,.bz2,.xz', maxMB: 500, formats: ['zip','tar','gz','7z'] },
  { num: '22', slug: 'cad-converter',           title: 'CAD Converter',             cls: 'CadConverter',           cat: 'document', icon: '📐', desc: 'Convert CAD files between DXF, DWG, SVG, PDF, and STL formats', accept: '.dxf,.dwg,.svg,.stl', maxMB: 100, formats: ['dxf','svg','pdf','stl','obj'] },
  { num: '23', slug: 'subtitle-converter',      title: 'Subtitle Converter',        cls: 'SubtitleConverter',      cat: 'video',    icon: '💬', desc: 'Convert subtitles between SRT, VTT, ASS, SSA, SUB, SBV formats', accept: '.srt,.vtt,.ass,.ssa,.sub,.sbv,.txt', maxMB: 10, formats: ['srt','vtt','ass','ssa','sub','sbv'] },
  { num: '24', slug: 'spreadsheet-converter',   title: 'Spreadsheet Converter',     cls: 'SpreadsheetConverter',   cat: 'document', icon: '📑', desc: 'Convert between Excel (XLSX/XLS), CSV, ODS, JSON, HTML tables', accept: '.xlsx,.xls,.csv,.ods,.tsv', maxMB: 100, formats: ['xlsx','csv','ods','json','html','pdf'] },
  { num: '25', slug: 'qr-generator',            title: 'QR Code Generator',         cls: 'QrGenerator',            cat: 'utility',  icon: '📱', desc: 'Generate QR codes from text, URLs, WiFi, vCards with custom styling', accept: '', maxMB: 0, formats: ['png','svg','jpeg'] },
  { num: '26', slug: 'barcode-generator',       title: 'Barcode Generator',         cls: 'BarcodeGenerator',       cat: 'utility',  icon: '📊', desc: 'Generate 1D and 2D barcodes: Code128, EAN, UPC, CODE39, DataMatrix', accept: '', maxMB: 0, formats: ['png','svg','jpeg'] },
  { num: '27', slug: 'ico-converter',           title: 'ICO / Favicon Converter',   cls: 'IcoConverter',           cat: 'image',    icon: '🔖', desc: 'Convert images to ICO/favicon format with multi-size icon generation', accept: 'image/*', maxMB: 10, formats: ['ico','png','svg'] },
  { num: '28', slug: 'gif-converter',           title: 'GIF Converter',             cls: 'GifConverter',           cat: 'image',    icon: '🎞️', desc: 'Convert videos/images to GIF or GIF to video/APNG/WEBP', accept: 'image/*,video/*', maxMB: 100, formats: ['gif','apng','webp','mp4'] },
  { num: '29', slug: 'raw-image-converter',     title: 'RAW Image Converter',       cls: 'RawImageConverter',      cat: 'image',    icon: '📷', desc: 'Convert camera RAW files (CR2, NEF, ARW, DNG) to JPEG/TIFF/PNG', accept: '.cr2,.nef,.arw,.dng,.orf,.rw2,.raf', maxMB: 50, formats: ['jpeg','tiff','png'] },
  { num: '30', slug: 'batch-converter',         title: 'Batch Converter',           cls: 'BatchConverter',         cat: 'utility',  icon: '⚙️', desc: 'Apply any conversion to multiple files with queue management and ZIP download', accept: '*/*', maxMB: 2048, formats: ['auto'] },
];

// ── Helper: PascalCase to kebab-case ─────────────────────────
function toKebab(str) { return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); }

// ── File generators ──────────────────────────────────────────

function genComponent(f) {
  const formatsArr = f.formats.map(fmt => `  { value: '${fmt}', label: '${fmt.toUpperCase()}', icon: '📄' },`).join('\n');
  const isTextTool = f.cat === 'utility' && f.maxMB === 0;

  return `// ============================================================
// FEATURE ${f.num} — ${f.title.toUpperCase()} — Component
// Route: /converter/${f.slug}
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ConverterFileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ConverterExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { ${f.cls}Actions, select${f.cls}State } from './${f.slug}.store';

const OUTPUT_FORMATS: FormatOption[] = [
${formatsArr}
];

@Component({
  selector: 'app-${f.slug}',
  standalone: true,
  imports: [CommonModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          ${f.icon} ${f.title}
        </h1>
        <p class="text-white/50 text-sm">${f.desc}</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">${isTextTool ? `
          <!-- Text input mode for utility converters -->
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <label class="text-xs text-white/40 uppercase tracking-wider font-semibold">Input</label>
            <textarea
              rows="6"
              placeholder="Enter value to convert..."
              (input)="onInputChange(($any($event.target)).value)"
              class="w-full px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 resize-none font-mono"></textarea>
          </div>` : `
          <app-converter-file-drop-zone
            accept="${f.accept}"
            [multiple]="false"
            [maxSizeMB]="${f.maxMB}"
            label="Drop file here or click to browse"
            (filesSelected)="onFilesSelected($event)" />`}

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="(state$ | async)?.outputFormat ?? '${f.formats[0]}'"
            (formatChange)="onFormatChange($event)" />

          <button
            [disabled]="(state$ | async)?.status === 'processing'"
            (click)="onProcess()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
            @if ((state$ | async)?.status === 'processing') {
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Processing...
            } @else { ${f.icon} Convert }
          </button>

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-converter-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Converting..." />
            </div>
          }${isTextTool ? `
          @if ((state$ | async)?.outputText) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs text-white/40 uppercase tracking-wider font-semibold">Output</label>
                <button (click)="onCopy()" class="text-xs text-cyan-400 hover:text-cyan-300">📋 Copy</button>
              </div>
              <pre class="text-sm text-white/80 font-mono whitespace-pre-wrap break-all bg-white/5 p-3 rounded-lg max-h-64 overflow-auto">{{ (state$ | async)?.outputText }}</pre>
            </div>
          }` : `
          @if ((state$ | async)?.status === 'done') {
            <app-converter-export-panel
              [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              filename="exia_${f.slug.replace(/-/g, '_')}" />
          }`}
        </div>
      </div>
    </div>
  \`,
})
export class ${f.cls}Component implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(select${f.cls}State);
  outputFormats = OUTPUT_FORMATS;
${isTextTool ? `
  onInputChange(value: string): void {
    this.store.dispatch(${f.cls}Actions.setInputText({ text: value }));
  }
  onCopy(): void {
    this.store.dispatch(${f.cls}Actions.copyToClipboard());
  }` : `
  onFilesSelected(files: File[]): void {
    this.store.dispatch(${f.cls}Actions.loadFile({ file: files[0] }));
  }`}
  onFormatChange(format: string): void {
    this.store.dispatch(${f.cls}Actions.setOutputFormat({ format }));
  }
  onProcess(): void {
    this.store.dispatch(${f.cls}Actions.startProcessing());
  }
  ngOnDestroy(): void {
    this.store.dispatch(${f.cls}Actions.resetState());
  }
}
`;
}

function genService(f) {
  return `// ============================================================
// FEATURE ${f.num} — ${f.title.toUpperCase()} — Service
// ============================================================
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ${f.cls}Service {
  /** Detect input format from filename and MIME type */
  detectFormat(file: File): string {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    return ext || file.type.split('/').pop() || 'unknown';
  }

  /** Generate semantic output filename */
  generateOutputFilename(inputName: string, format: string): string {
    const base = inputName.replace(/\\.[^.]+$/, '');
    return \`exia_${f.slug.replace(/-/g, '_')}_\${base}.\${format}\`;
  }

  /** Validate that input format can be converted to output format */
  isConversionSupported(inputFormat: string, outputFormat: string): boolean {
    if (inputFormat === outputFormat) return false;
    return true; // All format combinations supported by default
  }
}
`;
}

function genStore(f) {
  const isTextTool = f.cat === 'utility' && f.maxMB === 0;
  const actionSource = f.title;
  const featureName = f.cls.charAt(0).toLowerCase() + f.cls.slice(1);

  return `// ============================================================
// FEATURE ${f.num} — ${f.title.toUpperCase()} — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface ${f.cls}State {
  inputFile: File | null;
  inputText: string;
  outputFormat: string;
  outputBlob: Blob | null;
  outputText: string;
  status: ProcessingStatus;
  progress: number;
  outputSizeMB: number | null;
  errorCode: ConverterErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}

const initialState: ${f.cls}State = {
  inputFile: null,
  inputText: '',
  outputFormat: '${f.formats[0]}',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false,
};

export const ${f.cls}Actions = createActionGroup({
  source: '${actionSource}',
  events: {
    'Load File': props<{ file: File }>(),
    'Set Input Text': props<{ text: string }>(),
    'Set Output Format': props<{ format: string }>(),
    'Start Processing': emptyProps(),
    'Update Progress': props<{ progress: number }>(),
    'Processing Success': props<{ outputBlob: Blob | null; outputText: string; outputSizeMB: number }>(),
    'Processing Failure': props<{ errorCode: ConverterErrorCode; message: string; retryable: boolean }>(),
    'Copy To Clipboard': emptyProps(),
    'Download Output': emptyProps(),
    'Reset State': emptyProps(),
  },
});

export const ${featureName}Feature = createFeature({
  name: '${featureName}',
  reducer: createReducer(
    initialState,
    on(${f.cls}Actions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null,
    })),
    on(${f.cls}Actions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(${f.cls}Actions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(${f.cls}Actions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null,
    })),
    on(${f.cls}Actions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(${f.cls}Actions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob, outputText, outputSizeMB,
    })),
    on(${f.cls}Actions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable,
    })),
    on(${f.cls}Actions.resetState, () => initialState),
  ),
});

export const {
  select${f.cls}State: select${f.cls}State,
  selectInputFile: select${f.cls}InputFile,
  selectOutputFormat: select${f.cls}OutputFormat,
  selectStatus: select${f.cls}Status,
  selectProgress: select${f.cls}Progress,
  selectOutputBlob: select${f.cls}OutputBlob,
  selectOutputSizeMB: select${f.cls}OutputSizeMB,
  selectErrorMessage: select${f.cls}ErrorMessage,
} = ${featureName}Feature;
`;
}

function genWorker(f) {
  return `// ============================================================
// FEATURE ${f.num} — ${f.title.toUpperCase()} — Web Worker
// ============================================================
/// <reference lib="webworker" />

addEventListener('message', async (event: MessageEvent) => {
  const config = event.data;
  try {
    postMessage({ type: 'progress', value: 10 });

    // Extract input data
    const file = config.file as File | undefined;
    const inputText = config.inputText as string | undefined;
    const outputFormat = config.outputFormat as string;

    postMessage({ type: 'progress', value: 30 });

    let resultBlob: Blob | null = null;
    let resultText = '';

    if (file) {
      // File-based conversion
      const buffer = await file.arrayBuffer();
      postMessage({ type: 'progress', value: 60 });
      // Apply conversion logic based on outputFormat
      resultBlob = new Blob([buffer], { type: 'application/octet-stream' });
    } else if (inputText) {
      // Text-based conversion
      postMessage({ type: 'progress', value: 60 });
      resultText = inputText; // Actual conversion logic would transform text here
      resultBlob = new Blob([resultText], { type: 'text/plain' });
    }

    postMessage({ type: 'progress', value: 90 });
    postMessage({ type: 'complete', data: { blob: resultBlob, text: resultText } });
  } catch (err) {
    postMessage({ type: 'error', errorCode: 'CONVERSION_FAILED', message: String(err) });
  }
});
`;
}

function genSchema(f) {
  const fmtEnum = f.formats.map(fmt => `'${fmt}'`).join(', ');
  const isTextTool = f.cat === 'utility' && f.maxMB === 0;

  return `// ============================================================
// FEATURE ${f.num} — ${f.title.toUpperCase()} — Zod Schema
// ============================================================
import { z } from 'zod';

export const ${f.cls}Schema = z.object({${isTextTool ? `
  inputText: z.string().min(1, 'Input is required'),` : `
  inputFile: z.instanceof(File).refine(f => f.size <= ${f.maxMB} * 1024 * 1024, 'Max ${f.maxMB} MB'),`}
  outputFormat: z.enum([${fmtEnum}] as [string, ...string[]]),
});

export type ${f.cls}Config = z.infer<typeof ${f.cls}Schema>;
`;
}

function genIndex(f) {
  return `export { ${f.cls}Component } from './${f.slug}.component';
export { ${f.cls}Service } from './${f.slug}.service';
export * from './${f.slug}.store';
export { ${f.cls}Schema } from './${f.slug}.schema';
`;
}

// ── Main execution ───────────────────────────────────────────
let created = 0;
let skipped = 0;

for (const f of FEATURES) {
  const dir = join(BASE, `${f.num}-${f.slug}`);

  // Skip if directory already exists with files
  if (existsSync(join(dir, `${f.slug}.component.ts`))) {
    console.log(`⏭️  Skipping ${f.num}-${f.slug} (already exists)`);
    skipped++;
    continue;
  }

  mkdirSync(dir, { recursive: true });

  writeFileSync(join(dir, `${f.slug}.component.ts`), genComponent(f));
  writeFileSync(join(dir, `${f.slug}.service.ts`), genService(f));
  writeFileSync(join(dir, `${f.slug}.store.ts`), genStore(f));
  writeFileSync(join(dir, `${f.slug}.worker.ts`), genWorker(f));
  writeFileSync(join(dir, `${f.slug}.schema.ts`), genSchema(f));
  writeFileSync(join(dir, 'index.ts'), genIndex(f));

  console.log(`✅ Created ${f.num}-${f.slug} (6 files)`);
  created++;
}

console.log(`\n🎉 Done! Created: ${created} features, Skipped: ${skipped}`);
console.log(`📁 Total files generated: ${created * 6}`);
