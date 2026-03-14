import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { PdfMeta, PdfErrorCode, ProcessingStatus } from '../shared';

export interface FlattenerState {
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

const init: FlattenerState = {
  inputFile: null, pdfMeta: null, status: 'idle', progress: 0,
  outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null, retryable: false
};

export const FlattenerActions = {
  loadFile: createAction('[Flattener] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Flattener] Meta Success', props<{ meta: PdfMeta }>()),
  loadMetaFailure: createAction('[Flattener] Meta Failure', props<{ errorCode: PdfErrorCode; message: string }>()),
  startProcessing: createAction('[Flattener] Start Processing'),
  updateProgress: createAction('[Flattener] Update Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Flattener] Processing Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Flattener] Processing Failure', props<{ errorCode: PdfErrorCode; message: string; retryable: boolean }>()),
  resetState: createAction('[Flattener] Reset State')
};

export const flattenerFeature = createFeature({
  name: 'flattenerPdf',
  reducer: createReducer(init,
    on(FlattenerActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(FlattenerActions.loadMetaSuccess, (s, a) => ({ ...s, pdfMeta: a.meta, status: 'idle' as const })),
    on(FlattenerActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(FlattenerActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0 })),
    on(FlattenerActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(FlattenerActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(FlattenerActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })),
    on(FlattenerActions.resetState, () => init)
  )
});

export const { selectFlattenerPdfState, selectStatus, selectProgress, selectOutputBlob } = flattenerFeature;
export const selectFlattenerCanProcess = createSelector(selectFlattenerPdfState, (s: FlattenerState) => !!s.inputFile && s.status === 'idle');
export const selectFlattenerIsLoading = createSelector(selectStatus, (s: string) => s === 'loading' || s === 'processing' || s === 'rendering');
