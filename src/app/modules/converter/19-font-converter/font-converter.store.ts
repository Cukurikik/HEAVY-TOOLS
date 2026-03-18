// ============================================================
// FEATURE 19 — FONT CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface FontConverterState {
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

const initialState: FontConverterState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'ttf',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const FontConverterActions = createActionGroup({
  source: 'Font Converter',
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

export const fontConverterFeature = createFeature({
  name: 'fontConverter',
  reducer: createReducer(
    initialState,
    on(FontConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(FontConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(FontConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(FontConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(FontConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(FontConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })),
    on(FontConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(FontConverterActions.resetState, () => initialState),
  ) });

export const {
  selectFontConverterState: selectFontConverterState,
  selectInputFile: selectFontConverterInputFile,
  selectOutputFormat: selectFontConverterOutputFormat,
  selectStatus: selectFontConverterStatus,
  selectProgress: selectFontConverterProgress,
  selectOutputBlob: selectFontConverterOutputBlob,
  selectOutputSizeMB: selectFontConverterOutputSizeMB,
  selectErrorMessage: selectFontConverterErrorMessage } = fontConverterFeature;
