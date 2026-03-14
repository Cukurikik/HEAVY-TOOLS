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

// src/app/modules/converter/25-qr-generator/qr-generator.store.ts
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
var QrGeneratorActions = createActionGroup({
  source: "QR Code Generator",
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
var qrGeneratorFeature = createFeature({
  name: "qrGenerator",
  reducer: createReducer(initialState, on(QrGeneratorActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(QrGeneratorActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(QrGeneratorActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(QrGeneratorActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(QrGeneratorActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(QrGeneratorActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(QrGeneratorActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(QrGeneratorActions.resetState, () => initialState))
});
var { selectQrGeneratorState, selectInputFile: selectQrGeneratorInputFile, selectOutputFormat: selectQrGeneratorOutputFormat, selectStatus: selectQrGeneratorStatus, selectProgress: selectQrGeneratorProgress, selectOutputBlob: selectQrGeneratorOutputBlob, selectOutputSizeMB: selectQrGeneratorOutputSizeMB, selectErrorMessage: selectQrGeneratorErrorMessage } = qrGeneratorFeature;

export {
  QrGeneratorActions,
  qrGeneratorFeature,
  selectQrGeneratorState
};
//# sourceMappingURL=chunk-BF7PJVI6.mjs.map
