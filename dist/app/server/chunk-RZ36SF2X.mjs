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

// src/app/modules/converter/07-svg-converter/svg-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "png",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var SvgConverterActions = createActionGroup({
  source: "SVG Converter",
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
var svgConverterFeature = createFeature({
  name: "svgConverter",
  reducer: createReducer(initialState, on(SvgConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(SvgConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(SvgConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(SvgConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(SvgConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(SvgConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(SvgConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(SvgConverterActions.resetState, () => initialState))
});
var { selectSvgConverterState, selectInputFile: selectSvgConverterInputFile, selectOutputFormat: selectSvgConverterOutputFormat, selectStatus: selectSvgConverterStatus, selectProgress: selectSvgConverterProgress, selectOutputBlob: selectSvgConverterOutputBlob, selectOutputSizeMB: selectSvgConverterOutputSizeMB, selectErrorMessage: selectSvgConverterErrorMessage } = svgConverterFeature;

export {
  SvgConverterActions,
  svgConverterFeature,
  selectSvgConverterState
};
//# sourceMappingURL=chunk-RZ36SF2X.mjs.map
