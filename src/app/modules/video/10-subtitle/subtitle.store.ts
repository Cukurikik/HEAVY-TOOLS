import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface SubtitleState {
  inputFile: File | null;
  subtitleFile: File | null;
  videoMeta: VideoMeta | null;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
}

const init: SubtitleState = {
  inputFile: null,
  subtitleFile: null,
  videoMeta: null,
  status: 'idle',
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null
};

export const SubtitleActions = {
  loadFile: createAction('[Subtitle] Load File', props<{ file: File }>()),
  loadSubtitle: createAction('[Subtitle] Load Subtitle', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Subtitle] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Subtitle] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  startProcessing: createAction('[Subtitle] Start'),
  updateProgress: createAction('[Subtitle] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Subtitle] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Subtitle] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  resetState: createAction('[Subtitle] Reset'),
  resetSubtitle: createAction('[Subtitle] Reset Subtitle'),
};

export const subtitleFeature = createFeature({
  name: 'subtitle',
  reducer: createReducer(init,
    on(SubtitleActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(SubtitleActions.loadSubtitle, (s, a) => ({ ...s, subtitleFile: a.file })),
    on(SubtitleActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(SubtitleActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(SubtitleActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(SubtitleActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(SubtitleActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(SubtitleActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(SubtitleActions.resetState, () => init),
    on(SubtitleActions.resetSubtitle, (state) => ({ ...state, subtitleFile: null })),
  )
});

export const { selectSubtitleState, selectStatus, selectProgress, selectOutputBlob } = subtitleFeature;
