import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface OptimizerState {
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

const init: OptimizerState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const OptimizerActions = {
  loadFile: createAction('[Optimizer] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Optimizer] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[Optimizer] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[Optimizer] Start Processing'),
  updateProgress: createAction('[Optimizer] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Optimizer] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Optimizer] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[Optimizer] Reset State')
};

export const optimizerFeature = createFeature({
  name: 'optimizerPdf',
  reducer: createReducer(init,
    on(OptimizerActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(OptimizerActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(OptimizerActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(OptimizerActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(OptimizerActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(OptimizerActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(OptimizerActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(OptimizerActions.resetState, () => init)
  )
});

export const { selectOptimizerPdfState, selectStatus, selectProgress, selectOutputBlob } = optimizerFeature;
export const selectOptimizerCanProcess = createSelector(selectOptimizerPdfState, (s: OptimizerState) => !!s.inputFile && s.status === 'idle');
export const selectOptimizerIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
