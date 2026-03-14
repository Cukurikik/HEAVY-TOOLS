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

// src/app/modules/converter/12-html-converter/html-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "pdf",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var HtmlConverterActions = createActionGroup({
  source: "HTML Converter",
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
var htmlConverterFeature = createFeature({
  name: "htmlConverter",
  reducer: createReducer(initialState, on(HtmlConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(HtmlConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(HtmlConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(HtmlConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(HtmlConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(HtmlConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(HtmlConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(HtmlConverterActions.resetState, () => initialState))
});
var { selectHtmlConverterState, selectInputFile: selectHtmlConverterInputFile, selectOutputFormat: selectHtmlConverterOutputFormat, selectStatus: selectHtmlConverterStatus, selectProgress: selectHtmlConverterProgress, selectOutputBlob: selectHtmlConverterOutputBlob, selectOutputSizeMB: selectHtmlConverterOutputSizeMB, selectErrorMessage: selectHtmlConverterErrorMessage } = htmlConverterFeature;

export {
  HtmlConverterActions,
  htmlConverterFeature,
  selectHtmlConverterState
};
//# sourceMappingURL=chunk-EOLBFRAE.js.map
