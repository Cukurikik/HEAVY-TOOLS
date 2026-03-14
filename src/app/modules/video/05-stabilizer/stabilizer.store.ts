import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface StabilizerState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  smoothing: number; // 1-50
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
}

const init: StabilizerState = {
  inputFile: null,
  videoMeta: null,
  smoothing: 10,
  status: 'idle',
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null
};

export const StabilizerActions = {
  loadFile: createAction('[Stabilizer] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Stabilizer] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Stabilizer] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateSmoothing: createAction('[Stabilizer] Update Smoothing', props<{ smoothing: number }>()),
  startProcessing: createAction('[Stabilizer] Start'),
  updateProgress: createAction('[Stabilizer] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Stabilizer] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Stabilizer] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  resetState: createAction('[Stabilizer] Reset'),
};

export const stabilizerFeature = createFeature({
  name: 'stabilizer',
  reducer: createReducer(init,
    on(StabilizerActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(StabilizerActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(StabilizerActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(StabilizerActions.updateSmoothing, (s, a) => ({ ...s, smoothing: a.smoothing })),
    on(StabilizerActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(StabilizerActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(StabilizerActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(StabilizerActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(StabilizerActions.resetState, () => init),
  )
});

export const { selectStabilizerState, selectStatus, selectProgress, selectOutputBlob } = stabilizerFeature;
