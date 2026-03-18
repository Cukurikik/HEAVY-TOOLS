// ============================================================
// FEATURE 05 — IMAGE RESIZER — NgRx Store
// ============================================================
import { createActionGroup, createFeature, createReducer, emptyProps, on, props } from '@ngrx/store';
import { ProcessingStatus, ConverterErrorCode } from '../shared/types/converter.types';

export interface ImageResizerState {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
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

const initialState: ImageResizerState = {
  width: 1920,
  height: 1080,
  maintainAspectRatio: true,
  inputFile: null,
  inputText: '',
  outputFormat: 'original',
  outputBlob: null,
  outputText: '',
  status: 'idle',
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false };

export const ImageResizerActions = createActionGroup({
  source: 'Image Resizer',
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

export const imageResizerFeature = createFeature({
  name: 'imageResizer',
  reducer: createReducer(
    initialState,
    on(ImageResizerActions.loadFile, (state, { file }) => ({
      ...state, inputFile: file, status: 'idle' as const, errorCode: null, errorMessage: null })),
    on(ImageResizerActions.setInputText, (state, { text }) => ({ ...state, inputText: text })),
    on(ImageResizerActions.setOutputFormat, (state, { format }) => ({ ...state, outputFormat: format })),
    on(ImageResizerActions.startProcessing, (state) => ({
      ...state, status: 'processing' as const, progress: 0, outputBlob: null, outputText: '', outputSizeMB: null, errorCode: null, errorMessage: null })),
    on(ImageResizerActions.updateProgress, (state, { progress }) => ({ ...state, progress })),
    on(ImageResizerActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })),
    on(ImageResizerActions.processingFailure, (state, { errorCode, message, retryable }) => ({
      ...state, status: 'error' as const, errorCode, errorMessage: message, retryable })),
    on(ImageResizerActions.resetState, () => initialState),
  ) });

export const {
  selectImageResizerState: selectImageResizerState,
  selectInputFile: selectImageResizerInputFile,
  selectOutputFormat: selectImageResizerOutputFormat,
  selectStatus: selectImageResizerStatus,
  selectProgress: selectImageResizerProgress,
  selectOutputBlob: selectImageResizerOutputBlob,
  selectOutputSizeMB: selectImageResizerOutputSizeMB,
  selectErrorMessage: selectImageResizerErrorMessage } = imageResizerFeature;
