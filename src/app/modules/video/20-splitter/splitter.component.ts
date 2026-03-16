import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { SplitterActions, selectSplitterState, selectSplitterIsLoading, selectSplitterCanProcess } from './splitter.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';
import { VideoToolLayoutComponent } from '../shared/components/video-tool-layout/video-tool-layout.component';

@Component({
  selector: 'app-splitter',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent, VideoToolLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-video-tool-layout
      title="✂️ Video Splitter"
      description="Split video into equal segments or by custom duration"
      gradientClass="from-orange-400 to-red-400">
      <div leftPanel class="space-y-4">
        <app-file-drop-zone accept="video/*" label="Drop video to split" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-orange-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Segments</p>
                  <p class="text-sm font-semibold text-orange-400">{{ splitMode === 'count' ? segmentCount : (meta.duration / segmentDuration | number:'1.0-0') }}</p>
                </div>
              </div>

              <!-- Split Mode -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Split Mode</p>
                <div class="grid grid-cols-2 gap-2">
                  <button (click)="splitMode='count'"
                    [class]="splitMode==='count' ? 'p-3 rounded-xl border-2 border-orange-400 bg-orange-400/10 text-orange-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                    🔢 By Count
                  </button>
                  <button (click)="splitMode='duration'"
                    [class]="splitMode==='duration' ? 'p-3 rounded-xl border-2 border-orange-400 bg-orange-400/10 text-orange-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                    ⏱️ By Duration
                  </button>
                </div>
              </div>

              @if (splitMode === 'count') {
                <div class="space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-white/60">Number of Segments</span><span class="text-orange-400 font-mono">{{ segmentCount }}</span></div>
                  <input type="range" min="2" max="20" [value]="segmentCount" (input)="segmentCount=+getVal($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-400" />
                  <div class="flex justify-between text-xs text-white/30"><span>2</span><span>10</span><span>20</span></div>
                </div>
              }
              @if (splitMode === 'duration') {
                <div class="space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-white/60">Segment Duration (seconds)</span><span class="text-orange-400 font-mono">{{ segmentDuration }}s</span></div>
                  <input type="range" min="5" max="300" step="5" [value]="segmentDuration" (input)="segmentDuration=+getVal($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-400" />
                  <div class="flex justify-between text-xs text-white/30"><span>5s</span><span>2min</span><span>5min</span></div>
                </div>
              }

              <div class="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300/80">
                ℹ️ Uses stream copy (-c copy) for instant lossless splitting. Output is ZIP file with all segments.
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Splitting... } @else { ✂️ Split Video }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div> }
      </div>
      <div rightPanel class="space-y-4">
        @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Splitting..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_split" /> }
      </div>
    </app-video-tool-layout>
  ` })
export class SplitterComponent implements OnDestroy {
  private store = inject(Store); private ffmpeg = inject(FFmpegService); private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectSplitterState); isLoading$ = this.store.select(selectSplitterIsLoading); canProcess$ = this.store.select(selectSplitterCanProcess);
  splitMode: 'count' | 'duration' = 'count'; segmentCount = 3; segmentDuration = 30;
  getVal(e: Event): string { return (e.target as HTMLInputElement).value; }

  async onFileSelected(files: File[]) {
    const file = files[0]; this.store.dispatch(SplitterActions.loadFile({ file }));
    try { const meta = await this.ffmpeg.getMetadata(file); this.store.dispatch(SplitterActions.loadMetaSuccess({ meta })); }
    catch { this.store.dispatch(SplitterActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' })); }
  }

  onProcess() {
    this.store.dispatch(SplitterActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./splitter.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, splitMode: this.splitMode, segmentCount: this.segmentCount, segmentDuration: this.segmentDuration, duration: state.videoMeta?.duration ?? 0 }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(SplitterActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) { const b = msg.data as Blob; this.store.dispatch(SplitterActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1_048_576 })); }
        else if (msg.type === 'error') { this.store.dispatch(SplitterActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Splitting failed' })); }
      });
    }).unsubscribe();
  }
  ngOnDestroy() { this.store.dispatch(SplitterActions.resetState()); }
}
