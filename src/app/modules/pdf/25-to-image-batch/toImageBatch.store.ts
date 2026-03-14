import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface ToImageBatchState {
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

const init: ToImageBatchState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const ToImageBatchActions = {
  loadFile: createAction('[ToImageBatch] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[ToImageBatch] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[ToImageBatch] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[ToImageBatch] Start Processing'),
  updateProgress: createAction('[ToImageBatch] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[ToImageBatch] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[ToImageBatch] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[ToImageBatch] Reset State')
};

export const toImageBatchFeature = createFeature({
  name: 'toImageBatchPdf',
  reducer: createReducer(init,
    on(ToImageBatchActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(ToImageBatchActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(ToImageBatchActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ToImageBatchActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(ToImageBatchActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(ToImageBatchActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(ToImageBatchActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(ToImageBatchActions.resetState, () => init)
  )
});

export const { selectToImageBatchPdfState, selectStatus, selectProgress, selectOutputBlob } = toImageBatchFeature;
export const selectToImageBatchCanProcess = createSelector(selectToImageBatchPdfState, (s: ToImageBatchState) => !!s.inputFile && s.status === 'idle');
export const selectToImageBatchIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
