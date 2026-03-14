// ============================================================
// FEATURE 27 — ICO / FAVICON CONVERTER — Component
// Route: /converter/ico-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ConverterFileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ConverterExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { IcoConverterActions, selectIcoConverterState } from './ico-converter.store';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'ico', label: 'ICO', icon: '📄' },
  { value: 'png', label: 'PNG', icon: '📄' },
  { value: 'svg', label: 'SVG', icon: '📄' },
];

@Component({
  selector: 'app-ico-converter',
  standalone: true,
  imports: [CommonModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          🔖 ICO / Favicon Converter
        </h1>
        <p class="text-white/50 text-sm">Convert images to ICO/favicon format with multi-size icon generation</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-converter-file-drop-zone
            accept="image/*"
            [multiple]="false"
            [maxSizeMB]="10"
            label="Drop file here or click to browse"
            (filesSelected)="onFilesSelected($event)" />

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="(state$ | async)?.outputFormat ?? 'ico'"
            (formatChange)="onFormatChange($event)" />

          <button
            [disabled]="(state$ | async)?.status === 'processing'"
            (click)="onProcess()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
            @if ((state$ | async)?.status === 'processing') {
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Processing...
            } @else { 🔖 Convert }
          </button>

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-converter-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Converting..." />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-converter-export-panel
              [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              filename="exia_ico_converter" />
          }
        </div>
      </div>
    </div>
  ` })
export class IcoConverterComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectIcoConverterState);
  outputFormats = OUTPUT_FORMATS;

  onFilesSelected(files: File[]): void {
    this.store.dispatch(IcoConverterActions.loadFile({ file: files[0] }));
  }
  onFormatChange(format: string): void {
    this.store.dispatch(IcoConverterActions.setOutputFormat({ format }));
  }
  onProcess(): void {
    this.store.dispatch(IcoConverterActions.startProcessing());
  }
  ngOnDestroy(): void {
    this.store.dispatch(IcoConverterActions.resetState());
  }
}
