import { take } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { ThumbnailGeneratorActions, selectThumbnailGeneratorState, selectThumbnailGeneratorIsLoading, selectThumbnailGeneratorCanProcess } from './thumbnailGenerator.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-thumbnail-generator',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-200">
          🖼️ Thumbnail Generator
        </h1>
        <p class="text-white/50 text-sm">Generate single thumbnails or grid contact sheets from video</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-fuchsia-400">{{ meta.duration | number:'1.0-0' }}s</p>
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

              <!-- Mode Toggle -->
              <div class="space-y-2">
                <span class="text-xs text-white/40 uppercase tracking-wider" style="display: block;">Mode</span>
                <div class="grid grid-cols-2 gap-2">
                  <button (click)="mode = 'single'"
                    class="py-3 rounded-xl text-center transition-all duration-200 border"
                    [class.bg-fuchsia-500]="mode === 'single'"
                    [class.text-black]="mode === 'single'"
                    [class.border-fuchsia-500]="mode === 'single'"
                    [class.bg-white/5]="mode !== 'single'"
                    [class.text-white/60]="mode !== 'single'"
                    [class.border-white/10]="mode !== 'single'">
                    <span class="text-xl block">📷</span>
                    <span class="text-xs block mt-1">Single Frame</span>
                  </button>
                  <button (click)="mode = 'grid'"
                    class="py-3 rounded-xl text-center transition-all duration-200 border"
                    [class.bg-fuchsia-500]="mode === 'grid'"
                    [class.text-black]="mode === 'grid'"
                    [class.border-fuchsia-500]="mode === 'grid'"
                    [class.bg-white/5]="mode !== 'grid'"
                    [class.text-white/60]="mode !== 'grid'"
                    [class.border-white/10]="mode !== 'grid'">
                    <span class="text-xl block">🖼️</span>
                    <span class="text-xs block mt-1">Grid (4×4)</span>
                  </button>
                </div>
              </div>

              <!-- Timestamp / Interval -->
              @if (mode === 'single') {
                <div class="space-y-2">
                  <span class="text-xs text-white/40 uppercase tracking-wider" style="display: block;">Timestamp (seconds)</span>
                  <input type="range" min="0" [max]="meta.duration" step="0.5" [value]="interval"
                    (input)="interval = +($any($event.target)).value"
                    class="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-fuchsia-700 to-fuchsia-400" />
                  <div class="text-center text-sm font-bold text-fuchsia-400">{{ interval | number:'1.0-1' }}s</div>
                </div>
              } @else {
                <div class="space-y-2">
                  <span class="text-xs text-white/40 uppercase tracking-wider" style="display: block;">Interval between frames (seconds)</span>
                  <input type="range" min="1" [max]="meta.duration / 2" step="1" [value]="interval"
                    (input)="interval = +($any($event.target)).value"
                    class="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-fuchsia-700 to-fuchsia-400" />
                  <div class="text-center text-sm font-bold text-fuchsia-400">Every {{ interval | number:'1.0-0' }}s</div>
                </div>
              }

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:shadow-[0_0_30px_rgba(217,70,239,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                } @else { 🖼️ Generate Thumbnail }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Generating..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              [formats]="['png']" defaultFilename="omni_thumb" />
          }
        </div>
      </div>
    </div>
  ` })
export class ThumbnailGeneratorComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectThumbnailGeneratorState);
  isLoading$ = this.store.select(selectThumbnailGeneratorIsLoading);
  canProcess$ = this.store.select(selectThumbnailGeneratorCanProcess);

  mode: 'single' | 'grid' = 'single';
  interval = 5;

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(ThumbnailGeneratorActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(ThumbnailGeneratorActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(ThumbnailGeneratorActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onProcess() {
    this.store.dispatch(ThumbnailGeneratorActions.startProcessing());
    this.state$.pipe(take(1)).subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./thumbnailGenerator.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, mode: this.mode, interval: this.interval }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(ThumbnailGeneratorActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(ThumbnailGeneratorActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(ThumbnailGeneratorActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Thumbnail generation failed' }));
        }
      });
    });
  }

  ngOnDestroy() { this.store.dispatch(ThumbnailGeneratorActions.resetState()); }
}
