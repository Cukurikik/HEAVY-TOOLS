import { take } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { TrimmerActions, selectTrimmerState, selectTrimmerIsLoading, selectTrimmerCanProcess } from './trimmer.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-trimmer',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent, MatIconModule],
  template: `
    <div class="min-h-screen bg-[#040409] text-white p-6 md:p-10 space-y-8 relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute top-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <header class="space-y-2 relative z-10">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <span class="text-2xl">✂️</span>
          </div>
          <div>
            <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 tracking-tight">
              Video Trimmer
            </h1>
            <p class="text-cyan-200/50 text-xs uppercase tracking-widest font-medium mt-1">Precision Frame Engineering</p>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div class="space-y-6">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6 animate-[fadeSlideUp_0.4s_ease-out]">
              
              <div class="grid grid-cols-3 gap-4 text-center">
                <div class="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Duration</p>
                  <p class="text-lg font-bold text-cyan-400">{{ meta.duration | number:'1.0-1' }}s</p>
                </div>
                <div class="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Resolution</p>
                  <p class="text-lg font-bold text-white">{{ meta.width }}×{{ meta.height }}</p>
                </div>
                <div class="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">FPS</p>
                  <p class="text-lg font-bold text-white">{{ meta.fps | number:'1.0-1' }}</p>
                </div>
              </div>

              <div class="space-y-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                <div class="flex gap-4">
                  <div class="flex-1 space-y-2">
                    <label class="text-xs font-bold uppercase tracking-widest text-white/50">Start Time (s)</label>
                    <input type="number" min="0" [max]="meta.duration" step="0.1"
                      [value]="(state$ | async)?.startTime ?? 0"
                      (change)="onStartChange(+($any($event.target)).value)"
                      class="w-full px-4 py-3 text-sm bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono transition-colors">
                  </div>
                  <div class="flex-1 space-y-2">
                    <label class="text-xs font-bold uppercase tracking-widest text-white/50">End Time (s)</label>
                    <input type="number" min="0" [max]="meta.duration" step="0.1"
                      [value]="(state$ | async)?.endTime ?? meta.duration"
                      (change)="onEndChange(+($any($event.target)).value)"
                      class="w-full px-4 py-3 text-sm bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono transition-colors">
                  </div>
                </div>
              </div>

              <button
                [disabled]="(canProcess$ | async) === false || (isLoading$ | async)"
                (click)="onProcess()"
                class="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-30 disabled:hover:shadow-none">
                @if (isLoading$ | async) {
                  <div class="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Processing Core...
                } @else { 
                  ✂️ Execute Trim
                }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-sm text-red-400 animate-pulse flex items-center gap-3">
              ⚠️ {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-6">
          @if ((state$ | async)?.inputFile) {
            <div class="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" />
            </div>
          }
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-12 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Slicing frames..." [size]="140" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <div class="animate-[fadeSlideUp_0.4s_ease-out]">
              <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_trimmed" />
            </div>
          }
        </div>
      </div>
    </div>
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
    this.state$.pipe(take(1)).subscribe(state => {
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
    });
  }

  ngOnDestroy() { this.store.dispatch(TrimmerActions.resetState()); }
}
