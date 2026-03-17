import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { VideoErrorCode } from '../../types/video.types';

@Component({
  selector: 'app-file-drop-zone',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative flex flex-col items-center justify-center w-full min-h-[180px] rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
      role="button"
      [attr.aria-label]="label"
      [class.border-cyan-400]="isDragOver()"
      [class.bg-cyan-500/5]="isDragOver()"
      [class.border-red-500]="errorMsg()"
      [class.border-green-500]="hasFile() && !errorMsg()"
      [class.border-white/20]="!isDragOver() && !hasFile() && !errorMsg()"
      [class.bg-white/3]="!isDragOver()"
      [class.opacity-50]="disabled"
      [class.pointer-events-none]="disabled"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
      (drop)="onDrop($event)"
      (click)="fileInput.click()" (keydown.enter)="fileInput.click()"
      (keydown.space)="$event.preventDefault(); fileInput.click()" tabindex="0"
    >
      <input #fileInput type="file" [accept]="accept" [multiple]="multiple" class="hidden" (change)="onFileChange($event)" tabindex="-1" />

      @if (isValidating()) {
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm text-white/60">Validating file...</p>
        </div>
      } @else if (hasFile()) {
        <div class="flex flex-col items-center gap-2 px-6 text-center">
          <div class="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <p class="text-sm font-medium text-white">{{ selectedFileName() }}</p>
          <p class="text-xs text-white/50">{{ selectedFileSize() }}</p>
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
          <div class="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <svg class="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-white">{{ label }}</p>
            <p class="text-xs text-white/40 mt-1">Max {{ maxSizeMB >= 1024 ? (maxSizeMB / 1024).toFixed(0) + 'GB' : maxSizeMB + 'MB' }}</p>
          </div>
        </div>
      }
    </div>
  `
})
export class FileDropZoneComponent {
  @Input() accept = 'video/*';
  @Input() multiple = false;
  @Input() maxSizeMB = 2048;
  @Input() disabled = false;
  @Input() label = 'Drop video file here or click to browse';
  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() validationError = new EventEmitter<VideoErrorCode>();

  isDragOver = signal(false);
  isValidating = signal(false);
  hasFile = signal(false);
  selectedFileName = signal('');
  selectedFileSize = signal('');
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
  private processFiles(files: File[]) {
    this.isValidating.set(true);
    this.errorMsg.set('');
    const selected = this.multiple ? files : [files[0]];
    const maxBytes = this.maxSizeMB * 1_048_576;
    for (const file of selected) {
      if (file.size > maxBytes) {
        this.isValidating.set(false);
        this.errorMsg.set('File too large. Max ' + (this.maxSizeMB >= 1024 ? (this.maxSizeMB/1024)+'GB' : this.maxSizeMB+'MB'));
        this.validationError.emit('FILE_TOO_LARGE');
        return;
      }
    }
    this.isValidating.set(false);
    this.hasFile.set(true);
    this.selectedFileName.set(selected.length === 1 ? selected[0].name : `${selected.length} files selected`);
    const totalMB = selected.reduce((s, f) => s + f.size, 0) / 1_048_576;
    this.selectedFileSize.set(`${totalMB.toFixed(2)} MB`);
    this.filesSelected.emit(selected);
  }
}
