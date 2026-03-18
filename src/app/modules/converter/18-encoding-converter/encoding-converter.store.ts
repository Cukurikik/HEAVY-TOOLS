// ============================================================
// FEATURE 18 — ENCODING CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface EncodingConverterState {
  fromEncoding: string;
  toEncoding: string;
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

const initialState: EncodingConverterState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'utf8',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const EncodingConverterActions = createActionGroup({
  source: 'Encoding Converter',
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

export const encodingConverterFeature = createFeature({
  name: 'encodingConverter',
  reducer: createReducer(
    initialState,
    on(EncodingConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(EncodingConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(EncodingConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(EncodingConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(EncodingConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(EncodingConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })),
    on(EncodingConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(EncodingConverterActions.resetState, () => initialState),
  ) });

export const {
  selectEncodingConverterState: selectEncodingConverterState,
  selectInputFile: selectEncodingConverterInputFile,
  selectOutputFormat: selectEncodingConverterOutputFormat,
  selectStatus: selectEncodingConverterStatus,
  selectProgress: selectEncodingConverterProgress,
  selectOutputBlob: selectEncodingConverterOutputBlob,
  selectOutputSizeMB: selectEncodingConverterOutputSizeMB,
  selectErrorMessage: selectEncodingConverterErrorMessage } = encodingConverterFeature;
