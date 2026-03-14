import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface BookmarkEditorState {
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

const init: BookmarkEditorState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const BookmarkEditorActions = {
  loadFile: createAction('[BookmarkEditor] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[BookmarkEditor] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[BookmarkEditor] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[BookmarkEditor] Start Processing'),
  updateProgress: createAction('[BookmarkEditor] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[BookmarkEditor] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[BookmarkEditor] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[BookmarkEditor] Reset State')
};

export const bookmarkEditorFeature = createFeature({
  name: 'bookmarkEditorPdf',
  reducer: createReducer(init,
    on(BookmarkEditorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(BookmarkEditorActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(BookmarkEditorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(BookmarkEditorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(BookmarkEditorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(BookmarkEditorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(BookmarkEditorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(BookmarkEditorActions.resetState, () => init)
  )
});

export const { selectBookmarkEditorPdfState, selectStatus, selectProgress, selectOutputBlob } = bookmarkEditorFeature;
export const selectBookmarkEditorCanProcess = createSelector(selectBookmarkEditorPdfState, (s: BookmarkEditorState) => !!s.inputFile && s.status === 'idle');
export const selectBookmarkEditorIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
