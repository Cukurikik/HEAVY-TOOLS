import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface ConverterState {
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

const init: ConverterState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const ConverterActions = {
  loadFile: createAction('[Converter] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Converter] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[Converter] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[Converter] Start Processing'),
  updateProgress: createAction('[Converter] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Converter] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Converter] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[Converter] Reset State')
};

export const converterFeature = createFeature({
  name: 'converterPdf',
  reducer: createReducer(init,
    on(ConverterActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(ConverterActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(ConverterActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ConverterActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(ConverterActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(ConverterActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(ConverterActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(ConverterActions.resetState, () => init)
  )
});

export const { selectConverterPdfState, selectStatus, selectProgress, selectOutputBlob } = converterFeature;
export const selectConverterCanProcess = createSelector(selectConverterPdfState, (s: ConverterState) => !!s.inputFile && s.status === 'idle');
export const selectConverterIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
