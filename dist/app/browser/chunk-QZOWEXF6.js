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

// src/app/modules/converter/06-image-compressor/image-compressor.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "jpeg",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var ImageCompressorActions = createActionGroup({
  source: "Image Compressor",
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
var imageCompressorFeature = createFeature({
  name: "imageCompressor",
  reducer: createReducer(initialState, on(ImageCompressorActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(ImageCompressorActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(ImageCompressorActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(ImageCompressorActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(ImageCompressorActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(ImageCompressorActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(ImageCompressorActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(ImageCompressorActions.resetState, () => initialState))
});
var { selectImageCompressorState, selectInputFile: selectImageCompressorInputFile, selectOutputFormat: selectImageCompressorOutputFormat, selectStatus: selectImageCompressorStatus, selectProgress: selectImageCompressorProgress, selectOutputBlob: selectImageCompressorOutputBlob, selectOutputSizeMB: selectImageCompressorOutputSizeMB, selectErrorMessage: selectImageCompressorErrorMessage } = imageCompressorFeature;

export {
  ImageCompressorActions,
  imageCompressorFeature,
  selectImageCompressorState
};
//# sourceMappingURL=chunk-QZOWEXF6.js.map
