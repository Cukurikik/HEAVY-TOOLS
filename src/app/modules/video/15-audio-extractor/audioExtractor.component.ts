import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { AudioExtractorActions, selectAudioExtractorState, selectAudioExtractorIsLoading, selectAudioExtractorCanProcess } from './audioExtractor.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-audio-extractor',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
          🎵 Audio Extractor
        </h1>
        <p class="text-white/50 text-sm">Extract audio track from video as MP3, WAV, or AAC</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-amber-400">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Audio Codec</p>
                  <p class="text-sm font-semibold text-white">{{ meta.audioCodec || 'N/A' }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Channels</p>
                  <p class="text-sm font-semibold text-white">Stereo</p>
                </div>
              </div>

              <!-- Output Format -->
              <div class="space-y-2">
                <span class="text-xs text-white/40 uppercase tracking-wider" style="display: block;">Output Format</span>
                <div class="grid grid-cols-3 gap-3">
                  @for (fmt of audioFormats; track fmt.value) {
                    <button (click)="onFormatChange(fmt.value)"
                      class="py-4 rounded-xl text-center transition-all duration-200 border"
                      [class.bg-amber-500]="outputFormat === fmt.value"
                      [class.text-black]="outputFormat === fmt.value"
                      [class.border-amber-500]="outputFormat === fmt.value"
                      [class.shadow-[0_0_20px_rgba(245,158,11,0.3)]]="outputFormat === fmt.value"
                      [class.bg-white/5]="outputFormat !== fmt.value"
                      [class.text-white/60]="outputFormat !== fmt.value"
                      [class.border-white/10]="outputFormat !== fmt.value">
                      <span class="text-2xl block">{{ fmt.icon }}</span>
                      <span class="text-xs font-bold block mt-1">{{ fmt.label }}</span>
                      <span class="text-[10px] block text-white/40 mt-0.5">{{ fmt.desc }}</span>
                    </button>
                  }
                </div>
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Extracting Audio...
                } @else { 🎵 Extract Audio }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) {
            <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" />
          }
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Extracting..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              [availableFormats]="[outputFormat]" defaultFilename="omni_audio" />
          }
        </div>
      </div>
    </div>
  ` })
export class AudioExtractorComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectAudioExtractorState);
  isLoading$ = this.store.select(selectAudioExtractorIsLoading);
  canProcess$ = this.store.select(selectAudioExtractorCanProcess);

  outputFormat = 'mp3';

  audioFormats = [
    { value: 'mp3', label: 'MP3', icon: '🎵', desc: 'Universal' },
    { value: 'wav', label: 'WAV', icon: '🎼', desc: 'Lossless' },
    { value: 'aac', label: 'AAC', icon: '🔊', desc: 'Efficient' },
  ];

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(AudioExtractorActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(AudioExtractorActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(AudioExtractorActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onFormatChange(fmt: string) { this.outputFormat = fmt; }

  onProcess() {
    this.store.dispatch(AudioExtractorActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./audioExtractor.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, outputFormat: this.outputFormat }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(AudioExtractorActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(AudioExtractorActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(AudioExtractorActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Audio extraction failed' }));
        }
      });
    }).unsubscribe();
  }

  ngOnDestroy() { this.store.dispatch(AudioExtractorActions.resetState()); }
}
