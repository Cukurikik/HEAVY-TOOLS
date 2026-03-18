import { ChangeDetectionStrategy, Component, signal, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerBridgeService } from '../../engine/worker-bridge.service';

@Component({
  selector: 'app-export-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#12121a] rounded-xl p-4 border border-white/5 space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-white/70 font-medium">✅ Processing Complete!</span>
        @if (outputSizeMB()) {
          <span class="text-xs text-white/40">{{ outputSizeMB()?.toFixed(1) }} MB</span>
        }
      </div>
      <div class="flex flex-wrap gap-2">
        @for (fmt of formats(); track fmt) {
          <button
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            [class.bg-cyan-500]="selectedFormat() === fmt"
            [class.text-black]="selectedFormat() === fmt"
            [class.bg-white/5]="selectedFormat() !== fmt"
            [class.text-white/60]="selectedFormat() !== fmt"
            (click)="selectFormat(fmt)">
            {{ fmt.toUpperCase() }}
          </button>
        }
      </div>
      <button
        [disabled]="!outputBlob()"
        class="w-full py-3 rounded-xl font-bold text-sm transition-all bg-gradient-to-r from-cyan-500 to-purple-500 text-black disabled:opacity-30 hover:shadow-glow"
        (click)="onDownload()">
        {{ !outputBlob() ? 'Process First' : '⬇ Download ' + selectedFormat().toUpperCase() }}
      </button>
    </div>
  `
})
export class ExportPanelComponent {
  outputBlob = input.required<Blob | null>();
  outputSizeMB = input<number | null>(null);
  defaultFilename = input<string>('omni_output');
  formats = input<string[]>(['mp4', 'webm', 'mov', 'avi']);

  private worker = inject(WorkerBridgeService);

  selectedFormat = signal('mp4');

  selectFormat(format: string) {
    this.selectedFormat.set(format);
  }

  onDownload() {
    const blob = this.outputBlob();
    if (blob) {
      const filename = `${this.defaultFilename()}.${this.selectedFormat()}`;
      this.worker.downloadBlob(blob, filename);
    }
  }
}
