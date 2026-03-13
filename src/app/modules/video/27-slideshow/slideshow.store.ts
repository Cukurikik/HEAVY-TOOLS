import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface SlideshowState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  images: { file: File; id: string; duration: number }[];
  defaultDuration: number;
  kenBurns: boolean;
  musicFile: File | null;
  transitionType: string;
  transitionDuration: number;
  outputResolution: '1080p' | '720p';
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: SlideshowState = {
  inputFile: null, videoMeta: null,
  images: [],
  defaultDuration: 3,
  kenBurns: false,
  musicFile: null,
  transitionType: 'fade',
  transitionDuration: 0.5,
  outputResolution: '1080p',
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const SlideshowActions = {
  loadFile: createAction('[Slideshow] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Slideshow] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Slideshow] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Slideshow] Update Config', props<{ config: Partial<SlideshowState> }>()),
  startProcessing: createAction('[Slideshow] Start'),
  updateProgress: createAction('[Slideshow] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Slideshow] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Slideshow] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Slideshow] Download'),
  resetState: createAction('[Slideshow] Reset'),
};
export const slideshowFeature = createFeature({
  name: 'slideshow',
  reducer: createReducer(init,
    on(SlideshowActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(SlideshowActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(SlideshowActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(SlideshowActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(SlideshowActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(SlideshowActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(SlideshowActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(SlideshowActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(SlideshowActions.resetState, () => init),
  )
});
export const { selectSlideshowState, selectStatus, selectProgress, selectOutputBlob } = slideshowFeature;
export const selectSlideshowCanProcess = createSelector(selectSlideshowState, s => !!s.inputFile && s.status === 'idle');
export const selectSlideshowIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
