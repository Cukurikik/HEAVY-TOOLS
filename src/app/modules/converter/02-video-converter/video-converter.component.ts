// ============================================================
// FEATURE 02 — VIDEO FORMAT CONVERTER — Component
// Route: /converter/video-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ConverterFileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ConverterExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { VideoConverterActions, selectVideoConverterState } from './video-converter.store';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'mp4',  label: 'MP4',  icon: '🎬' },
  { value: 'mkv',  label: 'MKV',  icon: '📦' },
  { value: 'mov',  label: 'MOV',  icon: '🍎' },
  { value: 'avi',  label: 'AVI',  icon: '📼' },
  { value: 'webm', label: 'WEBM', icon: '🌐' },
  { value: 'flv',  label: 'FLV',  icon: '⚡' },
  { value: 'wmv',  label: 'WMV',  icon: '🪟' },
  { value: 'gif',  label: 'GIF',  icon: '🎞️' },
];

@Component({
  selector: 'app-video-converter',
  standalone: true,
  imports: [CommonModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          🎬 Video Format Converter
        </h1>
        <p class="text-white/50 text-sm">Convert between MP4, MKV, MOV, AVI, WEBM with codec and quality controls</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-converter-file-drop-zone accept="video/*" [maxSizeMB]="2048" label="Drop video file here" (filesSelected)="onFileSelected($event)" />
          <app-converter-format-selector [formats]="formats" [selected]="(state$ | async)?.outputFormat ?? 'mp4'" (formatChange)="onFormatChange($event)" />

          @if ((state$ | async)?.inputFile) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-white/40">CRF Quality (0-51)</label>
                  <input type="range" min="0" max="51" [value]="(state$ | async)?.crf ?? 23"
                    (input)="onCRFChange(+($any($event.target)).value)" class="w-full accent-blue-400" />
                  <span class="text-xs text-white/50">{{ (state$ | async)?.crf }}</span>
                </div>
                <div>
                  <label class="text-xs text-white/40">Encoding Speed</label>
                  <select (change)="onSpeedChange(($any($event.target)).value)"
                    class="w-full px-2 py-1 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white">
                    <option value="ultrafast">Ultrafast</option>
                    <option value="fast">Fast</option>
                    <option value="medium" selected>Medium</option>
                    <option value="slow">Slow</option>
                    <option value="veryslow">Very Slow</option>
                  </select>
                </div>
              </div>
              <button [disabled]="(state$ | async)?.status === 'processing'" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-black disabled:opacity-40">
                @if ((state$ | async)?.status === 'processing') {
                  <div class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>Converting...
                } @else { 🔄 Convert Video }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div>
          }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8"><app-converter-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Encoding..." /></div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-converter-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" filename="exia_video_converted" />
          }
        </div>
      </div>
    </div>
  `,
})
export class VideoConverterComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectVideoConverterState);
  formats = OUTPUT_FORMATS;

  onFileSelected(files: File[]): void { this.store.dispatch(VideoConverterActions.loadFile({ file: files[0] })); }
  onFormatChange(format: string): void { this.store.dispatch(VideoConverterActions.setOutputFormat({ format })); }
  onCRFChange(crf: number): void { this.store.dispatch(VideoConverterActions.setCRF({ crf })); }
  onSpeedChange(speed: string): void { this.store.dispatch(VideoConverterActions.setEncodingSpeed({ speed })); }
  onProcess(): void { this.store.dispatch(VideoConverterActions.startProcessing()); }
  ngOnDestroy(): void { this.store.dispatch(VideoConverterActions.resetState()); }
}
