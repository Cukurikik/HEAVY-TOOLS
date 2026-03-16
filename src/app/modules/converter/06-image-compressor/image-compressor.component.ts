// ============================================================
// FEATURE 06 — IMAGE COMPRESSOR — Component (FULLY FUNCTIONAL)
// Route: /converter/image-compressor
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConverterFileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ImageCompressorActions, selectImageCompressorState } from './image-compressor.store';

interface CompressResult {
  name: string;
  blob: Blob;
  url: string;
  size: number;
  originalSize: number;
  quality: number;
  format: string;
}

@Component({
  selector: 'app-image-compressor',
  standalone: true,
  imports: [CommonModule, FormsModule, ConverterFileDropZoneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          🗜️ Image Compressor
        </h1>
        <p class="text-white/50 text-sm">Reduce image file size intelligently while maintaining maximum visual quality</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Input & Controls -->
        <div class="space-y-4">
          <app-converter-file-drop-zone
            accept="image/jpeg,image/png,image/webp,image/avif"
            [multiple]="false"
            [maxSizeMB]="50"
            label="Drop image to compress"
            (filesSelected)="onFileSelected($event)" />

          @if (inputImage()) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <!-- Info -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-white truncate max-w-[200px]">{{ inputImage()!.name }}</span>
                <span class="text-white/40">{{ formatBytes(inputImage()!.size) }}</span>
              </div>

              <!-- Output Format -->
              <div class="space-y-2">
                <span class="text-xs text-white/40 block">Output Format (WebP/JPEG recommended for high yield)</span>
                <select [value]="targetFormat()" (change)="targetFormat.set(($any($event.target)).value); previewCompression()"
                  class="w-full px-3 py-2 bg-[#12121a] border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400">
                  <option value="image/webp">WEBP (Best size/quality)</option>
                  <option value="image/jpeg">JPEG (Most compatible)</option>
                  <option value="image/png">PNG (Lossless/Palette)</option>
                </select>
              </div>

              <!-- Quality Slider -->
              <div class="space-y-2">
                <div class="flex justify-between text-xs text-white/40">
                  <span>Compression Quality: {{ targetQuality() }}%</span>
                  <span>{{ targetQuality() < 40 ? 'High Compression (Noticeable artefacts)' : targetQuality() > 85 ? 'Low Compression (Large size)' : 'Balanced' }}</span>
                </div>
                <input type="range" min="1" max="100" [value]="targetQuality()" 
                  (input)="targetQuality.set(+($any($event.target)).value)"
                  (change)="previewCompression()"
                  class="w-full accent-cyan-400" />
              </div>

              <div class="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs rounded-lg flex items-start gap-2">
                <span class="text-lg">💡</span>
                <span>The image is automatically compressed in real-time. Adjust the slider to find the perfect balance between file size and visual quality.</span>
              </div>
            </div>
          }
        </div>

        <!-- RIGHT: Live Preview -->
        <div class="space-y-4">
          @if (inputUrl() && result()) {
            <!-- View Mode Tabs -->
            <div class="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
              <button (click)="viewMode.set('split')" [class]="viewMode() === 'split' ? 'px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm' : 'px-3 py-1.5 rounded-lg text-white/50 text-sm'">Split View</button>
              <button (click)="viewMode.set('original')" [class]="viewMode() === 'original' ? 'px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm' : 'px-3 py-1.5 rounded-lg text-white/50 text-sm'">Original</button>
              <button (click)="viewMode.set('compressed')" [class]="viewMode() === 'compressed' ? 'px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm' : 'px-3 py-1.5 rounded-lg text-white/50 text-sm'">Compressed</button>
            </div>

            <!-- Image Viewport -->
            <div class="rounded-2xl overflow-hidden border border-white/10 bg-[#12121a] relative group h-[400px]">
              
              @if (isProcessing()) {
                <div class="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div class="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              }

              <!-- Standard Views -->
              @if (viewMode() === 'original') {
                <img [src]="inputUrl()" alt="" class="w-full h-full object-contain" />
              } @else if (viewMode() === 'compressed') {
                <img [src]="result()!.url" alt="" class="w-full h-full object-contain" />
              } @else {
                <!-- CSS Split View -->
                <div class="relative w-full h-full overflow-hidden" (mousemove)="onSplitMove($event)" (touchmove)="onSplitMove($event)" (mouseleave)="splitPos.set(50)">
                  <!-- Bottom: Compressed -->
                  <img [src]="result()!.url" alt="" class="absolute top-0 left-0 w-full h-full object-cover" />
                  
                  <!-- Top: Original (clipped) -->
                  <div class="absolute top-0 left-0 h-full w-full overflow-hidden" [style.clip-path]="'inset(0 ' + (100 - splitPos()) + '% 0 0)'">
                    <img [src]="inputUrl()" alt="" class="absolute top-0 left-0 w-full h-full object-cover max-w-none" />
                  </div>
                  
                  <!-- Slider Line -->
                  <div class="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20" [style.left.%]="splitPos()">
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center cursor-ew-resize border border-gray-300">
                      <span class="text-xs text-black tracking-tighter w-[14px]">◄►</span>
                    </div>
                  </div>

                  <!-- Labels -->
                  <div class="absolute top-4 left-4 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/20 text-[10px] text-white z-10 font-mono">
                    ORIGINAL<br/>{{ formatBytes(result()!.originalSize) }}
                  </div>
                  <div class="absolute top-4 right-4 px-2 py-1 bg-cyan-500/80 backdrop-blur-md rounded border border-cyan-200/50 text-[10px] text-white z-10 font-mono text-right text-shadow">
                    COMPRESSED<br/>{{ formatBytes(result()!.size) }}
                  </div>
                </div>
              }
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-3 gap-2 mt-4">
              <div class="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                <span class="block text-[10px] text-white/40 uppercase">Original</span>
                <span class="block text-sm text-white font-mono mt-1">{{ formatBytes(result()!.originalSize) }}</span>
              </div>
              <div class="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-center">
                <span class="block text-[10px] text-cyan-400/80 uppercase">Compressed</span>
                <span class="block text-sm text-cyan-400 font-mono mt-1 font-bold">{{ formatBytes(result()!.size) }}</span>
              </div>
              <div class="p-3 bg-green-500/10 rounded-xl border border-green-500/30 text-center">
                <span class="block text-[10px] text-green-400/80 uppercase">Savings</span>
                <span class="block text-sm text-green-400 font-mono mt-1 font-bold">{{ calculateSavings(result()!.originalSize, result()!.size) }}</span>
              </div>
            </div>

            <!-- Download Button -->
            <button (click)="onDownload()"
              class="w-full py-4 mt-4 rounded-xl font-bold text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform">
              📥 Download Compressed Image
            </button>
          }

          @if (errorMessage()) {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ errorMessage() }}</div>
          }
        </div>
      </div>
    </div>
  `
})
export class ImageCompressorComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectImageCompressorState);

  readonly inputImage = signal<File | null>(null);
  readonly inputUrl = signal<string | null>(null);
  
  readonly targetFormat = signal('image/webp');
  readonly targetQuality = signal(80);
  
  readonly result = signal<CompressResult | null>(null);
  readonly isProcessing = signal(false);
  readonly errorMessage = signal<string | null>(null);
  
  readonly viewMode = signal<'split'|'original'|'compressed'>('split');
  readonly splitPos = signal(50);

  private tempUrls: string[] = [];
  private htmlImage: HTMLImageElement | null = null;
  private debounceTimer: any;

  async onFileSelected(files: File[]): Promise<void> {
    const file = files[0];
    if (!file) return;

    this.inputImage.set(file);
    this.errorMessage.set(null);
    this.result.set(null);
    
    // Auto-detect best format (if not png keep webp for max compression, otherwise keep png if original is png)
    if (file.type === 'image/png') this.targetFormat.set('image/png');
    else this.targetFormat.set('image/webp');

    const url = URL.createObjectURL(file);
    this.tempUrls.push(url);
    this.inputUrl.set(url);

    try {
      this.htmlImage = await this.loadImage(url);
      // Run initial compression immediately
      this.previewCompression();
    } catch {
      this.errorMessage.set('Failed to render original image.');
    }
  }

  onSplitMove(event: MouseEvent | TouchEvent): void {
    if (this.viewMode() !== 'split') return;
    const target = (event.currentTarget as HTMLElement);
    const rect = target.getBoundingClientRect();
    
    let clientX = 0;
    if (window.TouchEvent && event instanceof TouchEvent) {
      clientX = event.touches[0].clientX;
    } else {
      clientX = (event as MouseEvent).clientX;
    }

    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    this.splitPos.set((x / rect.width) * 100);
  }

  // Real-time canvas compression engine
  previewCompression(): void {
    if (!this.htmlImage || !this.inputImage()) return;
    
    clearTimeout(this.debounceTimer);
    this.isProcessing.set(true);

    this.debounceTimer = setTimeout(async () => {
      try {
        const file = this.inputImage()!;
        const img = this.htmlImage!;
        const format = this.targetFormat();
        const quality = this.targetQuality() / 100;

        const canvas = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('2D Context failed');

        if (format === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        let blob: Blob;
        try {
          blob = await canvas.convertToBlob({ type: format, quality });
        } catch {
          blob = await this.fallbackConvert(img, format, quality);
        }

        const url = URL.createObjectURL(blob);
        this.tempUrls.push(url);

        let ext = format.split('/')[1];
        if (ext === 'jpeg') ext = 'jpg';
        const outName = file.name.replace(/\.[^.]+$/, '') + `_compressed.${ext}`;

        this.result.set({
          name: outName,
          blob,
          url,
          size: blob.size,
          originalSize: file.size,
          quality: this.targetQuality(),
          format
        });
        
        // Update NGRX
        this.store.dispatch(ImageCompressorActions.processingSuccess({ outputBlob: blob, outputText: '', outputSizeMB: blob.size / 1024 / 1024 }));

      } catch (err) {
        this.errorMessage.set(err instanceof Error ? err.message : 'Compression failed');
      } finally {
        this.isProcessing.set(false);
      }
    }, 150); // 150ms debounce for smooth slider movement
  }

  private fallbackConvert(img: HTMLImageElement, format: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No ctx');
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(b => b ? resolve(b) : reject('Failed Blob'), format, quality);
    });
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  calculateSavings(orig: number, comp: number): string {
    if (comp >= orig) return '0%';
    const p = ((orig - comp) / orig) * 100;
    return `-${p.toFixed(1)}%`;
  }

  onDownload(): void {
    const res = this.result();
    if (!res) return;
    const a = document.createElement('a');
    a.href = res.url;
    a.download = res.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimer);
    for (const u of this.tempUrls) URL.revokeObjectURL(u);
    this.tempUrls = [];
    this.store.dispatch(ImageCompressorActions.resetState());
  }
}
