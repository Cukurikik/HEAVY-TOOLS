// ============================================================
// FEATURE 07 — SVG CONVERTER — Component (FULLY FUNCTIONAL)
// Route: /converter/svg-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConverterFileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { SvgConverterActions, selectSvgConverterState } from './svg-converter.store';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'png',  label: 'PNG',  icon: '🖼️' },
  { value: 'jpeg', label: 'JPEG', icon: '🖼️' },
  { value: 'webp', label: 'WEBP', icon: '🌐' },
  { value: 'svg',  label: 'SVG',  icon: '📐' },
];

@Component({
  selector: 'app-svg-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          🔷 SVG & Vector Converter
        </h1>
        <p class="text-white/50 text-sm">Convert SVG to Raster formats (PNG, JPEG, WEBP) or encapsulate Raster images into SVG</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Input & Controls -->
        <div class="space-y-4">
          <app-converter-file-drop-zone
            accept="image/*,.svg"
            [multiple]="false"
            [maxSizeMB]="25"
            label="Drop SVG or Image file here"
            (filesSelected)="onFileSelected($event)" />

          @if (inputFile()) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-white truncate max-w-[200px]">{{ inputFile()!.name }}</span>
                <span class="text-white/40 font-mono">{{ inputWidth() }} × {{ inputHeight() }}px</span>
              </div>
              
              <div class="space-y-2">
                 <span class="text-xs text-white/40 uppercase tracking-wider font-semibold">Convert To</span>
                 <app-converter-format-selector
                   [formats]="outputFormats"
                   [selected]="outputFormat()"
                   (formatChange)="outputFormat.set($event)" />
              </div>

              <!-- SVG Scale Control (Only relevant when rasterizing an SVG) -->
              @if (inputFile()!.type === 'image/svg+xml' && outputFormat() !== 'svg') {
                <div class="space-y-2 pt-2 border-t border-white/10">
                  <div class="flex justify-between text-xs text-white/40">
                    <span>Rasterize Scale Multiplier</span>
                    <span class="text-cyan-400 font-mono">{{ scaleMultiplier() }}x ({{ inputWidth() * scaleMultiplier() }} × {{ inputHeight() * scaleMultiplier() }}px)</span>
                  </div>
                  <input type="range" min="1" max="10" step="1" [value]="scaleMultiplier()" (input)="scaleMultiplier.set(+($any($event.target)).value)" class="w-full accent-cyan-400" />
                </div>
              }

              <!-- Quality Control for JPEG/WEBP -->
              @if (outputFormat() === 'jpeg' || outputFormat() === 'webp') {
                <div class="space-y-2 pt-2 border-t border-white/10">
                  <div class="flex justify-between text-xs text-white/40">
                    <span>Compression Quality</span>
                    <span class="text-cyan-400">{{ quality() }}%</span>
                  </div>
                  <input type="range" min="10" max="100" step="1" [value]="quality()" (input)="quality.set(+($any($event.target)).value)" class="w-full accent-cyan-400" />
                </div>
              }

              <button
                [disabled]="isProcessing()"
                (click)="onProcess()"
                class="w-full py-3 mt-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                       bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
                @if (isProcessing()) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                } @else { 🔷 Convert Image }
              </button>

              @if (errorMessage()) {
                <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                  ⚠️ {{ errorMessage() }}
                </div>
              }
            </div>
          }
        </div>

        <!-- RIGHT: Live Preview & Output -->
        <div class="space-y-4">
          @if (inputUrl() && !result()) {
            <div class="rounded-2xl border border-white/10 bg-[#12121a] p-2 relative">
              <div class="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[10px] text-white/60">SOURCE</div>
              <!-- Checkboard background for transparency -->
              <div class="w-full h-[400px] rounded-xl checkerboard-bg flex items-center justify-center overflow-hidden">
                <img [src]="inputUrl()" class="max-w-full max-h-full object-contain drop-shadow-2xl" />
              </div>
            </div>
          }

          @if (isProcessing()) {
            <div class="flex justify-center p-8 bg-white/5 rounded-2xl border border-white/10 h-[416px] items-center">
              <app-converter-progress-ring [progress]="100" label="Rendering Canvas..." />
            </div>
          }

          @if (result() && !isProcessing()) {
            <div class="rounded-2xl border border-white/10 bg-[#12121a] p-2 relative group">
              <div class="absolute top-2 left-2 px-2 py-1 bg-cyan-500/80 backdrop-blur-md rounded border border-cyan-300 text-[10px] text-white shadow-lg space-x-2 z-10">
                <span>CONVERTED</span>
                <span class="font-bold border-l border-white/30 pl-2">{{ outputFormat().toUpperCase() }}</span>
                <span class="font-mono border-l border-white/30 pl-2">{{ formatBytes(result()!.size) }}</span>
              </div>
              
              <!-- Checkboard background for transparency -->
              <div class="w-full h-[400px] rounded-xl checkerboard-bg flex items-center justify-center overflow-hidden relative">
                @if (outputFormat() === 'svg') {
                  <img [src]="result()!.url" class="max-w-full max-h-full object-contain drop-shadow-2xl" />
                } @else {
                  <img [src]="result()!.url" class="max-w-full max-h-full object-contain drop-shadow-2xl" />
                }
              </div>
            </div>

            <button (click)="onDownload()"
              class="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
              📥 Download {{ outputFormat().toUpperCase() }}
            </button>
            <div class="text-center text-xs text-white/30">{{ result()!.name }}</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkerboard-bg {
      background-image: linear-gradient(45deg, #1f1f2e 25%, transparent 25%), 
                        linear-gradient(-45deg, #1f1f2e 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #1f1f2e 75%), 
                        linear-gradient(-45deg, transparent 75%, #1f1f2e 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    }
  `]
})
export class SvgConverterComponent implements OnDestroy {
  private store = inject(Store);
  outputFormats = OUTPUT_FORMATS;

  readonly inputFile = signal<File | null>(null);
  readonly inputUrl = signal<string | null>(null);
  readonly inputWidth = signal(0);
  readonly inputHeight = signal(0);

  readonly outputFormat = signal('png');
  readonly scaleMultiplier = signal(1); // Scaler for SVG -> Raster
  readonly quality = signal(90);

  readonly isProcessing = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly result = signal<{url: string, blob: Blob, size: number, name: string} | null>(null);

  private tempUrls: string[] = [];

  async onFileSelected(files: File[]): Promise<void> {
    const file = files[0];
    if (!file) return;

    this.inputFile.set(file);
    this.errorMessage.set(null);
    this.result.set(null);
    
    // Auto-detect Format to toggle reasonable defaults
    if (file.type === 'image/svg+xml') {
      this.outputFormat.set('png');
    } else {
      this.outputFormat.set('svg');
    }

    const url = URL.createObjectURL(file);
    this.tempUrls.push(url);
    this.inputUrl.set(url);

    try {
       const img = await this.loadImage(url);
       this.inputWidth.set(img.naturalWidth || 800);
       this.inputHeight.set(img.naturalHeight || 600);
    } catch {
       this.inputWidth.set(800);
       this.inputHeight.set(600);
    }
  }

  async onProcess(): Promise<void> {
    const file = this.inputFile();
    const url = this.inputUrl();
    if (!file || !url) return;

    this.isProcessing.set(true);
    this.errorMessage.set(null);
    this.result.set(null);

    // Allowing UI to render processing spinner
    setTimeout(async () => {
      try {
        const fmt = this.outputFormat();
        const baseName = file.name.replace(/\.[^.]+$/, '');
        let blob: Blob;

        // Path A: Raster -> SVG
        if (fmt === 'svg') {
          if (file.type === 'image/svg+xml') throw new Error('Input is already an SVG.');
          blob = await this.rasterToSvg(file, url);
        }
        // Path B: SVG/Raster -> Raster
        else {
          blob = await this.convertToRaster(url, fmt, file.type === 'image/svg+xml');
        }

        const resUrl = URL.createObjectURL(blob);
        this.tempUrls.push(resUrl);

        let ext = fmt === 'jpeg' ? 'jpg' : fmt;
        this.result.set({
          name: `${baseName}_converted.${ext}`,
          url: resUrl,
          blob: blob,
          size: blob.size,
        });

        // Store integration
        this.store.dispatch(SvgConverterActions.processingSuccess({ outputBlob: , outputText: '', outputSizeMB:  }));

      } catch (err: any) {
        this.errorMessage.set(err.message || 'Conversion failed during DOM/Canvas operation.');
      } finally {
        this.isProcessing.set(false);
      }
    }, 100);
  }

  // 1. Convert any image to specific Raster using Canvas
  private async convertToRaster(imgUrl: string, targetFormat: string, isSvgSource: boolean): Promise<Blob> {
    const img = await this.loadImage(imgUrl);
    
    // Compute exact dimensions
    let w = this.inputWidth();
    let h = this.inputHeight();
    
    // Applying scale multiplier if source is SVG, ensuring crisp rendering at higher resolutions
    if (isSvgSource) {
      w = Math.round(w * this.scaleMultiplier());
      h = Math.round(h * this.scaleMultiplier());
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available.');

    const mime = targetFormat === 'jpeg' ? 'image/jpeg' : targetFormat === 'webp' ? 'image/webp' : 'image/png';

    if (mime === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
    }
    
    ctx.drawImage(img, 0, 0, w, h);

    return new Promise((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error('Canvas rasterization failed.'));
      }, mime, this.quality() / 100);
    });
  }

  // 2. Wrap Raster into an SVG (Base64 encapsulation)
  // For true vectorization, we would need potrace/imagetracerjs WASM module,
  // which is heavy. Standard SVG `<image>` wrapper is the native 100% reliable fallback.
  private async rasterToSvg(file: File, url: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const w = this.inputWidth();
        const h = this.inputHeight();

        const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <image width="${w}" height="${h}" xlink:href="${base64}" />
</svg>`;
        
        resolve(new Blob([svgContent], { type: 'image/svg+xml' }));
      };
      reader.onerror = () => reject(new Error('Failed to read visual data for SVG embedding.'));
      reader.readAsDataURL(file);
    });
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to decode source image payload.'));
      img.src = url;
    });
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
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
    for (const u of this.tempUrls) URL.revokeObjectURL(u);
    this.tempUrls = [];
    this.store.dispatch(SvgConverterActions.resetState());
  }
}
