// ============================================================
// FEATURE 04 — DOCUMENT CONVERTER — Component
// Route: /converter/document-converter
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FileDropZoneComponent } from '../shared/components/file-drop-zone/file-drop-zone.component';
import { ConverterFormatSelectorComponent, FormatOption } from '../shared/components/format-selector/format-selector.component';
import { ConverterProgressRingComponent } from '../shared/components/progress-ring/progress-ring.component';
import { ConverterExportPanelComponent } from '../shared/components/export-panel/export-panel.component';
import { DocumentConverterActions, selectDocumentConverterState } from './document-converter.store';
import { ConverterWorkerBridgeService } from '../shared/engine/worker-bridge.service';
import { take } from 'rxjs';

const OUTPUT_FORMATS: FormatOption[] = [
  { value: 'pdf', label: 'PDF', icon: '📄', badge: 'Popular' },
  { value: 'docx', label: 'DOCX', icon: '📝' },
  { value: 'txt', label: 'TXT', icon: '📑' },
  { value: 'rtf', label: 'RTF', icon: '🖨️' },
  { value: 'odt', label: 'ODT', icon: '📊' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'epub', label: 'EPUB', icon: '📚' },
];

@Component({
  selector: 'app-document-converter',
  standalone: true,
  imports: [
    CommonModule,
    FileDropZoneComponent,
    ConverterFormatSelectorComponent,
    ConverterProgressRingComponent,
    ConverterExportPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          📄 Document Converter
        </h1>
        <p class="text-white/50 text-sm">Convert between DOCX, PDF, TXT, RTF, ODT, EPUB, HTML documents</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone 
            accept=".pdf,.docx,.txt,.rtf,.odt,.html,.epub" 
            label="Drop document files here or click to browse" 
            icon="📄"
            [supportedFormats]="['pdf', 'docx', 'txt', 'rtf', 'odt', 'html', 'epub']"
            (filesSelected)="onFilesSelected($event)" />

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="((state$ | async)?.outputFormat ?? 'docx')"
            (formatChange)="onFormatChange($event)" />

          <button
            [disabled]="(state$ | async)?.status === 'processing' || !(state$ | async)?.inputFile"
            (click)="onProcess()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
            @if ((state$ | async)?.status === 'processing') {
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Processing...
            } @else { 📄 Convert }
          </button>

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) {
            <div class="bg-[#12121a] rounded-2xl p-6 border border-white/5">
              <!-- Info -->
              <div class="aspect-video rounded-xl overflow-hidden bg-black/20 mb-4 flex flex-col items-center justify-center p-8 text-white/50 space-y-2">
                <span class="text-4xl">📄</span>
                <p class="font-medium text-white/70">{{ (state$ | async)?.inputFile?.name }}</p>
                <p class="text-xs uppercase tracking-widest">{{ (state$ | async)?.inputFile?.type }}</p>
              </div>
          
              <!-- Processing Status -->
              @if ((state$ | async)?.status === 'processing') {
                <div class="mt-4 flex flex-col items-center gap-3 text-center">
                  <app-converter-progress-ring [progress]="(state$ | async)?.progress ?? 0"></app-converter-progress-ring>
                  <span class="text-white/70">Converting... {{ ((state$ | async)?.progress ?? 0) | number:'1.0-0' }}%</span>
                </div>
              }
          
              <!-- Export Panel -->
              @if ((state$ | async)?.status === 'done') {
                <app-converter-export-panel 
                  [outputBlob]="((state$ | async)?.outputBlob ?? null)"
                  [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
                  [filename]="'converted.' + (state$ | async)?.outputFormat"
                  (download)="onDownload()" />
              }
            </div>
          }
        </div>
      </div>
    </div>
  ` })
export class DocumentConverterComponent implements OnDestroy {
  private store = inject(Store);
  private bridge = inject(ConverterWorkerBridgeService);
  
  state$ = this.store.select(selectDocumentConverterState);
  outputFormats = OUTPUT_FORMATS;

  onFilesSelected(files: File[]) {
    if (files.length > 0) {
      this.store.dispatch(DocumentConverterActions.loadFile({ file: files[0] }));
    }
  }

  onFormatChange(format: string) {
    this.store.dispatch(DocumentConverterActions.setOutputFormat({ format }));
  }

  onProcess() {
    this.state$.pipe(take(1)).subscribe(state => {
      if (!state.inputFile) return;
      
      this.store.dispatch(DocumentConverterActions.startProcessing());
      
      this.bridge.process<any, { blob: Blob; text: string }>(
        () => new Worker(new URL('./document-converter.worker', import.meta.url), { type: 'module' }),
        { file: state.inputFile, outputFormat: state.outputFormat, options: state.options }
      ).subscribe({
        next: (msg) => {
          if (msg.type === 'progress') {
            this.store.dispatch(DocumentConverterActions.updateProgress({ progress: msg.value ?? 0 }));
          } else if (msg.type === 'complete' && msg.data) {
            const blob = msg.data.blob;
            this.store.dispatch(DocumentConverterActions.processingSuccess({ 
              outputBlob: blob, 
              outputSizeMB: blob.size / 1048576 
            }));
          } else if (msg.type === 'error') {
            this.store.dispatch(DocumentConverterActions.processingFailure({ 
              errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', 
              message: msg.message ?? 'Conversion failed',
              retryable: true
            }));
          }
        },
        error: (err) => {
          this.store.dispatch(DocumentConverterActions.processingFailure({ 
            errorCode: 'WORKER_CRASHED', 
            message: String(err),
            retryable: true
          }));
        }
      });
    });
  }

  onDownload() {
    this.store.dispatch(DocumentConverterActions.downloadOutput());
  }

  ngOnDestroy() {
    this.store.dispatch(DocumentConverterActions.resetState());
  }
}