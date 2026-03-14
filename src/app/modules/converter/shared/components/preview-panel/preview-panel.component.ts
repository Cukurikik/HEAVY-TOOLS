// ============================================================
// PREVIEW PANEL COMPONENT — Before/After side-by-side preview
// File: src/app/modules/converter/shared/components/preview-panel/preview-panel.component.ts
// ============================================================

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-converter-preview-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- Before -->
        <div class="p-4 border-b md:border-b-0 md:border-r border-white/10">
          <p class="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">{{ beforeLabel }}</p>
          @if (beforeUrl) {
            <img [src]="beforeUrl" alt="Original" class="max-w-full h-auto rounded-lg mx-auto max-h-64 object-contain" />
          } @else {
            <div class="h-40 flex items-center justify-center text-white/20 text-sm">No preview</div>
          }
        </div>
        <!-- After -->
        <div class="p-4">
          <p class="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">{{ afterLabel }}</p>
          @if (afterUrl) {
            <img [src]="afterUrl" alt="Converted" class="max-w-full h-auto rounded-lg mx-auto max-h-64 object-contain" />
          } @else {
            <div class="h-40 flex items-center justify-center text-white/20 text-sm">No preview</div>
          }
        </div>
      </div>
    </div>
  ` })
export class ConverterPreviewPanelComponent {
  @Input() beforeUrl: string | null = null;
  @Input() afterUrl: string | null = null;
  @Input() beforeLabel = 'Original';
  @Input() afterLabel = 'Converted';
}
