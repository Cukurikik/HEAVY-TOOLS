import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface ScreenRecorderState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  duration: number;
  audioSource: 'mic' | 'system' | 'both' | 'none';
  resolution: '1080p' | '720p' | '480p';
  outputFormat: 'mp4' | 'webm';
  recordingStatus: 'idle' | 'requesting' | 'recording' | 'paused' | 'processing';
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: ScreenRecorderState = {
  inputFile: null, videoMeta: null,
  duration: 0,
  audioSource: 'mic',
  resolution: '1080p',
  outputFormat: 'webm',
  recordingStatus: 'idle',
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const ScreenRecorderActions = {
  loadFile: createAction('[ScreenRecorder] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[ScreenRecorder] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[ScreenRecorder] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[ScreenRecorder] Update Config', props<{ config: Partial<ScreenRecorderState> }>()),
  startProcessing: createAction('[ScreenRecorder] Start'),
  updateProgress: createAction('[ScreenRecorder] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[ScreenRecorder] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[ScreenRecorder] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[ScreenRecorder] Download'),
  resetState: createAction('[ScreenRecorder] Reset') };
export const screenRecorderFeature = createFeature({
  name: 'screenRecorder',
  reducer: createReducer(init,
    on(ScreenRecorderActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(ScreenRecorderActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(ScreenRecorderActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ScreenRecorderActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(ScreenRecorderActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(ScreenRecorderActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(ScreenRecorderActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(ScreenRecorderActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(ScreenRecorderActions.resetState, () => init),
  )
});
export const { selectScreenRecorderState, selectStatus, selectProgress, selectOutputBlob } = screenRecorderFeature;
export const selectScreenRecorderCanProcess = createSelector(selectScreenRecorderState, s => !!s.inputFile && s.status === 'idle');
export const selectScreenRecorderIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
