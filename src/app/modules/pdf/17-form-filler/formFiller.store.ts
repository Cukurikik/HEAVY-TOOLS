import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface FormFillerState {
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

const init: FormFillerState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const FormFillerActions = {
  loadFile: createAction('[FormFiller] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[FormFiller] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[FormFiller] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[FormFiller] Start Processing'),
  updateProgress: createAction('[FormFiller] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[FormFiller] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[FormFiller] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[FormFiller] Reset State')
};

export const formFillerFeature = createFeature({
  name: 'formFillerPdf',
  reducer: createReducer(init,
    on(FormFillerActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(FormFillerActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(FormFillerActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(FormFillerActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(FormFillerActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(FormFillerActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(FormFillerActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(FormFillerActions.resetState, () => init)
  )
});

export const { selectFormFillerPdfState, selectStatus, selectProgress, selectOutputBlob } = formFillerFeature;
export const selectFormFillerCanProcess = createSelector(selectFormFillerPdfState, (s: FormFillerState) => !!s.inputFile && s.status === 'idle');
export const selectFormFillerIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
