import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface ToExcelState {
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

const init: ToExcelState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const ToExcelActions = {
  loadFile: createAction('[ToExcel] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[ToExcel] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[ToExcel] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[ToExcel] Start Processing'),
  updateProgress: createAction('[ToExcel] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[ToExcel] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[ToExcel] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[ToExcel] Reset State')
};

export const toExcelFeature = createFeature({
  name: 'toExcelPdf',
  reducer: createReducer(init,
    on(ToExcelActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(ToExcelActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(ToExcelActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ToExcelActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(ToExcelActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(ToExcelActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(ToExcelActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(ToExcelActions.resetState, () => init)
  )
});

export const { selectToExcelPdfState, selectStatus, selectProgress, selectOutputBlob } = toExcelFeature;
export const selectToExcelCanProcess = createSelector(selectToExcelPdfState, (s: ToExcelState) => !!s.inputFile && s.status === 'idle');
export const selectToExcelIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
