import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { SpeedControllerActions, selectSpeedControllerState, selectSpeedControllerIsLoading, selectSpeedControllerCanProcess } from './speedController.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-speed-controller',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-200">
          ⚡ Speed Controller
        </h1>
        <p class="text-white/50 text-sm">Change video playback speed from 0.25x slow-mo to 4x fast-forward</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <!-- Metadata -->
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Original Duration</p>
                  <p class="text-sm font-semibold text-violet-400">{{ meta.duration | number:'1.0-1' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">New Duration</p>
                  <p class="text-sm font-semibold text-emerald-400">{{ meta.duration / speed | number:'1.0-1' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Speed</p>
                  <p class="text-sm font-semibold text-white">{{ speed }}x</p>
                </div>
              </div>

              <!-- Speed Slider -->
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-white/40 uppercase tracking-wider" style="display: block;">Speed</span>
                  <span class="text-lg font-black text-violet-400">{{ speed }}x</span>
                </div>
                <input type="range" min="0.25" max="4" step="0.25" [value]="speed"
                  (input)="onSpeedChange(+($any($event.target)).value)"
                  class="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-blue-500 via-violet-500 to-red-500" />
                <div class="flex justify-between text-[10px] text-white/30">
                  <span>🐢 0.25x</span>
                  <span>▶️ 1x</span>
                  <span>🐇 4x</span>
                </div>
              </div>

              <!-- Speed Preset Buttons -->
              <div class="grid grid-cols-6 gap-1.5">
                @for (p of speedPresets; track p) {
                  <button (click)="onSpeedChange(p)"
                    class="py-2 rounded-lg text-xs font-bold transition-all duration-200"
                    [class.bg-violet-500]="speed === p"
                    [class.text-black]="speed === p"
                    [class.bg-white/5]="speed !== p"
                    [class.text-white/50]="speed !== p">{{ p }}x</button>
                }
              </div>

              <!-- Audio Mode -->
              <div class="space-y-2">
                <span class="text-xs text-white/40 uppercase tracking-wider" style="display: block;">Audio Mode</span>
                <div class="grid grid-cols-3 gap-2">
                  @for (mode of audioModes; track mode.value) {
                    <button (click)="onAudioModeChange(mode.value)"
                      class="py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                      [class.bg-violet-500/20]="audioMode === mode.value"
                      [class.text-violet-300]="audioMode === mode.value"
                      [class.border]="audioMode === mode.value"
                      [class.border-violet-500/40]="audioMode === mode.value"
                      [class.bg-white/5]="audioMode !== mode.value"
                      [class.text-white/50]="audioMode !== mode.value">{{ mode.icon }} {{ mode.label }}</button>
                  }
                </div>
              </div>

              <!-- Process -->
              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Adjusting Speed...
                } @else { ⚡ Apply Speed Change }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Changing speed..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              defaultFilename="omni_speed" />
          }
        </div>
      </div>
    </div>
  ` })
export class SpeedControllerComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectSpeedControllerState);
  isLoading$ = this.store.select(selectSpeedControllerIsLoading);
  canProcess$ = this.store.select(selectSpeedControllerCanProcess);

  speed = 1;
  audioMode: 'keep' | 'mute' | 'pitchCorrect' = 'pitchCorrect';
  speedPresets = [0.25, 0.5, 1, 1.5, 2, 4];

  audioModes = [
    { value: 'pitchCorrect' as const, label: 'Pitch Fix', icon: '🎵' },
    { value: 'keep' as const, label: 'Keep', icon: '🔊' },
    { value: 'mute' as const, label: 'Mute', icon: '🔇' },
  ];

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(SpeedControllerActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(SpeedControllerActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(SpeedControllerActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onSpeedChange(value: number) {
    this.speed = value;
    this.store.dispatch(SpeedControllerActions.updateConfig({ config: { speed: value } }));
  }

  onAudioModeChange(mode: 'keep' | 'mute' | 'pitchCorrect') {
    this.audioMode = mode;
    this.store.dispatch(SpeedControllerActions.updateConfig({ config: { audioMode: mode } }));
  }

  onProcess() {
    this.store.dispatch(SpeedControllerActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./speedController.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, speed: state.speed, audioMode: state.audioMode }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(SpeedControllerActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(SpeedControllerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(SpeedControllerActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Speed change failed' }));
        }
      });
    });
  }

  ngOnDestroy() { this.store.dispatch(SpeedControllerActions.resetState()); }
}
