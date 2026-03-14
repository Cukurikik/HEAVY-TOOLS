import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface MergerState {
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

const init: MergerState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const MergerActions = {
  loadFile: createAction('[Merger] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Merger] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[Merger] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[Merger] Start Processing'),
  updateProgress: createAction('[Merger] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Merger] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Merger] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[Merger] Reset State')
};

export const mergerFeature = createFeature({
  name: 'mergerPdf',
  reducer: createReducer(init,
    on(MergerActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(MergerActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(MergerActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(MergerActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(MergerActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(MergerActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(MergerActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(MergerActions.resetState, () => init)
  )
});

export const { selectMergerPdfState, selectStatus, selectProgress, selectOutputBlob } = mergerFeature;
export const selectMergerCanProcess = createSelector(selectMergerPdfState, (s: MergerState) => !!s.inputFile && s.status === 'idle');
export const selectMergerIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
