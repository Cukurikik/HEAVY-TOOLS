import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface CompareState {
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

const init: CompareState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const CompareActions = {
  loadFile: createAction('[Compare] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Compare] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[Compare] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[Compare] Start Processing'),
  updateProgress: createAction('[Compare] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Compare] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Compare] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[Compare] Reset State')
};

export const compareFeature = createFeature({
  name: 'comparePdf',
  reducer: createReducer(init,
    on(CompareActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(CompareActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(CompareActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(CompareActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(CompareActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(CompareActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(CompareActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(CompareActions.resetState, () => init)
  )
});

export const { selectComparePdfState, selectStatus, selectProgress, selectOutputBlob } = compareFeature;
export const selectCompareCanProcess = createSelector(selectComparePdfState, (s: CompareState) => !!s.inputFile && s.status === 'idle');
export const selectCompareIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
