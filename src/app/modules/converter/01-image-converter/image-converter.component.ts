// ============================================================
// FEATURE 01 — IMAGE CONVERTER — Component
// Route: /converter/image-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ConverterFileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ConverterExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { ImageConverterActions, selectImageConverterState } from './image-converter.store';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'jpeg', label: 'JPEG', icon: '🖼️' },
  { value: 'png',  label: 'PNG',  icon: '🎨' },
  { value: 'webp', label: 'WEBP', icon: '🌐' },
  { value: 'avif', label: 'AVIF', icon: '🚀', badge: 'Best' },
  { value: 'bmp',  label: 'BMP',  icon: '📋' },
  { value: 'tiff', label: 'TIFF', icon: '📐' },
  { value: 'gif',  label: 'GIF',  icon: '🎞️' },
];

@Component({
  selector: 'app-image-converter',
  standalone: true,
  imports: [CommonModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image-converter.component.html'
})
export class ImageConverterComponent implements OnDestroy {
  store = inject(Store);
  state$ = this.store.select(selectImageConverterState);
  outputFormats = OUTPUT_FORMATS;
  actions = ImageConverterActions;

  onFilesSelected(files: File[]): void {
    this.store.dispatch(ImageConverterActions.loadFiles({ files }));
  }
  onFormatChange(format: string): void {
    this.store.dispatch(ImageConverterActions.setOutputFormat({ format }));
  }
  onQualityChange(quality: number): void {
    this.store.dispatch(ImageConverterActions.setQuality({ quality }));
  }
  onProcess(): void {
    this.store.dispatch(ImageConverterActions.startProcessing());
  }
  ngOnDestroy(): void {
    this.store.dispatch(ImageConverterActions.resetState());
  }
}
