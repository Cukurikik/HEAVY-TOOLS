import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerBridgeService } from '../../engine/worker-bridge.service';
import type { ExportConfig } from '../../types/video.types';

@Component({
  selector: 'app-export-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-5 p-6 rounded-3xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-500 hover:border-white/20 animate-fade-in-up">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-white/90 tracking-wide uppercase">Export Settings</h3>
        @if (outputSizeMB !== null) {
          <span class="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
            {{ outputSizeMB.toFixed(2) }} MB
          </span>
        }
      </div>

      <!-- Format Selection -->
      <div class="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
        @for (fmt of availableFormats; track fmt) {
          <button (click)="selectedFormat.set(fmt)"
            class="flex-1 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden"
            [class.bg-gradient-to-r]="selectedFormat() === fmt"
            [class.from-blue-500]="selectedFormat() === fmt"
            [class.to-indigo-500]="selectedFormat() === fmt"
            [class.text-white]="selectedFormat() === fmt"
            [class.shadow-[0_0_15px_rgba(59,130,246,0.4)]]="selectedFormat() === fmt"
            [class.hover:bg-white/10]="selectedFormat() !== fmt"
            [class.text-white/50]="selectedFormat() !== fmt">
            <span class="relative z-10">{{ fmt }}</span>
          </button>
        }
      </div>

      <!-- Filename Input -->
      <div class="relative group">
        <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-500 blur-sm"></div>
        <div class="relative flex items-center bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-colors">
          <input type="text" [value]="customFilename() || defaultFilename"
            (input)="onFilenameInput($event)"
            placeholder="Name your masterpiece..."
            class="flex-1 px-4 py-3 text-sm bg-transparent text-white placeholder-white/30 focus:outline-none"/>
          <div class="px-4 py-3 bg-white/5 border-l border-white/10 text-sm font-semibold text-white/50">
            .{{ selectedFormat() }}
          </div>
        </div>
      </div>

      <!-- Download Button -->
      <button [disabled]="!outputBlob" (click)="onDownload()"
        class="relative flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-500 overflow-hidden group"
        [class.bg-gradient-to-r]="!!outputBlob" [class.from-blue-600]="!!outputBlob" [class.to-indigo-600]="!!outputBlob"
        [class.text-white]="!!outputBlob" [class.shadow-[0_0_30px_rgba(79,70,229,0.4)]]="!!outputBlob" [class.hover:-translate-y-1]="!!outputBlob" [class.hover:shadow-[0_0_40px_rgba(79,70,229,0.6)]]="!!outputBlob"
        [class.bg-white/5]="!outputBlob" [class.text-white/30]="!outputBlob" [class.border]="!outputBlob" [class.border-white/10]="!outputBlob"
        [class.cursor-not-allowed]="!outputBlob">
        
        @if (outputBlob) {
          <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        }
        
        <svg class="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        <span class="relative z-10">{{ outputBlob ? 'EXPORT ' + selectedFormat().toUpperCase() : 'AWAITING OUTPUT' }}</span>
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

  private bridge = inject(WorkerBridgeService);

  selectedFormat = signal('mp4');
  customFilename = signal('');

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
