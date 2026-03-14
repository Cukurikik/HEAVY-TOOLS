import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { CompressorActions, selectCompressorState, selectCompressorIsLoading, selectCompressorCanProcess } from './compressor.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-compressor',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
          📦 Video Compressor
        </h1>
        <p class="text-white/50 text-sm">Reduce file size with CRF quality control — powered by FFmpeg WASM</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <!-- Metadata -->
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-orange-400">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}×{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Original Size</p>
                  <p class="text-sm font-semibold text-white">{{ (state$ | async)?.originalSizeMB | number:'1.0-1' }} MB</p>
                </div>
              </div>

              <!-- CRF Slider -->
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-white/40 uppercase tracking-wider" style="display: block;">Quality (CRF)</span>
                  <span class="text-sm font-bold" [class.text-emerald-400]="crfValue < 20"
                    [class.text-cyan-400]="crfValue >= 20 && crfValue < 30"
                    [class.text-orange-400]="crfValue >= 30 && crfValue < 40"
                    [class.text-red-400]="crfValue >= 40">{{ crfValue }}</span>
                </div>
                <input type="range" min="0" max="51" step="1" [value]="crfValue"
                  (input)="onCrfChange(+($any($event.target)).value)"
                  class="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-emerald-500 via-cyan-500 via-orange-400 to-red-500" />
                <div class="flex justify-between text-[10px] text-white/30">
                  <span>🔬 Lossless</span>
                  <span>⚖️ Balanced</span>
                  <span>📦 Tiny File</span>
                </div>
              </div>

              <!-- Quick CRF Presets -->
              <div class="grid grid-cols-4 gap-2">
                @for (p of crfPresets; track p.crf) {
                  <button (click)="onCrfChange(p.crf)"
                    class="py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                    [class.bg-orange-500]="crfValue === p.crf"
                    [class.text-black]="crfValue === p.crf"
                    [class.bg-white/5]="crfValue !== p.crf"
                    [class.text-white/50]="crfValue !== p.crf">{{ p.label }}</button>
                }
              </div>

              <!-- Estimated Output -->
              @if ((state$ | async)?.originalSizeMB; as origMB) {
                <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span class="text-xs text-white/40">Estimated Output</span>
                  <span class="text-sm font-bold text-orange-400">~{{ estimateSize(origMB) | number:'1.0-1' }} MB</span>
                </div>
              }

              <!-- Process Button -->
              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Compressing...
                } @else { 📦 Compress Video }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Compressing..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <div class="space-y-3">
              @if ((state$ | async)?.outputSizeMB; as outMB) {
                <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-400 text-center">
                  ✅ Compressed! {{ (state$ | async)?.originalSizeMB | number:'1.0-1' }} MB → {{ outMB | number:'1.0-1' }} MB
                </div>
              }
              <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null"
                [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
                defaultFilename="omni_compressed" />
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class CompressorComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectCompressorState);
  isLoading$ = this.store.select(selectCompressorIsLoading);
  canProcess$ = this.store.select(selectCompressorCanProcess);

  crfValue = 23;

  crfPresets = [
    { crf: 18, label: '🔬 High' },
    { crf: 23, label: '⚖️ Medium' },
    { crf: 28, label: '📦 Small' },
    { crf: 35, label: '🗜️ Tiny' },
  ];

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(CompressorActions.loadFile({ file }));
    this.store.dispatch(CompressorActions.updateConfig({ config: { originalSizeMB: file.size / 1_048_576 } }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(CompressorActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(CompressorActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onCrfChange(value: number) {
    this.crfValue = value;
    this.store.dispatch(CompressorActions.updateConfig({ config: { crfValue: value } }));
  }

  estimateSize(originalMB: number): number {
    // Rough estimation: CRF 23 ≈ 50% size, each +6 ≈ halves again
    const ratio = Math.pow(0.5, (this.crfValue - 18) / 6);
    return originalMB * Math.max(ratio, 0.02);
  }

  onProcess() {
    this.store.dispatch(CompressorActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./compressor.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, crfValue: state.crfValue, outputFormat: 'mp4' }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(CompressorActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(CompressorActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(CompressorActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Compression failed' }));
        }
      });
    }).unsubscribe();
  }

  ngOnDestroy() { this.store.dispatch(CompressorActions.resetState()); }
}
