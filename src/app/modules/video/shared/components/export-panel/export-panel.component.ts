import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerBridgeService } from '../../engine/worker-bridge.service';
import type { ExportConfig } from '../../types/video.types';

@Component({
  selector: 'app-export-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
      <div class="flex flex-wrap gap-2">
        @for (fmt of availableFormats; track fmt) {
          <button (click)="selectedFormat.set(fmt)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all"
            [class.bg-cyan-500]="selectedFormat() === fmt"
            [class.text-black]="selectedFormat() === fmt"
            [class.bg-white/10]="selectedFormat() !== fmt"
            [class.text-white/70]="selectedFormat() !== fmt">{{ fmt }}</button>
        }
      </div>
      <div class="flex items-center gap-2">
        <input type="text" [value]="customFilename() || defaultFilename"
          (input)="onFilenameInput($event)"
          placeholder="Output filename"
          class="flex-1 px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"/>
        <span class="text-sm text-white/40">.{{ selectedFormat() }}</span>
      </div>
      @if (outputSizeMB !== null) {
        <p class="text-sm text-white/60">Output size: <span class="text-white font-medium">{{ outputSizeMB.toFixed(2) }} MB</span></p>
      }
      <button [disabled]="!outputBlob" (click)="onDownload()"
        class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
        [class.bg-gradient-to-r]="!!outputBlob" [class.from-cyan-500]="!!outputBlob" [class.to-cyan-400]="!!outputBlob"
        [class.text-black]="!!outputBlob" [class.bg-white/5]="!outputBlob" [class.text-white/30]="!outputBlob"
        [class.cursor-not-allowed]="!outputBlob">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        {{ outputBlob ? 'Download ' + selectedFormat().toUpperCase() : 'No output yet' }}
      </button>
    </div>
  `
})
export class ExportPanelComponent {
  @Input() outputBlob: Blob | null = null;
  @Input() availableFormats: string[] = ['mp4', 'webm', 'mov'];
  @Input() defaultFilename = 'omni_output';
  @Input() outputSizeMB: number | null = null;
  @Output() download = new EventEmitter<ExportConfig>();

  selectedFormat = signal('mp4');
  customFilename = signal('');

  constructor(private bridge: WorkerBridgeService) {}

  onFilenameInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.customFilename.set(val);
  }

  onDownload() {
    if (!this.outputBlob) return;
    const config: ExportConfig = {
      format: this.selectedFormat() as ExportConfig['format'],
      codec: '', quality: 'balanced',
      filename: (this.customFilename() || this.defaultFilename) + '.' + this.selectedFormat()
    };
    this.download.emit(config);
    this.bridge.downloadBlob(this.outputBlob, config.filename);
  }
}
