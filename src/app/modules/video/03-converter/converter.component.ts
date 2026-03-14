import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { ConverterActions, selectConverterState, selectConverterIsLoading, selectConverterCanProcess } from './converter.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
          🔄 Format Converter
        </h1>
        <p class="text-white/50 text-sm">Convert video between MP4, WebM, MOV, GIF with codec selection</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <!-- Metadata Display -->
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-cyan-400">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}×{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Codec</p>
                  <p class="text-sm font-semibold text-white">{{ meta.codec }}</p>
                </div>
              </div>

              <!-- Target Format Selector -->
              <div class="space-y-2">
                <span class="text-xs text-white/40 uppercase tracking-wider" style="display: block;">Target Format</span>
                <div class="grid grid-cols-4 gap-2">
                  @for (fmt of formats; track fmt.value) {
                    <button (click)="onFormatChange(fmt.value)"
                      class="py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200 border"
                      [class.bg-cyan-500]="(state$ | async)?.targetFormat === fmt.value"
                      [class.text-black]="(state$ | async)?.targetFormat === fmt.value"
                      [class.border-cyan-500]="(state$ | async)?.targetFormat === fmt.value"
                      [class.shadow-[0_0_20px_rgba(0,245,255,0.3)]]="(state$ | async)?.targetFormat === fmt.value"
                      [class.bg-white/5]="(state$ | async)?.targetFormat !== fmt.value"
                      [class.text-white/60]="(state$ | async)?.targetFormat !== fmt.value"
                      [class.border-white/10]="(state$ | async)?.targetFormat !== fmt.value"
                      [class.hover:bg-white/10]="(state$ | async)?.targetFormat !== fmt.value"
                    >
                      <span class="text-lg">{{ fmt.icon }}</span><br/>{{ fmt.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Quality Preset -->
              <div class="space-y-2">
                <span class="text-xs text-white/40 uppercase tracking-wider" style="display: block;">Quality Preset</span>
                <div class="grid grid-cols-3 gap-2">
                  @for (preset of presets; track preset.value) {
                    <button (click)="onPresetChange(preset.value)"
                      class="py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                      [class.bg-gradient-to-r]="(state$ | async)?.qualityPreset === preset.value"
                      [class.from-emerald-500]="(state$ | async)?.qualityPreset === preset.value"
                      [class.to-cyan-500]="(state$ | async)?.qualityPreset === preset.value"
                      [class.text-black]="(state$ | async)?.qualityPreset === preset.value"
                      [class.bg-white/5]="(state$ | async)?.qualityPreset !== preset.value"
                      [class.text-white/50]="(state$ | async)?.qualityPreset !== preset.value"
                    >{{ preset.icon }} {{ preset.label }}</button>
                  }
                </div>
              </div>

              <!-- Process Button -->
              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Converting...
                } @else { 🔄 Convert Video }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Converting..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              [availableFormats]="[(state$ | async)?.targetFormat ?? 'mp4']"
              defaultFilename="omni_converted" />
          }
        </div>
      </div>
    </div>
  ` })
export class ConverterComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpeg = inject(FFmpegService);
  private bridge = inject(WorkerBridgeService);

  state$ = this.store.select(selectConverterState);
  isLoading$ = this.store.select(selectConverterIsLoading);
  canProcess$ = this.store.select(selectConverterCanProcess);

  formats = [
    { value: 'mp4' as const, label: 'MP4', icon: '🎬' },
    { value: 'webm' as const, label: 'WebM', icon: '🌐' },
    { value: 'mov' as const, label: 'MOV', icon: '🍎' },
    { value: 'gif' as const, label: 'GIF', icon: '🎞️' },
  ];

  presets = [
    { value: 'fast' as const, label: 'Fast', icon: '⚡' },
    { value: 'balanced' as const, label: 'Balanced', icon: '⚖️' },
    { value: 'best' as const, label: 'Best', icon: '💎' },
  ];

  async onFileSelected(files: File[]) {
    const file = files[0];
    this.store.dispatch(ConverterActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(ConverterActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(ConverterActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' }));
    }
  }

  onFormatChange(format: string) {
    this.store.dispatch(ConverterActions.updateConfig({ config: { targetFormat: format as unknown as BlobPart } }));
  }

  onPresetChange(preset: string) {
    this.store.dispatch(ConverterActions.updateConfig({ config: { qualityPreset: preset as unknown as BlobPart } }));
  }

  onProcess() {
    this.store.dispatch(ConverterActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./converter.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, targetFormat: state.targetFormat, qualityPreset: state.qualityPreset }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(ConverterActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) {
          const blob = msg.data as Blob;
          this.store.dispatch(ConverterActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1_048_576 }));
        } else if (msg.type === 'error') {
          this.store.dispatch(ConverterActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Conversion failed' }));
        }
      });
    }).unsubscribe();
  }

  ngOnDestroy() { this.store.dispatch(ConverterActions.resetState()); }
}
