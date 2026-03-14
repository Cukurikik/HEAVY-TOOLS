import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface SplitterState {
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

const init: SplitterState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const SplitterActions = {
  loadFile: createAction('[Splitter] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Splitter] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[Splitter] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[Splitter] Start Processing'),
  updateProgress: createAction('[Splitter] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Splitter] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Splitter] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[Splitter] Reset State')
};

export const splitterFeature = createFeature({
  name: 'splitterPdf',
  reducer: createReducer(init,
    on(SplitterActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(SplitterActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(SplitterActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(SplitterActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(SplitterActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(SplitterActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(SplitterActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(SplitterActions.resetState, () => init)
  )
});

export const { selectSplitterPdfState, selectStatus, selectProgress, selectOutputBlob } = splitterFeature;
export const selectSplitterCanProcess = createSelector(selectSplitterPdfState, (s: SplitterState) => !!s.inputFile && s.status === 'idle');
export const selectSplitterIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
