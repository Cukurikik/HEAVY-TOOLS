import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { StabilizerActions, selectStabilizerState, selectStabilizerIsLoading, selectStabilizerCanProcess } from './stabilizer.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-stabilizer',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
          📸 Video Stabilizer
        </h1>
        <p class="text-white/50 text-sm">Remove camera shake with 2-pass stabilization (vidstabdetect + vidstabtransform)</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop shaky video here" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-cyan-400">{{ meta.duration | number:'1.0-0' }}s</p>
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

              <!-- Shakiness Detection -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">Shakiness Detection</span>
                  <span class="text-cyan-400 font-mono">{{ (state$ | async)?.shakiness }}</span>
                </div>
                <input type="range" min="1" max="10" [value]="(state$ | async)?.shakiness"
                  (input)="onShakiness($event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
                <div class="flex justify-between text-xs text-white/30">
                  <span>Low</span><span>Medium</span><span>High</span>
                </div>
              </div>

              <!-- Smoothing Strength -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">Smoothing Strength</span>
                  <span class="text-cyan-400 font-mono">{{ (state$ | async)?.smoothing }}</span>
                </div>
                <input type="range" min="1" max="100" [value]="(state$ | async)?.smoothing"
                  (input)="onSmoothing($event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
                <div class="flex justify-between text-xs text-white/30">
                  <span>Subtle</span><span>Moderate</span><span>Aggressive</span>
                </div>
              </div>

              <!-- Crop Mode -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Edge Fill Mode</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (mode of cropModes; track mode.value) {
                    <button (click)="onCropMode(mode.value)"
                      [class]="(state$ | async)?.cropMode === mode.value
                        ? 'p-3 rounded-xl border-2 border-cyan-400 bg-cyan-400/10 text-cyan-400 text-sm font-semibold transition-all'
                        : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-all'">
                      {{ mode.icon }} {{ mode.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Quick Presets -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Quick Presets</p>
                <div class="grid grid-cols-3 gap-2">
                  @for (preset of presets; track preset.label) {
                    <button (click)="applyPreset(preset)"
                      class="p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 hover:bg-cyan-400/10 hover:border-cyan-400/30 hover:text-cyan-400 transition-all">
                      {{ preset.icon }} {{ preset.label }}
                    </button>
                  }
                </div>
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Stabilizing...
                } @else { 📸 Stabilize Video }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Stabilizing..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_stabilized" />
          }
        </div>
      </div>
    </div>
  ` })
export class StabilizerComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectStabilizerState);
  isLoading$ = this.store.select(selectStabilizerIsLoading);
  canProcess$ = this.store.select(selectStabilizerCanProcess);

  cropModes = [
    { value: 'black' as const, label: 'Black Edges', icon: '⬛' },
    { value: 'fill' as const, label: 'Fill (Zoom)', icon: '🔍' },
  ];

  presets = [
    { label: 'Handheld', icon: '🤳', shakiness: 5, smoothing: 10 },
    { label: 'Walking', icon: '🚶', shakiness: 7, smoothing: 30 },
    { label: 'Action', icon: '🏃', shakiness: 10, smoothing: 50 },
  ];

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(StabilizerActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(StabilizerActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(StabilizerActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onShakiness(e: Event) { this.store.dispatch(StabilizerActions.updateConfig({ config: { shakiness: +(e.target as HTMLInputElement).value } })); }
  onSmoothing(e: Event) { this.store.dispatch(StabilizerActions.updateConfig({ config: { smoothing: +(e.target as HTMLInputElement).value } })); }
  onCropMode(mode: 'black' | 'fill') { this.store.dispatch(StabilizerActions.updateConfig({ config: { cropMode: mode } })); }

  applyPreset(p: { shakiness: number; smoothing: number }) {
    this.store.dispatch(StabilizerActions.updateConfig({ config: { shakiness: p.shakiness, smoothing: p.smoothing } }));
  }

  onProcess() {
    this.store.dispatch(StabilizerActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./stabilizer.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, shakiness: state.shakiness, smoothing: state.smoothing, cropMode: state.cropMode }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(StabilizerActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(StabilizerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(StabilizerActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Stabilization failed' }));
        }
      });
    }).unsubscribe();
  }

  ngOnDestroy() { this.store.dispatch(StabilizerActions.resetState()); }
}
