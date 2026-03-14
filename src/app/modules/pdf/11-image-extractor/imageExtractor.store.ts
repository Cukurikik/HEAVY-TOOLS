import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface ImageExtractorState {
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

const init: ImageExtractorState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const ImageExtractorActions = {
  loadFile: createAction('[ImageExtractor] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[ImageExtractor] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[ImageExtractor] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[ImageExtractor] Start Processing'),
  updateProgress: createAction('[ImageExtractor] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[ImageExtractor] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[ImageExtractor] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[ImageExtractor] Reset State')
};

export const imageExtractorFeature = createFeature({
  name: 'imageExtractorPdf',
  reducer: createReducer(init,
    on(ImageExtractorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(ImageExtractorActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(ImageExtractorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ImageExtractorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(ImageExtractorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(ImageExtractorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(ImageExtractorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(ImageExtractorActions.resetState, () => init)
  )
});

export const { selectImageExtractorPdfState, selectStatus, selectProgress, selectOutputBlob } = imageExtractorFeature;
export const selectImageExtractorCanProcess = createSelector(selectImageExtractorPdfState, (s: ImageExtractorState) => !!s.inputFile && s.status === 'idle');
export const selectImageExtractorIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
