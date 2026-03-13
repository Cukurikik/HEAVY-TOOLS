import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface SpeedControllerState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  speed: number;
  audioMode: 'keep' | 'mute' | 'pitchCorrect';
  originalDuration: number;
  newDuration: number;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: SpeedControllerState = {
  inputFile: null, videoMeta: null,
  speed: 1,
  audioMode: 'pitchCorrect',
  originalDuration: 0,
  newDuration: 0,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const SpeedControllerActions = {
  loadFile: createAction('[SpeedController] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[SpeedController] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[SpeedController] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[SpeedController] Update Config', props<{ config: Partial<SpeedControllerState> }>()),
  startProcessing: createAction('[SpeedController] Start'),
  updateProgress: createAction('[SpeedController] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[SpeedController] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[SpeedController] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[SpeedController] Download'),
  resetState: createAction('[SpeedController] Reset'),
};
export const speedControllerFeature = createFeature({
  name: 'speedController',
  reducer: createReducer(init,
    on(SpeedControllerActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(SpeedControllerActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(SpeedControllerActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(SpeedControllerActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(SpeedControllerActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(SpeedControllerActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(SpeedControllerActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(SpeedControllerActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(SpeedControllerActions.resetState, () => init),
  )
});
export const { selectSpeedControllerState, selectStatus, selectProgress, selectOutputBlob } = speedControllerFeature;
export const selectSpeedControllerCanProcess = createSelector(selectSpeedControllerState, s => !!s.inputFile && s.status === 'idle');
export const selectSpeedControllerIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
