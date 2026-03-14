import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import type { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface AudioExtractorState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  outputFormat: 'wav' | 'mp3' | 'aac' | 'ogg' | 'flac';
  bitrate: 128 | 192 | 256 | 320;
  waveformData: Float32Array | null;
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}
const init: AudioExtractorState = {
  inputFile: null, videoMeta: null,
  outputFormat: 'mp3',
  bitrate: 192,
  waveformData: null,
  status: 'idle', progress: 0, outputBlob: null, outputSizeMB: null,
  errorCode: null, errorMessage: null, retryable: false
};
export const AudioExtractorActions = {
  loadFile: createAction('[AudioExtractor] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[AudioExtractor] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[AudioExtractor] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateConfig: createAction('[AudioExtractor] Update Config', props<{ config: Partial<AudioExtractorState> }>()),
  startProcessing: createAction('[AudioExtractor] Start'),
  updateProgress: createAction('[AudioExtractor] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[AudioExtractor] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[AudioExtractor] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  downloadOutput: createAction('[AudioExtractor] Download'),
  resetState: createAction('[AudioExtractor] Reset') };
export const audioExtractorFeature = createFeature({
  name: 'audioExtractor',
  reducer: createReducer(init,
    on(AudioExtractorActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(AudioExtractorActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(AudioExtractorActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(AudioExtractorActions.updateConfig, (s, a) => ({ ...s, ...a.config })),
    on(AudioExtractorActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(AudioExtractorActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(AudioExtractorActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(AudioExtractorActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message, retryable: true })),
    on(AudioExtractorActions.resetState, () => init),
  )
});
export const { selectAudioExtractorState, selectStatus, selectProgress, selectOutputBlob } = audioExtractorFeature;
export const selectAudioExtractorCanProcess = createSelector(selectAudioExtractorState, s => !!s.inputFile && s.status === 'idle');
export const selectAudioExtractorIsLoading = createSelector(selectStatus, s => s === 'processing' || s === 'loading');
