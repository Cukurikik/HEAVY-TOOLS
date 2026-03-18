// ============================================================
// FEATURE 22 — CAD CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface CadConverterState {
  unit: string;
  inputFile: File | null;
  inputText: string;
  outputFormat: string;
  outputBlob: Blob | null;
  outputText: string;
  status: ProcessingStatus;
  progress: number;
  outputSizeMB: number | null;
  errorCode: ConverterErrorCode | null;
  errorMessage: string | null;
  retryable: boolean;
}

const initialState: CadConverterState = {
  unit: 'mm',
  inputFile: null,
  inputText: '',
  outputFormat: 'dxf',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const CadConverterActions = createActionGroup({
  source: 'CAD Converter',
  events: {
    'Load File': props<{ file: File }>(),
    'Set Input Text': props<{ text: string }>(),
    'Set Output Format': props<{ format: string }>(),
    'Start Processing': emptyProps(),
    'Update Progress': props<{ progress: number }>(),
    'Processing Success': props<{ outputBlob?: Blob | null; outputText?: string; outputSizeMB?: number | null }>(),
    'Processing Failure': props<{ errorCode: ConverterErrorCode; message: string; retryable: boolean }>(),
    'Copy To Clipboard': emptyProps(),
    'Download Output': emptyProps(),
    'Reset State': emptyProps() } });

export const cadConverterFeature = createFeature({
  name: 'cadConverter',
  reducer: createReducer(
    initialState,
    on(CadConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(CadConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(CadConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(CadConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(CadConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(CadConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })),
    on(CadConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(CadConverterActions.resetState, () => initialState),
  ) });

export const {
  selectCadConverterState: selectCadConverterState,
  selectInputFile: selectCadConverterInputFile,
  selectOutputFormat: selectCadConverterOutputFormat,
  selectStatus: selectCadConverterStatus,
  selectProgress: selectCadConverterProgress,
  selectOutputBlob: selectCadConverterOutputBlob,
  selectOutputSizeMB: selectCadConverterOutputSizeMB,
  selectErrorMessage: selectCadConverterErrorMessage } = cadConverterFeature;
