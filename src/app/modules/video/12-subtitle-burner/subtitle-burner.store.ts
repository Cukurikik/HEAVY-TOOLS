import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';

export interface SubtitleBurnerState {
  videoFile: File | null;
  subtitleFile: File | null;
  meta: { duration: number; size: number; name: string } | null;
  isProcessing: boolean;
  progress: number;
  outputUrl: string | null;
  error: string | null;
}

const initialState: SubtitleBurnerState = {
  videoFile: null,
  subtitleFile: null,
  meta: null,
  isProcessing: false,
  progress: 0,
  outputUrl: null,
  error: null
};

export const subtitleBurnerActions = {
  loadVideo: createAction('[SubtitleBurner] Load Video', props<{ file: File }>()),
  loadSubtitle: createAction('[SubtitleBurner] Load Subtitle', props<{ file: File }>()),
  setMeta: createAction('[SubtitleBurner] Set Meta', props<{ meta: { duration: number; size: number; name: string } }>()),
  startProcessing: createAction('[SubtitleBurner] Start Processing'),
  setProgress: createAction('[SubtitleBurner] Set Progress', props<{ progress: number }>()),
  completeProcessing: createAction('[SubtitleBurner] Complete Processing', props<{ outputUrl: string }>()),
  setError: createAction('[SubtitleBurner] Set Error', props<{ error: string }>()),
  reset: createAction('[SubtitleBurner] Reset')
};

export const subtitleBurnerFeature = createFeature({
  name: 'subtitleBurner',
  reducer: createReducer(
    initialState,
    on(subtitleBurnerActions.loadVideo, (state, { file }) => ({ ...state, videoFile: file, outputUrl: null, error: null })),
    on(subtitleBurnerActions.loadSubtitle, (state, { file }) => ({ ...state, subtitleFile: file, outputUrl: null, error: null })),
    on(subtitleBurnerActions.setMeta, (state, { meta }) => ({ ...state, meta })),
    on(subtitleBurnerActions.startProcessing, (state) => ({ ...state, isProcessing: true, progress: 0 })),
    on(subtitleBurnerActions.setProgress, (state, { progress }) => ({ ...state, progress })),
    on(subtitleBurnerActions.completeProcessing, (state, { outputUrl }) => ({ ...state, isProcessing: false, progress: 100, outputUrl })),
    on(subtitleBurnerActions.setError, (state, { error }) => ({ ...state, isProcessing: false, error })),
    on(subtitleBurnerActions.reset, () => initialState)
  )
});
