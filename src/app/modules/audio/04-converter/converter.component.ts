import { ChangeDetectionStrategy, Component, inject, OnDestroy, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { audioConverterFeature, audioConverterActions } from './converter.store';
import { AudioPlayerComponent } from '../shared/components/audio-player/audio-player.component';

@Component({
  selector: 'app-04-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, AudioPlayerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Header -->
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
            <span class="text-2xl">🎵</span>
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">Format Converter</h1>
            <p class="text-sm text-white/40">Convert between WAV, MP3, AAC, OGG, FLAC, OPUS</p>
          </div>
        </div>

        <!-- Drop Zone -->
        <div class="relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group"
             [class.border-cyan-500]="isDragOver" [class.bg-cyan-500/5]="isDragOver"
             [class.border-white/20]="!isDragOver" [class.hover:border-white/40]="!isDragOver"
             (click)="fileInput.click()" (keydown.enter)="fileInput.click()" tabindex="0" (drop)="onDrop($event)" (dragover)="onDragOver($event)" (dragleave)="isDragOver=false">
          <input #fileInput type="file" class="hidden" accept="audio/*"
                 (change)="onFileSelect($event)">
          <div class="space-y-3">
            <div class="w-16 h-16 mx-auto rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <span class="text-3xl">🎵</span>
            </div>
            <p class="text-white/70 text-sm">Drop audio files here or <span class="text-cyan-400 underline">browse</span></p>
            <p class="text-white/30 text-xs">MP3, WAV, FLAC, OGG, AAC, OPUS, M4A — Max 500MB</p>
          </div>
        </div>

        <!-- Controls -->
        @if ((state$ | async)?.inputFile) {
          <div class="bg-[#12121a] rounded-2xl p-6 border border-white/5 space-y-4">
            <div class="h-32 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
               <p class="text-white/30 text-sm">Input: {{ (state$ | async)?.inputFile?.name }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              @for(fmt of ['wav','mp3','aac','ogg','flac','opus','m4a'];track fmt){
                <button class="px-4 py-2 rounded-lg text-xs font-bold transition-all" 
                        [class.bg-cyan-500]="localFormat===fmt" 
                        [class.text-black]="localFormat===fmt" 
                        [class.bg-white/5]="localFormat!==fmt" 
                        [class.text-white/50]="localFormat!==fmt" 
                        (click)="localFormat=fmt">{{fmt.toUpperCase()}}</button>
              }
            </div>
          </div>

          <!-- Processing -->
          <div class="flex items-center gap-4">
            @if ((state$ | async)?.status === 'processing') {
              <div class="w-full h-12 rounded-xl bg-white/5 overflow-hidden relative border border-white/10">
                <div class="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                     [style.width.%]="(state$ | async)?.progress"></div>
                <div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white uppercase tracking-widest">
                  Processing {{ (state$ | async)?.progress }}%
                </div>
              </div>
            } @else {
              <button class="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
                      (click)="onProcess()">
                ⚡ Process
              </button>
            }
          </div>

          <!-- Player -->
          <app-audio-player [audioBlob]="((state$ | async)?.outputBlob ?? null)"></app-audio-player>

          <!-- Export Panel -->
          <div class="bg-[#12121a] rounded-xl p-4 border border-white/5 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-white/70 font-medium">Export Information</span>
              @if ((state$ | async)?.outputSizeMB) {
                <span class="text-xs text-white/40">{{ (state$ | async)?.outputSizeMB?.toFixed(2) }} MB</span>
              }
            </div>
            
            <button class="w-full py-3 rounded-xl font-bold text-sm transition-all"
                    [class.bg-gradient-to-r]="!disabled" [class.from-cyan-500]="!disabled"
                    [class.to-purple-500]="!disabled" [class.text-white]="!disabled"
                    [class.bg-white/10]="disabled" [class.text-white/30]="disabled"
                    [disabled]="disabled" (click)="download()">
              {{ disabled ? 'Process First' : '⬇ Download ' + localFormat.toUpperCase() }}
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class AudioConverterComponent {
  private store = inject(Store);
  
  state$ = this.store.select(audioConverterFeature.selectAudioConverterState);
  localFormat = 'mp3';
  
  disabled = true;
  isDragOver = false;

  constructor() {
    this.store.select(audioConverterFeature.selectAudioConverterState)
      .pipe(takeUntilDestroyed())
      .subscribe(state => {
        this.disabled = state.status !== 'done' || !state.outputBlob;
      });
  }

  onFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    this.store.dispatch(audioConverterActions.loadFile({ file: files[0] }));
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.onFilesSelected(input.files);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.onFilesSelected(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onProcess() {
    this.store.dispatch(audioConverterActions.startProcessing());
  }

  download() {
    this.store.dispatch(audioConverterActions.downloadOutput());
  }
}
