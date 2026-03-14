import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface RotatorState {
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

const init: RotatorState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const RotatorActions = {
  loadFile: createAction('[Rotator] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Rotator] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[Rotator] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[Rotator] Start Processing'),
  updateProgress: createAction('[Rotator] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Rotator] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Rotator] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[Rotator] Reset State')
};

export const rotatorFeature = createFeature({
  name: 'rotatorPdf',
  reducer: createReducer(init,
    on(RotatorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(RotatorActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(RotatorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(RotatorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(RotatorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(RotatorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(RotatorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(RotatorActions.resetState, () => init)
  )
});

export const { selectRotatorPdfState, selectStatus, selectProgress, selectOutputBlob } = rotatorFeature;
export const selectRotatorCanProcess = createSelector(selectRotatorPdfState, (s: RotatorState) => !!s.inputFile && s.status === 'idle');
export const selectRotatorIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
