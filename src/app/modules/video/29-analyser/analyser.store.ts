import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface AnalyserState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  metadata: { format: Record<string,string>; videoStreams: unknown[]; audioStreams: unknown[]; subtitleStreams: unknown[]; chapters: unknown[] } | null;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: AnalyserState = {
  inputFile: null, videoMeta: null,
  metadata: null,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const AnalyserActions = {
  loadFile: createAction('[Analyser] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Analyser] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Analyser] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Analyser] Update Config', props<{ config: Partial<AnalyserState> }>()),
  startProcessing: createAction('[Analyser] Start'),
  updateProgress: createAction('[Analyser] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Analyser] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Analyser] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Analyser] Download'),
  resetState: createAction('[Analyser] Reset') };
export const analyserFeature = createFeature({
  name: 'analyser',
  reducer: createReducer(init,
    on(AnalyserActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(AnalyserActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(AnalyserActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(AnalyserActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(AnalyserActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(AnalyserActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(AnalyserActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(AnalyserActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(AnalyserActions.resetState, () => init),
  )
});
export const { selectAnalyserState, selectStatus, selectProgress, selectOutputBlob } = analyserFeature;
export const selectAnalyserCanProcess = createSelector(selectAnalyserState, s => !!s.inputFile && s.status === 'idle');
export const selectAnalyserIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
