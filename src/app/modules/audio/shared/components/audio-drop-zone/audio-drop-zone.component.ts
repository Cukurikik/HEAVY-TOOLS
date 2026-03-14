import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { AudioErrorCode } from '../../types/audio.types';

@Component({
  selector: 'app-audio-drop-zone',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group"
         [class.border-cyan-500]="isDragOver" [class.bg-cyan-500/5]="isDragOver"
         [class.border-white/20]="!isDragOver" [class.hover:border-white/40]="!isDragOver"
         (click)="fileInput.click()" (keydown.enter)="fileInput.click()" tabindex="0" (drop)="onDrop($event)" (dragover)="onDragOver($event)" (dragleave)="isDragOver=false">
      <input #fileInput type="file" class="hidden" [accept]="accept" [multiple]="multiple"
             (change)="onFileSelect($event)">
      <div class="space-y-3">
        <div class="w-16 h-16 mx-auto rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <span class="text-3xl">🎵</span>
        </div>
        <p class="text-white/70 text-sm">Drop audio files here or <span class="text-cyan-400 underline">browse</span></p>
        <p class="text-white/30 text-xs">MP3, WAV, FLAC, OGG, AAC, OPUS, M4A — Max {{ maxSizeMB }}MB</p>
      </div>
    </div>
  `
})
export class AudioDropZoneComponent {
  @Input() accept = 'audio/*';
  @Input() multiple = false;
  @Input() maxSizeMB = 500;
  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() validationError = new EventEmitter<AudioErrorCode>();
  isDragOver = false;

  onDragOver(e: DragEvent): void { e.preventDefault(); e.stopPropagation(); this.isDragOver = true; }

  onDrop(e: DragEvent): void {
    e.preventDefault(); e.stopPropagation(); this.isDragOver = false;
    const files = Array.from(e.dataTransfer?.files || []);
    this.validateAndEmit(files);
  }

  onFileSelect(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    this.validateAndEmit(files);
    input.value = '';
  }

  private validateAndEmit(files: File[]): void {
    const valid = files.filter(f => {
      if (f.size > this.maxSizeMB * 1024 * 1024) { this.validationError.emit('FILE_TOO_LARGE'); return false; }
      return true;
    });
    if (valid.length > 0) this.filesSelected.emit(this.multiple ? valid : [valid[0]]);
  }
}
