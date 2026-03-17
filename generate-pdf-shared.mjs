import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

const base = 'src/app/modules/pdf/shared';

function w(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
  console.log('  CREATED:', path);
}

// ==========================================
// 1. TYPES & ERRORS
// ==========================================
w(`${base}/types/pdf.types.ts`, `export interface PdfMeta {
  filename: string;
  fileSizeMB: number;
  pageCount: number;
  pdfVersion: string;
  title: string | null;
  author: string | null;
  subject: string | null;
  creator: string | null;
  producer: string | null;
  creationDate: Date | null;
  modificationDate: Date | null;
  isEncrypted: boolean;
  isLinearized: boolean;
  hasAcroForm: boolean;
  hasFlattenedAnnotations: boolean;
  dimensions: { width: number; height: number }[];
}

export type PdfErrorCode =
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'FILE_CORRUPTED'
  | 'PASSWORD_REQUIRED'
  | 'WRONG_PASSWORD'
  | 'PERMISSION_DENIED'
  | 'PAGE_OUT_OF_RANGE'
  | 'MERGE_FAILED'
  | 'SPLIT_FAILED'
  | 'COMPRESS_FAILED'
  | 'OCR_FAILED'
  | 'OCR_MODEL_MISSING'
  | 'GHOSTSCRIPT_LOAD_FAILED'
  | 'GHOSTSCRIPT_TIMEOUT'
  | 'PDFLIB_ERROR'
  | 'RENDER_FAILED'
  | 'FORM_FIELD_NOT_FOUND'
  | 'SIGNATURE_FAILED'
  | 'WORKER_CRASHED'
  | 'WORKER_TIMEOUT'
  | 'UNKNOWN_ERROR';

export type ProcessingStatus = 'idle' | 'loading' | 'validating' | 'processing' | 'rendering' | 'done' | 'error';

export interface WorkerMessage<T = unknown> {
  type: 'progress' | 'complete' | 'error' | 'log' | 'preview';
  value?: number;
  data?: T;
  message?: string;
  errorCode?: PdfErrorCode;
}

export interface PageRange {
  from: number;
  to: number;
}

export interface PdfPermissions {
  printing: boolean;
  copying: boolean;
  editing: boolean;
  annotating: boolean;
  fillingForms: boolean;
}
`);

w(`${base}/errors/pdf.errors.ts`, `import type { PdfErrorCode } from '../types/pdf.types';

export const PdfErrorMessages: Record<PdfErrorCode, string> = {
  FILE_TOO_LARGE: 'File exceeds the 500 MB size limit',
  INVALID_FILE_TYPE: 'Only PDF files are accepted',
  FILE_CORRUPTED: 'The PDF file appears to be corrupted or invalid',
  PASSWORD_REQUIRED: 'This PDF is encrypted — please enter the password',
  WRONG_PASSWORD: 'Incorrect password — please try again',
  PERMISSION_DENIED: 'This PDF has restrictions that prevent this operation',
  PAGE_OUT_OF_RANGE: 'The specified page range is invalid or out of bounds',
  MERGE_FAILED: 'Failed to merge PDF files. Some files may be corrupted or encrypted.',
  SPLIT_FAILED: 'Failed to split PDF. The document may have missing resources.',
  COMPRESS_FAILED: 'Compression failed. Ghostscript encountered a fatal error.',
  OCR_FAILED: 'Text extraction failed. The document might just be images or have corrupted fonts.',
  OCR_MODEL_MISSING: 'Failed to load Tesseract.js language models.',
  GHOSTSCRIPT_LOAD_FAILED: 'Failed to load the Ghostscript WASM binary.',
  GHOSTSCRIPT_TIMEOUT: 'Ghostscript operation timed out (exceeded 5 minutes).',
  PDFLIB_ERROR: 'pdf-lib encountered a structural error while parsing the file.',
  RENDER_FAILED: 'PDF.js rendering crashed on this specific page.',
  FORM_FIELD_NOT_FOUND: 'The specified form field does not exist in this document.',
  SIGNATURE_FAILED: 'Failed to digitally sign document. Check credentials.',
  WORKER_CRASHED: 'The background worker crashed due to an Out-of-Memory (OOM) error.',
  WORKER_TIMEOUT: 'The background worker took too long to respond.',
  UNKNOWN_ERROR: 'An unknown error occurred during processing.',
};

export const PdfErrorRetryable: Record<PdfErrorCode, boolean> = {
  GHOSTSCRIPT_LOAD_FAILED: true,
  GHOSTSCRIPT_TIMEOUT: true,
  WORKER_CRASHED: true,
  WORKER_TIMEOUT: true,
  FILE_CORRUPTED: false,
  PASSWORD_REQUIRED: false,
  WRONG_PASSWORD: true,
  FILE_TOO_LARGE: false,
  INVALID_FILE_TYPE: false,
  PERMISSION_DENIED: false,
  PAGE_OUT_OF_RANGE: true,
  MERGE_FAILED: false,
  SPLIT_FAILED: false,
  COMPRESS_FAILED: false,
  OCR_FAILED: true,
  OCR_MODEL_MISSING: true,
  PDFLIB_ERROR: false,
  RENDER_FAILED: false,
  FORM_FIELD_NOT_FOUND: false,
  SIGNATURE_FAILED: false,
  UNKNOWN_ERROR: true,
};

export function getPdfError(code: PdfErrorCode): { message: string, retryable: boolean } {
  return {
    message: PdfErrorMessages[code] || PdfErrorMessages['UNKNOWN_ERROR'],
    retryable: PdfErrorRetryable[code] ?? true
  };
}
`);

