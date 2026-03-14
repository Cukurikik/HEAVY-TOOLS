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

// src/app/modules/converter/08-base64-encoder/base64-encoder.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "base64",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var Base64EncoderActions = createActionGroup({
  source: "Base64 Encoder / Decoder",
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
var base64EncoderFeature = createFeature({
  name: "base64Encoder",
  reducer: createReducer(initialState, on(Base64EncoderActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(Base64EncoderActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(Base64EncoderActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(Base64EncoderActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(Base64EncoderActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(Base64EncoderActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(Base64EncoderActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(Base64EncoderActions.resetState, () => initialState))
});
var { selectBase64EncoderState, selectInputFile: selectBase64EncoderInputFile, selectOutputFormat: selectBase64EncoderOutputFormat, selectStatus: selectBase64EncoderStatus, selectProgress: selectBase64EncoderProgress, selectOutputBlob: selectBase64EncoderOutputBlob, selectOutputSizeMB: selectBase64EncoderOutputSizeMB, selectErrorMessage: selectBase64EncoderErrorMessage } = base64EncoderFeature;

export {
  Base64EncoderActions,
  base64EncoderFeature,
  selectBase64EncoderState
};
//# sourceMappingURL=chunk-7S5CSXAD.js.map
