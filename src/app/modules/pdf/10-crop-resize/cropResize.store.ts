import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface CropResizeState {
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

const init: CropResizeState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const CropResizeActions = {
  loadFile: createAction('[CropResize] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[CropResize] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[CropResize] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[CropResize] Start Processing'),
  updateProgress: createAction('[CropResize] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[CropResize] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[CropResize] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[CropResize] Reset State')
};

export const cropResizeFeature = createFeature({
  name: 'cropResizePdf',
  reducer: createReducer(init,
    on(CropResizeActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(CropResizeActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(CropResizeActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(CropResizeActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(CropResizeActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(CropResizeActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(CropResizeActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(CropResizeActions.resetState, () => init)
  )
});

export const { selectCropResizePdfState, selectStatus, selectProgress, selectOutputBlob } = cropResizeFeature;
export const selectCropResizeCanProcess = createSelector(selectCropResizePdfState, (s: CropResizeState) => !!s.inputFile && s.status === 'idle');
export const selectCropResizeIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
