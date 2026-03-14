import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface LooperState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  loopCount: number; // 1-10
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
}

const init: LooperState = {
  inputFile: null,
  videoMeta: null,
  loopCount: 2,
  status: 'idle',
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null
};

export const LooperActions = {
  loadFile: createAction('[Looper] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Looper] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Looper] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateLoopCount: createAction('[Looper] Update Loop Count', props<{ count: number }>()),
  startProcessing: createAction('[Looper] Start'),
  updateProgress: createAction('[Looper] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Looper] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Looper] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  resetState: createAction('[Looper] Reset'),
};

export const looperFeature = createFeature({
  name: 'looper',
  reducer: createReducer(init,
    on(LooperActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(LooperActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(LooperActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(LooperActions.updateLoopCount, (s, a) => ({ ...s, loopCount: a.count })),
    on(LooperActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(LooperActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(LooperActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(LooperActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(LooperActions.resetState, () => init),
  )
});

export const { selectLooperState, selectStatus, selectProgress, selectOutputBlob } = looperFeature;
