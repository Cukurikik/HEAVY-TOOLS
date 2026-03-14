import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface ThumbnailGeneratorState {
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

const init: ThumbnailGeneratorState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const ThumbnailGeneratorActions = {
  loadFile: createAction('[ThumbnailGenerator] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[ThumbnailGenerator] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[ThumbnailGenerator] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[ThumbnailGenerator] Start Processing'),
  updateProgress: createAction('[ThumbnailGenerator] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[ThumbnailGenerator] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[ThumbnailGenerator] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[ThumbnailGenerator] Reset State')
};

export const thumbnailGeneratorFeature = createFeature({
  name: 'thumbnailGeneratorPdf',
  reducer: createReducer(init,
    on(ThumbnailGeneratorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(ThumbnailGeneratorActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(ThumbnailGeneratorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ThumbnailGeneratorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(ThumbnailGeneratorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(ThumbnailGeneratorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(ThumbnailGeneratorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(ThumbnailGeneratorActions.resetState, () => init)
  )
});

export const { selectThumbnailGeneratorPdfState, selectStatus, selectProgress, selectOutputBlob } = thumbnailGeneratorFeature;
export const selectThumbnailGeneratorCanProcess = createSelector(selectThumbnailGeneratorPdfState, (s: ThumbnailGeneratorState) => !!s.inputFile && s.status === 'idle');
export const selectThumbnailGeneratorIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
