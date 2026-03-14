import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface BlurState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  mode: 'full' | 'region' | 'background';
  strength: number;
  region: { x: number; y: number; w: number; h: number } | null;
  startTime: number | null;
  endTime: number | null;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: BlurState = {
  inputFile: null, videoMeta: null,
  mode: 'full',
  strength: 10,
  region: null,
  startTime: null,
  endTime: null,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const BlurActions = {
  loadFile: createAction('[Blur] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Blur] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Blur] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Blur] Update Config', props<{ config: Partial<BlurState> }>()),
  startProcessing: createAction('[Blur] Start'),
  updateProgress: createAction('[Blur] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Blur] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Blur] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Blur] Download'),
  resetState: createAction('[Blur] Reset') };
export const blurFeature = createFeature({
  name: 'blur',
  reducer: createReducer(init,
    on(BlurActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(BlurActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(BlurActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(BlurActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(BlurActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(BlurActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(BlurActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(BlurActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(BlurActions.resetState, () => init),
  )
});
export const { selectBlurState, selectStatus, selectProgress, selectOutputBlob } = blurFeature;
export const selectBlurCanProcess = createSelector(selectBlurState, s => !!s.inputFile && s.status === 'idle');
export const selectBlurIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
