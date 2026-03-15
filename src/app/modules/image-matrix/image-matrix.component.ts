import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToolCardComponent, Tool } from '../../shared/components/tool-card/tool-card.component';

export const IMAGE_TOOLS: Tool[] = [
  { id: 'upscale',    label: 'AI Upscaler',      icon: 'rocket_launch', category: 'ai',       status: 'experimental' },
  { id: 'heic',       label: 'HEIC Converter',   icon: 'image',        category: 'basic',    status: 'stable' },
  { id: 'filter',     label: 'WebGL Filters',    icon: 'filter_b_and_w', category: 'advanced', status: 'stable' },
  { id: 'ocr',        label: 'WASM OCR',         icon: 'document_scanner', category: 'ai',       status: 'beta' },
  { id: 'pdf',        label: 'PDF Engine',       icon: 'picture_as_pdf', category: 'pro',      status: 'stable' },
  { id: 'compress',   label: 'Smart Compress',   icon: 'compress',     category: 'basic',    status: 'stable' },
];

@Component({
  selector: 'app-image-matrix',
  standalone: true,
  imports: [CommonModule, MatIconModule, ToolCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 space-y-8 max-w-7xl mx-auto">
      <header class="flex items-center justify-between mb-12">
        <div>
          <h1 class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-status-success mb-2">
            Image Matrix
          </h1>
          <p class="text-text-secondary">GPU-accelerated image processing and AI vision.</p>
        </div>
      </header>

      <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        @for (tool of imageTools; track tool.id) {
          <app-tool-card [tool]="tool" />
        }
      </section>
    </div>
  `
})
export class ImageMatrixComponent {
  imageTools = IMAGE_TOOLS;
}
