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

// src/app/modules/converter/26-barcode-generator/barcode-generator.store.ts
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
var BarcodeGeneratorActions = createActionGroup({
  source: "Barcode Generator",
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
var barcodeGeneratorFeature = createFeature({
  name: "barcodeGenerator",
  reducer: createReducer(initialState, on(BarcodeGeneratorActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(BarcodeGeneratorActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(BarcodeGeneratorActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(BarcodeGeneratorActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(BarcodeGeneratorActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(BarcodeGeneratorActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(BarcodeGeneratorActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(BarcodeGeneratorActions.resetState, () => initialState))
});
var { selectBarcodeGeneratorState, selectInputFile: selectBarcodeGeneratorInputFile, selectOutputFormat: selectBarcodeGeneratorOutputFormat, selectStatus: selectBarcodeGeneratorStatus, selectProgress: selectBarcodeGeneratorProgress, selectOutputBlob: selectBarcodeGeneratorOutputBlob, selectOutputSizeMB: selectBarcodeGeneratorOutputSizeMB, selectErrorMessage: selectBarcodeGeneratorErrorMessage } = barcodeGeneratorFeature;

export {
  BarcodeGeneratorActions,
  barcodeGeneratorFeature,
  selectBarcodeGeneratorState
};
//# sourceMappingURL=chunk-5O2ZPV5R.js.map
