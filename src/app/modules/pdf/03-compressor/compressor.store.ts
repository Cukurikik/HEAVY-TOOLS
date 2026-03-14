import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface CompressorState {
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

const init: CompressorState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const CompressorActions = {
  loadFile: createAction('[Compressor] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Compressor] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[Compressor] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[Compressor] Start Processing'),
  updateProgress: createAction('[Compressor] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Compressor] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Compressor] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[Compressor] Reset State')
};

export const compressorFeature = createFeature({
  name: 'compressorPdf',
  reducer: createReducer(init,
    on(CompressorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(CompressorActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(CompressorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(CompressorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(CompressorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(CompressorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(CompressorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(CompressorActions.resetState, () => init)
  )
});

export const { selectCompressorPdfState, selectStatus, selectProgress, selectOutputBlob } = compressorFeature;
export const selectCompressorCanProcess = createSelector(selectCompressorPdfState, (s: CompressorState) => !!s.inputFile && s.status === 'idle');
export const selectCompressorIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
