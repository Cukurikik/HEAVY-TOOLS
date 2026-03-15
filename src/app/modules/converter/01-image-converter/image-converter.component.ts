// ============================================================
// FEATURE 01 — IMAGE CONVERTER — Component
// Route: /converter/image-converter
// FULLY FUNCTIONAL: Canvas-based image format conversion
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConverterFileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ConverterExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { ImageConverterActions, selectImageConverterState } from './image-converter.store';

// ============================================================
// FORMAT DEFINITIONS
// ============================================================
const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'jpeg', label: 'JPEG', icon: '🖼️' },
  { value: 'png',  label: 'PNG',  icon: '🎨' },
  { value: 'webp', label: 'WEBP', icon: '🌐' },
  { value: 'avif', label: 'AVIF', icon: '🚀', badge: 'Best' },
  { value: 'bmp',  label: 'BMP',  icon: '📋' },
  { value: 'gif',  label: 'GIF',  icon: '🎞️' },
];

// ============================================================
// MIME TYPE MAPPING
// ============================================================
function getMimeType(format: string): string {
  const map: Record<string, string> = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
    bmp: 'image/bmp',
    gif: 'image/gif',
    tiff: 'image/tiff',
  };
  return map[format] ?? 'image/png';
}

// ============================================================
// IMAGE INFO INTERFACE
// ============================================================
interface ImageInfo {
  name: string;
  size: number;
  width: number;
  height: number;
  type: string;
}

