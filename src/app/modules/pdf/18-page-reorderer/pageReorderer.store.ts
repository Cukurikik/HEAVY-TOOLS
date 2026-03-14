import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface PageReordererState {
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

const init: PageReordererState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const PageReordererActions = {
  loadFile: createAction('[PageReorderer] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[PageReorderer] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[PageReorderer] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[PageReorderer] Start Processing'),
  updateProgress: createAction('[PageReorderer] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[PageReorderer] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[PageReorderer] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[PageReorderer] Reset State')
};

export const pageReordererFeature = createFeature({
  name: 'pageReordererPdf',
  reducer: createReducer(init,
    on(PageReordererActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(PageReordererActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(PageReordererActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(PageReordererActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(PageReordererActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(PageReordererActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(PageReordererActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(PageReordererActions.resetState, () => init)
  )
});

export const { selectPageReordererPdfState, selectStatus, selectProgress, selectOutputBlob } = pageReordererFeature;
export const selectPageReordererCanProcess = createSelector(selectPageReordererPdfState, (s: PageReordererState) => !!s.inputFile && s.status === 'idle');
export const selectPageReordererIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
