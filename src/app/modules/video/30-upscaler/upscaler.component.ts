import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { UpscalerActions, selectUpscalerState, selectUpscalerIsLoading, selectUpscalerCanProcess } from './upscaler.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-upscaler',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400">🤖 AI Video Upscaler</h1>
        <p class="text-white/50 text-sm">Upscale video resolution using ESRGAN/SwinIR AI models via ONNX Runtime</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video to upscale" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Current</p><p class="text-sm font-semibold text-white">{{ meta.width }}×{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">→ Scale</p><p class="text-sm font-semibold text-fuchsia-400">{{ scaleFactor }}x</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Output</p><p class="text-sm font-semibold text-cyan-400">{{ meta.width * scaleFactor }}×{{ meta.height * scaleFactor }}</p></div>
              </div>

              <!-- Scale Factor -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Upscale Factor</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (s of scaleFactors; track s) {
                    <button (click)="scaleFactor=s"
                      [class]="scaleFactor===s ? 'p-3 rounded-xl border-2 border-fuchsia-400 bg-fuchsia-400/10 text-fuchsia-300 text-lg font-bold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-lg hover:bg-white/10'">
                      {{ s }}x
                    </button>
                  }
                </div>
              </div>

              <!-- Model -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">AI Model</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (m of models; track m.value) {
                    <button (click)="model=m.value"
                      [class]="model===m.value ? 'p-3 rounded-xl border-2 border-fuchsia-400 bg-fuchsia-400/10 text-fuchsia-300 text-sm font-semibold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ m.icon }} {{ m.label }}
                      <p class="text-xs mt-1 opacity-60">{{ m.desc }}</p>
                    </button>
                  }
                </div>
              </div>

              <!-- Denoise -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm"><span class="text-white/60">Denoise Level</span><span class="text-fuchsia-400 font-mono">{{ denoiseLevel }}</span></div>
                <input type="range" min="0" max="50" [value]="denoiseLevel" (input)="denoiseLevel=+gv($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-400" />
                <div class="flex justify-between text-xs text-white/30"><span>None</span><span>Medium</span><span>Strong</span></div>
              </div>

              <div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300/80">
                ⚠️ AI upscaling is GPU-intensive. Processing may take several minutes depending on video length and resolution. WebGPU acceleration is used when available.
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></div> Upscaling... } @else { 🤖 Upscale with AI }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="AI Upscaling..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_upscaled" /> }
        </div>
      </div>
    </div>
  ` })
export class UpscalerComponent implements OnDestroy {
  private store = inject(Store); private ffmpeg = inject(FFmpegService); private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectUpscalerState); isLoading$ = this.store.select(selectUpscalerIsLoading); canProcess$ = this.store.select(selectUpscalerCanProcess);
  scaleFactor = 2; model = 'esrgan'; denoiseLevel = 10;
  scaleFactors = [2, 4];
  models = [
    { value: 'esrgan', label: 'ESRGAN', icon: '⚡', desc: 'Fast, good quality' },
    { value: 'swinir', label: 'SwinIR', icon: '💎', desc: 'Slower, best quality' },
  ];
  gv(e: Event): string { return (e.target as HTMLInputElement).value; }

  async onFileSelected(files: File[]) {
    const file = files[0]; this.store.dispatch(UpscalerActions.loadFile({ file }));
    try { const meta = await this.ffmpeg.getMetadata(file); this.store.dispatch(UpscalerActions.loadMetaSuccess({ meta })); }
    catch { this.store.dispatch(UpscalerActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' })); }
  }

  onProcess() {
    this.store.dispatch(UpscalerActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./upscaler.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, scale: this.scaleFactor, model: this.model, denoise: this.denoiseLevel }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(UpscalerActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) { const b = msg.data as Blob; this.store.dispatch(UpscalerActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1_048_576 })); }
        else if (msg.type === 'error') { this.store.dispatch(UpscalerActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Upscaling failed' })); }
      });
    });
  }
  ngOnDestroy() { this.store.dispatch(UpscalerActions.resetState()); }
}
