// ============================================================
// FEATURE 28 — GIF CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface GifConverterState {
  fps: number;
  scale: number;
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

const initialState: GifConverterState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'gif',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const GifConverterActions = createActionGroup({
  source: 'GIF Converter',
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

export const gifConverterFeature = createFeature({
  name: 'gifConverter',
  reducer: createReducer(
    initialState,
    on(GifConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(GifConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(GifConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(GifConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(GifConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(GifConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })),
    on(GifConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(GifConverterActions.resetState, () => initialState),
  ) });

export const {
  selectGifConverterState: selectGifConverterState,
  selectInputFile: selectGifConverterInputFile,
  selectOutputFormat: selectGifConverterOutputFormat,
  selectStatus: selectGifConverterStatus,
  selectProgress: selectGifConverterProgress,
  selectOutputBlob: selectGifConverterOutputBlob,
  selectOutputSizeMB: selectGifConverterOutputSizeMB,
  selectErrorMessage: selectGifConverterErrorMessage } = gifConverterFeature;
