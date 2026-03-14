import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface ToPowerpointState {
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

const init: ToPowerpointState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const ToPowerpointActions = {
  loadFile: createAction('[ToPowerpoint] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[ToPowerpoint] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[ToPowerpoint] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[ToPowerpoint] Start Processing'),
  updateProgress: createAction('[ToPowerpoint] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[ToPowerpoint] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[ToPowerpoint] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[ToPowerpoint] Reset State')
};

export const toPowerpointFeature = createFeature({
  name: 'toPowerpointPdf',
  reducer: createReducer(init,
    on(ToPowerpointActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(ToPowerpointActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(ToPowerpointActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ToPowerpointActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(ToPowerpointActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(ToPowerpointActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(ToPowerpointActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(ToPowerpointActions.resetState, () => init)
  )
});

export const { selectToPowerpointPdfState, selectStatus, selectProgress, selectOutputBlob } = toPowerpointFeature;
export const selectToPowerpointCanProcess = createSelector(selectToPowerpointPdfState, (s: ToPowerpointState) => !!s.inputFile && s.status === 'idle');
export const selectToPowerpointIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
