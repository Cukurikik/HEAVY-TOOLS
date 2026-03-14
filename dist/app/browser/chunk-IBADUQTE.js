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

// src/app/modules/converter/15-currency-converter/currency-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "USD",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var CurrencyConverterActions = createActionGroup({
  source: "Currency Converter",
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
var currencyConverterFeature = createFeature({
  name: "currencyConverter",
  reducer: createReducer(initialState, on(CurrencyConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(CurrencyConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(CurrencyConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(CurrencyConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(CurrencyConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(CurrencyConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(CurrencyConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(CurrencyConverterActions.resetState, () => initialState))
});
var { selectCurrencyConverterState, selectInputFile: selectCurrencyConverterInputFile, selectOutputFormat: selectCurrencyConverterOutputFormat, selectStatus: selectCurrencyConverterStatus, selectProgress: selectCurrencyConverterProgress, selectOutputBlob: selectCurrencyConverterOutputBlob, selectOutputSizeMB: selectCurrencyConverterOutputSizeMB, selectErrorMessage: selectCurrencyConverterErrorMessage } = currencyConverterFeature;

export {
  CurrencyConverterActions,
  currencyConverterFeature,
  selectCurrencyConverterState
};
//# sourceMappingURL=chunk-IBADUQTE.js.map
