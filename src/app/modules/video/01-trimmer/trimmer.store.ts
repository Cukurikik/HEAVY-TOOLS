import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface TrimmerState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  startTime: number;
  endTime: number;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
}

const init: TrimmerState = {
  inputFile: null,
  videoMeta: null,
  startTime: 0,
  endTime: 0,
  status: 'idle',
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null
};

export const TrimmerActions = {
  loadFile: createAction('[Trimmer] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Trimmer] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Trimmer] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateRange: createAction('[Trimmer] Update Range', props<{ start: number; end: number }>()),
  startProcessing: createAction('[Trimmer] Start'),
  updateProgress: createAction('[Trimmer] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Trimmer] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Trimmer] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  resetState: createAction('[Trimmer] Reset'),
};

export const trimmerFeature = createFeature({
  name: 'trimmer',
  reducer: createReducer(init,
    on(TrimmerActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(TrimmerActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const, endTime: a.meta.duration })),
    on(TrimmerActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(TrimmerActions.updateRange, (s, a) => ({ ...s, startTime: a.start, endTime: a.end })),
    on(TrimmerActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(TrimmerActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(TrimmerActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(TrimmerActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(TrimmerActions.resetState, () => init),
  )
});

export const { selectTrimmerState, selectStatus, selectProgress, selectOutputBlob } = trimmerFeature;