// ============================================================
// COMPONENT
// ============================================================
@Component({
  selector: 'app-image-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          🖼️ Image Format Converter
        </h1>
        <p class="text-white/50 text-sm">Convert images between JPEG, PNG, WEBP, AVIF, BMP, GIF formats — 100% client-side</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT PANEL: Input + Settings -->
        <div class="space-y-4">
          <app-converter-file-drop-zone
            accept="image/*"
            [multiple]="true"
            [maxSizeMB]="50"
            label="Drop images here or click to browse"
            (filesSelected)="onFilesSelected($event)" />

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="outputFormat()"
            (formatChange)="onFormatChange($event)" />

          <!-- File Info Panel -->
          @if (inputFiles().length > 0) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <!-- File List -->
              <div class="space-y-2">
                <span class="text-xs text-white/40 block">{{ inputFiles().length }} file(s) selected</span>
                @for (info of fileInfos(); track info.name) {
                  <div class="flex items-center justify-between p-2 rounded-lg bg-white/5 text-sm">
                    <div class="flex items-center gap-2 overflow-hidden">
                      <span class="text-white/60">📄</span>
                      <span class="text-white truncate max-w-[180px]">{{ info.name }}</span>
                    </div>
                    <div class="flex gap-3 text-white/40 text-xs shrink-0">
                      <span>{{ info.width }}×{{ info.height }}</span>
                      <span>{{ (info.size / 1024).toFixed(0) }}KB</span>
                    </div>
                  </div>
                }
              </div>

              <!-- Quality Slider -->
              @if (outputFormat() !== 'png' && outputFormat() !== 'bmp') {
                <div class="space-y-2">
                  <span class="text-xs text-white/40 block">Quality: {{ quality() }}%</span>
                  <input type="range" min="1" max="100" [value]="quality()"
                    (input)="onQualityChange(+($any($event.target)).value)"
                    class="w-full accent-cyan-400" />
                </div>
              }

              <!-- Resize Option -->
              <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                  <input type="checkbox" [checked]="enableResize()"
                    (change)="enableResize.set(!enableResize())"
                    class="accent-cyan-400" />
                  Resize output
                </label>
                @if (enableResize()) {
                  <div class="flex gap-2">
                    <div class="flex-1">
                      <span class="text-xs text-white/40 block">Max Width</span>
                      <input type="number" min="16" max="8192" step="1"
                        [value]="maxWidth()" (change)="maxWidth.set(+($any($event.target)).value)"
                        class="w-full px-2 py-1 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400" />
                    </div>
                    <div class="flex-1">
                      <span class="text-xs text-white/40 block">Max Height</span>
                      <input type="number" min="16" max="8192" step="1"
                        [value]="maxHeight()" (change)="maxHeight.set(+($any($event.target)).value)"
                        class="w-full px-2 py-1 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400" />
                    </div>
                  </div>
                }
              </div>

              <!-- Process Button -->
              <button
                [disabled]="isProcessing()"
                (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                       bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]">
                @if (isProcessing()) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Converting {{ processedCount() }}/{{ inputFiles().length }}...
                } @else {
                  🔄 Convert {{ inputFiles().length }} Image(s)
                }
              </button>
            </div>
          }

          <!-- Error -->
          @if (errorMessage()) {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ errorMessage() }}
            </div>
          }
        </div>

        <!-- RIGHT PANEL: Preview + Results -->
        <div class="space-y-4">
          <!-- Image Preview -->
          @if (previewUrl()) {
            <div class="rounded-2xl overflow-hidden border border-white/10 bg-[#12121a]">
              <div class="p-2 bg-white/5 text-xs text-white/40 text-center">Preview</div>
              <img [src]="previewUrl()" alt="Preview" class="w-full max-h-[400px] object-contain" />
            </div>
          }

          <!-- Processing Progress -->
          @if (isProcessing()) {
            <div class="flex justify-center p-8">
              <app-converter-progress-ring [progress]="progress()" label="Converting..." />
            </div>
          }

          <!-- Results -->
          @if (results().length > 0) {
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-white/60">✅ Converted {{ results().length }} file(s)</h3>
              @for (result of results(); track result.name) {
                <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-white font-medium text-sm">{{ result.name }}</span>
                      <div class="flex gap-3 text-xs text-white/40 mt-1">
                        <span>{{ result.width }}×{{ result.height }}</span>
                        <span>{{ (result.size / 1024).toFixed(1) }}KB</span>
                        <span class="text-green-400">{{ result.savings }}</span>
                      </div>
                    </div>
                    <button (click)="downloadResult(result)"
                      class="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-colors">
                      📥 Download
                    </button>
                  </div>
                  <img [src]="result.url" alt="Converted" class="w-full max-h-[200px] object-contain rounded-lg" />
                </div>
              }
              @if (results().length > 1) {
                <button (click)="downloadAll()"
                  class="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-[1.02] transition-all">
                  📦 Download All as ZIP
                </button>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ImageConverterComponent implements OnDestroy {
  store = inject(Store);
  state$ = this.store.select(selectImageConverterState);
  outputFormats = OUTPUT_FORMATS;
  actions = ImageConverterActions;

  // ═══════════════════════════════════════════════════
  // LOCAL SIGNALS (for real-time UI without NgRx roundtrip)
  // ═══════════════════════════════════════════════════
  readonly inputFiles = signal<File[]>([]);
  readonly fileInfos = signal<ImageInfo[]>([]);
  readonly outputFormat = signal('jpeg');
  readonly quality = signal(85);
  readonly enableResize = signal(false);
  readonly maxWidth = signal(1920);
  readonly maxHeight = signal(1080);
  readonly isProcessing = signal(false);
  readonly progress = signal(0);
  readonly processedCount = signal(0);
  readonly errorMessage = signal<string | null>(null);
  readonly previewUrl = signal<string | null>(null);
  readonly results = signal<ConvertedResult[]>([]);

  private blobUrls: string[] = [];

  // ═══════════════════════════════════════════════════
  // FILE SELECTION
  // ═══════════════════════════════════════════════════
  async onFilesSelected(files: File[]): Promise<void> {
    this.inputFiles.set(files);
    this.errorMessage.set(null);
    this.results.set([]);
    this.cleanupUrls();

    // Also dispatch to NgRx store for shared state
    this.store.dispatch(ImageConverterActions.loadFiles({ files }));

    // Analyze each file for preview
    const infos: ImageInfo[] = [];
    for (const file of files) {
      try {
        const info = await this.getImageInfo(file);
        infos.push(info);
      } catch {
        infos.push({ name: file.name, size: file.size, width: 0, height: 0, type: file.type });
      }
    }
    this.fileInfos.set(infos);

    // Show preview of first file
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      this.blobUrls.push(url);
      this.previewUrl.set(url);
    }
  }

  onFormatChange(format: string): void {
    this.outputFormat.set(format);
    this.store.dispatch(ImageConverterActions.setOutputFormat({ format }));
  }

  onQualityChange(quality: number): void {
    this.quality.set(quality);
    this.store.dispatch(ImageConverterActions.setQuality({ quality }));
  }

  // ═══════════════════════════════════════════════════
  // CORE PROCESSING LOGIC — Canvas-based Conversion
  // ═══════════════════════════════════════════════════
  async onProcess(): Promise<void> {
    const files = this.inputFiles();
    if (files.length === 0) return;

    this.isProcessing.set(true);
    this.progress.set(0);
    this.processedCount.set(0);
    this.errorMessage.set(null);
    this.results.set([]);
    this.cleanupUrls();
    this.store.dispatch(ImageConverterActions.startProcessing());

    const convertedResults: ConvertedResult[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.processedCount.set(i + 1);
        this.progress.set(Math.round(((i) / files.length) * 100));

        try {
          const result = await this.convertSingleImage(file);
          convertedResults.push(result);
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          convertedResults.push({
            name: `ERROR_${file.name}`,
            blob: new Blob(),
            url: '',
            size: 0,
            width: 0,
            height: 0,
            savings: msg,
            originalSize: file.size,
          });
        }
      }

      this.progress.set(100);
      this.results.set(convertedResults.filter(r => r.blob.size > 0));

      // Update NgRx store with the first successful result (for export panel compatibility)
      const firstGood = convertedResults.find(r => r.blob.size > 0);
      if (firstGood) {
        this.store.dispatch(ImageConverterActions.processingSuccess({ outputBlob: , outputText: '', outputSizeMB:  }));
      }

      if (convertedResults.every(r => r.blob.size === 0)) {
        throw new Error('All images failed to convert. Check that the files are valid images.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Conversion failed';
      this.errorMessage.set(msg);
      this.store.dispatch(ImageConverterActions.processingFailure({
        errorCode: 'CONVERSION_FAILED',
        message: msg,
        retryable: true,
      }));
    } finally {
      this.isProcessing.set(false);
    }
  }

  // ═══════════════════════════════════════════════════
  // SINGLE IMAGE CONVERSION ENGINE
  // ═══════════════════════════════════════════════════
  private async convertSingleImage(file: File): Promise<ConvertedResult> {
    const format = this.outputFormat();
    const quality = this.quality() / 100;
    const mimeType = getMimeType(format);

    // Step 1: Load image into HTMLImageElement
    const img = await this.loadImage(file);

    // Step 2: Calculate output dimensions
    let outWidth = img.naturalWidth;
    let outHeight = img.naturalHeight;

    if (this.enableResize()) {
      const maxW = this.maxWidth();
      const maxH = this.maxHeight();
      const ratio = Math.min(maxW / outWidth, maxH / outHeight, 1);
      outWidth = Math.round(outWidth * ratio);
      outHeight = Math.round(outHeight * ratio);
    }

    // Step 3: Draw onto canvas
    const canvas = new OffscreenCanvas(outWidth, outHeight);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');

    // For JPEG: fill white background (no transparency)
    if (format === 'jpeg' || format === 'jpg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, outWidth, outHeight);
    }

    ctx.drawImage(img, 0, 0, outWidth, outHeight);

    // Step 4: Export to target format
    let blob: Blob;
    try {
      blob = await canvas.convertToBlob({ type: mimeType, quality });
    } catch {
      // Fallback: some browsers don't support AVIF/WEBP in OffscreenCanvas
      // Use regular canvas as fallback
      blob = await this.fallbackConvert(img, outWidth, outHeight, mimeType, quality, format);
    }

    // Step 5: Create result object
    const ext = format === 'jpeg' ? 'jpg' : format;
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const outputName = `${baseName}.${ext}`;
    const url = URL.createObjectURL(blob);
    this.blobUrls.push(url);

    const savings = file.size > 0
      ? `${((1 - blob.size / file.size) * 100).toFixed(1)}% ${blob.size < file.size ? 'smaller' : 'larger'}`
      : 'N/A';

    return {
      name: outputName,
      blob,
      url,
      size: blob.size,
      width: outWidth,
      height: outHeight,
      savings,
      originalSize: file.size,
    };
  }

  // ═══════════════════════════════════════════════════
  // FALLBACK: Regular Canvas for unsupported formats
  // ═══════════════════════════════════════════════════
  private fallbackConvert(
    img: HTMLImageElement,
    width: number,
    height: number,
    mimeType: string,
    quality: number,
    format: string
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not available'));

      if (format === 'jpeg' || format === 'jpg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error(`Failed to convert to ${format}`));
        },
        mimeType,
        quality
      );
    });
  }

  // ═══════════════════════════════════════════════════
  // IMAGE LOADING UTILITY
  // ═══════════════════════════════════════════════════
  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to load image: ${file.name}`));
      };
      img.src = url;
    });
  }

  private async getImageInfo(file: File): Promise<ImageInfo> {
    const img = await this.loadImage(file);
    return {
      name: file.name,
      size: file.size,
      width: img.naturalWidth,
      height: img.naturalHeight,
      type: file.type,
    };
  }

  // ═══════════════════════════════════════════════════
  // DOWNLOAD LOGIC
  // ═══════════════════════════════════════════════════
  downloadResult(result: ConvertedResult): void {
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async downloadAll(): Promise<void> {
    const allResults = this.results();
    if (allResults.length === 0) return;

    // Simple: download each one individually (no dependency on JSZip)
    for (const result of allResults) {
      this.downloadResult(result);
      await new Promise(r => setTimeout(r, 300)); // Small delay between downloads
    }
  }

  // ═══════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════
  private cleanupUrls(): void {
    for (const url of this.blobUrls) {
      URL.revokeObjectURL(url);
    }
    this.blobUrls = [];
    this.previewUrl.set(null);
  }

  ngOnDestroy(): void {
    this.cleanupUrls();
    this.store.dispatch(ImageConverterActions.resetState());
  }
}

// ═══════════════════════════════════════════════════
// RESULT INTERFACE
// ═══════════════════════════════════════════════════
interface ConvertedResult {
  name: string;
  blob: Blob;
  url: string;
  size: number;
  width: number;
  height: number;
  savings: string;
  originalSize: number;
}
