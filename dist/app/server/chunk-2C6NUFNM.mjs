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

// src/app/modules/converter/28-gif-converter/gif-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "gif",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var GifConverterActions = createActionGroup({
  source: "GIF Converter",
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
var gifConverterFeature = createFeature({
  name: "gifConverter",
  reducer: createReducer(initialState, on(GifConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(GifConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(GifConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(GifConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(GifConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(GifConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(GifConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(GifConverterActions.resetState, () => initialState))
});
var { selectGifConverterState, selectInputFile: selectGifConverterInputFile, selectOutputFormat: selectGifConverterOutputFormat, selectStatus: selectGifConverterStatus, selectProgress: selectGifConverterProgress, selectOutputBlob: selectGifConverterOutputBlob, selectOutputSizeMB: selectGifConverterOutputSizeMB, selectErrorMessage: selectGifConverterErrorMessage } = gifConverterFeature;

export {
  GifConverterActions,
  gifConverterFeature,
  selectGifConverterState
};
//# sourceMappingURL=chunk-2C6NUFNM.mjs.map
