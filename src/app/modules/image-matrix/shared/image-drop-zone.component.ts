// ============================================================
// IMAGE FILE DROP ZONE — Shared file input for image tools
// File: src/app/modules/image-matrix/shared/image-drop-zone.component.ts
// ============================================================

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-drop-zone',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative flex flex-col items-center justify-center w-full min-h-[200px] rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
      role="button"
      [attr.aria-label]="label"
      [class.border-cyan-400]="isDragOver()"
      [class.bg-cyan-500/5]="isDragOver()"
      [class.border-green-500]="hasFile() && !errorMsg()"
      [class.border-white/20]="!isDragOver() && !hasFile() && !errorMsg()"
      [class.bg-white/3]="!isDragOver()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
      (drop)="onDrop($event)"
      (click)="fileInput.click()" (keydown.enter)="fileInput.click()"
      (keydown.space)="$event.preventDefault(); fileInput.click()" tabindex="0"
    >
      <input #fileInput type="file" [accept]="accept" [multiple]="multiple" class="hidden" (change)="onFileChange($event)" tabindex="-1" />

      @if (hasFile() && previewUrl()) {
        <div class="flex flex-col items-center gap-3 p-4 w-full">
          <img [src]="previewUrl()" alt="Preview" class="max-h-[160px] rounded-xl object-contain shadow-lg" />
          <div class="text-center">
            <p class="text-sm font-medium text-white truncate max-w-[240px]">{{ selectedFileName() }}</p>
            <p class="text-xs text-white/50">{{ selectedFileSize() }} · {{ selectedDimensions() }}</p>
          </div>
          <button (click)="onClear($event)" class="text-xs text-red-400 hover:text-red-300 transition-colors">
            ✕ Remove
          </button>
        </div>
      } @else if (errorMsg()) {
        <div class="flex flex-col items-center gap-2 px-6 text-center">
          <div class="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <p class="text-sm text-red-400">{{ errorMsg() }}</p>
          <p class="text-xs text-white/50">Click to try again</p>
        </div>
      } @else {
        <div class="flex flex-col items-center gap-3 px-6 text-center pointer-events-none">
          <div class="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-white">{{ label }}</p>
            <p class="text-xs text-white/40 mt-1">Supports: PNG, JPG, WebP, BMP, GIF, HEIC</p>
            <p class="text-xs text-white/30 mt-0.5">Max {{ maxSizeMB }}MB</p>
          </div>
        </div>
      }
    </div>
  `
})
export class ImageDropZoneComponent {
  @Input() accept = 'image/*';
  @Input() multiple = false;
  @Input() maxSizeMB = 50;
  @Input() label = 'Drop image here or click to browse';
  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() imageLoaded = new EventEmitter<{ width: number; height: number; file: File }>();

  isDragOver = signal(false);
  hasFile = signal(false);
  selectedFileName = signal('');
  selectedFileSize = signal('');
  selectedDimensions = signal('');
  previewUrl = signal('');
  errorMsg = signal('');

  onDragOver(event: DragEvent) { event.preventDefault(); event.stopPropagation(); this.isDragOver.set(true); }
  onDragLeave() { this.isDragOver.set(false); }

  onDrop(event: DragEvent) {
    event.preventDefault(); event.stopPropagation();
    this.isDragOver.set(false);
    const files = Array.from(event.dataTransfer?.files ?? []);
    if (files.length) this.processFiles(files);
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length) this.processFiles(files);
    input.value = '';
  }

  onClear(event: Event) {
    event.stopPropagation();
    this.cleanup();
  }

  private cleanup() {
    const url = this.previewUrl();
    if (url) URL.revokeObjectURL(url);
    this.hasFile.set(false);
    this.selectedFileName.set('');
    this.selectedFileSize.set('');
    this.selectedDimensions.set('');
    this.previewUrl.set('');
    this.errorMsg.set('');
  }

  private processFiles(files: File[]) {
    this.errorMsg.set('');
    const selected = this.multiple ? files : [files[0]];
    const maxBytes = this.maxSizeMB * 1_048_576;

    for (const file of selected) {
      if (file.size > maxBytes) {
        this.errorMsg.set(`File too large. Max ${this.maxSizeMB}MB`);
        return;
      }
    }

    const file = selected[0];
    const url = URL.createObjectURL(file);
    this.previewUrl.set(url);
    this.hasFile.set(true);
    this.selectedFileName.set(file.name);
    const sizeMB = file.size / 1_048_576;
    this.selectedFileSize.set(sizeMB >= 1 ? `${sizeMB.toFixed(2)} MB` : `${(file.size / 1024).toFixed(1)} KB`);

    // Get image dimensions
    const img = new Image();
    img.onload = () => {
      this.selectedDimensions.set(`${img.naturalWidth} × ${img.naturalHeight}`);
      this.imageLoaded.emit({ width: img.naturalWidth, height: img.naturalHeight, file });
    };
    img.src = url;

    this.filesSelected.emit(selected);
  }
}
