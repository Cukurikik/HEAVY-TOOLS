import { take } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { CompareActions, selectCompareState, selectCompareIsLoading, selectCompareCanProcess } from './compare.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-400">🔍 Video Compare</h1>
        <p class="text-white/50 text-sm">Compare two videos side-by-side or stacked vertically</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop FIRST video (left/top)" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-lime-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>
              <!-- Second Video -->
              <span class="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-lime-400/50 bg-white/5 cursor-pointer transition-all" style="display: block;">
                <span class="text-2xl">🎬</span>
                <div><p class="text-sm text-white/80">{{ secondVideoName || 'Select SECOND video (right/bottom)' }}</p></div>
                <input type="file" accept="video/*" (change)="onSecondVideo($event)" class="hidden" />
              </span>
              <!-- Layout -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Compare Layout</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (l of layouts; track l.value) {
                    <button (click)="layout=l.value"
                      [class]="layout===l.value ? 'p-3 rounded-xl border-2 border-lime-400 bg-lime-400/10 text-lime-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ l.icon }} {{ l.label }}
                    </button>
                  }
                </div>
              </div>
              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async) || !secondVideo" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-lime-500 to-green-500 text-black hover:shadow-[0_0_30px_rgba(132,204,22,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Comparing... } @else { 🔍 Generate Comparison }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Comparing..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_compare" /> }
        </div>
      </div>
    </div>
  ` })
export class CompareComponent implements OnDestroy {
  private store = inject(Store); private ffmpeg = inject(FFmpegService); private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectCompareState); isLoading$ = this.store.select(selectCompareIsLoading); canProcess$ = this.store.select(selectCompareCanProcess);
  secondVideo: File | null = null; secondVideoName = ''; layout = 'hstack';
  layouts = [
    { value: 'hstack', label: 'Side by Side', icon: '↔️' },
    { value: 'vstack', label: 'Top & Bottom', icon: '↕️' },
  ];
  async onFileSelected(files: File[]) {
    const file = files[0]; this.store.dispatch(CompareActions.loadFile({ file }));
    try { const meta = await this.ffmpeg.getMetadata(file); this.store.dispatch(CompareActions.loadMetaSuccess({ meta })); }
    catch { this.store.dispatch(CompareActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read.' })); }
  }
  onSecondVideo(e: Event) { const f = (e.target as HTMLInputElement).files?.[0]; if (f) { this.secondVideo = f; this.secondVideoName = f.name; } }
  onProcess() {
    this.store.dispatch(CompareActions.startProcessing());
    this.state$.pipe(take(1)).subscribe(state => {
      if (!state.inputFile || !this.secondVideo) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./compare.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, secondFile: this.secondVideo, layout: this.layout }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(CompareActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) { const b = msg.data as Blob; this.store.dispatch(CompareActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1_048_576 })); }
        else if (msg.type === 'error') { this.store.dispatch(CompareActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Compare failed' })); }
      });
    });
  }
  ngOnDestroy() { this.store.dispatch(CompareActions.resetState()); }
}
