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

// src/app/modules/converter/01-image-converter/image-converter.store.ts
var initialState = {
  inputFiles: [],
  outputFormat: "jpeg",
  quality: 85,
  colorSpace: "srgb",
  preserveExif: true,
  lossless: false,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var ImageConverterActions = createActionGroup({
  source: "Image Converter",
  events: {
    "Load Files": props(),
    "Set Output Format": props(),
    "Set Quality": props(),
    "Set Color Space": props(),
    "Toggle Preserve Exif": emptyProps(),
    "Toggle Lossless": emptyProps(),
    "Start Processing": emptyProps(),
    "Update Progress": props(),
    "Processing Success": props(),
    "Processing Failure": props(),
    "Download Output": emptyProps(),
    "Reset State": emptyProps()
  }
});
var imageConverterFeature = createFeature({
  name: "imageConverter",
  reducer: createReducer(initialState, on(ImageConverterActions.loadFiles, (state, { files }) => __spreadProps(__spreadValues({}, state), {
    inputFiles: files,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(ImageConverterActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(ImageConverterActions.setQuality, (state, { quality }) => __spreadProps(__spreadValues({}, state), { quality })), on(ImageConverterActions.setColorSpace, (state, { colorSpace }) => __spreadProps(__spreadValues({}, state), { colorSpace })), on(ImageConverterActions.togglePreserveExif, (state) => __spreadProps(__spreadValues({}, state), { preserveExif: !state.preserveExif })), on(ImageConverterActions.toggleLossless, (state) => __spreadProps(__spreadValues({}, state), { lossless: !state.lossless })), on(ImageConverterActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(ImageConverterActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(ImageConverterActions.processingSuccess, (state, { outputBlob, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputSizeMB
  })), on(ImageConverterActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(ImageConverterActions.resetState, () => initialState))
});
var { selectImageConverterState, selectInputFiles, selectOutputFormat, selectQuality, selectStatus, selectProgress, selectOutputBlob, selectOutputSizeMB, selectErrorCode, selectErrorMessage, selectRetryable } = imageConverterFeature;

export {
  ImageConverterActions,
  imageConverterFeature,
  selectImageConverterState
};
//# sourceMappingURL=chunk-XCWCM5FM.js.map
