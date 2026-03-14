import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface FlipRotateState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  flipH: boolean;
  flipV: boolean;
  rotation: number;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: FlipRotateState = {
  inputFile: null, videoMeta: null,
  flipH: false,
  flipV: false,
  rotation: 0,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const FlipRotateActions = {
  loadFile: createAction('[FlipRotate] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[FlipRotate] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[FlipRotate] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[FlipRotate] Update Config', props<{ config: Partial<FlipRotateState> }>()),
  startProcessing: createAction('[FlipRotate] Start'),
  updateProgress: createAction('[FlipRotate] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[FlipRotate] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[FlipRotate] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[FlipRotate] Download'),
  resetState: createAction('[FlipRotate] Reset') };
export const flipRotateFeature = createFeature({
  name: 'flipRotate',
  reducer: createReducer(init,
    on(FlipRotateActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(FlipRotateActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(FlipRotateActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(FlipRotateActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(FlipRotateActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(FlipRotateActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(FlipRotateActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(FlipRotateActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(FlipRotateActions.resetState, () => init),
  )
});
export const { selectFlipRotateState, selectStatus, selectProgress, selectOutputBlob } = flipRotateFeature;
export const selectFlipRotateCanProcess = createSelector(selectFlipRotateState, s => !!s.inputFile && s.status === 'idle');
export const selectFlipRotateIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
