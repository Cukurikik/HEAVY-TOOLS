// ============================================================
// FEATURE 15 — CURRENCY CONVERTER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface CurrencyConverterState {
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

const initialState: CurrencyConverterState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'USD',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const CurrencyConverterActions = createActionGroup({
  source: 'Currency Converter',
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

export const currencyConverterFeature = createFeature({
  name: 'currencyConverter',
  reducer: createReducer(
    initialState,
    on(CurrencyConverterActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(CurrencyConverterActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(CurrencyConverterActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(CurrencyConverterActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(CurrencyConverterActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(CurrencyConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob, outputText, outputSizeMB })),
    on(CurrencyConverterActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(CurrencyConverterActions.resetState, () => initialState),
  ) });

export const {
  selectCurrencyConverterState: selectCurrencyConverterState,
  selectInputFile: selectCurrencyConverterInputFile,
  selectOutputFormat: selectCurrencyConverterOutputFormat,
  selectStatus: selectCurrencyConverterStatus,
  selectProgress: selectCurrencyConverterProgress,
  selectOutputBlob: selectCurrencyConverterOutputBlob,
  selectOutputSizeMB: selectCurrencyConverterOutputSizeMB,
  selectErrorMessage: selectCurrencyConverterErrorMessage } = currencyConverterFeature;
