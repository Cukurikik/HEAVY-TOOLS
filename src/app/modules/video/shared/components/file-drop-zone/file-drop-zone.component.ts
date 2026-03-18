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
      class="relative flex flex-col items-center justify-center w-full min-h-[180px] rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer select-none"
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
      (click)="fileInput.click()" (keydown.enter)="fileInput.click()" tabindex="0"
    >
      <input #fileInput type="file" [accept]="accept" [multiple]="multiple" class="hidden" (change)="onFileChange($event)" />

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
        <div class="flex flex-col items-center gap-3 px-6 text-center">
          <div class="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
            <svg class="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </div>
          <div>
            <p class="font-medium text-white">{{ label }}</p>
            <p class="text-sm text-white/50 mt-1">Click or drag a file to upload</p>
          </div>
        </div>
      }
    </div>
  `
})
export class FileDropZoneComponent {
  @Input() accept = '*';
  @Input() label = 'Select a file';
  @Input() multiple = false;
  @Input() disabled = false;
  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() error = new EventEmitter<VideoErrorCode>();

  isDragOver = signal(false);
  hasFile = signal(false);
  selectedFile = signal<File | null>(null);
  selectedFileName = signal('');
  selectedFileSize = signal('');
  errorMsg = signal('');
  isValidating = signal(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (this.disabled) return;
    this.isDragOver.set(true);
  }

  onDragLeave() {
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);

    if (this.disabled) return;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  onFileChange(event: Event) {
    if (this.disabled) return;
    
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.handleFiles(target.files);
    }
  }

  private handleFiles(files: FileList) {
    // Reset states
    this.errorMsg.set('');
    this.hasFile.set(false);
    
    // Process files
    const fileList = Array.from(files);
    if (fileList.length > 0) {
      const file = fileList[0]; // Just take the first file
      
      // Validate file
      if (this.validateFile(file)) {
        this.selectedFile.set(file);
        this.selectedFileName.set(file.name);
        this.selectedFileSize.set(this.formatFileSize(file.size));
        this.hasFile.set(true);
        this.filesSelected.emit(fileList);
      }
    }
  }

  private validateFile(file: File): boolean {
    // Set validating state
    this.isValidating.set(true);

    // Simulate short validation time
    setTimeout(() => {
      this.isValidating.set(false);
      
      // Basic validation
      if (!file.type.startsWith(this.accept.replace('*','')) && this.accept !== '*') {
        const errorCode: VideoErrorCode = 'FILE_TYPE_INVALID' as VideoErrorCode;
        this.errorMsg.set('Invalid file type');
        this.error.emit(errorCode);
        return false;
      }
      
      // File size validation (optional, adjust as needed)
      if (file.size > 500 * 1024 * 1024) { // 500MB limit
        const errorCode: VideoErrorCode = 'FILE_TOO_LARGE' as VideoErrorCode;
        this.errorMsg.set('File too large (>500MB)');
        this.error.emit(errorCode);
        return false;
      }
      
      return true;
    }, 300);
    
    return true;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}