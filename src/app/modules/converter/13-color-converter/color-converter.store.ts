// ============================================================
// FEATURE 13 — COLOR CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface ColorConverterState {
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

const initialState: ColorConverterState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'hex',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const ColorConverterActions = createActionGroup({
  source: 'Color Converter',
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

export const colorConverterFeature = createFeature({
  name: 'colorConverter',
  reducer: createReducer(
    initialState,
    on(ColorConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(ColorConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(ColorConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(ColorConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(ColorConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(ColorConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })),
    on(ColorConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(ColorConverterActions.resetState, () => initialState),
  ) });

export const {
  selectColorConverterState: selectColorConverterState,
  selectInputFile: selectColorConverterInputFile,
  selectOutputFormat: selectColorConverterOutputFormat,
  selectStatus: selectColorConverterStatus,
  selectProgress: selectColorConverterProgress,
  selectOutputBlob: selectColorConverterOutputBlob,
  selectOutputSizeMB: selectColorConverterOutputSizeMB,
  selectErrorMessage: selectColorConverterErrorMessage } = colorConverterFeature;
