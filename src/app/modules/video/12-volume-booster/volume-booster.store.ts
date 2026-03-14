import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { VideoMeta, VideoErrorCode } from '../shared/types/video.types';

export interface VolumeBoosterState {
  inputFile: File | null;
  videoMeta: VideoMeta | null;
  volume: number; // 0.1 to 5.0
  status: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  outputBlob: Blob | null;
  outputSizeMB: number | null;
  errorCode: VideoErrorCode | null;
  errorMessage: string | null;
}

const init: VolumeBoosterState = {
  inputFile: null,
  videoMeta: null,
  volume: 1.5,
  status: 'idle',
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null
};

export const VolumeBoosterActions = {
  loadFile: createAction('[VolumeBooster] Load File', props<{ file: File }>()),
  loadMetaSuccess: createAction('[VolumeBooster] Meta OK', props<{ meta: VideoMeta }>()),
  loadMetaFailure: createAction('[VolumeBooster] Meta Fail', props<{ errorCode: VideoErrorCode; message: string }>()),
  updateVolume: createAction('[VolumeBooster] Update Volume', props<{ volume: number }>()),
  startProcessing: createAction('[VolumeBooster] Start'),
  updateProgress: createAction('[VolumeBooster] Progress', props<{ progress: number }>()),
  processingSuccess: createAction('[VolumeBooster] Success', props<{ outputBlob: Blob; outputSizeMB: number }>()),
  processingFailure: createAction('[VolumeBooster] Failure', props<{ errorCode: VideoErrorCode; message: string }>()),
  resetState: createAction('[VolumeBooster] Reset'),
};

export const volumeBoosterFeature = createFeature({
  name: 'volumeBooster',
  reducer: createReducer(init,
    on(VolumeBoosterActions.loadFile, (s, a) => ({ ...s, inputFile: a.file, status: 'loading' as const, outputBlob: null, errorMessage: null, progress: 0 })),
    on(VolumeBoosterActions.loadMetaSuccess, (s, a) => ({ ...s, videoMeta: a.meta, status: 'idle' as const })),
    on(VolumeBoosterActions.loadMetaFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(VolumeBoosterActions.updateVolume, (s, a) => ({ ...s, volume: a.volume })),
    on(VolumeBoosterActions.startProcessing, s => ({ ...s, status: 'processing' as const, progress: 0, outputBlob: null })),
    on(VolumeBoosterActions.updateProgress, (s, a) => ({ ...s, progress: a.progress })),
    on(VolumeBoosterActions.processingSuccess, (s, a) => ({ ...s, status: 'done' as const, progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })),
    on(VolumeBoosterActions.processingFailure, (s, a) => ({ ...s, status: 'error' as const, errorCode: a.errorCode, errorMessage: a.message })),
    on(VolumeBoosterActions.resetState, () => init),
  )
});

export const { selectVolumeBoosterState, selectStatus, selectProgress, selectOutputBlob } = volumeBoosterFeature;
