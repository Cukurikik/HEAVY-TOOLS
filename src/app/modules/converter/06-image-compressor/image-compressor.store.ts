// ============================================================
// FEATURE 06 — IMAGE COMPRESSOR — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface ImageCompressorState {
  quality: number;
  maxSizeMB: number;
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

const initialState: ImageCompressorState = {
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

export const ImageCompressorActions = createActionGroup({
  source: 'Image Compressor',
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

export const imageCompressorFeature = createFeature({
  name: 'imageCompressor',
  reducer: createReducer(
    initialState,
    on(ImageCompressorActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(ImageCompressorActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(ImageCompressorActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(ImageCompressorActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(ImageCompressorActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(ImageCompressorActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })),
    on(ImageCompressorActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(ImageCompressorActions.resetState, () => initialState),
  ) });

export const {
  selectImageCompressorState: selectImageCompressorState,
  selectInputFile: selectImageCompressorInputFile,
  selectOutputFormat: selectImageCompressorOutputFormat,
  selectStatus: selectImageCompressorStatus,
  selectProgress: selectImageCompressorProgress,
  selectOutputBlob: selectImageCompressorOutputBlob,
  selectOutputSizeMB: selectImageCompressorOutputSizeMB,
  selectErrorMessage: selectImageCompressorErrorMessage } = imageCompressorFeature;
