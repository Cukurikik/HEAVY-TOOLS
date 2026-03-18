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
  
  isDragOver = false;

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.filesSelected.emit(Array.from(input.files));
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.filesSelected.emit(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }
}