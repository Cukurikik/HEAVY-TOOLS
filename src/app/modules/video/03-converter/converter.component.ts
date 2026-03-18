import { take } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ConverterActions, selectConverterState, selectConverterIsLoading, selectConverterCanProcess } from './converter.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule],
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
          <div class="relative border-2 border-dashed border-white/20 rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group bg-[#12121a]/30 hover:bg-[#1a1a24]/50"
               (click)="fileInput.click()">
            <input #fileInput type="file" class="hidden" accept="video/*" (change)="onFileSelected($event)">
            <div class="space-y-3">
              <div class="w-16 h-16 mx-auto rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <span class="text-3xl">🎬</span>
              </div>
              <p class="text-white/70 text-sm">Drop video file here or <span class="text-cyan-400 underline">browse</span></p>
              <p class="text-white/30 text-xs">MP4, AVI, MOV, WMV, FLV, WebM — Max 500MB</p>
            </div>
          </div>

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
                      <span class="text-lg">{{ fmt.icon }}</span><br>{{ fmt.label }}
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
                    >
                      {{ preset.icon }} {{ preset.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Process Button -->
              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-5 h-5 border-t-2 border-cyan-400 border-solid rounded-full animate-spin"></div>
                  Processing...
                } @else {
                  ⚡ Convert to {{ (state$ | async)?.targetFormat?.toUpperCase() }}
                }
              </button>
            </div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) {
            <div class="rounded-2xl overflow-hidden border border-white/10 aspect-video flex items-center justify-center bg-black/20">
              <video #videoPlayer controls class="max-w-full max-h-80 mx-auto" [src]="inputFileUrl()">
                Your browser does not support the video tag.
              </video>
            </div>
          }

          @if (outputFileUrl()) {
            <div class="rounded-2xl overflow-hidden border border-white/10 aspect-video flex items-center justify-center bg-black/20">
              <video controls class="max-w-full max-h-80 mx-auto" [src]="outputFileUrl()">
                Your browser does not support the video tag.
              </video>
            </div>
            <button (click)="onDownload()"
              class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-500 text-black hover:shadow-[0_0_30px_rgba(0,245,255,0.4)]">
              ⬇ Download {{ (state$ | async)?.targetFormat?.toUpperCase() }}
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class ConverterComponent implements OnDestroy {
  private store = inject(Store);
  private ffmpegService = inject(FFmpegService);
  private workerBridge = inject(WorkerBridgeService);
  
  state$ = this.store.select(selectConverterState);
  isLoading$ = this.store.select(selectConverterIsLoading);
  canProcess$ = this.store.select(selectConverterCanProcess);
  
  formats = [
    { value: 'mp4', label: 'MP4', icon: '🎬' },
    { value: 'webm', label: 'WEBM', icon: '🌐' },
    { value: 'mov', label: 'MOV', icon: '🎥' },
    { value: 'gif', label: 'GIF', icon: '🎡' }
  ];
  
  presets = [
    { value: 'fast', label: 'Fast', icon: '⚡' },
    { value: 'balanced', label: 'Balanced', icon: '⚖️' },
    { value: 'high', label: 'High Quality', icon: '💎' }
  ];

  inputFileUrl = signal<string | null>(null);
  outputFileUrl = signal<string | null>(null);

  constructor() {
    this.state$.pipe(take(1)).subscribe(state => {
      if (state.inputFile && !this.inputFileUrl()) {
        this.inputFileUrl.set(URL.createObjectURL(state.inputFile));
      } else if (!state.inputFile && this.inputFileUrl()) {
        URL.revokeObjectURL(this.inputFileUrl()!);
        this.inputFileUrl.set(null);
      }
      if (state.outputBlob && !this.outputFileUrl()) {
        this.outputFileUrl.set(URL.createObjectURL(state.outputBlob));
      } else if (!state.outputBlob && this.outputFileUrl()) {
        URL.revokeObjectURL(this.outputFileUrl()!);
        this.outputFileUrl.set(null);
      }
    });
  }

  ngOnDestroy() {
    // Cleanup resources if needed
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.store.dispatch(ConverterActions.loadFile({ file }));
    }
  }

  onFormatChange(format: string) {
    this.store.dispatch(ConverterActions.updateConfig({ config: { targetFormat: format as any } }));
  }

  onPresetChange(preset: string) {
    this.store.dispatch(ConverterActions.updateConfig({ config: { qualityPreset: preset as any } }));
  }

  onProcess() {
    this.store.dispatch(ConverterActions.startProcessing());
  }

  onDownload() {
    this.store.dispatch(ConverterActions.downloadOutput());
  }
}
