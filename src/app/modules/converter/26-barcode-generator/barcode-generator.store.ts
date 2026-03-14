// ============================================================
// FEATURE 26 — BARCODE GENERATOR — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface BarcodeGeneratorState {
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

const initialState: BarcodeGeneratorState = {
  inputFile: null,
  inputText: '',
  outputFormat: 'png',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const BarcodeGeneratorActions = createActionGroup({
  source: 'Barcode Generator',
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

export const barcodeGeneratorFeature = createFeature({
  name: 'barcodeGenerator',
  reducer: createReducer(
    initialState,
    on(BarcodeGeneratorActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(BarcodeGeneratorActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(BarcodeGeneratorActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(BarcodeGeneratorActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(BarcodeGeneratorActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(BarcodeGeneratorActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob, outputText, outputSizeMB })),
    on(BarcodeGeneratorActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(BarcodeGeneratorActions.resetState, () => initialState),
  ) });

export const {
  selectBarcodeGeneratorState: selectBarcodeGeneratorState,
  selectInputFile: selectBarcodeGeneratorInputFile,
  selectOutputFormat: selectBarcodeGeneratorOutputFormat,
  selectStatus: selectBarcodeGeneratorStatus,
  selectProgress: selectBarcodeGeneratorProgress,
  selectOutputBlob: selectBarcodeGeneratorOutputBlob,
  selectOutputSizeMB: selectBarcodeGeneratorOutputSizeMB,
  selectErrorMessage: selectBarcodeGeneratorErrorMessage } = barcodeGeneratorFeature;
