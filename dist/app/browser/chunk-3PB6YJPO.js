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

// src/app/modules/converter/23-subtitle-converter/subtitle-converter.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "srt",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var SubtitleConverterActions = createActionGroup({
  source: "Subtitle Converter",
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
var subtitleConverterFeature = createFeature({
  name: "subtitleConverter",
  reducer: createReducer(initialState, on(SubtitleConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(SubtitleConverterActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(SubtitleConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(SubtitleConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(SubtitleConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(SubtitleConverterActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(SubtitleConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(SubtitleConverterActions.resetState, () => initialState))
});
var { selectSubtitleConverterState, selectInputFile: selectSubtitleConverterInputFile, selectOutputFormat: selectSubtitleConverterOutputFormat, selectStatus: selectSubtitleConverterStatus, selectProgress: selectSubtitleConverterProgress, selectOutputBlob: selectSubtitleConverterOutputBlob, selectOutputSizeMB: selectSubtitleConverterOutputSizeMB, selectErrorMessage: selectSubtitleConverterErrorMessage } = subtitleConverterFeature;

export {
  SubtitleConverterActions,
  subtitleConverterFeature,
  selectSubtitleConverterState
};
//# sourceMappingURL=chunk-3PB6YJPO.js.map
