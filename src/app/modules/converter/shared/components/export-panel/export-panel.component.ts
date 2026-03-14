// ============================================================
// EXPORT PANEL COMPONENT — Download button + size info
// File: src/app/modules/converter/shared/components/export-panel/export-panel.component.ts
// ============================================================

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-converter-export-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-emerald-400 text-xl">✅</span>
          <span class="text-sm font-semibold text-emerald-400">Conversion Complete</span>
        </div>
        @if (outputSizeMB !== null) {
          <span class="text-xs text-white/50">{{ outputSizeMB | number:'1.0-2' }} MB</span>
        }
      </div>
      <button
        [disabled]="disabled || !outputBlob"
        (click)="onDownload()"
        class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
               bg-gradient-to-r from-emerald-500 to-teal-500 text-black hover:shadow-lg hover:shadow-emerald-500/25
               disabled:opacity-40 disabled:cursor-not-allowed">
        📥 Download {{ filename }}
      </button>
    </div>
  ` })
export class ConverterExportPanelComponent {
  @Input() outputBlob: Blob | null = null;
  @Input() outputSizeMB: number | null = null;
  @Input() filename = 'converted_file';
  @Input() disabled = false;
  @Output() download = new EventEmitter<void>();

  onDownload(): void {
    if (!this.outputBlob) return;
    const url = URL.createObjectURL(this.outputBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 150);
  }
}
