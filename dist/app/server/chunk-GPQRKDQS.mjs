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

// src/app/modules/converter/14-unit-converter/unit-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "length",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var UnitConverterActions = createActionGroup({
  source: "Unit Converter",
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
var unitConverterFeature = createFeature({
  name: "unitConverter",
  reducer: createReducer(initialState, on(UnitConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(UnitConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(UnitConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(UnitConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(UnitConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(UnitConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(UnitConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(UnitConverterActions.resetState, () => initialState))
});
var { selectUnitConverterState, selectInputFile: selectUnitConverterInputFile, selectOutputFormat: selectUnitConverterOutputFormat, selectStatus: selectUnitConverterStatus, selectProgress: selectUnitConverterProgress, selectOutputBlob: selectUnitConverterOutputBlob, selectOutputSizeMB: selectUnitConverterOutputSizeMB, selectErrorMessage: selectUnitConverterErrorMessage } = unitConverterFeature;

export {
  UnitConverterActions,
  unitConverterFeature,
  selectUnitConverterState
};
//# sourceMappingURL=chunk-GPQRKDQS.mjs.map
