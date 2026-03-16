import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { InterpolatorActions, selectInterpolatorState, selectInterpolatorIsLoading, selectInterpolatorCanProcess } from './interpolator.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';
import { VideoToolLayoutComponent } from '../shared/components/video-tool-layout/video-tool-layout.component';

@Component({
  selector: 'app-interpolator',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent, VideoToolLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-video-tool-layout
      title="🎞️ Frame Interpolator"
      description="Increase frame rate for smoother playback with AI-powered interpolation"
      gradientClass="from-violet-400 to-purple-400">
      <div leftPanel class="space-y-4">
        <app-file-drop-zone accept="video/*" label="Drop video to interpolate" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-violet-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Current FPS</p><p class="text-sm font-semibold text-white">{{ meta.fps }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Target FPS</p><p class="text-sm font-semibold text-violet-400">{{ targetFps }}</p></div>
              </div>

              <!-- Target FPS -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Target Frame Rate</p>
                <div class="grid grid-cols-4 gap-2">
                  @for (fps of fpsOptions; track fps) {
                    <button (click)="targetFps=fps"
                      [class]="targetFps===fps ? 'p-3 rounded-xl border-2 border-violet-400 bg-violet-400/10 text-violet-300 text-sm font-bold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ fps }} FPS
                    </button>
                  }
                </div>
              </div>

              <!-- Algorithm -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Interpolation Method</p>
                <div class="grid grid-cols-3 gap-2">
                  @for (algo of algos; track algo.value) {
                    <button (click)="algo_mode=algo.value"
                      [class]="algo_mode===algo.value ? 'p-3 rounded-xl border-2 border-violet-400 bg-violet-400/10 text-violet-300 text-sm font-semibold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ algo.icon }}<br/>{{ algo.label }}
                    </button>
                  }
                </div>
              </div>

              <div class="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300/80">
                ℹ️ Higher FPS = more frames generated = longer processing time. MCI gives best motion quality.
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Interpolating... } @else { 🎞️ Interpolate Frames }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div> }
      </div>
      <div rightPanel class="space-y-4">
        @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Interpolating..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_interpolated" /> }
      </div>
    </app-video-tool-layout>
  ` })
export class InterpolatorComponent implements OnDestroy {
  private store = inject(Store); private ffmpeg = inject(FFmpegService); private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectInterpolatorState); isLoading$ = this.store.select(selectInterpolatorIsLoading); canProcess$ = this.store.select(selectInterpolatorCanProcess);
  targetFps = 60; algo_mode = 'mci';
  fpsOptions = [30, 60, 120, 240];
  algos = [
    { value: 'blend', label: 'Blend', icon: '🌊' },
    { value: 'mci', label: 'MCI', icon: '🎯' },
    { value: 'dup', label: 'Duplicate', icon: '📋' },
  ];

  async onFileSelected(files: File[]) {
    const file = files[0]; this.store.dispatch(InterpolatorActions.loadFile({ file }));
    try { const meta = await this.ffmpeg.getMetadata(file); this.store.dispatch(InterpolatorActions.loadMetaSuccess({ meta })); }
    catch { this.store.dispatch(InterpolatorActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' })); }
  }

  onProcess() {
    this.store.dispatch(InterpolatorActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./interpolator.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, targetFps: this.targetFps, algorithm: this.algo_mode }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(InterpolatorActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) { const b = msg.data as Blob; this.store.dispatch(InterpolatorActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1_048_576 })); }
        else if (msg.type === 'error') { this.store.dispatch(InterpolatorActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Interpolation failed' })); }
      });
    }).unsubscribe();
  }
  ngOnDestroy() { this.store.dispatch(InterpolatorActions.resetState()); }
}
