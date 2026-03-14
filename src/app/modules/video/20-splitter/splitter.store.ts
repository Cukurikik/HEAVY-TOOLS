import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface SplitterState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  mode: 'markers' | 'equal';
  markers: number[];
  equalParts: number;
  outputSegments: Blob[];
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: SplitterState = {
  inputFile: null, videoMeta: null,
  mode: 'equal',
  markers: [],
  equalParts: 3,
  outputSegments: [],
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const SplitterActions = {
  loadFile: createAction('[Splitter] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Splitter] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Splitter] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Splitter] Update Config', props<{ config: Partial<SplitterState> }>()),
  startProcessing: createAction('[Splitter] Start'),
  updateProgress: createAction('[Splitter] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Splitter] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Splitter] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Splitter] Download'),
  resetState: createAction('[Splitter] Reset'),
};
export const splitterFeature = createFeature({
  name: 'splitter',
  reducer: createReducer(init,
    on(SplitterActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(SplitterActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(SplitterActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(SplitterActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(SplitterActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(SplitterActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(SplitterActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(SplitterActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(SplitterActions.resetState, () => init),
  )
});
export const { selectSplitterState, selectStatus, selectProgress, selectOutputBlob } = splitterFeature;
export const selectSplitterCanProcess = createSelector(selectSplitterState, s => !!s.inputFile && s.status === 'idle');
export const selectSplitterIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
