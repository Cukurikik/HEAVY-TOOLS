// ============================================================
// FEATURE 29 — RAW IMAGE CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface RawImageConverterState {
  exposure: number;
  contrast: number;
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

const initialState: RawImageConverterState = {
  exposure: 0,
  contrast: 1,
  inputFile: null,
  inputText: '',
  outputFormat: 'jpeg',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const RawImageConverterActions = createActionGroup({
  source: 'RAW Image Converter',
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

export const rawImageConverterFeature = createFeature({
  name: 'rawImageConverter',
  reducer: createReducer(
    initialState,
    on(RawImageConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(RawImageConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(RawImageConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(RawImageConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(RawImageConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(RawImageConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })),
    on(RawImageConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(RawImageConverterActions.resetState, () => initialState),
  ) });

export const {
  selectRawImageConverterState: selectRawImageConverterState,
  selectInputFile: selectRawImageConverterInputFile,
  selectOutputFormat: selectRawImageConverterOutputFormat,
  selectStatus: selectRawImageConverterStatus,
  selectProgress: selectRawImageConverterProgress,
  selectOutputBlob: selectRawImageConverterOutputBlob,
  selectOutputSizeMB: selectRawImageConverterOutputSizeMB,
  selectErrorMessage: selectRawImageConverterErrorMessage } = rawImageConverterFeature;
