import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface AudioReplacerState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  audioFile: File | null;
  mode: 'replace' | 'mix';
  originalVolume: number;
  newAudioVolume: number;
  loopAudio: boolean;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: AudioReplacerState = {
  inputFile: null, videoMeta: null,
  audioFile: null,
  mode: 'replace',
  originalVolume: 1,
  newAudioVolume: 1,
  loopAudio: false,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const AudioReplacerActions = {
  loadFile: createAction('[AudioReplacer] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[AudioReplacer] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[AudioReplacer] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[AudioReplacer] Update Config', props<{ config: Partial<AudioReplacerState> }>()),
  startProcessing: createAction('[AudioReplacer] Start'),
  updateProgress: createAction('[AudioReplacer] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[AudioReplacer] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[AudioReplacer] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[AudioReplacer] Download'),
  resetState: createAction('[AudioReplacer] Reset'),
};
export const audioReplacerFeature = createFeature({
  name: 'audioReplacer',
  reducer: createReducer(init,
    on(AudioReplacerActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(AudioReplacerActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(AudioReplacerActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(AudioReplacerActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(AudioReplacerActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(AudioReplacerActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(AudioReplacerActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(AudioReplacerActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(AudioReplacerActions.resetState, () => init),
  )
});
export const { selectAudioReplacerState, selectStatus, selectProgress, selectOutputBlob } = audioReplacerFeature;
export const selectAudioReplacerCanProcess = createSelector(selectAudioReplacerState, s => !!s.inputFile && s.status === 'idle');
export const selectAudioReplacerIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
