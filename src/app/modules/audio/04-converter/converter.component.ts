import { ChangeDetectionStrategy, Component, inject, OnDestroy, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AudioDropZoneComponent } from '../shared/components/audio-drop-zone/audio-drop-zone.component';
import { AudioPlayerComponent } from '../shared/components/audio-player/audio-player.component';
import { AudioExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { AudioProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { WaveformDisplayComponent } from '../shared/components/waveform-display/waveform-display.component';
import { AudioConverterState, audioConverterFeature, audioConverterActions } from './converter.store';
import type { ExportFormat } from '../shared/types/audio.types';

@Component({
  selector: 'app-04-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, AudioDropZoneComponent, AudioPlayerComponent, AudioExportPanelComponent, AudioProgressRingComponent, WaveformDisplayComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6">
    <div class="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div class="relative bg-[#0a0a0f]/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
        <div class="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 space-y-8">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Header -->
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
            <span class="text-2xl">🎵</span>
          </div>
          <div>
            <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg tracking-tight" class="text-xl font-bold text-white">Format Converter</h1>
            <p class="text-sm text-white/40">Convert between WAV, MP3, AAC, OGG, FLAC, OPUS</p>
          </div>
        </div>

        <!-- Drop Zone -->
        <app-audio-drop-zone (filesSelected)="onFilesSelected(\$event)"
          [multiple]="false"></app-audio-drop-zone>

        <!-- Controls -->
        @if ((state$ | async)?.inputFile) {
          <div class="bg-[#12121a] rounded-2xl p-6 border border-white/5 space-y-4">
            <app-waveform-display [waveformData]="(state$ | async)?.waveformData ?? null"></app-waveform-display>
            <div class="flex flex-wrap gap-2">@for(fmt of ['wav','mp3','aac','ogg','flac','opus','m4a'];track fmt){<button class="px-4 py-2 rounded-lg text-xs font-bold transition-all" [class.bg-cyan-500]="localFormat===fmt" [class.text-black]="localFormat===fmt" [class.bg-white/5]="localFormat!==fmt" [class.text-white/50]="localFormat!==fmt" (click)="localFormat=fmt">{{fmt.toUpperCase()}}</button>}</div>
          </div>

          <!-- Processing -->
          <div class="flex items-center gap-4">
            @if ((state$ | async)?.status === 'processing' || (state$ | async)?.status === 'rendering') {
              <app-audio-progress-ring [progress]="(state$ | async)?.progress ?? 0"></app-audio-progress-ring>
              <span class="text-sm text-white/50">Processing...</span>
            } @else {
              <button class="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
                      [disabled]="(state$ | async)?.status !== 'idle'" (click)="onProcess()">
                ⚡ Process
              </button>
            }
          </div>

          <!-- Error -->
          @if ((state$ | async)?.status === 'error') {
            <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {{ (state$ | async)?.errorMessage }}
              @if ((state$ | async)?.retryable) {
                <button class="relative flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 transform hover:-translate-y-1 group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden" (click)="onProcess()">
        <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <span class="relative z-10 flex items-center gap-2">Retry</span>
      </button>
              }
            </div>
          }

          <!-- Player + Export -->
          @if ((state$ | async)?.outputBlob) {
            <app-audio-player [audioBlob]="(state$ | async)?.outputBlob ?? null"></app-audio-player>
            <app-audio-export-panel [disabled]="!(state$ | async)?.outputBlob"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              (download)="onDownload()"></app-audio-export-panel>
          }
        }
      </div>
    </div>
  `
})
export class AudioConverterComponent implements OnDestroy {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  state$ = this.store.select(audioConverterFeature.selectAudioConverterState);
  localFormat='mp3';

  onFilesSelected(files: File[]): void {
    this.store.dispatch(audioConverterActions.loadFile({ file: files[0] }));
  }

  onProcess(): void {
    this.store.dispatch(audioConverterActions.startProcessing());
  }

  onDownload(): void {
    this.store.dispatch(audioConverterActions.downloadOutput());
  }

  ngOnDestroy(): void {
    this.store.dispatch(audioConverterActions.resetState());
  }
}
