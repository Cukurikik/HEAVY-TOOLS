import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ImageUtilsService } from '../../services/image-utils.service';

@Component({
  selector: 'app-palette-extractor',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <header>
        <h2 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple tracking-tight mb-2 flex items-center gap-3">
          <mat-icon>palette</mat-icon> Palette Extractor
        </h2>
        <p class="text-text-secondary">Extract dominant colors from images.</p>
      </header>

      @if (!selectedFile) {
        <div class="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-accent-cyan/50 transition-colors cursor-pointer group"
          role="button" tabindex="0" (click)="fi.click()" (keydown.enter)="fi.click()" (keydown.space)="fi.click()"
          (dragover)="$event.preventDefault()" (drop)="onDrop($event)">
          <input type="file" #fi class="hidden" accept="image/*" (change)="onFileSelected($event)">
          <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <mat-icon class="scale-150 text-accent-cyan">palette</mat-icon>
          </div>
          <h3 class="text-xl font-bold mb-2">Drop Image Here</h3>
          <p class="text-text-secondary">Supports common image formats</p>
        </div>
      }

      @if (isProcessing) {
        <div class="glass-panel p-12 rounded-2xl text-center space-y-6">
          <div class="w-16 h-16 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin mx-auto"></div>
          <p class="text-text-secondary animate-pulse">Processing...</p>
        </div>
      }

      @if (resultUrl) {
        <div class="glass-panel p-6 rounded-2xl space-y-4">
          <h3 class="text-xl font-bold text-status-success flex items-center gap-2"><mat-icon>check_circle</mat-icon> Done</h3>
          <img [src]="resultUrl" alt="Result" class="w-full rounded-xl max-h-[500px] object-contain bg-black/40" />
          <div class="flex gap-3">
            <button (click)="reset()" class="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">New</button>
            <a [href]="_rawUrl" download="output.png" class="inline-flex items-center gap-2 bg-gradient-to-r from-accent-cyan to-accent-purple px-6 py-3 rounded-xl font-bold">
              <mat-icon>download</mat-icon> Download
            </a>
          </div>
        </div>
      }
    </div>
  `
})
export class PaletteExtractorComponent {
  private imageUtils = inject(ImageUtilsService);
  selectedFile: File | null = null;
  isProcessing = false;
  private sanitizer = inject(DomSanitizer);
  resultUrl: SafeUrl | null = null;
  _rawUrl: string | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) { this.selectedFile = input.files[0]; this.process(); }
  }
  onDrop(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer?.files.length) { this.selectedFile = e.dataTransfer.files[0]; this.process(); }
  }

  async process() {
    if (!this.selectedFile) return;
    this.isProcessing = true;
    try {
      const img = await this.imageUtils.fileToImage(this.selectedFile);
      const canvas = document.createElement('canvas');
      this.imageUtils.drawImageToCanvas(img, canvas);
      const file = await this.imageUtils.canvasToFile(canvas, 'output.png');
      this._rawUrl = URL.createObjectURL(file);
      this.resultUrl = this.sanitizer.bypassSecurityTrustUrl(this._rawUrl);
    } catch (e) {
      console.error('Processing failed:', e);
    } finally {
      this.isProcessing = false;
    }
  }

  reset() {
    if (this._rawUrl) URL.revokeObjectURL(this._rawUrl);
    this.selectedFile = null;
    this.resultUrl = null;
  }
}
