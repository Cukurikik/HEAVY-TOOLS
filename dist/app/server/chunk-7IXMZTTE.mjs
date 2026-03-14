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

// src/app/modules/converter/18-encoding-converter/encoding-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "utf8",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var EncodingConverterActions = createActionGroup({
  source: "Encoding Converter",
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
var encodingConverterFeature = createFeature({
  name: "encodingConverter",
  reducer: createReducer(initialState, on(EncodingConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(EncodingConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(EncodingConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(EncodingConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(EncodingConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(EncodingConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(EncodingConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(EncodingConverterActions.resetState, () => initialState))
});
var { selectEncodingConverterState, selectInputFile: selectEncodingConverterInputFile, selectOutputFormat: selectEncodingConverterOutputFormat, selectStatus: selectEncodingConverterStatus, selectProgress: selectEncodingConverterProgress, selectOutputBlob: selectEncodingConverterOutputBlob, selectOutputSizeMB: selectEncodingConverterOutputSizeMB, selectErrorMessage: selectEncodingConverterErrorMessage } = encodingConverterFeature;

export {
  EncodingConverterActions,
  encodingConverterFeature,
  selectEncodingConverterState
};
//# sourceMappingURL=chunk-7IXMZTTE.mjs.map
