import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface WatermarkState {
  inputFile: File | null;
  watermarkFile: File | null;
  videoMeta: VideoMeta | null;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
}

const init: WatermarkState = {
  inputFile: null,
  watermarkFile: null,
  videoMeta: null,
  position: 'bottom-right',
  opacity: 0.8,
  status: 'idle',
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null
};

export const WatermarkActions = {
  loadFile: createAction('[Watermark] Load File', props<{ file: File }>()),
  loadWatermark: createAction('[Watermark] Load Watermark', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Watermark] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Watermark] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateSettings: createAction('[Watermark] Update Settings', props<{ position?: WatermarkState['position']; opacity?: number }>()),
  startProcessing: createAction('[Watermark] Start'),
  updateProgress: createAction('[Watermark] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Watermark] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Watermark] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  resetState: createAction('[Watermark] Reset'),
};

export const watermarkFeature = createFeature({
  name: 'watermark',
  reducer: createReducer(init,
    on(WatermarkActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(WatermarkActions.loadWatermark, (s, a) => ({ ...s, watermarkFile: a.file })),
    on(WatermarkActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(WatermarkActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(WatermarkActions.updateSettings, (s, a) => ({ ...s, position: a.position ?? s.position, opacity: a.opacity ?? s.opacity })),
    on(WatermarkActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(WatermarkActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(WatermarkActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(WatermarkActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(WatermarkActions.resetState, () => init),
  )
});

export const { selectWatermarkState, selectStatus, selectProgress, selectOutputBlob } = watermarkFeature;
