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

// src/app/modules/converter/20-ebook-converter/ebook-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "epub",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var EbookConverterActions = createActionGroup({
  source: "Ebook Converter",
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
var ebookConverterFeature = createFeature({
  name: "ebookConverter",
  reducer: createReducer(initialState, on(EbookConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(EbookConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(EbookConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(EbookConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(EbookConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(EbookConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(EbookConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(EbookConverterActions.resetState, () => initialState))
});
var { selectEbookConverterState, selectInputFile: selectEbookConverterInputFile, selectOutputFormat: selectEbookConverterOutputFormat, selectStatus: selectEbookConverterStatus, selectProgress: selectEbookConverterProgress, selectOutputBlob: selectEbookConverterOutputBlob, selectOutputSizeMB: selectEbookConverterOutputSizeMB, selectErrorMessage: selectEbookConverterErrorMessage } = ebookConverterFeature;

export {
  EbookConverterActions,
  ebookConverterFeature,
  selectEbookConverterState
};
//# sourceMappingURL=chunk-YDVPPVC6.mjs.map
