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

// src/app/modules/converter/21-archive-converter/archive-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "zip",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var ArchiveConverterActions = createActionGroup({
  source: "Archive Converter",
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
var archiveConverterFeature = createFeature({
  name: "archiveConverter",
  reducer: createReducer(initialState, on(ArchiveConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(ArchiveConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(ArchiveConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(ArchiveConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(ArchiveConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(ArchiveConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(ArchiveConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(ArchiveConverterActions.resetState, () => initialState))
});
var { selectArchiveConverterState, selectInputFile: selectArchiveConverterInputFile, selectOutputFormat: selectArchiveConverterOutputFormat, selectStatus: selectArchiveConverterStatus, selectProgress: selectArchiveConverterProgress, selectOutputBlob: selectArchiveConverterOutputBlob, selectOutputSizeMB: selectArchiveConverterOutputSizeMB, selectErrorMessage: selectArchiveConverterErrorMessage } = archiveConverterFeature;

export {
  ArchiveConverterActions,
  archiveConverterFeature,
  selectArchiveConverterState
};
//# sourceMappingURL=chunk-MPV7ZJXA.js.map
