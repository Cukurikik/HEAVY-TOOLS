import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface AnnotatorState {
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

const init: AnnotatorState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const AnnotatorActions = {
  loadFile: createAction('[Annotator] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Annotator] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[Annotator] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[Annotator] Start Processing'),
  updateProgress: createAction('[Annotator] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Annotator] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Annotator] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[Annotator] Reset State')
};

export const annotatorFeature = createFeature({
  name: 'annotatorPdf',
  reducer: createReducer(init,
    on(AnnotatorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(AnnotatorActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(AnnotatorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(AnnotatorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(AnnotatorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(AnnotatorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(AnnotatorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(AnnotatorActions.resetState, () => init)
  )
});

export const { selectAnnotatorPdfState, selectStatus, selectProgress, selectOutputBlob } = annotatorFeature;
export const selectAnnotatorCanProcess = createSelector(selectAnnotatorPdfState, (s: AnnotatorState) => !!s.inputFile && s.status === 'idle');
export const selectAnnotatorIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
