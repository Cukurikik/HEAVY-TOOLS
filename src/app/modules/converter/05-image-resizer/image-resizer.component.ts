// ============================================================
// FEATURE 05 — IMAGE RESIZER — Component (FULLY FUNCTIONAL)
// Route: /converter/image-resizer
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConverterFileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ConverterExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { ImageResizerActions, selectImageResizerState } from './image-resizer.store';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'original', label: 'ORIGINAL', icon: '📄' },
  { value: 'jpeg',     label: 'JPEG',     icon: '🖼️' },
  { value: 'png',      label: 'PNG',      icon: '🎨' },
  { value: 'webp',     label: 'WEBP',     icon: '🌐' },
];

interface ResizeResult {
  name: string;
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  originalSize: number;
}

@Component({
  selector: 'app-image-resizer',
  standalone: true,
  imports: [CommonModule, FormsModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          📐 Image Resizer
        </h1>
        <p class="text-white/50 text-sm">Resize images to exact dimensions, percentage, or presets with high-quality resampling</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Input & Controls -->
        <div class="space-y-4">
          <app-converter-file-drop-zone
            accept="image/*"
            [multiple]="false"
            [maxSizeMB]="50"
            label="Drop image here to resize"
            (filesSelected)="onFileSelected($event)" />

          @if (inputImage()) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <!-- Info -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-white">{{ inputImage()!.name }}</span>
                <span class="text-white/40">{{ inputWidth() }} × {{ inputHeight() }}px</span>
              </div>

              <!-- Resize Mode Selection -->
              <div class="space-y-2">
                <span class="text-xs text-white/40 block">Resize Mode</span>
                <div class="grid grid-cols-3 gap-2">
                  <button (click)="resizeMode.set('exact')"
                    [class]="resizeMode() === 'exact' ? 'py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'py-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 text-sm'">Exact</button>
                  <button (click)="resizeMode.set('percentage')"
                    [class]="resizeMode() === 'percentage' ? 'py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'py-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 text-sm'">Percentage</button>
                  <button (click)="resizeMode.set('preset')"
                    [class]="resizeMode() === 'preset' ? 'py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'py-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 text-sm'">Presets</button>
                </div>
              </div>

              <!-- EXACT MODE -->
              @if (resizeMode() === 'exact') {
                <div class="flex gap-4 items-end">
                  <div class="flex-1 space-y-1">
                    <span class="text-xs text-white/40 block">Width (px)</span>
                    <input type="number" [value]="targetWidth()" (input)="onWidthChange(+($any($event.target)).value)"
                      class="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white font-mono focus:border-cyan-400 focus:outline-none" />
                  </div>
                  <button (click)="maintainRatio.set(!maintainRatio())" class="pb-2 text-white/40 hover:text-white" title="Maintain Aspect Ratio">
                    {{ maintainRatio() ? '🔗' : '⛓️‍💥' }}
                  </button>
                  <div class="flex-1 space-y-1">
                    <span class="text-xs text-white/40 block">Height (px)</span>
                    <input type="number" [value]="targetHeight()" (input)="onHeightChange(+($any($event.target)).value)"
                      class="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white font-mono focus:border-cyan-400 focus:outline-none" />
                  </div>
                </div>
              }

              <!-- PERCENTAGE MODE -->
              @if (resizeMode() === 'percentage') {
                <div class="space-y-2">
                  <div class="flex justify-between text-xs text-white/40">
                    <span>Scale: {{ targetPercentage() }}%</span>
                    <span>{{ calculatePercentDimension(inputWidth()) }} × {{ calculatePercentDimension(inputHeight()) }}px</span>
                  </div>
                  <input type="range" min="1" max="200" [value]="targetPercentage()" (input)="targetPercentage.set(+($any($event.target)).value)"
                    class="w-full accent-cyan-400" />
                </div>
              }

              <!-- PRESETS MODE -->
              @if (resizeMode() === 'preset') {
                <div class="grid grid-cols-2 gap-2">
                  @for (preset of presets; track preset.label) {
                    <button (click)="applyPreset(preset)"
                      class="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-left hover:bg-white/10 hover:border-white/20 transition-all">
                      <span class="block text-white/80 font-medium">{{ preset.label }}</span>
                      <span class="block text-white/40">{{ preset.w }} × {{ preset.h }}</span>
                    </button>
                  }
                </div>
              }

              <!-- Output Format -->
               <div class="pt-4 border-t border-white/10">
                 <app-converter-format-selector
                   [formats]="outputFormats"
                   [selected]="outputFormat()"
                   (formatChange)="outputFormat.set($event)" />
               </div>

              <!-- Process Button -->
              <button (click)="onProcess()" [disabled]="isProcessing()"
                class="w-full py-3 mt-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]">
                @if (isProcessing()) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Resizing...
                } @else {
                  📐 Resize Image
                }
              </button>
              @if (errorMessage()) {
                <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400 mt-2">⚠️ {{ errorMessage() }}</div>
              }
            </div>
          }
        </div>

        <!-- RIGHT: Preview & Output -->
        <div class="space-y-4">
          @if (inputUrl() && !result()) {
            <div class="rounded-2xl overflow-hidden border border-white/10 bg-[#12121a]">
              <div class="p-2 bg-white/5 text-xs text-white/40 text-center">Original Preview</div>
              <img [src]="inputUrl()" alt="Original" class="w-full max-h-[400px] object-contain" />
            </div>
          }

          @if (isProcessing()) {
            <div class="flex justify-center p-8">
              <app-converter-progress-ring [progress]="100" label="Processing Canvas..." />
            </div>
          }

          @if (result()) {
            <div class="rounded-2xl overflow-hidden border border-white/10 bg-[#12121a] relative">
              <div class="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-xs text-white/80 flex gap-3">
                <span>{{ result()!.width }} × {{ result()!.height }}px</span>
                <span class="text-cyan-400">{{ formatBytes(result()!.size) }}</span>
              </div>
              <img [src]="result()!.url" alt="Resized" class="w-full max-h-[500px] object-contain" />
            </div>

            <button (click)="onDownload()"
              class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:scale-[1.02]">
              📥 Download Resized Image
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class ImageResizerComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectImageResizerState);
  outputFormats = OUTPUT_FORMATS;

  readonly presets = [
    { label: 'FHD 1080p', w: 1920, h: 1080 },
    { label: 'HD 720p', w: 1280, h: 720 },
    { label: 'Instagram Square', w: 1080, h: 1080 },
    { label: 'Instagram Story', w: 1080, h: 1920 },
    { label: 'Twitter Post', w: 1200, h: 675 },
    { label: 'Thumbnail', w: 1280, h: 720 },
  ];

  readonly inputImage = signal<File | null>(null);
  readonly inputUrl = signal<string | null>(null);
  readonly inputWidth = signal(0);
  readonly inputHeight = signal(0);

  readonly resizeMode = signal<'exact'|'percentage'|'preset'>('exact');
  readonly maintainRatio = signal(true);
  readonly targetWidth = signal(0);
  readonly targetHeight = signal(0);
  readonly targetPercentage = signal(50);
  readonly outputFormat = signal('original');

  readonly isProcessing = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly result = signal<ResizeResult | null>(null);

  private tempUrls: string[] = [];

  async onFileSelected(files: File[]): Promise<void> {
    const file = files[0];
    if (!file) return;

    this.inputImage.set(file);
    this.result.set(null);
    this.errorMessage.set(null);
    this.store.dispatch(ImageResizerActions.loadFile({ file }));

    const url = URL.createObjectURL(file);
    this.tempUrls.push(url);
    this.inputUrl.set(url);

    // Get original dimensions
    const img = await this.loadImage(url);
    this.inputWidth.set(img.naturalWidth);
    this.inputHeight.set(img.naturalHeight);
    this.targetWidth.set(img.naturalWidth);
    this.targetHeight.set(img.naturalHeight);
  }

  onWidthChange(w: number): void {
    this.targetWidth.set(w);
    if (this.maintainRatio() && this.inputWidth() > 0) {
      const ratio = this.inputHeight() / this.inputWidth();
      this.targetHeight.set(Math.round(w * ratio));
    }
  }

  onHeightChange(h: number): void {
    this.targetHeight.set(h);
    if (this.maintainRatio() && this.inputHeight() > 0) {
      const ratio = this.inputWidth() / this.inputHeight();
      this.targetWidth.set(Math.round(h * ratio));
    }
  }

  calculatePercentDimension(orig: number): number {
    return Math.round(orig * (this.targetPercentage() / 100));
  }

  applyPreset(preset: {w: number, h: number}): void {
    this.targetWidth.set(preset.w);
    this.targetHeight.set(preset.h);
  }

  async onProcess(): Promise<void> {
    const file = this.inputImage();
    const url = this.inputUrl();
    if (!file || !url) return;

    this.isProcessing.set(true);
    this.errorMessage.set(null);
    this.result.set(null);
    this.store.dispatch(ImageResizerActions.startProcessing());

    try {
      let finalW = this.targetWidth();
      let finalH = this.targetHeight();

      if (this.resizeMode() === 'percentage') {
        finalW = this.calculatePercentDimension(this.inputWidth());
        finalH = this.calculatePercentDimension(this.inputHeight());
      }

      if (finalW <= 0 || finalH <= 0 || finalW > 10000 || finalH > 10000) {
        throw new Error('Invalid target dimensions (max 10,000px)');
      }

      const img = await this.loadImage(url);
      const canvas = new OffscreenCanvas(finalW, finalH);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context not available');

      // Transparent/white background handling based on format
      let format = this.outputFormat();
      let mimeType = file.type;
      
      if (format !== 'original') {
        mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      }
      
      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, finalW, finalH);
      }

      ctx.drawImage(img, 0, 0, finalW, finalH);

      let blob: Blob;
      try {
        blob = await canvas.convertToBlob({ type: mimeType, quality: 0.9 });
      } catch {
        blob = await this.fallbackConvert(img, finalW, finalH, mimeType, 0.9);
      }

      const resultUrl = URL.createObjectURL(blob);
      this.tempUrls.push(resultUrl);

      let ext = mimeType.split('/')[1] || 'png';
      if (ext === 'jpeg') ext = 'jpg';
      const outName = file.name.replace(/\.[^.]+$/, '') + `_resized_${finalW}x${finalH}.${ext}`;

      this.result.set({
        name: outName,
        blob,
        url: resultUrl,
        width: finalW,
        height: finalH,
        size: blob.size,
        originalSize: file.size,
      });

      this.store.dispatch(ImageResizerActions.processingSuccess({ outputBlob: , outputText: '', outputSizeMB:  }));

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Resizing failed';
      this.errorMessage.set(msg);
      this.store.dispatch(ImageResizerActions.processingFailure({
        errorCode: 'CONVERSION_FAILED',
        message: msg,
        retryable: true,
      }));
    } finally {
      this.isProcessing.set(false);
    }
  }

  private fallbackConvert(img: HTMLImageElement, width: number, height: number, mimeType: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not available'));
      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, mimeType, quality);
    });
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image for resizing'));
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
    this.store.dispatch(ImageResizerActions.resetState());
  }
}
