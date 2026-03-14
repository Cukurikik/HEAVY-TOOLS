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

// src/app/modules/converter/30-batch-converter/batch-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "auto",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var BatchConverterActions = createActionGroup({
  source: "Batch Converter",
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
var batchConverterFeature = createFeature({
  name: "batchConverter",
  reducer: createReducer(initialState, on(BatchConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(BatchConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(BatchConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(BatchConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(BatchConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(BatchConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(BatchConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(BatchConverterActions.resetState, () => initialState))
});
var { selectBatchConverterState, selectInputFile: selectBatchConverterInputFile, selectOutputFormat: selectBatchConverterOutputFormat, selectStatus: selectBatchConverterStatus, selectProgress: selectBatchConverterProgress, selectOutputBlob: selectBatchConverterOutputBlob, selectOutputSizeMB: selectBatchConverterOutputSizeMB, selectErrorMessage: selectBatchConverterErrorMessage } = batchConverterFeature;

export {
  BatchConverterActions,
  batchConverterFeature,
  selectBatchConverterState
};
//# sourceMappingURL=chunk-LM5M3KOQ.js.map
