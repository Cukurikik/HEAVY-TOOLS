import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface InterpolatorState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  inputFPS: number;
  targetFPS: number;
  algorithm: 'duplicate' | 'motion';
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: InterpolatorState = {
  inputFile: null, videoMeta: null,
  inputFPS: 30,
  targetFPS: 60,
  algorithm: 'duplicate',
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const InterpolatorActions = {
  loadFile: createAction('[Interpolator] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Interpolator] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Interpolator] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Interpolator] Update Config', props<{ config: Partial<InterpolatorState> }>()),
  startProcessing: createAction('[Interpolator] Start'),
  updateProgress: createAction('[Interpolator] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Interpolator] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Interpolator] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Interpolator] Download'),
  resetState: createAction('[Interpolator] Reset') };
export const interpolatorFeature = createFeature({
  name: 'interpolator',
  reducer: createReducer(init,
    on(InterpolatorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(InterpolatorActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(InterpolatorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(InterpolatorActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(InterpolatorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(InterpolatorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(InterpolatorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(InterpolatorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(InterpolatorActions.resetState, () => init),
  )
});
export const { selectInterpolatorState, selectStatus, selectProgress, selectOutputBlob } = interpolatorFeature;
export const selectInterpolatorCanProcess = createSelector(selectInterpolatorState, s => !!s.inputFile && s.status === 'idle');
export const selectInterpolatorIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
