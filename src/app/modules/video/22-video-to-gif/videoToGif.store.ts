import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface VideoToGifState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  startTime: number;
  endTime: number;
  fps: number;
  width: number | 'auto';
  dither: 'none' | 'bayer' | 'floyd_steinberg';
  estimatedSizeKB: number;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: VideoToGifState = {
  inputFile: null, videoMeta: null,
  startTime: 0,
  endTime: 10,
  fps: 10,
  width: 480,
  dither: 'bayer',
  estimatedSizeKB: 0,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const VideoToGifActions = {
  loadFile: createAction('[VideoToGif] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[VideoToGif] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[VideoToGif] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[VideoToGif] Update Config', props<{ config: Partial<VideoToGifState> }>()),
  startProcessing: createAction('[VideoToGif] Start'),
  updateProgress: createAction('[VideoToGif] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[VideoToGif] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[VideoToGif] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[VideoToGif] Download'),
  resetState: createAction('[VideoToGif] Reset'),
};
export const videoToGifFeature = createFeature({
  name: 'videoToGif',
  reducer: createReducer(init,
    on(VideoToGifActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(VideoToGifActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(VideoToGifActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(VideoToGifActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(VideoToGifActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(VideoToGifActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(VideoToGifActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(VideoToGifActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(VideoToGifActions.resetState, () => init),
  )
});
export const { selectVideoToGifState, selectStatus, selectProgress, selectOutputBlob } = videoToGifFeature;
export const selectVideoToGifCanProcess = createSelector(selectVideoToGifState, s => !!s.inputFile && s.status === 'idle');
export const selectVideoToGifIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
