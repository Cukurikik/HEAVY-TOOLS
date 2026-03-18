import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToolCardComponent, Tool } from '../../shared/components/tool-card/tool-card.component';

export const PDF_TOOLS: Tool[] = [
  { id: 'merger',      label: 'PDF Merger',      icon: 'picture_as_pdf', category: 'basic',    status: 'stable' },
  { id: 'splitter',    label: 'PDF Splitter',    icon: 'call_split',   category: 'basic',    status: 'stable' },
  { id: 'compressor',  label: 'PDF Compressor',  icon: 'compress',     category: 'basic',    status: 'stable' },
  { id: 'converter',   label: 'PDF Converter',   icon: 'sync',         category: 'basic',    status: 'stable' },
  { id: 'ocr',         label: 'PDF OCR',         icon: 'document_scanner', category: 'advanced', status: 'beta' },
  { id: 'watermark',   label: 'PDF Watermark',   icon: 'branding_watermark', category: 'advanced', status: 'stable' },
  { id: 'passwordProtector', label: 'Password Protect', icon: 'lock',      category: 'pro',      status: 'stable' },
  { id: 'unlocker',    label: 'PDF Unlocker',    icon: 'lock_open',    category: 'pro',      status: 'stable' },
  { id: 'rotator',     label: 'PDF Rotator',     icon: 'rotate_right', category: 'basic',    status: 'stable' },
  { id: 'cropResize',  label: 'Crop & Resize',   icon: 'crop',         category: 'advanced', status: 'stable' },
  { id: 'imageExtractor', label: 'Image Extractor', icon: 'image',        category: 'pro',      status: 'stable' },
  { id: 'textExtractor', label: 'Text Extractor', icon: 'description',  category: 'pro',      status: 'stable' },
  { id: 'metadataEditor', label: 'Metadata Editor', icon: 'info',         category: 'pro',      status: 'stable' },
  { id: 'digitalSigner', label: 'Digital Signer', icon: 'draw',         category: 'pro',      status: 'beta' },
  { id: 'redactor',    label: 'PDF Redactor',    icon: 'auto_fix_high', category: 'pro',      status: 'beta' },
  { id: 'annotator',   label: 'PDF Annotator',   icon: 'edit',         category: 'pro',      status: 'beta' },
  { id: 'formFiller',  label: 'Form Filler',     icon: 'assignment',   category: 'pro',      status: 'beta' },
  { id: 'pageReorderer', label: 'Page Reorderer', icon: 'reorder',      category: 'advanced', status: 'stable' },
  { id: 'thumbnailGenerator', label: 'Thumbnail Gen', icon: 'image_search', category: 'pro',      status: 'stable' },
  { id: 'compare',     label: 'PDF Compare',     icon: 'compare',      category: 'advanced', status: 'stable' },
  { id: 'toWord',      label: 'PDF to Word',     icon: 'description',  category: 'convert',  status: 'stable' },
  { id: 'toExcel',     label: 'PDF to Excel',    icon: 'table_view',   category: 'convert',  status: 'stable' },
  { id: 'toPowerpoint', label: 'PDF to PPT',      icon: 'slideshow',    category: 'convert',  status: 'stable' },
  { id: 'toHtml',      label: 'PDF to HTML',     icon: 'html',         category: 'convert',  status: 'stable' },
  { id: 'toImageBatch', label: 'PDF to Image',    icon: 'collections',  category: 'convert',  status: 'stable' },
  { id: 'repair',      label: 'PDF Repair',      icon: 'build',         category: 'pro',      status: 'experimental' },
  { id: 'flattener',   label: 'PDF Flattener',   icon: 'layers_clear', category: 'pro',      status: 'stable' },
  { id: 'optimizer',   label: 'PDF Optimizer',   icon: 'speed',        category: 'pro',      status: 'stable' },
  { id: 'bookmarkEditor', label: 'Bookmark Editor', icon: 'bookmarks',    category: 'pro',      status: 'stable' },
  { id: 'batchProcessor', label: 'Batch Processor', icon: 'layers',       category: 'pro',      status: 'beta' },
];

@Component({
  selector: 'app-pdf',
  standalone: true,
  imports: [CommonModule, MatIconModule, ToolCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 space-y-8 max-w-7xl mx-auto">
      <header class="flex items-center justify-between mb-12">
        <div>
          <h1 class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple mb-2">
            PDF Engine
          </h1>
          <p class="text-text-secondary">Complete PDF toolkit. Private, secure, and fast.</p>
        </div>
      </header>

      <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        @for (tool of pdfTools; track tool.id) {
          <app-tool-card [tool]="tool" basePath="pdf" />
        }
      </section>
    </div>
  `
})
export class PdfComponent {
  pdfTools = PDF_TOOLS;
}
