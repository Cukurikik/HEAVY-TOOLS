import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface ToHtmlState {
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

const init: ToHtmlState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const ToHtmlActions = {
  loadFile: createAction('[ToHtml] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[ToHtml] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[ToHtml] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[ToHtml] Start Processing'),
  updateProgress: createAction('[ToHtml] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[ToHtml] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[ToHtml] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[ToHtml] Reset State')
};

export const toHtmlFeature = createFeature({
  name: 'toHtmlPdf',
  reducer: createReducer(init,
    on(ToHtmlActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(ToHtmlActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(ToHtmlActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ToHtmlActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(ToHtmlActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(ToHtmlActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(ToHtmlActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(ToHtmlActions.resetState, () => init)
  )
});

export const { selectToHtmlPdfState, selectStatus, selectProgress, selectOutputBlob } = toHtmlFeature;
export const selectToHtmlCanProcess = createSelector(selectToHtmlPdfState, (s: ToHtmlState) => !!s.inputFile && s.status === 'idle');
export const selectToHtmlIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
