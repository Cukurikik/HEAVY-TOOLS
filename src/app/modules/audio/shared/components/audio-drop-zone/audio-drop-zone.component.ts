import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { AudioErrorCode } from '../../types/audio.types';

@Component({
  selector: 'app-audio-drop-zone',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group relative flex flex-col items-center justify-center w-full min-h-[220px] rounded-3xl transition-all duration-500 cursor-pointer select-none overflow-hidden"
         tabindex="0"
         role="button"
         (click)="fileInput.click()" 
         (keydown.enter)="fileInput.click()"
         (keydown.space)="fileInput.click(); $event.preventDefault()"
         (drop)="onDrop($event)" (dragover)="onDragOver($event)" (dragleave)="isDragOver=false">
         
         <input #fileInput type="file" class="hidden" [accept]="accept" [multiple]="multiple" (change)="onFileSelect($event)">
         
         <!-- Animated Border Gradient -->
         <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              [class.opacity-100]="isDragOver"
              [class.!from-blue-500/50]="isDragOver"
              [class.!to-cyan-500/50]="isDragOver"></div>

        <!-- Inner Glass Panel -->
        <div class="absolute inset-[2px] rounded-[22px] bg-[#0a0a0f]/90 backdrop-blur-xl border transition-all duration-500 z-10 flex flex-col items-center justify-center pointer-events-none"
             [class.border-cyan-500/50]="isDragOver"
             [class.bg-[#0a0a0f]/70]="isDragOver"
             [class.border-white/10]="!isDragOver"
             [class.group-hover:border-white/20]="!isDragOver">
             
          <div class="flex flex-col flex-1 items-center justify-center w-full space-y-4 px-6 text-center transform transition-all duration-500 group-hover:-translate-y-1">
            <div class="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/5 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all duration-500">
              <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span class="text-4xl relative z-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform duration-500">🎵</span>
            </div>
            <div class="space-y-1.5 mt-2">
              <p class="text-base font-semibold text-white/90 group-hover:text-white transition-colors duration-300 drop-shadow-sm">Drop audio files here or <span class="text-cyan-400 group-hover:text-cyan-300">browse</span></p>
              <p class="text-xs font-medium text-white/40 tracking-wider uppercase">MP3, WAV, FLAC, OGG, AAC, OPUS, M4A • MAX {{ maxSizeMB }}MB</p>
            </div>
          </div>
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
