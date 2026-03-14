import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface PipState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  mainFile: File | null;
  overlayFile: File | null;
  pipWidth: number;
  position: 'TL' | 'TR' | 'BL' | 'BR';
  startTime: number | null;
  endTime: number | null;
  borderRadius: number;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: PipState = {
  inputFile: null, videoMeta: null,
  mainFile: null,
  overlayFile: null,
  pipWidth: 25,
  position: 'TR',
  startTime: null,
  endTime: null,
  borderRadius: 8,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const PipActions = {
  loadFile: createAction('[Pip] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Pip] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Pip] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Pip] Update Config', props<{ config: Partial<PipState> }>()),
  startProcessing: createAction('[Pip] Start'),
  updateProgress: createAction('[Pip] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Pip] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Pip] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Pip] Download'),
  resetState: createAction('[Pip] Reset'),
};
export const pipFeature = createFeature({
  name: 'pip',
  reducer: createReducer(init,
    on(PipActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(PipActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(PipActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(PipActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(PipActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(PipActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(PipActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(PipActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(PipActions.resetState, () => init),
  )
});
export const { selectPipState, selectStatus, selectProgress, selectOutputBlob } = pipFeature;
export const selectPipCanProcess = createSelector(selectPipState, s => !!s.inputFile && s.status === 'idle');
export const selectPipIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
