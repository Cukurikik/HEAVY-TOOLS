import {
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
  on,
  props
} from "./chunk-KGVNL5XR.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-KWSTWQNB.js";

// src/app/modules/converter/17-number-base-converter/number-base-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "binary",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var NumberBaseConverterActions = createActionGroup({
  source: "Number Base Converter",
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
var numberBaseConverterFeature = createFeature({
  name: "numberBaseConverter",
  reducer: createReducer(initialState, on(NumberBaseConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(NumberBaseConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(NumberBaseConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(NumberBaseConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(NumberBaseConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(NumberBaseConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(NumberBaseConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(NumberBaseConverterActions.resetState, () => initialState))
});
var { selectNumberBaseConverterState, selectInputFile: selectNumberBaseConverterInputFile, selectOutputFormat: selectNumberBaseConverterOutputFormat, selectStatus: selectNumberBaseConverterStatus, selectProgress: selectNumberBaseConverterProgress, selectOutputBlob: selectNumberBaseConverterOutputBlob, selectOutputSizeMB: selectNumberBaseConverterOutputSizeMB, selectErrorMessage: selectNumberBaseConverterErrorMessage } = numberBaseConverterFeature;

export {
  NumberBaseConverterActions,
  numberBaseConverterFeature,
  selectNumberBaseConverterState
};
//# sourceMappingURL=chunk-CKNNZTWB.js.map
