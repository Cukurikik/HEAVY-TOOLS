import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface ToWordState {
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

const init: ToWordState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const ToWordActions = {
  loadFile: createAction('[ToWord] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[ToWord] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[ToWord] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[ToWord] Start Processing'),
  updateProgress: createAction('[ToWord] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[ToWord] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[ToWord] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[ToWord] Reset State')
};

export const toWordFeature = createFeature({
  name: 'toWordPdf',
  reducer: createReducer(init,
    on(ToWordActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(ToWordActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(ToWordActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ToWordActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(ToWordActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(ToWordActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(ToWordActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(ToWordActions.resetState, () => init)
  )
});

export const { selectToWordPdfState, selectStatus, selectProgress, selectOutputBlob } = toWordFeature;
export const selectToWordCanProcess = createSelector(selectToWordPdfState, (s: ToWordState) => !!s.inputFile && s.status === 'idle');
export const selectToWordIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
