import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface RedactorState {
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

const init: RedactorState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const RedactorActions = {
  loadFile: createAction('[Redactor] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Redactor] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[Redactor] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[Redactor] Start Processing'),
  updateProgress: createAction('[Redactor] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Redactor] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Redactor] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[Redactor] Reset State')
};

export const redactorFeature = createFeature({
  name: 'redactorPdf',
  reducer: createReducer(init,
    on(RedactorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(RedactorActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(RedactorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(RedactorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(RedactorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(RedactorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(RedactorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(RedactorActions.resetState, () => init)
  )
});

export const { selectRedactorPdfState, selectStatus, selectProgress, selectOutputBlob } = redactorFeature;
export const selectRedactorCanProcess = createSelector(selectRedactorPdfState, (s: RedactorState) => !!s.inputFile && s.status === 'idle');
export const selectRedactorIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
