import { take } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { 
    PdfDropZoneComponent, 
    PdfPreviewComponent, 
    ProgressRingComponent, 
    ExportPanelComponent,
    PdfLibService,
    WorkerBridgeService
} from '../shared';
import { FormFillerActions, selectFormFillerPdfState, selectFormFillerIsLoading, selectFormFillerCanProcess } from './formFiller.store';

@Component({
  selector: 'app-pdf-for-iller',
  standalone: true,
  imports: [CommonModule, PdfDropZoneComponent, PdfPreviewComponent, ProgressRingComponent, ExportPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400 drop-shadow-lg">
          📄 Form Filler
        </h1>
        <p class="text-white/50 text-sm">Fill interactive PDF forms.</p>
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
                    [disabled]="(canProcess$ | async) === false || (isLoading$ | async)"
                    (click)="onProcess()"
                    class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    @if (isLoading$ | async) {
                      <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    } @else { 📄 Execute }
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
                  defaultFilename="omni_formFiller.pdf" 
                />
            }
         </div>
      </div>
    </div>
  `
})
export class FormFillerComponent implements OnDestroy {
  store = inject(Store);
  pdfLib = inject(PdfLibService);
  bridge = inject(WorkerBridgeService);
  
  state$ = this.store.select(selectFormFillerPdfState);
  isLoading$ = this.store.select(selectFormFillerIsLoading);
  canProcess$ = this.store.select(selectFormFillerCanProcess);
  
  async onFileSelected(files: File[]) {
     const file = files[0];
     this.store.dispatch(FormFillerActions.loadFile({ file }));
     try {
       const meta = await this.pdfLib.getMetadata(file);
       this.store.dispatch(FormFillerActions.loadMetaSuccess({ meta }));
     } catch {
       this.store.dispatch(FormFillerActions.loadMetaFailure({ errorCode: 'FILE_CORRUPTED', message: 'Could not read PDF structure.' }));
     }
  }
  
  onProcess() {
     this.store.dispatch(FormFillerActions.startProcessing());
     this.state$.pipe(take(1)).subscribe(state => {
        if (!state.inputFile) return;
        this.bridge.process<unknown, Blob>(
          () => new Worker(new URL('./formFiller.worker', import.meta.url), { type: 'module' }),
          { file: state.inputFile }
        ).subscribe({
           next: (msg) => {
              if (msg.type === 'progress') this.store.dispatch(FormFillerActions.updateProgress({ progress: msg.value ?? 0 }));
              if (msg.type === 'complete' && msg.data) {
                 this.store.dispatch(FormFillerActions.processingSuccess({ outputBlob: msg.data, outputSizeMB: msg.data.size / 1048576 }));
              }
              if (msg.type === 'error') {
                 this.store.dispatch(FormFillerActions.processingFailure({ errorCode: msg.errorCode ?? 'UNKNOWN_ERROR', message: msg.message ?? 'Failed', retryable: true }));
              }
           }
        });
     });
  }
  
  ngOnDestroy() {
     this.store.dispatch(FormFillerActions.resetState());
  }
}
