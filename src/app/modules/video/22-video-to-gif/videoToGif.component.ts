import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { VideoToGifActions, selectVideoToGifState, selectVideoToGifIsLoading, selectVideoToGifCanProcess } from './videoToGif.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-video-to-gif',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-200">
          🎞️ Video to GIF
        </h1>
        <p class="text-white/50 text-sm">Convert video to high-quality GIF with 2-pass palette generation</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-green-400">{{ meta.duration | number:'1.0-1' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}×{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">FPS</p>
                  <p class="text-sm font-semibold text-white">{{ meta.fps | number:'1.0-0' }}</p>
                </div>
              </div>

              <!-- FPS Slider -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-white/40 uppercase tracking-wider">GIF Frame Rate</span>
                  <span class="text-sm font-bold text-green-400">{{ fps }} fps</span>
                </div>
                <input type="range" min="5" max="30" step="1" [value]="fps"
                  (input)="onFpsChange(+($any($event.target)).value)"
                  class="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-green-800 to-green-400" />
                <div class="flex justify-between text-[10px] text-white/30">
                  <span>5 fps (small)</span>
                  <span>15</span>
                  <span>30 fps (smooth)</span>
                </div>
              </div>

              <!-- Scale Width -->
              <div class="space-y-2">
                <span class="text-xs text-white/40 uppercase tracking-wider">Output Width</span>
                <div class="grid grid-cols-4 gap-2">
                  @for (s of scalePresets; track s) {
                    <button (click)="onScaleChange(s)"
                      class="py-2 rounded-lg text-xs font-bold transition-all duration-200"
                      [class.bg-green-500]="scale === s"
                      [class.text-black]="scale === s"
                      [class.bg-white/5]="scale !== s"
                      [class.text-white/50]="scale !== s">
                      {{ s }}px
                    </button>
                  }
                </div>
              </div>

              <!-- Estimated Size -->
              <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span class="text-xs text-white/40">Estimated GIF size</span>
                <span class="text-sm font-bold text-green-400">~{{ estimateGifSize(meta.duration) | number:'1.0-1' }} MB</span>
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-lime-500 text-black hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Converting to GIF...
                } @else { 🎞️ Create GIF }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) {
            <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" />
          }
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Creating GIF..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              [availableFormats]="['gif']" defaultFilename="omni_gif" />
          }
        </div>
      </div>
    </div>
  ` })
export class VideoToGifComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectVideoToGifState);
  isLoading$ = this.store.select(selectVideoToGifIsLoading);
  canProcess$ = this.store.select(selectVideoToGifCanProcess);

  fps = 15;
  scale = 640;
  scalePresets = [320, 640, 960, 1280];

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(VideoToGifActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(VideoToGifActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(VideoToGifActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onFpsChange(value: number) { this.fps = value; }

  onScaleChange(value: number) { this.scale = value; }

  estimateGifSize(duration: number) {
    // Rough estimation: higher fps and scale increase file size
    return (duration * this.fps * (this.scale / 100) * 0.15);
  }

  onProcess() {
    this.store.dispatch(VideoToGifActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./videoToGif.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, fps: this.fps, scale: this.scale }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(VideoToGifActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(VideoToGifActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(VideoToGifActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'GIF conversion failed' }));
        }
      });
    }).unsubscribe();
  }

  ngOnDestroy() { this.store.dispatch(VideoToGifActions.resetState()); }
}