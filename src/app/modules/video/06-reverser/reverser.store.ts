import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface ReverserState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  reverseAudio: boolean;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
}

const init: ReverserState = {
  inputFile: null,
  videoMeta: null,
  reverseAudio: true,
  status: 'idle',
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null
};

export const ReverserActions = {
  loadFile: createAction('[Reverser] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Reverser] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Reverser] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  toggleAudio: createAction('[Reverser] Toggle Audio'),
  startProcessing: createAction('[Reverser] Start'),
  updateProgress: createAction('[Reverser] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Reverser] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Reverser] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  resetState: createAction('[Reverser] Reset'),
};

export const reverserFeature = createFeature({
  name: 'reverser',
  reducer: createReducer(init,
    on(ReverserActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(ReverserActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(ReverserActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ReverserActions.toggleAudio, s => ({ ...s, reverseAudio: !s.reverseAudio })),
    on(ReverserActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(ReverserActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(ReverserActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(ReverserActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ReverserActions.resetState, () => init),
  )
});

export const { selectReverserState, selectStatus, selectProgress, selectOutputBlob } = reverserFeature;
