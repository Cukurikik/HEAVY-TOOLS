import { take } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { ColorGradingActions, selectColorGradingState, selectColorGradingIsLoading, selectColorGradingCanProcess } from './colorGrading.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-color-grading',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
          🎨 Color Grading
        </h1>
        <p class="text-white/50 text-sm">Adjust brightness, contrast, saturation, hue of the entire video</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video to color grade" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-amber-400">{{ meta.duration | number:'1.0-0' }}s</p>
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

              <!-- Brightness -->
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">☀️ Brightness</span>
                  <span class="text-amber-400 font-mono">{{ brightness }}</span>
                </div>
                <input type="range" min="-1" max="1" step="0.05" [value]="brightness"
                  (input)="onSlider('brightness', $event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400" />
              </div>

              <!-- Contrast -->
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">🔲 Contrast</span>
                  <span class="text-amber-400 font-mono">{{ contrast }}</span>
                </div>
                <input type="range" min="0" max="3" step="0.1" [value]="contrast"
                  (input)="onSlider('contrast', $event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400" />
              </div>

              <!-- Saturation -->
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">🌈 Saturation</span>
                  <span class="text-amber-400 font-mono">{{ saturation }}</span>
                </div>
                <input type="range" min="0" max="3" step="0.1" [value]="saturation"
                  (input)="onSlider('saturation', $event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400" />
              </div>

              <!-- Gamma -->
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">🌓 Gamma</span>
                  <span class="text-amber-400 font-mono">{{ gamma }}</span>
                </div>
                <input type="range" min="0.1" max="5" step="0.1" [value]="gamma"
                  (input)="onSlider('gamma', $event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400" />
              </div>

              <!-- LUT Presets -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Quick LUT Presets</p>
                <div class="grid grid-cols-3 gap-2">
                  @for (preset of lutPresets; track preset.label) {
                    <button (click)="applyLut(preset)"
                      class="p-2 rounded-lg border border-white/10 bg-white/5 text-xs text-white/70 hover:bg-amber-400/10 hover:border-amber-400/30 hover:text-amber-400 transition-all">
                      {{ preset.icon }} {{ preset.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Reset -->
              <button (click)="resetGrading()" class="w-full py-2 text-xs text-white/40 hover:text-white/70 transition-colors">
                🔄 Reset to Default
              </button>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Grading...
                } @else { 🎨 Apply Color Grading }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Grading..." [size]="120" /></div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_graded" />
          }
        </div>
      </div>
    </div>
  ` })
export class ColorGradingComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectColorGradingState);
  isLoading$ = this.store.select(selectColorGradingIsLoading);
  canProcess$ = this.store.select(selectColorGradingCanProcess);

  brightness = 0; contrast = 1; saturation = 1; gamma = 1;

  lutPresets = [
    { label: 'Warm', icon: '🌅', brightness: 0.05, contrast: 1.1, saturation: 1.3, gamma: 0.9 },
    { label: 'Cool', icon: '🧊', brightness: -0.05, contrast: 1.1, saturation: 0.8, gamma: 1.1 },
    { label: 'Vintage', icon: '📷', brightness: 0.1, contrast: 0.9, saturation: 0.6, gamma: 1.2 },
    { label: 'Vivid', icon: '🎆', brightness: 0, contrast: 1.3, saturation: 1.8, gamma: 0.95 },
    { label: 'B&W', icon: '⚫', brightness: 0, contrast: 1.2, saturation: 0, gamma: 1 },
    { label: 'Cinematic', icon: '🎬', brightness: -0.1, contrast: 1.4, saturation: 0.9, gamma: 1.3 },
  ];

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(ColorGradingActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(ColorGradingActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(ColorGradingActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onSlider(key: string, e: Event) {
    const val = +(e.target as HTMLInputElement).value;
    Object.assign(this, { [key]: val });
    this.store.dispatch(ColorGradingActions.updateConfig({ config: { [key]: val } }));
  }

  applyLut(p: { brightness: number; contrast: number; saturation: number; gamma: number }) {
    this.brightness = p.brightness; this.contrast = p.contrast; this.saturation = p.saturation; this.gamma = p.gamma;
    this.store.dispatch(ColorGradingActions.updateConfig({ config: { brightness: p.brightness, contrast: p.contrast, saturation: p.saturation, gamma: p.gamma } }));
  }

  resetGrading() {
    this.brightness = 0; this.contrast = 1; this.saturation = 1; this.gamma = 1;
    this.store.dispatch(ColorGradingActions.updateConfig({ config: { brightness: 0, contrast: 1, saturation: 1, gamma: 1 } }));
  }

  onProcess() {
    this.store.dispatch(ColorGradingActions.startProcessing());
    this.state$.pipe(take(1)).subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./colorGrading.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, brightness: this.brightness, contrast: this.contrast, saturation: this.saturation, gamma: this.gamma }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(ColorGradingActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(ColorGradingActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(ColorGradingActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Grading failed' }));
        }
      });
    });
  }

  ngOnDestroy() { this.store.dispatch(ColorGradingActions.resetState()); }
}
