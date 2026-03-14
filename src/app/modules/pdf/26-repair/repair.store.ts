import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface RepairState {
  inputFile: File | null;
  pdfMeta: PdfMeta | null;
  status: ProcessingStatus;
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: PdfErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}

const init: RepairState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const RepairActions = {
  loadFile: createAction('[Repair] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Repair] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[Repair] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[Repair] Start Processing'),
  updateProgress: createAction('[Repair] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Repair] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Repair] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[Repair] Reset State')
};

export const repairFeature = createFeature({
  name: 'repairPdf',
  reducer: createReducer(init,
    on(RepairActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(RepairActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(RepairActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(RepairActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(RepairActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(RepairActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(RepairActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(RepairActions.resetState, () => init)
  )
});

export const { selectRepairPdfState, selectStatus, selectProgress, selectOutputBlob } = repairFeature;
export const selectRepairCanProcess = createSelector(selectRepairPdfState, (s: RepairState) => !!s.inputFile && s.status === 'idle');
export const selectRepairIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
