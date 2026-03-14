import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface DigitalSignerState {
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

const init: DigitalSignerState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const DigitalSignerActions = {
  loadFile: createAction('[DigitalSigner] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[DigitalSigner] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[DigitalSigner] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[DigitalSigner] Start Processing'),
  updateProgress: createAction('[DigitalSigner] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[DigitalSigner] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[DigitalSigner] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[DigitalSigner] Reset State')
};

export const digitalSignerFeature = createFeature({
  name: 'digitalSignerPdf',
  reducer: createReducer(init,
    on(DigitalSignerActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(DigitalSignerActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(DigitalSignerActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(DigitalSignerActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(DigitalSignerActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(DigitalSignerActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(DigitalSignerActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(DigitalSignerActions.resetState, () => init)
  )
});

export const { selectDigitalSignerPdfState, selectStatus, selectProgress, selectOutputBlob } = digitalSignerFeature;
export const selectDigitalSignerCanProcess = createSelector(selectDigitalSignerPdfState, (s: DigitalSignerState) => !!s.inputFile && s.status === 'idle');
export const selectDigitalSignerIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
