import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { ReverserActions, selectReverserState, selectReverserIsLoading, selectReverserCanProcess } from './reverser.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-reverser',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          ⏪ Video Reverser
        </h1>
        <p class="text-white/50 text-sm">Play video backwards with optional audio reversal</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video to reverse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-purple-400">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Codec</p>
                  <p class="text-sm font-semibold text-white">{{ meta.codec }}</p>
                </div>
              </div>

              <!-- Audio Mode -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Audio Handling</p>
                <div class="grid grid-cols-3 gap-2">
                  @for (mode of audioModes; track mode.value) {
                    <button (click)="selectedAudioMode = mode.value"
                      [class]="selectedAudioMode === mode.value
                        ? 'p-3 rounded-xl border-2 border-purple-400 bg-purple-400/10 text-purple-300 text-sm font-semibold transition-all'
                        : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-all'">
                      <div class="text-lg mb-1">{{ mode.icon }}</div>
                      {{ mode.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Speed Multiplier -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">Reverse Speed</span>
                  <span class="text-purple-400 font-mono">{{ selectedSpeed }}x</span>
                </div>
                <div class="grid grid-cols-4 gap-2">
                  @for (spd of speeds; track spd) {
                    <button (click)="selectedSpeed = spd"
                      [class]="selectedSpeed === spd
                        ? 'py-2 rounded-lg border-2 border-purple-400 bg-purple-400/10 text-purple-300 text-sm font-semibold'
                        : 'py-2 rounded-lg border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ spd }}x
                    </button>
                  }
                </div>
              </div>

              <!-- Info Badge -->
              <div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300/80">
                ℹ️ Reversing requires full re-encoding. Larger files take longer to process.
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Reversing...
                } @else { ⏪ Reverse Video }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) {
            <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" />
          }
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Reversing..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_reversed" />
          }
        </div>
      </div>
    </div>
  `,
})
export class ReverserComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectReverserState);
  isLoading$ = this.store.select(selectReverserIsLoading);
  canProcess$ = this.store.select(selectReverserCanProcess);

  /** Local UI config — not in NgRx store to avoid Language Service type issues */
  selectedAudioMode = 'reverse';
  selectedSpeed = 1;

  audioModes = [
    { value: 'reverse' as const, label: 'Reverse', icon: '🔄' },
    { value: 'mute' as const, label: 'Mute', icon: '🔇' },
    { value: 'keep' as const, label: 'Keep Original', icon: '🔊' },
  ];

  speeds = [0.5, 1, 1.5, 2];

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(ReverserActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(ReverserActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(ReverserActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onProcess() {
    this.store.dispatch(ReverserActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./reverser.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, audioMode: this.selectedAudioMode, speed: this.selectedSpeed }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(ReverserActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(ReverserActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(ReverserActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Reversal failed' }));
        }
      });
    }).unsubscribe();
  }

  ngOnDestroy() { this.store.dispatch(ReverserActions.resetState()); }
}
