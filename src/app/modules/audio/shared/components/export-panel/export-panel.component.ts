import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audio-export-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#12121a] rounded-xl p-4 border border-white/5 space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-white/70 font-medium">Export Format</span>
        @if (outputSizeMB) {
          <span class="text-xs text-white/40">{{ outputSizeMB.toFixed(1) }} MB</span>
        }
      </div>
      <div class="flex flex-wrap gap-2">
        @for (fmt of formats; track fmt) {
          <button class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  [class.bg-cyan-500]="selectedFormat() === fmt" [class.text-black]="selectedFormat() === fmt"
                  [class.bg-white/5]="selectedFormat() !== fmt" [class.text-white/60]="selectedFormat() !== fmt"
                  (click)="selectFormat(fmt)">
            {{ fmt.toUpperCase() }}
          </button>
        }
      </div>
      <button class="w-full py-3 rounded-xl font-bold text-sm transition-all"
              [class.bg-gradient-to-r]="!disabled" [class.from-cyan-500]="!disabled"
              [class.to-purple-500]="!disabled" [class.text-white]="!disabled"
              [class.bg-white/10]="disabled" [class.text-white/30]="disabled"
              [disabled]="disabled" (click)="download.emit()">
        {{ disabled ? 'Process First' : '⬇ Download ' + selectedFormat().toUpperCase() }}
      </button>
    </div>
  `
})
export class AudioExportPanelComponent {
  @Input() disabled = true;
  @Input() outputSizeMB: number | null = null;
  @Output() formatChange = new EventEmitter<ExportFormat>();
  @Output() download = new EventEmitter<void>();
  formats: ExportFormat[] = ['wav', 'mp3', 'aac', 'ogg', 'flac', 'opus', 'm4a'];
  selectedFormat = signal<ExportFormat>('wav');

  selectFormat(fmt: ExportFormat): void {
    this.selectedFormat.set(fmt);
    this.formatChange.emit(fmt);
  }
}
