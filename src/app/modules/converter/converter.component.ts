import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToolCardComponent, Tool } from '../../shared/components/tool-card/tool-card.component';

export const CONVERTER_TOOLS: Tool[] = [
  { id: 'image-converter',      label: 'Image Converter',      icon: 'image',           category: 'image',    status: 'stable' },
  { id: 'video-converter',      label: 'Video Converter',      icon: 'movie',           category: 'video',    status: 'stable' },
  { id: 'audio-converter',      label: 'Audio Converter',      icon: 'music_note',      category: 'audio',    status: 'stable' },
  { id: 'document-converter',   label: 'Document Converter',   icon: 'description',     category: 'document', status: 'stable' },
  { id: 'image-resizer',        label: 'Image Resizer',        icon: 'photo_size_select_large', category: 'image', status: 'stable' },
  { id: 'image-compressor',     label: 'Image Compressor',     icon: 'compress',        category: 'image',    status: 'stable' },
  { id: 'svg-converter',        label: 'SVG Converter',        icon: 'draw',            category: 'image',    status: 'stable' },
  { id: 'base64-encoder',       label: 'Base64 Encoder',       icon: 'code',            category: 'text',     status: 'stable' },
  { id: 'json-converter',       label: 'JSON Converter',       icon: 'data_object',     category: 'text',     status: 'stable' },
  { id: 'csv-converter',        label: 'CSV Converter',        icon: 'table_chart',     category: 'text',     status: 'stable' },
  { id: 'markdown-converter',   label: 'Markdown Converter',   icon: 'edit_note',       category: 'text',     status: 'stable' },
  { id: 'html-converter',       label: 'HTML Converter',       icon: 'html',            category: 'text',     status: 'stable' },
  { id: 'color-converter',      label: 'Color Converter',      icon: 'palette',         category: 'utility',  status: 'stable' },
  { id: 'unit-converter',       label: 'Unit Converter',       icon: 'straighten',      category: 'utility',  status: 'stable' },
  { id: 'currency-converter',   label: 'Currency Converter',   icon: 'currency_exchange',category: 'utility', status: 'stable' },
  { id: 'timezone-converter',   label: 'Timezone Converter',   icon: 'schedule',        category: 'utility',  status: 'stable' },
  { id: 'number-base-converter',label: 'Number Base Converter',icon: 'pin',             category: 'utility',  status: 'stable' },
  { id: 'encoding-converter',   label: 'Encoding Converter',   icon: 'translate',       category: 'text',     status: 'stable' },
  { id: 'font-converter',       label: 'Font Converter',       icon: 'font_download',   category: 'document', status: 'stable' },
  { id: 'ebook-converter',      label: 'Ebook Converter',      icon: 'menu_book',       category: 'document', status: 'stable' },
  { id: 'archive-converter',    label: 'Archive Converter',    icon: 'folder_zip',      category: 'utility',  status: 'stable' },
  { id: 'qr-generator',         label: 'QR Code Generator',    icon: 'qr_code_2',       category: 'utility',  status: 'stable' },
  { id: 'barcode-generator',    label: 'Barcode Generator',    icon: 'barcode',         category: 'utility',  status: 'stable' },
  { id: 'ico-converter',        label: 'ICO / Favicon',        icon: 'web',             category: 'image',    status: 'stable' },
  { id: 'gif-converter',        label: 'GIF Converter',        icon: 'gif',             category: 'image',    status: 'stable' },
  { id: 'raw-image-converter',  label: 'RAW Image Converter',  icon: 'camera_roll',     category: 'image',    status: 'stable' },
  { id: 'batch-converter',      label: 'Batch Converter',      icon: 'layers',          category: 'utility',  status: 'stable' },
];

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, MatIconModule, ToolCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 space-y-8 max-w-7xl mx-auto">
      <header class="flex items-center justify-between mb-12">
        <div>
          <h1 class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-status-warning to-accent-pink mb-2">
            Universal Converter
          </h1>
          <p class="text-text-secondary">Data transmutation, format conversion, and archive extraction.</p>
        </div>
      </header>

      <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        @for (tool of converterTools; track tool.id) {
          <app-tool-card [tool]="tool" [basePath]="'converter'" />
        }
      </section>
    </div>
  `
})
export class ConverterComponent {
  converterTools = CONVERTER_TOOLS;
}

