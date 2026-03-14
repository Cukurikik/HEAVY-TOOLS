import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface BatchState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  files: { id: string; file: File; status: string; progress: number; outputBlob: Blob | null; error: string | null }[];
  operation: 'compress' | 'convert' | 'trim' | 'resize';
  operationConfig: Record<string, unknown>;
  isRunning: boolean;
  currentIndex: number;
  completedCount: number;
  failedCount: number;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: BatchState = {
  inputFile: null, videoMeta: null,
  files: [],
  operation: 'compress',
  operationConfig: {},
  isRunning: false,
  currentIndex: 0,
  completedCount: 0,
  failedCount: 0,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const BatchActions = {
  loadFile: createAction('[Batch] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Batch] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Batch] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Batch] Update Config', props<{ config: Partial<BatchState> }>()),
  startProcessing: createAction('[Batch] Start'),
  updateProgress: createAction('[Batch] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Batch] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Batch] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Batch] Download'),
  resetState: createAction('[Batch] Reset'),
};
export const batchFeature = createFeature({
  name: 'batch',
  reducer: createReducer(init,
    on(BatchActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(BatchActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(BatchActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(BatchActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(BatchActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(BatchActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(BatchActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(BatchActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(BatchActions.resetState, () => init),
  )
});
export const { selectBatchState, selectStatus, selectProgress, selectOutputBlob } = batchFeature;
export const selectBatchCanProcess = createSelector(selectBatchState, s => !!s.inputFile && s.status === 'idle');
export const selectBatchIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
