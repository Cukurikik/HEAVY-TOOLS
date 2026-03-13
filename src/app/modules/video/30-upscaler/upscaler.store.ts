import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface UpscalerState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  scaleFactor: 2 | 4;
  model: 'realesrgan' | 'esrgan' | 'swinir';
  webGpuAvailable: boolean;
  totalFrames: number;
  processedFrames: number;
  currentFrameIndex: number;
  modelLoaded: boolean;
  memoryWarning: boolean;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: UpscalerState = {
  inputFile: null, videoMeta: null,
  scaleFactor: 2,
  model: 'realesrgan',
  webGpuAvailable: false,
  totalFrames: 0,
  processedFrames: 0,
  currentFrameIndex: 0,
  modelLoaded: false,
  memoryWarning: false,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const UpscalerActions = {
  loadFile: createAction('[Upscaler] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Upscaler] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Upscaler] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Upscaler] Update Config', props<{ config: Partial<UpscalerState> }>()),
  startProcessing: createAction('[Upscaler] Start'),
  updateProgress: createAction('[Upscaler] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Upscaler] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Upscaler] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Upscaler] Download'),
  resetState: createAction('[Upscaler] Reset'),
};
export const upscalerFeature = createFeature({
  name: 'upscaler',
  reducer: createReducer(init,
    on(UpscalerActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(UpscalerActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(UpscalerActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(UpscalerActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(UpscalerActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(UpscalerActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(UpscalerActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(UpscalerActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(UpscalerActions.resetState, () => init),
  )
});
export const { selectUpscalerState, selectStatus, selectProgress, selectOutputBlob } = upscalerFeature;
export const selectUpscalerCanProcess = createSelector(selectUpscalerState, s => !!s.inputFile && s.status === 'idle');
export const selectUpscalerIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
