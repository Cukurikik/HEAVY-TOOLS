import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface MuterState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
}

const init: MuterState = {
  inputFile: null,
  videoMeta: null,
  status: 'idle',
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null
};

export const MuterActions = {
  loadFile: createAction('[Muter] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Muter] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Muter] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  startProcessing: createAction('[Muter] Start'),
  updateProgress: createAction('[Muter] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Muter] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Muter] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  resetState: createAction('[Muter] Reset'),
};

export const muterFeature = createFeature({
  name: 'muter',
  reducer: createReducer(init,
    on(MuterActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(MuterActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(MuterActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(MuterActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(MuterActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(MuterActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(MuterActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(MuterActions.resetState, () => init),
  )
});

export const { selectMuterState, selectStatus, selectProgress, selectOutputBlob } = muterFeature;
