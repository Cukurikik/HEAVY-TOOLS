import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToolCardComponent, Tool } from '../../shared/components/tool-card/tool-card.component';

export const CONVERTER_TOOLS: Tool[] = [
  { id: 'image-converter',        label: 'Image Converter',        icon: 'image',             category: 'image',    status: 'stable' },
  { id: 'video-converter',        label: 'Video Converter',        icon: 'movie',             category: 'video',    status: 'stable' },
  { id: 'audio-converter',        label: 'Audio Converter',        icon: 'music_note',        category: 'audio',    status: 'stable' },
  { id: 'document-converter',     label: 'Document Converter',     icon: 'description',       category: 'document', status: 'stable' },
  { id: 'image-resizer',          label: 'Image Resizer',          icon: 'photo_size_select_large', category: 'image', status: 'stable' },
  { id: 'image-compressor',       label: 'Image Compressor',       icon: 'compress',          category: 'image',    status: 'stable' },
  { id: 'svg-converter',          label: 'SVG Converter',          icon: 'draw',              category: 'image',    status: 'stable' },
  { id: 'base64-encoder',         label: 'Base64 Encoder',         icon: 'code',              category: 'text',     status: 'stable' },
  { id: 'json-converter',         label: 'JSON Converter',         icon: 'data_object',       category: 'text',     status: 'stable' },
  { id: 'csv-converter',          label: 'CSV Converter',          icon: 'table_chart',       category: 'text',     status: 'stable' },
  { id: 'markdown-converter',     label: 'Markdown Converter',     icon: 'edit_note',         category: 'text',     status: 'stable' },
  { id: 'html-converter',         label: 'HTML Converter',         icon: 'html',              category: 'text',     status: 'stable' },
  { id: 'color-converter',        label: 'Color Converter',        icon: 'palette',           category: 'utility',  status: 'stable' },
  { id: 'unit-converter',         label: 'Unit Converter',         icon: 'straighten',        category: 'utility',  status: 'stable' },
  { id: 'currency-converter',     label: 'Currency Converter',     icon: 'currency_exchange', category: 'utility',  status: 'stable' },
  { id: 'timezone-converter',     label: 'Timezone Converter',     icon: 'schedule',          category: 'utility',  status: 'stable' },
  { id: 'number-base-converter',  label: 'Number Base Converter',  icon: 'pin',               category: 'utility',  status: 'stable' },
  { id: 'encoding-converter',     label: 'Encoding Converter',     icon: 'translate',         category: 'text',     status: 'stable' },
  { id: 'font-converter',         label: 'Font Converter',         icon: 'font_download',     category: 'document', status: 'stable' },
  { id: 'ebook-converter',        label: 'Ebook Converter',        icon: 'menu_book',         category: 'document', status: 'stable' },
  { id: 'archive-converter',      label: 'Archive Converter',      icon: 'folder_zip',        category: 'utility',  status: 'stable' },
  { id: 'cad-converter',          label: 'CAD Converter',          icon: 'architecture',      category: 'document', status: 'beta' },
  { id: 'subtitle-converter',     label: 'Subtitle Converter',     icon: 'subtitles',         category: 'video',    status: 'stable' },
  { id: 'spreadsheet-converter',  label: 'Spreadsheet Converter',  icon: 'grid_on',           category: 'document', status: 'stable' },
  { id: 'qr-generator',           label: 'QR Code Generator',      icon: 'qr_code',           category: 'utility',  status: 'stable' },
  { id: 'barcode-generator',      label: 'Barcode Generator',      icon: 'barcode',           category: 'utility',  status: 'stable' },
  { id: 'ico-converter',          label: 'ICO / Favicon',          icon: 'web',               category: 'image',    status: 'stable' },
  { id: 'gif-converter',          label: 'GIF Converter',          icon: 'gif',               category: 'image',    status: 'stable' },
  { id: 'raw-image-converter',    label: 'RAW Image Converter',    icon: 'camera',            category: 'image',    status: 'beta' },
  { id: 'batch-converter',        label: 'Batch Converter',        icon: 'layers',            category: 'utility',  status: 'stable' },
];

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, MatIconModule, ToolCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 space-y-8 max-w-7xl mx-auto">
      <header class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-amber to-accent-red mb-2">
            Universal Converter
          </h1>
          <p class="text-text-secondary">30 powerful converters for images, audio, video, documents, and utilities.</p>
        </div>
        <div class="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button (click)="filterCategory = ''" [class.bg-white/10]="filterCategory === ''" class="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">All</button>
          <button (click)="filterCategory = 'image'" [class.bg-white/10]="filterCategory === 'image'" class="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">Image</button>
          <button (click)="filterCategory = 'text'" [class.bg-white/10]="filterCategory === 'text'" class="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">Text</button>
          <button (click)="filterCategory = 'utility'" [class.bg-white/10]="filterCategory === 'utility'" class="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">Utility</button>
          <button (click)="filterCategory = 'document'" [class.bg-white/10]="filterCategory === 'document'" class="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">Doc</button>
        </div>
      </header>

      <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        @for (tool of filteredTools; track tool.id) {
          <app-tool-card [tool]="tool" basePath="converter" />
        }
      </section>

      @if (filteredTools.length === 0) {
        <div class="text-center py-16 text-text-muted">
          <mat-icon class="text-5xl mb-4">search_off</mat-icon>
          <p>No converters found for this category.</p>
        </div>
      }
    </div>
  `
})
export class ConverterComponent {
  converterTools = CONVERTER_TOOLS;
  filterCategory = '';

  get filteredTools(): Tool[] {
    if (!this.filterCategory) return this.converterTools;
    return this.converterTools.filter(t => t.category === this.filterCategory);
  }
}
