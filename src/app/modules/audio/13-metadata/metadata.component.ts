import { ChangeDetectionStrategy, Component, inject, OnDestroy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AudioDropZoneComponent } from '../shared/components/audio-drop-zone/audio-drop-zone.component';
import { AudioPlayerComponent } from '../shared/components/audio-player/audio-player.component';
import { AudioExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { AudioProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { WaveformDisplayComponent } from '../shared/components/waveform-display/waveform-display.component';
import { audioMetadataFeature, audioMetadataActions } from './metadata.store';

@Component({
  selector: 'app-13-metadata',
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
            <h1 class="text-xl font-bold text-white">Metadata Editor</h1>
            <p class="text-sm text-white/40">Read and write ID3 tags, cover art, and lyrics</p>
          </div>
        </div>

        <!-- Drop Zone -->
        <app-audio-drop-zone (filesSelected)="onFilesSelected($event)"
          [multiple]="false"></app-audio-drop-zone>

        <!-- Controls -->
        @if ((state$ | async)?.inputFile) {
          <div class="bg-[#12121a] rounded-2xl p-6 border border-white/5 space-y-4">
            <app-waveform-display [waveformData]="(state$ | async)?.waveformData ?? null"></app-waveform-display>
            <div class="grid grid-cols-2 gap-4">@for(field of ['Title','Artist','Album','Year','Genre'];track field){<div><span class="text-xs text-white/40" style="display: block;">{{field}}</span><input type="text" class="w-full bg-white/5 rounded-lg px-3 py-2 text-white text-sm" [placeholder]="field"></div>}</div>
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
            <app-audio-export-panel [disabled]="(state$ | async) === false?.outputBlob"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              (download)="onDownload()"></app-audio-export-panel>
          }
        }
      </div>
    </div>
  `
})
export class AudioMetadataComponent implements OnDestroy {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  state$ = this.store.select(audioMetadataFeature.selectAudioMetadataState);
  

  onFilesSelected(files: File[]): void {
    this.store.dispatch(audioMetadataActions.loadFile({ file: files[0] }));
  }

  onProcess(): void {
    this.store.dispatch(audioMetadataActions.startProcessing());
  }

  onDownload(): void {
    this.store.dispatch(audioMetadataActions.downloadOutput());
  }

  ngOnDestroy(): void {
    this.store.dispatch(audioMetadataActions.resetState());
  }
}
