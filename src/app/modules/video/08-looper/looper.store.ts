import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface LooperState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  mode: 'count' | 'duration';
  loopCount: number;
  targetDuration: number;
  crossfade: boolean;
  crossfadeDuration: number;
  transitionMode: string;
  outputDuration: number;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: LooperState = {
  inputFile: null, videoMeta: null,
  mode: 'count',
  loopCount: 3,
  targetDuration: 60,
  crossfade: false,
  crossfadeDuration: 0.5,
  transitionMode: 'cut',
  outputDuration: 0,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const LooperActions = {
  loadFile: createAction('[Looper] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Looper] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Looper] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Looper] Update Config', props<{ config: Partial<LooperState> }>()),
  startProcessing: createAction('[Looper] Start'),
  updateProgress: createAction('[Looper] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Looper] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Looper] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Looper] Download'),
  resetState: createAction('[Looper] Reset') };
export const looperFeature = createFeature({
  name: 'looper',
  reducer: createReducer(init,
    on(LooperActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(LooperActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(LooperActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(LooperActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(LooperActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(LooperActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(LooperActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(LooperActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(LooperActions.resetState, () => init),
  )
});
export const { selectLooperState, selectStatus, selectProgress, selectOutputBlob } = looperFeature;
export const selectLooperCanProcess = createSelector(selectLooperState, s => !!s.inputFile && s.status === 'idle');
export const selectLooperIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
