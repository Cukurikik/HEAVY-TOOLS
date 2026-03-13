import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface SubtitleBurnerState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  subtitleFile: File | null;
  subtitleContent: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  outlineColor: string;
  position: 'top' | 'bottom';
  offsetSeconds: number;
  aiGenerating: boolean;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: SubtitleBurnerState = {
  inputFile: null, videoMeta: null,
  subtitleFile: null,
  subtitleContent: '',
  fontFamily: 'Arial',
  fontSize: 24,
  fontColor: '#FFFFFF',
  outlineColor: '#000000',
  position: 'bottom',
  offsetSeconds: 0,
  aiGenerating: false,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const SubtitleBurnerActions = {
  loadFile: createAction('[SubtitleBurner] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[SubtitleBurner] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[SubtitleBurner] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[SubtitleBurner] Update Config', props<{ config: Partial<SubtitleBurnerState> }>()),
  startProcessing: createAction('[SubtitleBurner] Start'),
  updateProgress: createAction('[SubtitleBurner] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[SubtitleBurner] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[SubtitleBurner] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[SubtitleBurner] Download'),
  resetState: createAction('[SubtitleBurner] Reset'),
};
export const subtitleBurnerFeature = createFeature({
  name: 'subtitleBurner',
  reducer: createReducer(init,
    on(SubtitleBurnerActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(SubtitleBurnerActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(SubtitleBurnerActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(SubtitleBurnerActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(SubtitleBurnerActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(SubtitleBurnerActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(SubtitleBurnerActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(SubtitleBurnerActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(SubtitleBurnerActions.resetState, () => init),
  )
});
export const { selectSubtitleBurnerState, selectStatus, selectProgress, selectOutputBlob } = subtitleBurnerFeature;
export const selectSubtitleBurnerCanProcess = createSelector(selectSubtitleBurnerState, s => !!s.inputFile && s.status === 'idle');
export const selectSubtitleBurnerIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
