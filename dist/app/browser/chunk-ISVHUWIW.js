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

// src/app/modules/converter/10-csv-converter/csv-converter.store.ts
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
var CsvConverterActions = createActionGroup({
  source: "CSV Converter",
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
var csvConverterFeature = createFeature({
  name: "csvConverter",
  reducer: createReducer(initialState, on(CsvConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(CsvConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(CsvConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(CsvConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(CsvConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(CsvConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(CsvConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(CsvConverterActions.resetState, () => initialState))
});
var { selectCsvConverterState, selectInputFile: selectCsvConverterInputFile, selectOutputFormat: selectCsvConverterOutputFormat, selectStatus: selectCsvConverterStatus, selectProgress: selectCsvConverterProgress, selectOutputBlob: selectCsvConverterOutputBlob, selectOutputSizeMB: selectCsvConverterOutputSizeMB, selectErrorMessage: selectCsvConverterErrorMessage } = csvConverterFeature;

export {
  CsvConverterActions,
  csvConverterFeature,
  selectCsvConverterState
};
//# sourceMappingURL=chunk-ISVHUWIW.js.map