w(`${base}/schemas/pdf.schemas.ts`, `import { z } from 'zod';

export const PdfFileSchema = z.custom<File>(v => v instanceof File && v.type === 'application/pdf')
  .refine(f => f.size <= 500 * 1024 * 1024, 'File must be under 500 MB');

export const PageRangeSchema = z.object({
  from: z.number().int().min(1),
  to: z.number().int().min(1),
}).refine(d => d.to >= d.from, 'End page must be >= start page');

export const PasswordSchema = z.string().min(1).max(128);

export const EncryptionStrengthSchema = z.enum(['AES-128', 'AES-256']);

export const ImageFormatSchema = z.enum(['jpeg', 'png', 'webp']);

export const CompressionLevelSchema = z.enum(['low', 'medium', 'high', 'maximum']);
`);

// ==========================================
// 2. ENGINE EXPERTS (Stubs resolving to actual implementations in worker or UI)
// ==========================================
w(`${base}/engine/pdf-lib.service.ts`, `import { Injectable } from '@angular/core';
import type { PdfMeta } from '../types/pdf.types';
import { PDFDocument } from 'pdf-lib';

@Injectable({ providedIn: 'root' })
export class PdfLibService {
  async getMetadata(file: File): Promise<PdfMeta> {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      const title = doc.getTitle() || null;
      const author = doc.getAuthor() || null;
      const subject = doc.getSubject() || null;
      const creator = doc.getCreator() || null;
      const producer = doc.getProducer() || null;
      const creationDate = doc.getCreationDate() || null;
      const modificationDate = doc.getModificationDate() || null;
      
      const pageCount = doc.getPageCount();
      const isEncrypted = doc.isEncrypted;
      
      const numBytes = arrayBuffer.byteLength;
      const dimensions = doc.getPages().slice(0, 10).map(p => {
        const size = p.getSize();
        return { width: size.width, height: size.height };
      });
      
      return {
        filename: file.name,
        fileSizeMB: numBytes / (1024 * 1024),
        pageCount,
        pdfVersion: '1.7', // Assuming for now
        title, author, subject, creator, producer, creationDate, modificationDate,
        isEncrypted,
        isLinearized: false,
        hasAcroForm: !!doc.getForm(),
        hasFlattenedAnnotations: false,
        dimensions
      };
    } catch(e) {
      console.warn("pdf-lib metadata extraction warning:", e);
      // Fallback
      return {
        filename: file.name,
        fileSizeMB: file.size / (1024 * 1024),
        pageCount: 0,
        pdfVersion: 'Unknown',
        title: null, author: null, subject: null, creator: null, producer: null, creationDate: null, modificationDate: null,
        isEncrypted: false,
        isLinearized: false,
        hasAcroForm: false,
        hasFlattenedAnnotations: false,
        dimensions: []
      }
    }
  }
}
`);

