import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface OcrState {
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

const init: OcrState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const OcrActions = {
  loadFile: createAction('[Ocr] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Ocr] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[Ocr] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[Ocr] Start Processing'),
  updateProgress: createAction('[Ocr] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Ocr] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Ocr] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[Ocr] Reset State')
};

export const ocrFeature = createFeature({
  name: 'ocrPdf',
  reducer: createReducer(init,
    on(OcrActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(OcrActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(OcrActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(OcrActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(OcrActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(OcrActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(OcrActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(OcrActions.resetState, () => init)
  )
});

export const { selectOcrPdfState, selectStatus, selectProgress, selectOutputBlob } = ocrFeature;
export const selectOcrCanProcess = createSelector(selectOcrPdfState, (s: OcrState) => !!s.inputFile && s.status === 'idle');
export const selectOcrIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
