import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface AudioExtractorState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  format: 'mp3' | 'wav' | 'aac' | 'm4a';
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
}

const init: AudioExtractorState = {
  inputFile: null,
  videoMeta: null,
  format: 'mp3',
  status: 'idle',
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null
};

export const AudioExtractorActions = {
  loadFile: createAction('[AudioExtractor] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[AudioExtractor] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[AudioExtractor] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateFormat: createAction('[AudioExtractor] Update Format', props<{ format: AudioExtractorState['format'] }>()),
  startProcessing: createAction('[AudioExtractor] Start'),
  updateProgress: createAction('[AudioExtractor] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[AudioExtractor] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[AudioExtractor] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  resetState: createAction('[AudioExtractor] Reset'),
};

export const audioExtractorFeature = createFeature({
  name: 'audioExtractor',
  reducer: createReducer(init,
    on(AudioExtractorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(AudioExtractorActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(AudioExtractorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(AudioExtractorActions.updateFormat, (s, a) => ({ ...s, format: a.format })),
    on(AudioExtractorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(AudioExtractorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(AudioExtractorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(AudioExtractorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(AudioExtractorActions.resetState, () => init),
  )
});

export const { selectAudioExtractorState, selectStatus, selectProgress, selectOutputBlob } = audioExtractorFeature;
