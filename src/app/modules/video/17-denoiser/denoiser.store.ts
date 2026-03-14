import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface DenoiserState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  algorithm: 'hqdn3d' | 'nlmeans';
  lumaStrength: number;
  chromaStrength: number;
  temporalStrength: number;
  denoiseAudio: boolean;
  audioNoiseLevel: number;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: DenoiserState = {
  inputFile: null, videoMeta: null,
  algorithm: 'hqdn3d',
  lumaStrength: 4,
  chromaStrength: 4,
  temporalStrength: 3,
  denoiseAudio: false,
  audioNoiseLevel: 50,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const DenoiserActions = {
  loadFile: createAction('[Denoiser] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[Denoiser] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[Denoiser] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[Denoiser] Update Config', props<{ config: Partial<DenoiserState> }>()),
  startProcessing: createAction('[Denoiser] Start'),
  updateProgress: createAction('[Denoiser] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[Denoiser] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[Denoiser] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[Denoiser] Download'),
  resetState: createAction('[Denoiser] Reset') };
export const denoiserFeature = createFeature({
  name: 'denoiser',
  reducer: createReducer(init,
    on(DenoiserActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(DenoiserActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(DenoiserActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(DenoiserActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(DenoiserActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(DenoiserActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(DenoiserActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(DenoiserActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(DenoiserActions.resetState, () => init),
  )
});
export const { selectDenoiserState, selectStatus, selectProgress, selectOutputBlob } = denoiserFeature;
export const selectDenoiserCanProcess = createSelector(selectDenoiserState, s => !!s.inputFile && s.status === 'idle');
export const selectDenoiserIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
