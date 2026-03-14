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

// src/app/modules/converter/22-cad-converter/cad-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "dxf",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var CadConverterActions = createActionGroup({
  source: "CAD Converter",
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
var cadConverterFeature = createFeature({
  name: "cadConverter",
  reducer: createReducer(initialState, on(CadConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(CadConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(CadConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(CadConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(CadConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(CadConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(CadConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(CadConverterActions.resetState, () => initialState))
});
var { selectCadConverterState, selectInputFile: selectCadConverterInputFile, selectOutputFormat: selectCadConverterOutputFormat, selectStatus: selectCadConverterStatus, selectProgress: selectCadConverterProgress, selectOutputBlob: selectCadConverterOutputBlob, selectOutputSizeMB: selectCadConverterOutputSizeMB, selectErrorMessage: selectCadConverterErrorMessage } = cadConverterFeature;

export {
  CadConverterActions,
  cadConverterFeature,
  selectCadConverterState
};
//# sourceMappingURL=chunk-4HQSZUNN.js.map
