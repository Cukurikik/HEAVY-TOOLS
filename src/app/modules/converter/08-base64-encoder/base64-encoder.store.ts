// ============================================================
// FEATURE 08 — BASE64 ENCODER / DECODER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface Base64EncoderState {
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

const initialState: Base64EncoderState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'base64',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const Base64EncoderActions = createActionGroup({
  source: 'Base64 Encoder / Decoder',
  events: {
    'Load File': props<{ file: File }>(),
    'Set Input Text': props<{ text: string }>(),
    'Set Output Format': props<{ format: string }>(),
    'Start Processing': emptyProps(),
    'Update Progress': props<{ progress: number }>(),
    'Processing Success': props<{ outputBlob: Blob | null; outputText: string; outputSizeMB: number }>(),
    'Processing Failure': props<{ errorCode: ConverterErrorCode; message: string; retryable: boolean }>(),
    'Copy To Clipboard': emptyProps(),
    'Download Output': emptyProps(),
    'Reset State': emptyProps() } });

export const base64EncoderFeature = createFeature({
  name: 'base64Encoder',
  reducer: createReducer(
    initialState,
    on(Base64EncoderActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(Base64EncoderActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(Base64EncoderActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(Base64EncoderActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(Base64EncoderActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(Base64EncoderActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob, outputText, outputSizeMB })),
    on(Base64EncoderActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(Base64EncoderActions.resetState, () => initialState),
  ) });

export const {
  selectBase64EncoderState: selectBase64EncoderState,
  selectInputFile: selectBase64EncoderInputFile,
  selectOutputFormat: selectBase64EncoderOutputFormat,
  selectStatus: selectBase64EncoderStatus,
  selectProgress: selectBase64EncoderProgress,
  selectOutputBlob: selectBase64EncoderOutputBlob,
  selectOutputSizeMB: selectBase64EncoderOutputSizeMB,
  selectErrorMessage: selectBase64EncoderErrorMessage } = base64EncoderFeature;
