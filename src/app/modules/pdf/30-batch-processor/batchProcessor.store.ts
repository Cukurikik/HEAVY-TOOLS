import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface BatchProcessorState {
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

const init: BatchProcessorState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const BatchProcessorActions = {
  loadFile: createAction('[BatchProcessor] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[BatchProcessor] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[BatchProcessor] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[BatchProcessor] Start Processing'),
  updateProgress: createAction('[BatchProcessor] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[BatchProcessor] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[BatchProcessor] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[BatchProcessor] Reset State')
};

export const batchProcessorFeature = createFeature({
  name: 'batchProcessorPdf',
  reducer: createReducer(init,
    on(BatchProcessorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(BatchProcessorActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(BatchProcessorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(BatchProcessorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(BatchProcessorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(BatchProcessorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(BatchProcessorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(BatchProcessorActions.resetState, () => init)
  )
});

export const { selectBatchProcessorPdfState, selectStatus, selectProgress, selectOutputBlob } = batchProcessorFeature;
export const selectBatchProcessorCanProcess = createSelector(selectBatchProcessorPdfState, (s: BatchProcessorState) => !!s.inputFile && s.status === 'idle');
export const selectBatchProcessorIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
