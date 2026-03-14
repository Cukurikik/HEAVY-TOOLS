import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';

export interface CropResizeState {
  file: File | null;
  meta: { duration: number; size: number; name: string; width: number; height: number } | null;
  crop: { x: number; y: number; width: number; height: number } | null;
  resize: { width: number; height: number } | null;
  isProcessing: boolean;
  progress: number;
  outputUrl: string | null;
  error: string | null;
}

const initialState: CropResizeState = {
  file: null,
  meta: null,
  crop: null,
  resize: null,
  isProcessing: false,
  progress: 0,
  outputUrl: null,
  error: null
};

export const cropResizeActions = {
  loadFile: createAction('[CropResize] Load File', props<{ file: File }>()),
  setMeta: createAction('[CropResize] Set Meta', props<{ meta: { duration: number; size: number; name: string; width: number; height: number } }>()),
  setCrop: createAction('[CropResize] Set Crop', props<{ crop: { x: number; y: number; width: number; height: number } | null }>()),
  setResize: createAction('[CropResize] Set Resize', props<{ resize: { width: number; height: number } | null }>()),
  startProcessing: createAction('[CropResize] Start Processing'),
  setProgress: createAction('[CropResize] Set Progress', props<{ progress: number }>()),
  completeProcessing: createAction('[CropResize] Complete Processing', props<{ outputUrl: string }>()),
  setError: createAction('[CropResize] Set Error', props<{ error: string }>()),
  reset: createAction('[CropResize] Reset')
};

export const cropResizeFeature = createFeature({
  name: 'cropResize',
  reducer: createReducer(
    initialState,
    on(cropResizeActions.loadFile, (state, { file }) => ({ ...state, file, outputUrl: null, error: null })),
    on(cropResizeActions.setMeta, (state, { meta }) => ({ ...state, meta })),
    on(cropResizeActions.setCrop, (state, { crop }) => ({ ...state, crop })),
    on(cropResizeActions.setResize, (state, { resize }) => ({ ...state, resize })),
    on(cropResizeActions.startProcessing, (state) => ({ ...state, isProcessing: true, progress: 0 })),
    on(cropResizeActions.setProgress, (state, { progress }) => ({ ...state, progress })),
    on(cropResizeActions.completeProcessing, (state, { outputUrl }) => ({ ...state, isProcessing: false, progress: 100, outputUrl })),
    on(cropResizeActions.setError, (state, { error }) => ({ ...state, isProcessing: false, error })),
    on(cropResizeActions.reset, () => initialState)
  )
});
