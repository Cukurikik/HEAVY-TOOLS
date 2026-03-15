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

// src/app/modules/converter/05-image-resizer/image-resizer.store.ts
var initialState = {
  inputFile: null,
  inputText: "",
  outputFormat: "original",
  outputBlob: null,
  outputText: "",
  status: "idle",
  progress: 0,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var ImageResizerActions = createActionGroup({
  source: "Image Resizer",
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
var imageResizerFeature = createFeature({
  name: "imageResizer",
  reducer: createReducer(initialState, on(ImageResizerActions.loadFile, (state, { file }) => __spreadProps(__spreadValues({}, state), {
    inputFile: file,
    status: "idle",
    errorCode: null,
    errorMessage: null
  })), on(ImageResizerActions.setInputText, (state, { text }) => __spreadProps(__spreadValues({}, state), { inputText: text })), on(ImageResizerActions.setOutputFormat, (state, { format }) => __spreadProps(__spreadValues({}, state), { outputFormat: format })), on(ImageResizerActions.startProcessing, (state) => __spreadProps(__spreadValues({}, state), {
    status: "processing",
    progress: 0,
    outputBlob: null,
    outputText: "",
    outputSizeMB: null,
    errorCode: null,
    errorMessage: null
  })), on(ImageResizerActions.updateProgress, (state, { progress }) => __spreadProps(__spreadValues({}, state), { progress })), on(ImageResizerActions.processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => __spreadProps(__spreadValues({}, state), {
    status: "done",
    progress: 100,
    outputBlob,
    outputText,
    outputSizeMB
  })), on(ImageResizerActions.processingFailure, (state, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, state), {
    status: "error",
    errorCode,
    errorMessage: message,
    retryable
  })), on(ImageResizerActions.resetState, () => initialState))
});
var { selectImageResizerState, selectInputFile: selectImageResizerInputFile, selectOutputFormat: selectImageResizerOutputFormat, selectStatus: selectImageResizerStatus, selectProgress: selectImageResizerProgress, selectOutputBlob: selectImageResizerOutputBlob, selectOutputSizeMB: selectImageResizerOutputSizeMB, selectErrorMessage: selectImageResizerErrorMessage } = imageResizerFeature;

export {
  ImageResizerActions,
  imageResizerFeature,
  selectImageResizerState
};
//# sourceMappingURL=chunk-JETNDNOI.mjs.map
