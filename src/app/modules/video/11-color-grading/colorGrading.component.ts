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
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
          🎨 Color Grading
        </h1>
        <p class="text-white/50 text-sm">Adjust brightness, contrast, saturation, hue, gamma and apply LUT files</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone
            accept="video/*"
            label="Drop video file here or click to browse"
            (filesSelected)="onFileSelected($event)"
          />

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
              <button
                [disabled]="!(canProcess$ | async) || (isLoading$ | async)"
                (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                } @else { 🎨 Process }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Processing..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel
              [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              defaultFilename="omni_color_grading"
            />
          }
        </div>
      </div>
    </div>
  `,
})
export class ColorGradingComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectColorGradingState);
  isLoading$ = this.store.select(selectColorGradingIsLoading);
  canProcess$ = this.store.select(selectColorGradingCanProcess);

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(ColorGradingActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(ColorGradingActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(ColorGradingActions.loadMetaFailure({
        errorCode: 'FILE_CORRUPTED',
        message: 'Could not read video metadata.'
      }));
    }
  }

  onProcess() {
    this.store.dispatch(ColorGradingActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./colorGrading.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile }
      ).subscribe(msg => {
        if (msg.type === 'progress') {
          this.store.dispatch(ColorGradingActions.updateProgress({ progress: msg.value ?? 0 }));
        } else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(ColorGradingActions.processingSuccess({
            outputBlob: blob,
            outputSizeMB: blob.size / 1_048_576
          }));
        } else if (msg.type === 'error') {
          this.store.dispatch(ColorGradingActions.processingFailure({
            errorCode: msg.errorCode ?? 'UNKNOWN_ERROR',
            message: msg.message ?? 'Processing failed'
          }));
        }
      });
    }).unsubscribe();
  }

  ngOnDestroy() {
    this.store.dispatch(ColorGradingActions.resetState());
  }
}
