import { take } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#040409] text-white p-6 md:p-10 space-y-8 relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <header class="space-y-2 relative z-10">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400/20 to-amber-600/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <span class="text-2xl">📦</span>
          </div>
          <div>
            <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 tracking-tight">
              Video Compressor
            </h1>
            <p class="text-orange-200/50 text-xs uppercase tracking-widest font-medium mt-1">Intelligent Bitrate Reduction</p>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div class="space-y-6">
          <app-file-drop-zone accept="video/*" label="Drop heavy video to encode" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6 animate-[fadeSlideUp_0.4s_ease-out]">
              <!-- Metadata -->
              <div class="grid grid-cols-3 gap-4 text-center">
                <div class="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Duration</p>
                  <p class="text-lg font-bold text-orange-400">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
                <div class="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Resolution</p>
                  <p class="text-lg font-bold text-white">{{ meta.width }}×{{ meta.height }}</p>
                </div>
                <div class="p-3 rounded-2xl bg-black/40 border border-white/5">
                  <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Original Size</p>
                  <p class="text-lg font-bold text-white">{{ (state$ | async)?.originalSizeMB | number:'1.0-1' }} MB</p>
                </div>
              </div>

              <!-- CRF Slider -->
              <div class="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-bold uppercase tracking-widest text-white/50">Compression Quality (CRF)</span>
                  <span class="text-sm font-black px-2 py-1 bg-black/60 rounded-lg border border-white/10" 
                    [class.text-emerald-400]="crfValue < 20"
                    [class.text-cyan-400]="crfValue >= 20 && crfValue < 30"
                    [class.text-orange-400]="crfValue >= 30 && crfValue < 40"
                    [class.text-red-400]="crfValue >= 40">CRF {{ crfValue }}</span>
                </div>
                <input type="range" min="0" max="51" step="1" [value]="crfValue"
                  (input)="onCrfChange(+($any($event.target)).value)"
                  class="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-emerald-500 via-cyan-500 via-orange-400 to-red-500 outline-none" />
                <div class="flex justify-between mt-2 text-[10px] text-white/30 uppercase tracking-widest font-mono">
                  <span>Lossless (0)</span>
                  <span>Balanced (23)</span>
                  <span>Worst (51)</span>
                </div>
              </div>

              <!-- Quick CRF Presets -->
              <div class="grid grid-cols-4 gap-2">
                @for (p of crfPresets; track p.crf) {
                  <button (click)="onCrfChange(p.crf)"
                    class="py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all duration-200 border border-transparent"
                    [class.bg-orange-500]="crfValue === p.crf"
                    [class.text-black]="crfValue === p.crf"
                    [class.bg-white/5]="crfValue !== p.crf"
                    [class.border-white/10]="crfValue !== p.crf"
                    [class.hover:bg-white/10]="crfValue !== p.crf"
                    [class.text-white/50]="crfValue !== p.crf">{{ p.label }}</button>
                }
              </div>

              <div class="space-y-4 mb-2">
                 <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-bold uppercase tracking-widest text-white/50">Audio Layer Action</span>
                 </div>
                 <select [value]="audioCodec" (change)="onAudioCodecChange($any($event.target).value)" 
                         class="w-full px-4 py-3 text-sm bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-orange-400 font-mono transition-colors">
                   <option value="copy">Bypass Codec (Fastest, Larger file)</option>
                   <option value="aac">Encode AAC (Slower, Better compression)</option>
                 </select>
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] disabled:opacity-30 disabled:hover:shadow-none">
                @if (isLoading$ | async) {
                  <div class="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Compressing Engine...
                } @else { 📦 Execute Compression }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-sm font-medium text-red-400 animate-pulse flex items-center gap-3">
              <mat-icon>error_outline</mat-icon> {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-6">
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center flex-col items-center gap-6 p-12 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Compressing macroblocks..." [size]="140" />
              <p class="text-xs text-orange-300/60 uppercase tracking-widest font-mono text-center">Processing via optimized WebAssembly Engine</p>
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
             <div class="animate-[fadeSlideUp_0.4s_ease-out]">
               <div class="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 mb-6 flex justify-between items-center text-center">
                 <div>
                    <p class="text-[10px] text-emerald-400/50 uppercase tracking-widest mb-1">Original Data</p>
                    <p class="text-xl font-bold font-mono text-emerald-200">{{ (state$ | async)?.originalSizeMB | number:'1.0-1' }} MB</p>
                 </div>
                 <div class="text-2xl opacity-50 px-4">➡️</div>
                 <div>
                    <p class="text-[10px] text-emerald-400/50 uppercase tracking-widest mb-1">Optimized Output</p>
                    <p class="text-xl font-bold font-mono text-white">{{ (state$ | async)?.outputSizeMB | number:'1.0-1' }} MB</p>
                 </div>
               </div>
               <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_compressed" />
             </div>
          }
        </div>
      </div>
    </div>
  `
})
export class CompressorComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectCompressorState);
  isLoading$ = this.store.select(selectCompressorIsLoading);
  canProcess$ = this.store.select(selectCompressorCanProcess);

  crfValue = 23;
  audioCodec = 'copy';

  crfPresets = [
    { crf: 18, label: 'High' },
    { crf: 23, label: 'Medium' },
    { crf: 28, label: 'Small' },
    { crf: 35, label: 'Tiny' },
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

  onAudioCodecChange(value: string) {
    this.audioCodec = value;
    // (Assuming updateConfig handles this if needed by the worker)
    this.store.dispatch(CompressorActions.updateConfig({ config: { audioCodec: value } as any }));
  }

  estimateSize(originalMB: number): number {
    const ratio = Math.pow(0.5, (this.crfValue - 18) / 6);
    return originalMB * Math.max(ratio, 0.02);
  }

  onProcess() {
    this.store.dispatch(CompressorActions.startProcessing());
    this.state$.pipe(take(1)).subscribe(state => {
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
    });
  }

  ngOnDestroy() { this.store.dispatch(CompressorActions.resetState()); }
}