w(`${base}/engine/pdfjs.service.ts`, `import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PdfjsService {
  // Methods for rendering using PDF.js locally when needed
}
`);

w(`${base}/engine/ghostscript.service.ts`, `import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GhostscriptService {
  // Methods for caching GS WASM via OPFS
}
`);

w(`${base}/engine/tesseract.service.ts`, `import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TesseractService {
  // Methods for loading OCR
}
`);

w(`${base}/engine/opfs.service.ts`, `import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OpfsService {
  async saveFile(file: File): Promise<string> { return 'sandbox://' + file.name; }
  async getFile(path: string): Promise<File | null> { return null; }
  async deleteFile(path: string): Promise<void> {}
}
`);

w(`${base}/engine/worker-bridge.service.ts`, `import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkerMessage } from '../types/pdf.types';

@Injectable({ providedIn: 'root' })
export class WorkerBridgeService {
  process<TConfig, TResult>(workerFactory: () => Worker, config: TConfig, transfer?: Transferable[]): Observable<WorkerMessage<TResult>> {
    return new Observable(observer => {
      const worker = workerFactory();
      
      worker.onmessage = (e) => {
        const msg = e.data as WorkerMessage<TResult>;
        observer.next(msg);
        if (msg.type === 'complete' || msg.type === 'error') {
          observer.complete();
          worker.terminate();
        }
      };
      
      worker.onerror = (err) => {
        observer.next({ type: 'error', errorCode: 'WORKER_CRASHED', message: err.message });
        observer.complete();
        worker.terminate();
      };

      worker.postMessage({ config }, transfer || []);

      return () => {
        worker.terminate();
      };
    });
  }
}
`);

// ==========================================
// 3. UI COMPONENTS (Tailwind / CDK / NgRx specific UI needs)
// ==========================================
// Dropzone
w(`${base}/components/pdf-drop-zone/pdf-drop-zone.component.ts`, `import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-drop-zone',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div 
      class="border-2 border-dashed border-white/20 hover:border-cyan-500/50 hover:bg-cyan-500/5 bg-white/5 rounded-2xl p-12 text-center transition-all cursor-pointer shadow-lg"
      (dragover)="onDragOver($event)" 
      (dragleave)="onDragLeave($event)" 
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
      [class.border-cyan-500]="isDragging"
      [class.bg-cyan-500]="isDragging"
      [class.bg-opacity-10]="isDragging"
    >
      <input type="file" #fileInput class="hidden" (change)="onFileSelected($event)" [accept]="accept" [multiple]="multiple" />
      <div class="text-4xl mb-4">📄</div>
      <h3 class="text-xl font-bold text-white mb-2">{{ label }}</h3>
      <p class="text-white/50 text-sm">Supported: {{ accept }}</p>
    </div>
  \`
})
export class PdfDropZoneComponent {
  @Input() accept = 'application/pdf';
  @Input() label = 'Drop PDF files here or click to browse';
  @Input() multiple = false;
  @Output() filesSelected = new EventEmitter<File[]>();

  isDragging = false;

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragging = true;
  }
  
  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
  }
  
  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
    if (e.dataTransfer?.files?.length) {
      this.handleFiles(Array.from(e.dataTransfer.files));
    }
  }

  onFileSelected(e: any) {
    if (e.target.files?.length) {
      this.handleFiles(Array.from(e.target.files));
    }
  }

  private handleFiles(files: File[]) {
    const valid = files.filter(f => f.type === 'application/pdf' || this.accept.includes(f.name.split('.').pop() || ''));
    if (valid.length) {
      this.filesSelected.emit(valid);
    }
  }
}
`);
w(`${base}/components/pdf-drop-zone/index.ts`, `export * from './pdf-drop-zone.component';`);

// Page Thumbnail Strip
w(`${base}/components/page-thumbnail-strip/page-thumbnail-strip.component.ts`, `import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-thumbnail-strip',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="flex overflow-x-auto gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
      <div class="text-white/50 text-sm whitespace-nowrap pt-8 px-4" *ngIf="!thumbnails?.length">
         Thumbnails rendering...
      </div>
      @for (thumb of thumbnails; track thumb) {
         <div class="w-24 shrink-0 aspect-[1/1.414] bg-white rounded flex items-center justify-center text-black font-bold">
           {{thumb}}
         </div>
      }
    </div>
  \`
})
export class PageThumbnailStripComponent {
  @Input() file: File | null = null;
  @Input() pageCount: number = 0;
  
  // Stubs for now
  get thumbnails(): number[] {
     return Array.from({length: this.pageCount || 1}, (_, i) => i + 1);
  }
}
`);
w(`${base}/components/page-thumbnail-strip/index.ts`, `export * from './page-thumbnail-strip.component';`);


