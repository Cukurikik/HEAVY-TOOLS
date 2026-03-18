import { take } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#040409] text-white p-6 md:p-10 space-y-8 relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <header class="space-y-2 relative z-10">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-400/20 to-purple-600/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(192,38,211,0.2)]">
            <span class="text-2xl">🤖</span>
          </div>
          <div>
            <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 tracking-tight">
              AI Video Upscaler
            </h1>
            <p class="text-fuchsia-200/50 text-xs uppercase tracking-widest font-medium mt-1">ONNX Runtime Accelerated Enhancement</p>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div class="space-y-6">
          <app-file-drop-zone accept="video/*" label="Drop low-res video to enhance" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6 animate-[fadeSlideUp_0.4s_ease-out]">
              
              <div class="flex justify-between items-center p-4 rounded-2xl bg-black/40 border border-white/5">
                 <div class="text-center">
                    <p class="text-[10px] text-fuchsia-400/50 uppercase tracking-widest mb-1">Current</p>
                    <p class="text-lg font-bold text-white">{{ meta.width }}×{{ meta.height }}</p>
                 </div>
                 <div class="text-2xl font-black text-fuchsia-400 px-4">→</div>
                 <div class="text-center">
                    <p class="text-[10px] text-fuchsia-400/50 uppercase tracking-widest mb-1">Output ({{ scaleFactor }}x)</p>
                    <p class="text-lg font-bold text-cyan-400">{{ meta.width * scaleFactor }}×{{ meta.height * scaleFactor }}</p>
                 </div>
              </div>

              <!-- Scale Factor -->
              <div class="space-y-3">
                <p class="text-xs font-bold uppercase tracking-widest text-white/50">Upscale Multiplier</p>
                <div class="grid grid-cols-2 gap-3">
                  @for (s of scaleFactors; track s) {
                    <button (click)="scaleFactor=s"
                      class="p-4 rounded-2xl border transition-all duration-300 font-bold text-lg"
                      [class.bg-fuchsia-500]="scaleFactor === s"
                      [class.border-fuchsia-400]="scaleFactor === s"
                      [class.text-white]="scaleFactor === s"
                      [class.shadow-[0_0_20px_rgba(217,70,239,0.3)]]="scaleFactor === s"
                      [class.bg-white/5]="scaleFactor !== s"
                      [class.border-white/5]="scaleFactor !== s"
                      [class.text-white/40]="scaleFactor !== s">
                      {{ s }}x
                    </button>
                  }
                </div>
              </div>

              <!-- Model -->
              <div class="space-y-3">
                <p class="text-xs font-bold uppercase tracking-widest text-white/50">Neural Network Engine</p>
                <div class="grid grid-cols-2 gap-3">
                  @for (m of models; track m.value) {
                    <button (click)="model=m.value"
                      class="p-4 flex text-left flex-col rounded-2xl border transition-all duration-300"
                      [class.bg-purple-500/20]="model === m.value"
                      [class.border-purple-400/50]="model === m.value"
                      [class.bg-white/5]="model !== m.value"
                      [class.border-white/5]="model !== m.value">
                      <div class="font-bold text-sm" [class.text-white]="model === m.value" [class.text-white/60]="model !== m.value">{{ m.icon }} {{ m.label }}</div>
                      <div class="text-[10px] uppercase font-mono mt-1" [class.text-purple-300]="model === m.value" [class.text-white/30]="model !== m.value">{{ m.desc }}</div>
                    </button>
                  }
                </div>
              </div>

              <!-- Denoise -->
              <div class="space-y-3 bg-black/20 p-5 rounded-2xl border border-white/5">
                <div class="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                  <span class="text-white/50">Temporal Denoise</span>
                  <span class="text-fuchsia-400 font-mono bg-fuchsia-500/10 px-2 py-1 rounded-md">{{ denoiseLevel }}</span>
                </div>
                <input type="range" min="0" max="50" [value]="denoiseLevel" (input)="denoiseLevel=+gv($event)" class="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-white/10 to-fuchsia-500 outline-none" />
                <div class="flex justify-between text-[10px] uppercase tracking-widest text-white/30"><span>None</span><span>Medium</span><span>Aggressive</span></div>
              </div>

              <div class="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200/80 font-mono leading-relaxed flex gap-3">
                <span class="text-xl">⚠️</span> 
                <span>AI upscaling is extremely GPU-intensive. Processing may take several minutes depending on video parameters. WebGPU hardware acceleration is active.</span>
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-3 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-30 disabled:hover:shadow-none">
                @if (isLoading$ | async) { 
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"></div> 
                  Initializing Neural Cores... 
                } @else { 
                  🤖 Execute AI Upscale 
                }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { 
            <div class="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-sm font-bold text-red-400 animate-pulse flex items-center gap-3">
              <span>⚠️</span> {{ (state$ | async)?.errorMessage }}
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
            <div class="flex flex-col items-center gap-6 justify-center p-12 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Enhancing pixels..." [size]="140" />
              <p class="text-xs text-fuchsia-300/60 uppercase tracking-widest font-mono text-center">Tessellating tensor graphs in WebGPU</p>
            </div> 
          }
          @if ((state$ | async)?.status === 'done') { 
            <div class="animate-[fadeSlideUp_0.4s_ease-out]">
              <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_upscaled" /> 
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class UpscalerComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectUpscalerState);
  isLoading$ = this.store.select(selectUpscalerIsLoading);
  canProcess$ = this.store.select(selectUpscalerCanProcess);

  scaleFactor = 2;
  model = 'esrgan';
  denoiseLevel = 10;
  
  scaleFactors = [2, 4];
  models = [
    { value: 'esrgan', label: 'ESRGAN', icon: '⚡', desc: 'Fast, good quality' },
    { value: 'swinir', label: 'SwinIR', icon: '💎', desc: 'Slower, best quality' },
  ];

  gv(e: Event): string { return (e.target as HTMLInputElement).value; }

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(UpscalerActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(UpscalerActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(UpscalerActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onProcess() {
    this.store.dispatch(UpscalerActions.startProcessing());
    this.state$.pipe(take(1)).subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./upscaler.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, scale: this.scaleFactor, model: this.model, denoise: this.denoiseLevel }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(UpscalerActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(UpscalerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(UpscalerActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Upscaling failed' }));
        }
      });
    });
  }

  ngOnDestroy() { this.store.dispatch(UpscalerActions.resetState()); }
}
