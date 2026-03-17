// ============================================================
// IMAGE EXPORT PANEL — Download output with format options
// File: src/app/modules/image-matrix/shared/image-export.component.ts
// ============================================================

import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-export',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (outputBlob) {
      <div class="space-y-4">
        <!-- Preview -->
        <div class="rounded-xl overflow-hidden border border-white/10 bg-[repeating-conic-gradient(#ffffff08_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]">
          <img [src]="previewUrl()" alt="Output" class="w-full max-h-[400px] object-contain" />
        </div>

        <!-- Info -->
        <div class="grid grid-cols-2 gap-3 text-center">
          <div class="p-3 rounded-xl bg-white/5">
            <p class="text-xs text-white/40">Output Size</p>
            <p class="text-sm font-semibold text-cyan-400">{{ formatSize(outputBlob.size) }}</p>
          </div>
          <div class="p-3 rounded-xl bg-white/5">
            <p class="text-xs text-white/40">Format</p>
            <p class="text-sm font-semibold text-white uppercase">{{ selectedFormat }}</p>
          </div>
        </div>

        <!-- Format Selection -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-white/50">Save as:</span>
          <div class="flex gap-1">
            @for (fmt of formats; track fmt) {
              <button (click)="selectedFormat = fmt"
                      [class.bg-cyan-500/20]="selectedFormat === fmt"
                      [class.border-cyan-500/50]="selectedFormat === fmt"
                      [class.text-cyan-400]="selectedFormat === fmt"
                      [class.border-white/10]="selectedFormat !== fmt"
                      [class.text-white/60]="selectedFormat !== fmt"
                      class="px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 hover:bg-white/5 uppercase">
                {{ fmt }}
              </button>
            }
          </div>
        </div>

        <!-- Quality Slider (for JPG/WebP) -->
        @if (selectedFormat === 'jpg' || selectedFormat === 'webp') {
          <div class="space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-white/50">Quality</span>
              <span class="text-cyan-400 font-medium">{{ quality }}%</span>
            </div>
            <input type="range" min="10" max="100" step="5" [(ngModel)]="quality"
                   class="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer" />
          </div>
        }

        <!-- Download Button -->
        <button (click)="onDownload()"
                class="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 flex items-center justify-center gap-2">
          <mat-icon class="text-lg">download</mat-icon>
          Download {{ selectedFormat.toUpperCase() }}
        </button>
      </div>
    }
  `
})
export class ImageExportComponent implements OnChanges, OnDestroy {
  @Input() outputBlob: Blob | null = null;
  @Input() defaultFilename = 'omni_output';
  @Input() formats: string[] = ['png', 'jpg', 'webp'];

  selectedFormat = 'png';
  quality = 90;

  previewUrl = signal('');

  ngOnChanges(changes: SimpleChanges) {
    if (this.outputBlob) {
      const url = URL.createObjectURL(this.outputBlob);
      const oldUrl = this.previewUrl();
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      this.previewUrl.set(url);
    }
  }

  formatSize(bytes: number): string {
    if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  async onDownload() {
    if (!this.outputBlob) return;

    let blob = this.outputBlob;

    // Re-encode if format changed or quality specified
    if (this.selectedFormat !== 'png' || this.quality < 100) {
      const img = new Image();
      const url = URL.createObjectURL(this.outputBlob);
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.src = url;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const mimeMap: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', bmp: 'image/bmp' };
      const mime = mimeMap[this.selectedFormat] || 'image/png';
      const q = this.quality / 100;

      blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), mime, q);
      });
    }

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${this.defaultFilename}.${this.selectedFormat}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 150);
  }

  ngOnDestroy() {
    const url = this.previewUrl();
    if (url) URL.revokeObjectURL(url);
  }
}
