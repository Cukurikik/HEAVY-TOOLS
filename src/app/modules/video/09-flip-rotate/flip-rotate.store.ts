import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';

export interface FlipRotateState {
  file: File | null;
  meta: { duration: number; size: number; name: string } | null;
  flipH: boolean;
  flipV: boolean;
  rotation: 0 | 90 | 180 | 270;
  isProcessing: boolean;
  progress: number;
  outputUrl: string | null;
  error: string | null;
}

const initialState: FlipRotateState = {
  file: null,
  meta: null,
  flipH: false,
  flipV: false,
  rotation: 0,
  isProcessing: false,
  progress: 0,
  outputUrl: null,
  error: null
};

export const flipRotateActions = {
  loadFile: createAction('[FlipRotate] Load File', props<{ file: File }>()),
  setMeta: createAction('[FlipRotate] Set Meta', props<{ meta: { duration: number; size: number; name: string } }>()),
  setFlipH: createAction('[FlipRotate] Set Flip H', props<{ flipH: boolean }>()),
  setFlipV: createAction('[FlipRotate] Set Flip V', props<{ flipV: boolean }>()),
  setRotation: createAction('[FlipRotate] Set Rotation', props<{ rotation: 0 | 90 | 180 | 270 }>()),
  startProcessing: createAction('[FlipRotate] Start Processing'),
  setProgress: createAction('[FlipRotate] Set Progress', props<{ progress: number }>()),
  completeProcessing: createAction('[FlipRotate] Complete Processing', props<{ outputUrl: string }>()),
  setError: createAction('[FlipRotate] Set Error', props<{ error: string }>()),
  reset: createAction('[FlipRotate] Reset')
};

export const flipRotateFeature = createFeature({
  name: 'flipRotate',
  reducer: createReducer(
    initialState,
    on(flipRotateActions.loadFile, (state, { file }) => ({ ...state, file, outputUrl: null, error: null })),
    on(flipRotateActions.setMeta, (state, { meta }) => ({ ...state, meta })),
    on(flipRotateActions.setFlipH, (state, { flipH }) => ({ ...state, flipH })),
    on(flipRotateActions.setFlipV, (state, { flipV }) => ({ ...state, flipV })),
    on(flipRotateActions.setRotation, (state, { rotation }) => ({ ...state, rotation })),
    on(flipRotateActions.startProcessing, (state) => ({ ...state, isProcessing: true, progress: 0 })),
    on(flipRotateActions.setProgress, (state, { progress }) => ({ ...state, progress })),
    on(flipRotateActions.completeProcessing, (state, { outputUrl }) => ({ ...state, isProcessing: false, progress: 100, outputUrl })),
    on(flipRotateActions.setError, (state, { error }) => ({ ...state, isProcessing: false, error })),
    on(flipRotateActions.reset, () => initialState)
  )
});
