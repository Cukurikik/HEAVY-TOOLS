import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface ThumbnailGeneratorState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  mode: 'single' | 'grid' | 'interval';
  timestamp: number;
  gridCols: number;
  gridRows: number;
  intervalSeconds: number;
  imageFormat: 'jpg' | 'png' | 'webp';
  jpgQuality: number;
  outputBlobs: Blob[];
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: ThumbnailGeneratorState = {
  inputFile: null, videoMeta: null,
  mode: 'single',
  timestamp: 0,
  gridCols: 3,
  gridRows: 3,
  intervalSeconds: 5,
  imageFormat: 'jpg',
  jpgQuality: 85,
  outputBlobs: [],
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const ThumbnailGeneratorActions = {
  loadFile: createAction('[ThumbnailGenerator] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[ThumbnailGenerator] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[ThumbnailGenerator] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[ThumbnailGenerator] Update Config', props<{ config: Partial<ThumbnailGeneratorState> }>()),
  startProcessing: createAction('[ThumbnailGenerator] Start'),
  updateProgress: createAction('[ThumbnailGenerator] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[ThumbnailGenerator] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[ThumbnailGenerator] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[ThumbnailGenerator] Download'),
  resetState: createAction('[ThumbnailGenerator] Reset') };
export const thumbnailGeneratorFeature = createFeature({
  name: 'thumbnailGenerator',
  reducer: createReducer(init,
    on(ThumbnailGeneratorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(ThumbnailGeneratorActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(ThumbnailGeneratorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ThumbnailGeneratorActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(ThumbnailGeneratorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(ThumbnailGeneratorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(ThumbnailGeneratorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(ThumbnailGeneratorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(ThumbnailGeneratorActions.resetState, () => init),
  )
});
export const { selectThumbnailGeneratorState, selectStatus, selectProgress, selectOutputBlob } = thumbnailGeneratorFeature;
export const selectThumbnailGeneratorCanProcess = createSelector(selectThumbnailGeneratorState, s => !!s.inputFile && s.status === 'idle');
export const selectThumbnailGeneratorIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
