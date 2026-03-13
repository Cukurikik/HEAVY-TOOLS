import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface ReverserState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  reverseAudio: boolean;
  durationWarning: boolean;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: ReverserState = {
  inputFile: null, videoMeta: null,
  reverseAudio: false,
  durationWarning: false,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const ReverserActions = {
  loadFile: createAction('[Reverser] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Reverser] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Reverser] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Reverser] Update Config', props<{ config: Partial<ReverserState> }>()),
  startProcessing: createAction('[Reverser] Start'),
  updateProgress: createAction('[Reverser] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Reverser] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Reverser] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Reverser] Download'),
  resetState: createAction('[Reverser] Reset'),
};
export const reverserFeature = createFeature({
  name: 'reverser',
  reducer: createReducer(init,
    on(ReverserActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(ReverserActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(ReverserActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(ReverserActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(ReverserActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(ReverserActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(ReverserActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(ReverserActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(ReverserActions.resetState, () => init),
  )
});
export const { selectReverserState, selectStatus, selectProgress, selectOutputBlob } = reverserFeature;
export const selectReverserCanProcess = createSelector(selectReverserState, s => !!s.inputFile && s.status === 'idle');
export const selectReverserIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
