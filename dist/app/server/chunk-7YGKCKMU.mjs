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

// src/app/modules/converter/09-json-converter/json-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "json",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var JsonConverterActions = createActionGroup({
  source: "JSON Converter",
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
var jsonConverterFeature = createFeature({
  name: "jsonConverter",
  reducer: createReducer(initialState, on(JsonConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(JsonConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(JsonConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(JsonConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(JsonConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(JsonConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(JsonConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(JsonConverterActions.resetState, () => initialState))
});
var { selectJsonConverterState, selectInputFile: selectJsonConverterInputFile, selectOutputFormat: selectJsonConverterOutputFormat, selectStatus: selectJsonConverterStatus, selectProgress: selectJsonConverterProgress, selectOutputBlob: selectJsonConverterOutputBlob, selectOutputSizeMB: selectJsonConverterOutputSizeMB, selectErrorMessage: selectJsonConverterErrorMessage } = jsonConverterFeature;

export {
  JsonConverterActions,
  jsonConverterFeature,
  selectJsonConverterState
};
//# sourceMappingURL=chunk-7YGKCKMU.mjs.map
