import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { 
    PdfDropZoneComponent, 
    PdfPreviewComponent, 
    ProgressRingComponent, 
    ExportPanelComponent,
    PdfLibService,
    WorkerBridgeService
} from '../shared';
import { MergerActions, selectMergerPdfState, selectMergerIsLoading, selectMergerCanProcess } from './merger.store';

@Component({
  selector: 'app-pdf-merger',
  standalone: true,
  imports: [CommonModule, PdfDropZoneComponent, PdfPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
    <div class="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div class="relative bg-[#0a0a0f]/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
        <div class="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 space-y-8">
      <header class="space-y-1">
        <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg tracking-tight" class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400 drop-shadow-lg">
          🔗 PDF Merger
        </h1>
        <p class="text-white/50 text-sm">Combine multiple PDF files into one.</p>
      </header>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <!-- LEFT COLUMN: CONTROLS -->
         <div class="space-y-4">
            <app-pdf-drop-zone (filesSelected)="onFileSelected($event)" label="Drop PDF file here or click" />
            
            @if((state$ | async)?.pdfMeta; as meta) {
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                 <div class="grid grid-cols-2 gap-3 text-center">
                    <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Pages</p><p class="text-sm font-semibold text-rose-400">{{meta.pageCount}}</p></div>
                    <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Size</p><p class="text-sm font-semibold text-white">{{meta.fileSizeMB | number:'1.2-2'}} MB</p></div>
                 </div>
                 
                 <button
                    [disabled]="!(canProcess$ | async) || (isLoading$ | async)"
                    (click)="onProcess()"
                    class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    @if (isLoading$ | async) {
                      <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    } @else { 🔗 Execute }
                  </button>
              </div>
            }
            
            @if ((state$ | async)?.status === 'error') {
               <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                  ⚠️ {{ (state$ | async)?.errorMessage }}
               </div>
            }
         </div>
         
         <!-- RIGHT COLUMN: PREVIEW/OUTPUT -->
         <div class="space-y-4">
            @if ((state$ | async)?.inputFile && (state$ | async)?.status !== 'done') {
                <app-pdf-preview [file]="(state$ | async)?.inputFile ?? null" />
            }
            @if ((state$ | async)?.status === 'processing') {
                <div class="flex justify-center p-8">
                  <app-pdf-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Modifying..." [size]="120" />
                </div>
            }
            @if ((state$ | async)?.status === 'done') {
                <app-pdf-export-panel 
                  [outputBlob]="(state$ | async)?.outputBlob ?? null" 
                  [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" 
                  defaultFilename="omni_merger.pdf" 
                />
            }
         </div>
      </div>
    </div>
  `
})
export class MergerComponent implements OnDestroy {
  store = inject(Store);
  pdfLib = inject(PdfLibService);
  bridge = inject(WorkerBridgeService);
  
  state$ = this.store.select(selectMergerPdfState);
  isLoading$ = this.store.select(selectMergerIsLoading);
  canProcess$ = this.store.select(selectMergerCanProcess);
  
  async onFileSelected(files: File[]) {
     const file = files[0];
     this.store.dispatch(MergerActions.loadFile({ file }));
     try {
       const meta = await this.pdfLib.getMetadata(file);
       this.store.dispatch(MergerActions.loadMetaSuccess({ meta }));
     } catch {
       this.store.dispatch(MergerActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read PDF structure.' }));
     }
  }
  
  onProcess() {
     this.store.dispatch(MergerActions.startProcessing());
     this.state$.subscribe(state => {
        if (!state.inputFile) return;
        this.bridge.process<any, Blob>(
          () => new Worker(new URL('./merger.worker', import.meta.url), { type: 'module' }),
          { file: state.inputFile }
        ).subscribe({
           next: (msg) => {
              if (msg.type === 'progress') this.store.dispatch(MergerActions.updateProgress({ progress: msg.value ?? 0 }));
              if (msg.type === 'complete' && msg.data) {
                 this.store.dispatch(MergerActions.processingSuccess({ outputBlob: msg.data, outputSizeMB: msg.data.size / 1048576 }));
              }
              if (msg.type === 'error') {
                 this.store.dispatch(MergerActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Failed', retryable: true }));
              }
           }
        });
     }).unsubscribe();
  }
  
  ngOnDestroy() {
     this.store.dispatch(MergerActions.resetState());
  }
}
