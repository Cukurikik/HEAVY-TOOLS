import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { TrimmerActions, selectTrimmerState, selectTrimmerIsLoading, selectTrimmerCanProcess } from './trimmer.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';
import { VideoToolLayoutComponent } from '../shared/components/video-tool-layout/video-tool-layout.component';

@Component({
  selector: 'app-trimmer',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent, VideoToolLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-video-tool-layout
      title="✂️ Video Trimmer"
      description="Precision frame-level trimming powered by FFmpeg WASM"
      gradientClass="from-cyan-400 to-cyan-200">
      <div leftPanel class="space-y-4">
        <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-cyan-400">{{ meta.duration | number:'1.0-1' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}×{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">FPS</p>
                  <p class="text-sm font-semibold text-white">{{ meta.fps | number:'1.0-1' }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <div class="flex-1">
                  <span class="text-xs text-white/40" style="display: block;">Start (s)</span>
                  <input type="number" min="0" [max]="meta.duration" step="0.1"
                    [value]="(state$ | async)?.startTime ?? 0"
                    (change)="onStartChange(+($any($event.target)).value)"
                    class="w-full px-2 py-1 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400">
                </div>
                <div class="flex-1">
                  <span class="text-xs text-white/40" style="display: block;">End (s)</span>
                  <input type="number" min="0" [max]="meta.duration" step="0.1"
                    [value]="(state$ | async)?.endTime ?? meta.duration"
                    (change)="onEndChange(+($any($event.target)).value)"
                    class="w-full px-2 py-1 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400">
                </div>
              </div>
              <button
                [disabled]="(canProcess$ | async) === false || (isLoading$ | async)"
                (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                } @else { ✂️ Trim Video }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ (state$ | async)?.errorMessage }}
            </div>
          }
      </div>
      <div rightPanel class="space-y-4">
        @if ((state$ | async)?.inputFile) {
            <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" />
          }
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Trimming video..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_trimmed" />
          }
      </div>
    </app-video-tool-layout>
  `
})
export class TrimmerComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectTrimmerState);
  isLoading$ = this.store.select(selectTrimmerIsLoading);
  canProcess$ = this.store.select(selectTrimmerCanProcess);

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(TrimmerActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(TrimmerActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(TrimmerActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onStartChange(value: number) { this.store.dispatch(TrimmerActions.updateConfig({ startTime: value })); }
  onEndChange(value: number) { this.store.dispatch(TrimmerActions.updateConfig({ endTime: value })); }

  onProcess() {
    this.store.dispatch(TrimmerActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile || !state.videoMeta) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./trimmer.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, startTime: state.startTime, endTime: state.endTime, outputFormat: state.outputFormat }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(TrimmerActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(TrimmerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(TrimmerActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Processing failed' }));
        }
      });
    }).unsubscribe();
  }

  ngOnDestroy() { this.store.dispatch(TrimmerActions.resetState()); }
}
