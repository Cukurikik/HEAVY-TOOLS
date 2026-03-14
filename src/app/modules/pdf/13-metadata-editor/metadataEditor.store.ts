import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface MetadataEditorState {
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

const init: MetadataEditorState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const MetadataEditorActions = {
  loadFile: createAction('[MetadataEditor] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[MetadataEditor] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[MetadataEditor] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[MetadataEditor] Start Processing'),
  updateProgress: createAction('[MetadataEditor] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[MetadataEditor] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[MetadataEditor] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[MetadataEditor] Reset State')
};

export const metadataEditorFeature = createFeature({
  name: 'metadataEditorPdf',
  reducer: createReducer(init,
    on(MetadataEditorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(MetadataEditorActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(MetadataEditorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(MetadataEditorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(MetadataEditorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(MetadataEditorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(MetadataEditorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(MetadataEditorActions.resetState, () => init)
  )
});

export const { selectMetadataEditorPdfState, selectStatus, selectProgress, selectOutputBlob } = metadataEditorFeature;
export const selectMetadataEditorCanProcess = createSelector(selectMetadataEditorPdfState, (s: MetadataEditorState) => !!s.inputFile && s.status === 'idle');
export const selectMetadataEditorIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
