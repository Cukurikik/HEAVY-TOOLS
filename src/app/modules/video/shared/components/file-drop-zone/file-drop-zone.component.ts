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
      class="group relative flex flex-col items-center justify-center w-full min-h-[220px] rounded-3xl transition-all duration-500 cursor-pointer select-none overflow-hidden"
      [class.opacity-50]="disabled"
      [class.pointer-events-none]="disabled"
      tabindex="0"
      role="button"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
      (keydown.enter)="fileInput.click()"
      (keydown.space)="fileInput.click(); $event.preventDefault()"
    >
      <!-- Animated Border Gradient -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
           [class.opacity-100]="isDragOver()"
           [class.!from-red-500/50]="errorMsg()"
           [class.!to-red-500/50]="errorMsg()"
           [class.!from-green-500/50]="hasFile() && !errorMsg()"
           [class.!to-green-500/50]="hasFile() && !errorMsg()"></div>
      
      <!-- Inner Glass Panel -->
      <div class="absolute inset-[2px] rounded-[22px] bg-[#0a0a0f]/90 backdrop-blur-xl border transition-all duration-500 z-10 flex flex-col items-center justify-center"
           [class.border-blue-500/50]="isDragOver()"
           [class.bg-[#0a0a0f]/70]="isDragOver()"
           [class.border-red-500/50]="errorMsg()"
           [class.border-green-500/50]="hasFile() && !errorMsg()"
           [class.border-white/10]="!isDragOver() && !hasFile() && !errorMsg()"
           [class.group-hover:border-white/20]="!isDragOver() && !hasFile() && !errorMsg()">
        
        <input #fileInput type="file" [accept]="accept" [multiple]="multiple" class="hidden" (change)="onFileChange($event)" />

        @if (isValidating()) {
          <div class="flex flex-col items-center gap-4 z-20">
            <div class="relative w-12 h-12">
              <div class="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p class="text-sm font-medium text-white/70 tracking-wide">Validating file...</p>
          </div>
        } @else if (hasFile()) {
          <div class="flex flex-col items-center gap-3 px-6 text-center z-20 animate-fade-in-up">
            <div class="relative w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <div class="absolute inset-0 rounded-full bg-green-500/20 animate-ping opacity-20"></div>
              <svg class="w-8 h-8 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <p class="text-base font-semibold text-white drop-shadow-md">{{ selectedFileName() }}</p>
            <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">{{ selectedFileSize() }}</span>
          </div>
        } @else if (errorMsg()) {
          <div class="flex flex-col items-center gap-3 px-6 text-center z-20 animate-fade-in-up">
            <div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <svg class="w-8 h-8 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <p class="text-sm font-medium text-red-400 drop-shadow-md">{{ errorMsg() }}</p>
            <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/50 hover:bg-white/10 transition-colors">Click to try again</span>
          </div>
        } @else {
          <div class="flex flex-col items-center gap-4 px-6 text-center pointer-events-none z-20 transition-transform duration-500 group-hover:-translate-y-1">
            <div class="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/5 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <svg class="w-10 h-10 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)] group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <div class="space-y-1 mt-2">
              <p class="text-base font-semibold text-white/90 group-hover:text-white transition-colors duration-300 drop-shadow-sm">{{ label }}</p>
              <p class="text-xs font-medium text-white/40 tracking-wider">MAX • {{ maxSizeMB >= 1024 ? (maxSizeMB / 1024).toFixed(0) + 'GB' : maxSizeMB + 'MB' }}</p>
            </div>
          </div>
        }
      </div>
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
