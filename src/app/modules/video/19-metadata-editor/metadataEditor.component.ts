import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { VideoPreviewComponent } from '../shared/components/video-preview/video-preview.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { MetadataEditorActions, selectMetadataEditorState, selectMetadataEditorIsLoading, selectMetadataEditorCanProcess } from './metadataEditor.store';
import { FFmpegService } from '../shared/engine/ffmpeg.service';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-metadata-editor',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">🏷️ Metadata Editor</h1>
        <p class="text-white/50 text-sm">Edit video metadata tags: title, artist, year, comment, genre</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video to edit metadata" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-emerald-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>

              @for (field of metaFields; track field.key) {
                <div class="space-y-1">
                  <span class="text-sm text-white/60" style="display: block;">{{ field.icon }} {{ field.label }}</span>
                  <input [type]="field.type" [value]="metaValues[field.key] || ''" (input)="onMetaChange(field.key, $event)"
                    [placeholder]="field.placeholder"
                    class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-emerald-400 focus:outline-none transition-colors" />
                </div>
              }

              <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300/80">
                ℹ️ Metadata editing uses stream copy (-c copy) so it's instant and lossless — no re-encoding needed!
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-black hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Saving... } @else { 🏷️ Save Metadata }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Saving..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_metadata" /> }
        </div>
      </div>
    </div>
  ` })
export class MetadataEditorComponent implements OnDestroy {
  private store = inject(Store); private ffmpeg = inject(FFmpegService); private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectMetadataEditorState); isLoading$ = this.store.select(selectMetadataEditorIsLoading); canProcess$ = this.store.select(selectMetadataEditorCanProcess);

  metaValues: Record<string, string> = { title: '', artist: '', year: '', comment: '', genre: '' };
  metaFields = [
    { key: 'title', label: 'Title', icon: '📝', type: 'text', placeholder: 'Enter video title...' },
    { key: 'artist', label: 'Artist / Creator', icon: '👤', type: 'text', placeholder: 'Enter artist name...' },
    { key: 'year', label: 'Year', icon: '📅', type: 'number', placeholder: '2024' },
    { key: 'comment', label: 'Comment', icon: '💬', type: 'text', placeholder: 'Enter a comment...' },
    { key: 'genre', label: 'Genre', icon: '🎭', type: 'text', placeholder: 'Enter genre...' },
  ];

  async onFileSelected(files: File[]) {
    const file = files[0]; this.store.dispatch(MetadataEditorActions.loadFile({ file }));
    try { const meta = await this.ffmpeg.getMetadata(file); this.store.dispatch(MetadataEditorActions.loadMetaSuccess({ meta })); }
    catch { this.store.dispatch(MetadataEditorActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read video metadata.' })); }
  }

  onMetaChange(key: string, e: Event) { this.metaValues = { ...this.metaValues, [key]: (e.target as HTMLInputElement).value }; }

  onProcess() {
    this.store.dispatch(MetadataEditorActions.startProcessing());
    this.state$.subscribe(state => {
      if (!state.inputFile) return;
      this.bridge.process<unknown, Blob>(
        () => new Worker(new URL('./metadataEditor.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, metadata: this.metaValues }
      ).subscribe(msg => {
        if (msg.type === 'progress') this.store.dispatch(MetadataEditorActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === 'complete' && msg.data) { const b = msg.data as Blob; this.store.dispatch(MetadataEditorActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1_048_576 })); }
        else if (msg.type === 'error') { this.store.dispatch(MetadataEditorActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Metadata save failed' })); }
      });
    });
  }
  ngOnDestroy() { this.store.dispatch(MetadataEditorActions.resetState()); }
}
