import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { AnalyserActions, selectAnalyserState, selectAnalyserIsLoading, selectAnalyserCanProcess } from './analyser.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-analyser',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
    <div class="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div class="relative bg-[#0a0a0f]/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
        <div class="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 space-y-8">
      <header class="space-y-1">
        <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg tracking-tight" class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-zinc-400">📊 Video Analyser</h1>
        <p class="text-white/50 text-sm">Deep analysis of video properties: codec, bitrate, frame rate, audio channels</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video to analyse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="space-y-3">
              <!-- Video Info Cards -->
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h3 class="text-sm font-semibold text-white/80 flex items-center gap-2">🎬 Video Stream</h3>
                <div class="grid grid-cols-2 gap-2">
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-mono text-cyan-400">{{ meta.codec }}</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-mono text-cyan-400">{{ meta.width }}x{{ meta.height }}</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-mono text-cyan-400">{{ meta.duration | number:'1.2-2' }}s</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Frame Rate</p><p class="text-sm font-mono text-cyan-400">{{ meta.fps }} FPS</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Bitrate</p><p class="text-sm font-mono text-cyan-400">{{ meta.bitrate ? (meta.bitrate / 1000 | number:'1.0-0') + ' kbps' : 'N/A' }}</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">File Size</p><p class="text-sm font-mono text-cyan-400">{{ fileSize | number:'1.1-1' }} MB</p></div>
                </div>
              </div>

              <!-- Audio Info -->
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h3 class="text-sm font-semibold text-white/80 flex items-center gap-2">🔊 Audio Stream</h3>
                <div class="grid grid-cols-2 gap-2">
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Audio Codec</p><p class="text-sm font-mono text-green-400">{{ meta.audioCodec ?? 'N/A' }}</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Sample Rate</p><p class="text-sm font-mono text-green-400">{{ meta.sampleRate ?? 'N/A' }} Hz</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Channels</p><p class="text-sm font-mono text-green-400">Stereo</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Audio Bitrate</p><p class="text-sm font-mono text-green-400">{{ meta.audioBitrate ? (meta.audioBitrate / 1000 | number:'1.0-0') + ' kbps' : 'N/A' }}</p></div>
                </div>
              </div>

              <!-- Additional Analysis -->
              <button [disabled]="(isLoading$ | async)" (click)="onDeepAnalyse()"
                class="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-slate-600 to-zinc-600 text-white hover:shadow-[0_0_20px_rgba(148,163,184,0.3)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></div> Analysing... } @else { 🔬 Deep Analysis (FFprobe) }
              </button>

              @if (deepAnalysis) {
                <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h3 class="text-sm font-semibold text-white/80 mb-2">📋 Raw FFprobe Output</h3>
                  <pre class="text-xs text-white/60 font-mono overflow-x-auto max-h-60 overflow-y-auto whitespace-pre-wrap">{{ deepAnalysis }}</pre>
                </div>
              }
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
        </div>
      </div>
          </div>
      </div>
    </div>
  </div>
  `,
})
export class AnalyserComponent implements OnDestroy {
  private store = inject(Store); private ffmpeg = inject(FFmpegService); private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectAnalyserState); isLoading$ = this.store.select(selectAnalyserIsLoading); canProcess$ = this.store.select(selectAnalyserCanProcess);
  fileSize = 0; deepAnalysis = '';

  async onFileSelected(files: File[]) {
    const file = files[0]; this.fileSize = file.size / 1_048_576;
    this.store.dispatch(AnalyserActions.loadFile({ file }));
    try { const meta = await this.ffmpeg.getMetadata(file); this.store.dispatch(AnalyserActions.loadMetaSuccess({ meta })); }
    catch { this.store.dispatch(AnalyserActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' })); }
  }

  onDeepAnalyse() {
    this.store.dispatch(AnalyserActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./analyser.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, mode: 'probe' }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(AnalyserActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          // Deep analysis returns JSON string as Blob
          const reader = new FileReader();
          reader.onload = () => { this.deepAnalysis = reader.result as string; };
          reader.readAsText(msg.data as Blob);
          this.store.dispatch(AnalyserActions.processingSuccess({ outputBlob: msg.data as Blob, outputSizeMB: 0 }));
        }
        else if (msg.type === 'error') { this.store.dispatch(AnalyserActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Analysis failed' })); }
      });
    }).unsubscribe();
  }
  ngOnDestroy() { this.store.dispatch(AnalyserActions.resetState()); }
}
