import './polyfills.server.mjs';
import {
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
  on,
  props
} from "./chunk-GPJTNT77.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-UFAUNXOA.mjs";

// src/app/modules/converter/03-audio-converter/audio-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "mp3",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var AudioConverterActions = createActionGroup({
  source: "Audio Format Converter",
  events: {
    "Load File": props(),
    "Set Input Text": props(),
    "Set Output Format": props(),
    "Start Processing": emptyProps(),
    "Update Progress": props(),
    "Processing Success": props(),
    "Processing Failure": props(),
    "Copy To Clipboard": emptyProps(),
    "Download Output": emptyProps(),
    "Reset State": emptyProps()
  }
});
var audioConverterFeature = createFeature({
  name: "audioConverter",
  reducer: createReducer(initialState, on(AudioConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(AudioConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(AudioConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(AudioConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(AudioConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(AudioConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(AudioConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(AudioConverterActions.resetState, () => initialState))
});
var { selectAudioConverterState, selectInputFile: selectAudioConverterInputFile, selectOutputFormat: selectAudioConverterOutputFormat, selectStatus: selectAudioConverterStatus, selectProgress: selectAudioConverterProgress, selectOutputBlob: selectAudioConverterOutputBlob, selectOutputSizeMB: selectAudioConverterOutputSizeMB, selectErrorMessage: selectAudioConverterErrorMessage } = audioConverterFeature;

export {
  AudioConverterActions,
  audioConverterFeature,
  selectAudioConverterState
};
//# sourceMappingURL=chunk-G5KINMM6.mjs.map
