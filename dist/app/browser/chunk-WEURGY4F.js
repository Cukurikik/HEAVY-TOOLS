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

// src/app/modules/converter/27-ico-converter/ico-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "ico",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var IcoConverterActions = createActionGroup({
  source: "ICO / Favicon Converter",
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
var icoConverterFeature = createFeature({
  name: "icoConverter",
  reducer: createReducer(initialState, on(IcoConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(IcoConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(IcoConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(IcoConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(IcoConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(IcoConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(IcoConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(IcoConverterActions.resetState, () => initialState))
});
var { selectIcoConverterState, selectInputFile: selectIcoConverterInputFile, selectOutputFormat: selectIcoConverterOutputFormat, selectStatus: selectIcoConverterStatus, selectProgress: selectIcoConverterProgress, selectOutputBlob: selectIcoConverterOutputBlob, selectOutputSizeMB: selectIcoConverterOutputSizeMB, selectErrorMessage: selectIcoConverterErrorMessage } = icoConverterFeature;

export {
  IcoConverterActions,
  icoConverterFeature,
  selectIcoConverterState
};
//# sourceMappingURL=chunk-WEURGY4F.js.map
