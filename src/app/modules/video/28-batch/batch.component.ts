import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { BatchActions, selectBatchState, selectBatchIsLoading, selectBatchCanProcess } from './batch.store';
import { WorkerBridgeService } from '../shared/engine/worker-bridge.service';

@Component({
  selector: 'app-batch',
  standalone: true,
  imports: [CommonModule, FileDropZoneComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">⚡ Batch Processor</h1>
        <p class="text-white/50 text-sm">Process multiple videos with the same operation at once</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop multiple videos" [multiple]="true" (filesSelected)="onFilesSelected($event)" />

          @if (files.length > 0) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <!-- File List -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm"><span class="text-white/60">{{ files.length }} videos queued</span>
                  <button (click)="files=[]" class="text-xs text-red-400 hover:text-red-300">Clear All</button>
                </div>
                <div class="max-h-40 overflow-y-auto space-y-1">
                  @for (f of files; track f.name; let i = $index) {
                    <div class="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <span class="text-sm text-white/70 truncate">{{ i + 1 }}. {{ f.name }}</span>
                      <span class="text-xs text-white/40">{{ (f.size / 1_048_576) | number:'1.1-1' }}MB</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Operation -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Batch Operation</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (op of operations; track op.value) {
                    <button (click)="operation=op.value"
                      [class]="operation===op.value ? 'p-3 rounded-xl border-2 border-cyan-400 bg-cyan-400/10 text-cyan-300 text-sm font-semibold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ op.icon }} {{ op.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Quality preset for compress -->
              @if (operation === 'compress') {
                <div class="space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-white/60">CRF Quality</span><span class="text-cyan-400 font-mono">{{ batchCrf }}</span></div>
                  <input type="range" min="18" max="40" [value]="batchCrf" (input)="batchCrf=+gv($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
                </div>
              }

              <!-- Batch Progress -->
              @if ((state$ | async)?.status === 'processing') {
                <div class="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <p class="text-sm text-cyan-300">Processing {{ currentFile }} of {{ files.length }}...</p>
                  <div class="w-full h-2 bg-white/10 rounded-full mt-2">
                    <div class="h-2 bg-cyan-400 rounded-full transition-all" [style.width.%]="(state$ | async)?.progress ?? 0"></div>
                  </div>
                </div>
              }

              <button [disabled]="(isLoading$ | async) || files.length === 0" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></div> Batch Processing... } @else { ⚡ Start Batch }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">⚠️ {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Batch..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_batch" /> }
        </div>
      </div>
    </div>
  `,
})
export class BatchComponent implements OnDestroy {
  private store = inject(Store); private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectBatchState); isLoading$ = this.store.select(selectBatchIsLoading); canProcess$ = this.store.select(selectBatchCanProcess);
  files: File[] = []; operation = 'compress'; batchCrf = 28; currentFile = 0;
  operations = [
    { value: 'compress', label: 'Compress', icon: '📦' },
    { value: 'convert_mp4', label: 'to MP4', icon: '🎬' },
    { value: 'convert_webm', label: 'to WebM', icon: '🌐' },
    { value: 'extract_audio', label: 'Extract Audio', icon: '🎵' },
  ];
  gv(e: Event): string { return (e.target as HTMLInputElement).value; }
  onFilesSelected(newFiles: File[]) { this.files = [...this.files, ...newFiles]; if (this.files.length > 0) this.store.dispatch(BatchActions.loadFile({ file: this.files[0] })); }
  onProcess() {
    this.store.dispatch(BatchActions.startProcessing());
    this.currentFile = 1;
    this.bridge.process<unknown, Blob>(
      () => new Worker(new URL('./batch.worker', import.meta.url), { type: 'module' }),
      { files: this.files, operation: this.operation, crf: this.batchCrf }
    ).subscribe(msg => {
      if (msg.type === 'progress') { this.currentFile = Math.ceil((msg.value ?? 0) / 100 * this.files.length) || 1; this.store.dispatch(BatchActions.updateProgress({ progress: msg.value ?? 0 })); }
      else if (msg.type === 'complete' && msg.data) { const b = msg.data as Blob; this.store.dispatch(BatchActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1_048_576 })); }
      else if (msg.type === 'error') { this.store.dispatch(BatchActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Batch failed' })); }
    });
  }
  ngOnDestroy() { this.store.dispatch(BatchActions.resetState()); }
}
