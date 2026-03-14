import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { DenoiserActions, selectDenoiserState, selectDenoiserIsLoading, selectDenoiserCanProcess } from './denoiser.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-denoiser',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">🔇 Video Denoiser</h1>
        <p class="text-white/50 text-sm">Remove grain and noise from video using hqdn3d / nlmeans filters</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop noisy video here" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-blue-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>

              <!-- Denoise Algorithm -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Algorithm</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (algo of algorithms; track algo.value) {
                    <button (click)="algorithm=algo.value"
                      [class]="algorithm===algo.value ? 'p-3 rounded-xl border-2 border-blue-400 bg-blue-400/10 text-blue-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ algo.icon }} {{ algo.label }}
                      <p class="text-xs mt-1 opacity-60">{{ algo.desc }}</p>
                    </button>
                  }
                </div>
              </div>

              <!-- Strength Presets -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Denoise Strength</p>
                <div class="grid grid-cols-3 gap-2">
                  @for (s of strengths; track s.value) {
                    <button (click)="strength=s.value"
                      [class]="strength===s.value ? 'p-3 rounded-xl border-2 border-blue-400 bg-blue-400/10 text-blue-300 text-sm font-bold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ s.icon }} {{ s.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Temporal Toggle -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p class="text-sm text-white/80">Temporal Denoising</p>
                  <p class="text-xs text-white/40">Reduces flicker between frames</p>
                </div>
                <button (click)="temporal=!temporal"
                  [class]="temporal ? 'w-12 h-6 rounded-full bg-blue-500 relative transition-colors' : 'w-12 h-6 rounded-full bg-white/20 relative transition-colors'">
                  <span [class]="temporal ? 'absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all' : 'absolute left-1 top-1 w-4 h-4 bg-white/60 rounded-full transition-all'"></span>
                </button>
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Denoising... } @else { 🔇 Denoise Video }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Denoising..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_denoised" /> }
        </div>
      </div>
    </div>
  `,
})
export class DenoiserComponent implements OnDestroy {
  private store = inject(Store); private ffmpeg = inject(FFmpegService); private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectDenoiserState); isLoading$ = this.store.select(selectDenoiserIsLoading); canProcess$ = this.store.select(selectDenoiserCanProcess);
  algorithm: 'hqdn3d' | 'nlmeans' = 'hqdn3d'; strength: 'light' | 'medium' | 'heavy' = 'medium'; temporal = true;
  algorithms = [
    { value: 'hqdn3d' as const, label: 'HQ Denoise 3D', icon: '⚡', desc: 'Fast, good quality' },
    { value: 'nlmeans' as const, label: 'NL-Means', icon: '💎', desc: 'Slow, best quality' },
  ];
  strengths = [
    { value: 'light' as const, label: 'Light', icon: '🌤️' },
    { value: 'medium' as const, label: 'Medium', icon: '☁️' },
    { value: 'heavy' as const, label: 'Heavy', icon: '🌧️' },
  ];

  async onFileSelected(files: File[]) {
    const file = files[0]; this.store.dispatch(DenoiserActions.loadFile({ file }));
    try { const meta = await this.ffmpeg.getMetadata(file); this.store.dispatch(DenoiserActions.loadMetaSuccess({ meta })); }
    catch { this.store.dispatch(DenoiserActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' })); }
  }

  onProcess() {
    this.store.dispatch(DenoiserActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./denoiser.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, algorithm: this.algorithm, strength: this.strength, temporal: this.temporal }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(DenoiserActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) { const b = msg.data as Blob; this.store.dispatch(DenoiserActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1_048_576 })); }
        else if (msg.type === 'error') { this.store.dispatch(DenoiserActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Denoising failed' })); }
      });
    }).unsubscribe();
  }
  ngOnDestroy() { this.store.dispatch(DenoiserActions.resetState()); }
}