// PDF Preview
w(`${base}/components/pdf-preview/pdf-preview.component.ts`, `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pdf-preview',
  standalone: true,
  template: \`
    <div class="bg-black/40 rounded-xl border border-white/10 flex items-center justify-center min-h-[300px]">
      <div class="text-white/50">📄 Preview Placeholder</div>
    </div>
  \`
})
export class PdfPreviewComponent {
  @Input() file: File | null = null;
}
`);
w(`${base}/components/pdf-preview/index.ts`, `export * from './pdf-preview.component';`);


// Progress Ring
w(`${base}/components/progress-ring/progress-ring.component.ts`, `import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-pdf-progress-ring',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="relative flex items-center justify-center">
      <svg class="transform -rotate-90" [style.width.px]="size" [style.height.px]="size">
        <circle class="text-white/10" stroke-width="8" stroke="currentColor" fill="transparent" [attr.r]="radius" [attr.cx]="size/2" [attr.cy]="size/2" />
        <circle class="text-cyan-500 transition-all duration-300 ease-out" stroke-width="8" [attr.stroke-dasharray]="circumference" [attr.stroke-dashoffset]="circumference - progress / 100 * circumference" stroke-linecap="round" stroke="currentColor" fill="transparent" [attr.r]="radius" [attr.cx]="size/2" [attr.cy]="size/2" />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-2xl font-bold text-white">{{ progress | number:'1.0-0' }}%</span>
        <span class="text-xs text-white/50 mt-1">{{ label }}</span>
      </div>
    </div>
  \`
})
export class ProgressRingComponent {
  @Input() progress = 0;
  @Input() size = 120;
  @Input() label = 'Processing...';

  get radius() { return (this.size - 16) / 2; }
  get circumference() { return this.radius * 2 * Math.PI; }
}
`);
w(`${base}/components/progress-ring/index.ts`, `export * from './progress-ring.component';`);


// Export Panel
w(`${base}/components/export-panel/export-panel.component.ts`, `import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-export-panel',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl space-y-4 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
      <div class="flex items-center gap-3 text-green-400">
        <div class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">✅</div>
        <h3 class="font-bold">Processing Complete</h3>
      </div>
      
      <div class="flex justify-between items-center text-sm p-3 bg-white/5 rounded-lg border border-white/5">
        <span class="text-white/50">Output Size</span>
        <span class="font-bold text-white">{{ outputSizeMB | number:'1.2-2' }} MB</span>
      </div>
      
      <a *ngIf="outputBlob" [href]="downloadUrl" [download]="defaultFilename" class="block w-full text-center py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-all hover:scale-[1.02]">
        ⬇️ Download Output
      </a>
    </div>
  \`
})
export class ExportPanelComponent {
  @Input() outputBlob: Blob | null = null;
  @Input() outputSizeMB: number | null = null;
  @Input() defaultFilename = 'output.pdf';

  get downloadUrl() {
    return this.outputBlob ? URL.createObjectURL(this.outputBlob) : '';
  }
}
`);
w(`${base}/components/export-panel/index.ts`, `export * from './export-panel.component';`);

w(`${base}/components/index.ts`, `export * from './pdf-drop-zone';
export * from './page-thumbnail-strip';
export * from './pdf-preview';
export * from './progress-ring';
export * from './export-panel';
`);

// ==========================================
// 4. BARREL EXPORT
// ==========================================
w(`${base}/index.ts`, `export * from './types/pdf.types';
export * from './errors/pdf.errors';
export * from './schemas/pdf.schemas';
export * from './engine/pdf-lib.service';
export * from './engine/pdfjs.service';
export * from './engine/ghostscript.service';
export * from './engine/tesseract.service';
export * from './engine/worker-bridge.service';
export * from './engine/opfs.service';

export * from './components';
`);

console.log('✅ PDF Shared Infrastructure Generated!');
