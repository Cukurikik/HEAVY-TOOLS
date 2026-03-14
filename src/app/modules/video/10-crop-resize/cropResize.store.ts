import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface CropResizeState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  mode: 'crop' | 'resize';
  cropRegion: { x: number; y: number; w: number; h: number };
  targetWidth: number;
  targetHeight: number;
  lockAspectRatio: boolean;
  padMode: 'stretch' | 'pad' | 'crop-to-fit';
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: CropResizeState = {
  inputFile: null, videoMeta: null,
  mode: 'resize',
  cropRegion: { x: 0, y: 0, w: 1920, h: 1080 },
  targetWidth: 1920,
  targetHeight: 1080,
  lockAspectRatio: true,
  padMode: 'pad',
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const CropResizeActions = {
  loadFile: createAction('[CropResize] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[CropResize] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[CropResize] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[CropResize] Update Config', props<{ config: Partial<CropResizeState> }>()),
  startProcessing: createAction('[CropResize] Start'),
  updateProgress: createAction('[CropResize] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[CropResize] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[CropResize] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[CropResize] Download'),
  resetState: createAction('[CropResize] Reset') };
export const cropResizeFeature = createFeature({
  name: 'cropResize',
  reducer: createReducer(init,
    on(CropResizeActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(CropResizeActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(CropResizeActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(CropResizeActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(CropResizeActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(CropResizeActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(CropResizeActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(CropResizeActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(CropResizeActions.resetState, () => init),
  )
});
export const { selectCropResizeState, selectStatus, selectProgress, selectOutputBlob } = cropResizeFeature;
export const selectCropResizeCanProcess = createSelector(selectCropResizeState, s => !!s.inputFile && s.status === 'idle');
export const selectCropResizeIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
