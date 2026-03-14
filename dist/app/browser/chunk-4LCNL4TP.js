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

// src/app/modules/converter/02-video-converter/video-converter.store.ts
var initialState = {
  inputFile: null,
  outputFormat: "mp4",
  crf: 23,
  encodingSpeed: "medium",
  resolution: "original",
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var VideoConverterActions = createActionGroup({
  source: "Video Converter",
  events: {
    "Load File": props(),
    "Set Output Format": props(),
    "Set CRF": props(),
    "Set Encoding Speed": props(),
    "Set Resolution": props(),
    "Start Processing": emptyProps(),
    "Update Progress": props(),
    "Processing Success": props(),
    "Processing Failure": props(),
    "Download Output": emptyProps(),
    "Reset State": emptyProps()
  }
});
var videoConverterFeature = createFeature({
  name: "videoConverter",
  reducer: createReducer(initialState, on(VideoConverterActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), { inputFile: file, status: "idle", errorCode: null, errorMessage: null })), on(VideoConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(VideoConverterActions.setCRF, (state, { crf }) => __spreadProps(__spreadValues({}, state), { crf })), on(VideoConverterActions.setEncodingSpeed, (state, { speed }) => __spreadProps(__spreadValues({}, state), { encodingSpeed: speed })), on(VideoConverterActions.setResolution, (state, { resolution }) => __spreadProps(__spreadValues({}, state), { resolution })), on(VideoConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), { status: "processing", progress: 0, outputBlob: null, outputSizeMB: null, errorCode: null, errorMessage: null })), on(VideoConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(VideoConverterActions.processingSuccess, (state, { outputBlob, outputSizeMB }) => __spreadProps(__spreadValues({}, state), { status: "done", progress: 100, outputBlob, outputSizeMB })), on(VideoConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), { status: "error", errorCode, errorMessage: message, retryable })), on(VideoConverterActions.resetState, () => initialState))
});
var { selectVideoConverterState, selectInputFile: selectVideoInputFile, selectOutputFormat: selectVideoOutputFormat, selectStatus: selectVideoStatus, selectProgress: selectVideoProgress, selectOutputBlob: selectVideoOutputBlob, selectOutputSizeMB: selectVideoOutputSizeMB, selectErrorMessage: selectVideoErrorMessage } = videoConverterFeature;

export {
  VideoConverterActions,
  videoConverterFeature,
  selectVideoConverterState
};
//# sourceMappingURL=chunk-4LCNL4TP.js.map
