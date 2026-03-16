import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { BlurActions, selectBlurState, selectBlurIsLoading, selectBlurCanProcess } from './blur.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-blur',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-300">🌫️ Video Blur</h1>
        <p class="text-white/50 text-sm">Apply gaussian, box, or smart blur to the entire video or specific regions</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video to blur" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-indigo-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>
              <!-- Blur Type -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Blur Algorithm</p>
                <div class="grid grid-cols-3 gap-2">
                  @for (bt of blurTypes; track bt.value) {
                    <button (click)="blurType=bt.value"
                      [class]="blurType===bt.value ? 'p-3 rounded-xl border-2 border-indigo-400 bg-indigo-400/10 text-indigo-300 text-sm font-semibold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ bt.icon }} {{ bt.label }}
                    </button>
                  }
                </div>
              </div>
              <!-- Strength -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm"><span class="text-white/60">Blur Strength</span><span class="text-indigo-400 font-mono">{{ blurStrength }}</span></div>
                <input type="range" min="1" max="30" [value]="blurStrength" (input)="blurStrength=+gv($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-400" />
                <div class="flex justify-between text-xs text-white/30"><span>Subtle</span><span>Medium</span><span>Heavy</span></div>
              </div>
              <!-- Region -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Blur Region</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (r of regions; track r.value) {
                    <button (click)="region=r.value"
                      [class]="region===r.value ? 'p-3 rounded-xl border-2 border-indigo-400 bg-indigo-400/10 text-indigo-300 text-sm font-semibold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ r.icon }} {{ r.label }}
                    </button>
                  }
                </div>
              </div>
              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Blurring... } @else { 🌫️ Apply Blur }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Blurring..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_blurred" /> }
        </div>
      </div>
    </div>
  ` })
export class BlurComponent implements OnDestroy {
  private store = inject(Store); private ffmpeg = inject(FFmpegService); private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectBlurState); isLoading$ = this.store.select(selectBlurIsLoading); canProcess$ = this.store.select(selectBlurCanProcess);
  blurType = 'boxblur'; blurStrength = 10; region = 'full';
  blurTypes = [
    { value: 'boxblur', label: 'Box', icon: '⬜' },
    { value: 'gaussblur', label: 'Gaussian', icon: '🔵' },
    { value: 'smartblur', label: 'Smart', icon: '🧠' },
  ];
  regions = [
    { value: 'full', label: 'Full Frame', icon: '🖼️' },
    { value: 'center', label: 'Center Region', icon: '⏺️' },
  ];
  gv(e: Event): string { return (e.target as HTMLInputElement).value; }
  async onFileSelected(files: File[]) {
    const file = files[0]; this.store.dispatch(BlurActions.loadFile({ file }));
    try { const meta = await this.ffmpeg.getMetadata(file); this.store.dispatch(BlurActions.loadMetaSuccess({ meta })); }
    catch { this.store.dispatch(BlurActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read.' })); }
  }
  onProcess() {
    this.store.dispatch(BlurActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./blur.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, blurType: this.blurType, strength: this.blurStrength, region: this.region }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(BlurActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) { const b = msg.data as Blob; this.store.dispatch(BlurActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1_048_576 })); }
        else if (msg.type === 'error') { this.store.dispatch(BlurActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Blur failed' })); }
      });
    }).unsubscribe();
  }
  ngOnDestroy() { this.store.dispatch(BlurActions.resetState()); }
}
