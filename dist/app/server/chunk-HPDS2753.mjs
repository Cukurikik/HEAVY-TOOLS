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

// src/app/modules/converter/16-timezone-converter/timezone-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "UTC",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var TimezoneConverterActions = createActionGroup({
  source: "Timezone Converter",
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
var timezoneConverterFeature = createFeature({
  name: "timezoneConverter",
  reducer: createReducer(initialState, on(TimezoneConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(TimezoneConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(TimezoneConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(TimezoneConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(TimezoneConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(TimezoneConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(TimezoneConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(TimezoneConverterActions.resetState, () => initialState))
});
var { selectTimezoneConverterState, selectInputFile: selectTimezoneConverterInputFile, selectOutputFormat: selectTimezoneConverterOutputFormat, selectStatus: selectTimezoneConverterStatus, selectProgress: selectTimezoneConverterProgress, selectOutputBlob: selectTimezoneConverterOutputBlob, selectOutputSizeMB: selectTimezoneConverterOutputSizeMB, selectErrorMessage: selectTimezoneConverterErrorMessage } = timezoneConverterFeature;

export {
  TimezoneConverterActions,
  timezoneConverterFeature,
  selectTimezoneConverterState
};
//# sourceMappingURL=chunk-HPDS2753.mjs.map
