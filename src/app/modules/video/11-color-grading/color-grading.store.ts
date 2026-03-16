import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';

export interface ColorGradingState {
  file: File | null;
  meta: { duration: number; size: number; name: string } | null;
  brightness: number; // -1.0 to 1.0
  contrast: number; // -1000 to 1000 (actually 1.0 is default)
  saturation: number; // 0 to 3.0
  gamma: number; // 0.1 to 10.0
  isProcessing: boolean;
  progress: number;
  outputUrl: string | null;
  error: string | null;
}

const initialState: ColorGradingState = {
  file: null,
  meta: null,
  brightness: 0,
  contrast: 1,
  saturation: 1,
  gamma: 1,
  isProcessing: false,
  progress: 0,
  outputUrl: null,
  error: null
};

export const colorGradingActions = {
  loadFile: createAction('[ColorGrading] Load File', props<{ file: File }>()),
  setMeta: createAction('[ColorGrading] Set Meta', props<{ meta: { duration: number; size: number; name: string } }>()),
  setBrightness: createAction('[ColorGrading] Set Brightness', props<{ brightness: number }>()),
  setContrast: createAction('[ColorGrading] Set Contrast', props<{ contrast: number }>()),
  setSaturation: createAction('[ColorGrading] Set Saturation', props<{ saturation: number }>()),
  setGamma: createAction('[ColorGrading] Set Gamma', props<{ gamma: number }>()),
  startProcessing: createAction('[ColorGrading] Start Processing'),
  setProgress: createAction('[ColorGrading] Set Progress', props<{ progress: number }>()),
  completeProcessing: createAction('[ColorGrading] Complete Processing', props<{ outputUrl: string }>()),
  setError: createAction('[ColorGrading] Set Error', props<{ error: string }>()),
  reset: createAction('[ColorGrading] Reset')
};

export const colorGradingFeature = createFeature({
  name: 'colorGrading',
  reducer: createReducer(
    initialState,
    on(colorGradingActions.loadFile, (state, { file }) => ({ ...state, file, outputUrl: null, error: null })),
    on(colorGradingActions.setMeta, (state, { meta }) => ({ ...state, meta })),
    on(colorGradingActions.setBrightness, (state, { brightness }) => ({ ...state, brightness })),
    on(colorGradingActions.setContrast, (state, { contrast }) => ({ ...state, contrast })),
    on(colorGradingActions.setSaturation, (state, { saturation }) => ({ ...state, saturation })),
    on(colorGradingActions.setGamma, (state, { gamma }) => ({ ...state, gamma })),
    on(colorGradingActions.startProcessing, (state) => ({ ...state, isProcessing: true, progress: 0 })),
    on(colorGradingActions.setProgress, (state, { progress }) => ({ ...state, progress })),
    on(colorGradingActions.completeProcessing, (state, { outputUrl }) => ({ ...state, isProcessing: false, progress: 100, outputUrl })),
    on(colorGradingActions.setError, (state, { error }) => ({ ...state, isProcessing: false, error })),
    on(colorGradingActions.reset, () => initialState)
  )
});
