import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface AudioRemoverState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
}

const init: AudioRemoverState = {
  inputFile: null,
  videoMeta: null,
  status: 'idle',
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null
};

export const AudioRemoverActions = {
  loadFile: createAction('[AudioRemover] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[AudioRemover] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[AudioRemover] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  startProcessing: createAction('[AudioRemover] Start'),
  updateProgress: createAction('[AudioRemover] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[AudioRemover] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[AudioRemover] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  resetState: createAction('[AudioRemover] Reset'),
};

export const audioRemoverFeature = createFeature({
  name: 'audioRemover',
  reducer: createReducer(init,
    on(AudioRemoverActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(AudioRemoverActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(AudioRemoverActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(AudioRemoverActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(AudioRemoverActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(AudioRemoverActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(AudioRemoverActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(AudioRemoverActions.resetState, () => init),
  )
});

export const { selectAudioRemoverState, selectStatus, selectProgress, selectOutputBlob } = audioRemoverFeature;
