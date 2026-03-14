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

// src/app/modules/converter/24-spreadsheet-converter/spreadsheet-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "xlsx",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var SpreadsheetConverterActions = createActionGroup({
  source: "Spreadsheet Converter",
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
var spreadsheetConverterFeature = createFeature({
  name: "spreadsheetConverter",
  reducer: createReducer(initialState, on(SpreadsheetConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(SpreadsheetConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(SpreadsheetConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(SpreadsheetConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(SpreadsheetConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(SpreadsheetConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(SpreadsheetConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(SpreadsheetConverterActions.resetState, () => initialState))
});
var { selectSpreadsheetConverterState, selectInputFile: selectSpreadsheetConverterInputFile, selectOutputFormat: selectSpreadsheetConverterOutputFormat, selectStatus: selectSpreadsheetConverterStatus, selectProgress: selectSpreadsheetConverterProgress, selectOutputBlob: selectSpreadsheetConverterOutputBlob, selectOutputSizeMB: selectSpreadsheetConverterOutputSizeMB, selectErrorMessage: selectSpreadsheetConverterErrorMessage } = spreadsheetConverterFeature;

export {
  SpreadsheetConverterActions,
  spreadsheetConverterFeature,
  selectSpreadsheetConverterState
};
//# sourceMappingURL=chunk-P3SNWOM3.mjs.map
