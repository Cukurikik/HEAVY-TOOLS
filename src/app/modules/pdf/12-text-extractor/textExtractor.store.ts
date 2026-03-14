import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface TextExtractorState {
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

const init: TextExtractorState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const TextExtractorActions = {
  loadFile: createAction('[TextExtractor] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[TextExtractor] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[TextExtractor] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[TextExtractor] Start Processing'),
  updateProgress: createAction('[TextExtractor] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[TextExtractor] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[TextExtractor] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[TextExtractor] Reset State')
};

export const textExtractorFeature = createFeature({
  name: 'textExtractorPdf',
  reducer: createReducer(init,
    on(TextExtractorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(TextExtractorActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(TextExtractorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(TextExtractorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(TextExtractorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(TextExtractorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(TextExtractorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(TextExtractorActions.resetState, () => init)
  )
});

export const { selectTextExtractorPdfState, selectStatus, selectProgress, selectOutputBlob } = textExtractorFeature;
export const selectTextExtractorCanProcess = createSelector(selectTextExtractorPdfState, (s: TextExtractorState) => !!s.inputFile && s.status === 'idle');
export const selectTextExtractorIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
