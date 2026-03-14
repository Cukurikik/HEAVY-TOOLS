import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { AudioReplacerActions, selectAudioReplacerState, selectAudioReplacerIsLoading, selectAudioReplacerCanProcess } from './audioReplacer.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-audio-replacer',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">🔊 Audio Replacer</h1>
        <p class="text-white/50 text-sm">Replace or mix a new audio track into your video</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-rose-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>

              <!-- Audio Upload -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">New Audio Track</p>
                <label class="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-rose-400/50 bg-white/5 cursor-pointer transition-all">
                  <span class="text-2xl">🎵</span>
                  <div><p class="text-sm text-white/80">{{ audioFileName || 'Select audio file' }}</p><p class="text-xs text-white/40">.mp3, .wav, .aac, .ogg</p></div>
                  <input type="file" accept="audio/*" (change)="onAudioFile($event)" class="hidden" />
                </label>
              </div>

              <!-- Mix Mode -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Audio Mode</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (mode of mixModes; track mode.value) {
                    <button (click)="mixMode=mode.value"
                      [class]="mixMode===mode.value ? 'p-3 rounded-xl border-2 border-rose-400 bg-rose-400/10 text-rose-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ mode.icon }} {{ mode.label }}
                      <p class="text-xs mt-1 opacity-60">{{ mode.desc }}</p>
                    </button>
                  }
                </div>
              </div>

              @if (mixMode === 'overlay') {
                <!-- Volume Slider -->
                <div class="space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-white/60">Original Volume</span><span class="text-rose-400 font-mono">{{ origVolume }}%</span></div>
                  <input type="range" min="0" max="100" [value]="origVolume" (input)="origVolume=+getVal($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-400" />
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-white/60">New Audio Volume</span><span class="text-rose-400 font-mono">{{ newVolume }}%</span></div>
                  <input type="range" min="0" max="200" [value]="newVolume" (input)="newVolume=+getVal($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-400" />
                </div>
              }

              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async) || !audioFile" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Replacing... } @else { 🔊 Replace Audio }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Replacing Audio..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_audio_replaced" /> }
        </div>
      </div>
    </div>
  `,
})
export class AudioReplacerComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectAudioReplacerState);
  isLoading$ = this.store.select(selectAudioReplacerIsLoading);
  canProcess$ = this.store.select(selectAudioReplacerCanProcess);

  audioFile: File | null = null;
  audioFileName = '';
  mixMode: 'replace' | 'overlay' = 'replace';
  origVolume = 50;
  newVolume = 100;

  mixModes = [
    { value: 'replace' as const, label: 'Replace', icon: '🔄', desc: 'Remove original audio' },
    { value: 'overlay' as const, label: 'Mix/Overlay', icon: '🎚️', desc: 'Blend both tracks' },
  ];

  getVal(e: Event): string { return (e.target as HTMLInputElement).value; }

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(AudioReplacerActions.loadFile({ file }));
    try { const meta = await this.ffmpeg.getMetadata(file); this.store.dispatch(AudioReplacerActions.loadMetaSuccess({ meta })); }
    catch { this.store.dispatch(AudioReplacerActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' })); }
  }

  onAudioFile(e: Event) { const f = (e.target as HTMLInputElement).files?.[0]; if (f) { this.audioFile = f; this.audioFileName = f.name; } }

  onProcess() {
    this.store.dispatch(AudioReplacerActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile || !this.audioFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./audioReplacer.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, audioFile: this.audioFile, mixMode: this.mixMode, origVolume: this.origVolume / 100, newVolume: this.newVolume / 100 }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(AudioReplacerActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) { const b = msg.data as Blob; this.store.dispatch(AudioReplacerActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1_048_576 })); }
        else if (msg.type === 'error') { this.store.dispatch(AudioReplacerActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Audio replacement failed' })); }
      });
    }).unsubscribe();
  }

  ngOnDestroy() { this.store.dispatch(AudioReplacerActions.resetState()); }
}
