import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface WatermarkState {
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

const init: WatermarkState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const WatermarkActions = {
  loadFile: createAction('[Watermark] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Watermark] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[Watermark] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[Watermark] Start Processing'),
  updateProgress: createAction('[Watermark] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Watermark] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Watermark] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[Watermark] Reset State')
};

export const watermarkFeature = createFeature({
  name: 'watermarkPdf',
  reducer: createReducer(init,
    on(WatermarkActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(WatermarkActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(WatermarkActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(WatermarkActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(WatermarkActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(WatermarkActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(WatermarkActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(WatermarkActions.resetState, () => init)
  )
});

export const { selectWatermarkPdfState, selectStatus, selectProgress, selectOutputBlob } = watermarkFeature;
export const selectWatermarkCanProcess = createSelector(selectWatermarkPdfState, (s: WatermarkState) => !!s.inputFile && s.status === 'idle');
export const selectWatermarkIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
