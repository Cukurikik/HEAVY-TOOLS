import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { ExportFormat } from '../../types/audio.types';

@Component({
  selector: 'app-audio-export-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-5 p-6 rounded-3xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-500 hover:border-white/20 animate-fade-in-up">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-white/90 tracking-wide uppercase">Export Format</h3>
        @if (outputSizeMB) {
          <span class="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-400">
            {{ outputSizeMB.toFixed(1) }} MB
          </span>
        }
      </div>
      
      <!-- Format Grid -->
      <div class="grid grid-cols-4 gap-2">
        @for (fmt of formats; track fmt) {
          <button class="relative px-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 overflow-hidden"
                  [class.bg-gradient-to-r]="selectedFormat() === fmt" 
                  [class.from-cyan-500]="selectedFormat() === fmt"
                  [class.to-blue-500]="selectedFormat() === fmt" 
                  [class.text-white]="selectedFormat() === fmt"
                  [class.shadow-[0_0_15px_rgba(34,211,238,0.4)]]="selectedFormat() === fmt"
                  [class.bg-white/5]="selectedFormat() !== fmt" 
                  [class.hover:bg-white/10]="selectedFormat() !== fmt"
                  [class.text-white/50]="selectedFormat() !== fmt"
                  (click)="selectFormat(fmt)">
            <span class="relative z-10">{{ fmt }}</span>
          </button>
        }
      </div>
      
      <!-- Download Button -->
      <button class="relative flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-500 overflow-hidden group"
              [class.bg-gradient-to-r]="!disabled" [class.from-cyan-500]="!disabled"
              [class.to-blue-600]="!disabled" [class.text-white]="!disabled"
              [class.shadow-[0_0_30px_rgba(34,211,238,0.3)]]="!disabled" [class.hover:-translate-y-1]="!disabled" [class.hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]]="!disabled"
              [class.bg-white/5]="disabled" [class.text-white/30]="disabled" [class.border]="disabled" [class.border-white/10]="disabled"
              [disabled]="disabled" (click)="download.emit()">
              
        @if (!disabled) {
          <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        }
        
        <svg class="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        <span class="relative z-10">{{ disabled ? 'PROCESS FIRST' : 'EXPORT ' + selectedFormat().toUpperCase() }}</span>
      </button>
    </div>
  `
})
export class AudioExportPanelComponent {
  @Input() disabled = true;
  @Input() outputSizeMB: number | null = null;
  @Output() formatChange = new EventEmitter<ExportFormat>();
  @Output() download = new EventEmitter<void>();
  formats: ExportFormat[] = ['wav', 'mp3', 'aac', 'ogg', 'flac', 'opus', 'm4a'];
  selectedFormat = signal<ExportFormat>('wav');

  selectFormat(fmt: ExportFormat): void {
    this.selectedFormat.set(fmt);
    this.formatChange.emit(fmt);
  }
}
