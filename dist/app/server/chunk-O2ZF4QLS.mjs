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

// src/app/modules/converter/19-font-converter/font-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "ttf",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var FontConverterActions = createActionGroup({
  source: "Font Converter",
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
var fontConverterFeature = createFeature({
  name: "fontConverter",
  reducer: createReducer(initialState, on(FontConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(FontConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(FontConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(FontConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(FontConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(FontConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(FontConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(FontConverterActions.resetState, () => initialState))
});
var { selectFontConverterState, selectInputFile: selectFontConverterInputFile, selectOutputFormat: selectFontConverterOutputFormat, selectStatus: selectFontConverterStatus, selectProgress: selectFontConverterProgress, selectOutputBlob: selectFontConverterOutputBlob, selectOutputSizeMB: selectFontConverterOutputSizeMB, selectErrorMessage: selectFontConverterErrorMessage } = fontConverterFeature;

export {
  FontConverterActions,
  fontConverterFeature,
  selectFontConverterState
};
//# sourceMappingURL=chunk-O2ZF4QLS.mjs.map
