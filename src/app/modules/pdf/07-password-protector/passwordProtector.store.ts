import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface PasswordProtectorState {
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

const init: PasswordProtectorState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const PasswordProtectorActions = {
  loadFile: createAction('[PasswordProtector] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[PasswordProtector] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[PasswordProtector] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[PasswordProtector] Start Processing'),
  updateProgress: createAction('[PasswordProtector] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[PasswordProtector] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[PasswordProtector] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[PasswordProtector] Reset State')
};

export const passwordProtectorFeature = createFeature({
  name: 'passwordProtectorPdf',
  reducer: createReducer(init,
    on(PasswordProtectorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(PasswordProtectorActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(PasswordProtectorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(PasswordProtectorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(PasswordProtectorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(PasswordProtectorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(PasswordProtectorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(PasswordProtectorActions.resetState, () => init)
  )
});

export const { selectPasswordProtectorPdfState, selectStatus, selectProgress, selectOutputBlob } = passwordProtectorFeature;
export const selectPasswordProtectorCanProcess = createSelector(selectPasswordProtectorPdfState, (s: PasswordProtectorState) => !!s.inputFile && s.status === 'idle');
export const selectPasswordProtectorIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
