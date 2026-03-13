// ============================================================
// EXPORT PANEL COMPONENT — Format selector + download button
// File: src/app/modules/video/shared/components/export-panel/export-panel.component.ts
// ============================================================

import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal
} from '@angular/core';
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
      <!-- Format selector -->
      <div class="flex flex-wrap gap-2">
        @for (fmt of availableFormats; track fmt) {
          <button
            (click)="selectedFormat.set(fmt)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all"
            [class.bg-cyan-500]="selectedFormat() === fmt"
            [class.text-black]="selectedFormat() === fmt"
            [class.bg-white/10]="selectedFormat() !== fmt"
            [class.text-white/70]="selectedFormat() !== fmt"
            [class.hover:bg-white/15]="selectedFormat() !== fmt"
          >{{ fmt }}</button>
        }
      </div>

      <!-- Filename input -->
      <div class="flex items-center gap-2">
        <input
          type="text"
          [value]="customFilename() || defaultFilename"
          (input)="customFilename.set(($event.target as HTMLInputElement).value)"
          placeholder="Output filename"
          class="flex-1 px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 transition-colors"
        />
        <span class="text-sm text-white/40">.{{ selectedFormat() }}</span>
      </div>

      <!-- Size display -->
      @if (outputSizeMB !== null) {
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="text-sm text-white/60">Output size: <span class="text-white font-medium">{{ outputSizeMB.toFixed(2) }} MB</span></span>
        </div>
      }

      <!-- Download button -->
      <button
        [disabled]="!outputBlob"
        (click)="onDownload()"
        class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
        [class.bg-gradient-to-r]="outputBlob"
        [class.from-cyan-500]="outputBlob"
        [class.to-cyan-400]="outputBlob"
        [class.text-black]="outputBlob"
        [class.hover:shadow-[0_0_30px_rgba(0,245,255,0.4)]]="outputBlob"
        [class.bg-white/5]="!outputBlob"
        [class.text-white/30]="!outputBlob"
        [class.cursor-not-allowed]="!outputBlob"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        {{ outputBlob ? 'Download ' + selectedFormat().toUpperCase() : 'No output yet' }}
      </button>
    </div>
  `,
})
export class ExportPanelComponent {
  @Input() outputBlob: Blob | null = null;
  @Input() availableFormats: string[] = ['mp4', 'webm', 'mov'];
  @Input() defaultFilename = 'omni_output';
  @Input() outputSizeMB: number | null = null;

  @Output() download = new EventEmitter<ExportConfig>();
  @Output() formatChanged = new EventEmitter<string>();

  selectedFormat = signal('mp4');
  customFilename = signal('');

  constructor(private bridge: WorkerBridgeService) {}

  onDownload() {
    if (!this.outputBlob) return;

    const config: ExportConfig = {
      format: this.selectedFormat() as ExportConfig['format'],
      codec: '',
      quality: 'balanced',
      filename: (this.customFilename() || this.defaultFilename) + '.' + this.selectedFormat(),
    };

    this.download.emit(config);
    this.bridge.downloadBlob(this.outputBlob, config.filename);
  }
}
