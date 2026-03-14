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
import { SilenceRemoverState, silenceRemoverFeature, silenceRemoverActions } from './silence-remover.store';
import type { ExportFormat } from '../shared/types/audio.types';

@Component({
  selector: 'app-21-silence-remover',
  standalone: true,
  imports: [CommonModule, FormsModule, AudioDropZoneComponent, AudioPlayerComponent, AudioExportPanelComponent, AudioProgressRingComponent, WaveformDisplayComponent],
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
            <h1 class="text-xl font-bold text-white">Silence Remover</h1>
            <p class="text-sm text-white/40">Detect and remove silent regions</p>
          </div>
        </div>

        <!-- Drop Zone -->
        <app-audio-drop-zone (filesSelected)="onFilesSelected(\$event)"
          [multiple]="false"></app-audio-drop-zone>

        <!-- Controls -->
        @if ((state$ | async)?.inputFile) {
          <div class="bg-[#12121a] rounded-2xl p-6 border border-white/5 space-y-4">
            <app-waveform-display [waveformData]="(state$ | async)?.waveformData ?? null"></app-waveform-display>
            <div><label class="text-xs text-white/40">Threshold (dBFS)</label><input type="range" class="w-full accent-amber-400" min="-60" max="-10" [(ngModel)]="localThreshold"><p class="text-center text-sm text-white/50">{{localThreshold}} dB</p></div>
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
                <button class="ml-3 underline" (click)="onProcess()">Retry</button>
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
export class SilenceRemoverComponent implements OnDestroy {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  state$ = this.store.select(silenceRemoverFeature.selectSilenceRemoverState);
  localThreshold=-40;

  onFilesSelected(files: File[]): void {
    this.store.dispatch(silenceRemoverActions.loadFile({ file: files[0] }));
  }

  onProcess(): void {
    this.store.dispatch(silenceRemoverActions.startProcessing());
  }

  onDownload(): void {
    this.store.dispatch(silenceRemoverActions.downloadOutput());
  }

  ngOnDestroy(): void {
    this.store.dispatch(silenceRemoverActions.resetState());
  }
}
