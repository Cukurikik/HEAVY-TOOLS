import {
  __spreadValues
} from "./chunk-KWSTWQNB.js";

// src/app/modules/video/video.routes.ts
var VIDEO_ROUTES = [
  __spreadValues({
    path: "trimmer",
    loadComponent: () => import("./chunk-SS4UC34Y.js").then((m) => m.TrimmerComponent),
    title: "Video Trimmer \u2014 Omni-Tool",
    data: { category: "basic" }
  }, false ? { \u0275entryName: "src/app/modules/video/01-trimmer/trimmer.component.ts" } : {}),
  __spreadValues({
    path: "merger",
    loadComponent: () => import("./chunk-PK3MXUS5.js").then((m) => m.MergerComponent),
    title: "Video Merger \u2014 Omni-Tool",
    data: { category: "basic" }
  }, false ? { \u0275entryName: "src/app/modules/video/02-merger/merger.component.ts" } : {}),
  __spreadValues({
    path: "converter",
    loadComponent: () => import("./chunk-KX52HTCA.js").then((m) => m.ConverterComponent),
    title: "Format Converter \u2014 Omni-Tool",
    data: { category: "basic" }
  }, false ? { \u0275entryName: "src/app/modules/video/03-converter/converter.component.ts" } : {}),
  __spreadValues({
    path: "compressor",
    loadComponent: () => import("./chunk-U2ZWDO6U.js").then((m) => m.CompressorComponent),
    title: "Video Compressor \u2014 Omni-Tool",
    data: { category: "basic" }
  }, false ? { \u0275entryName: "src/app/modules/video/04-compressor/compressor.component.ts" } : {}),
  __spreadValues({
    path: "stabilizer",
    loadComponent: () => import("./chunk-C6GQSCTH.js").then((m) => m.StabilizerComponent),
    title: "Video Stabilizer \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, false ? { \u0275entryName: "src/app/modules/video/05-stabilizer/stabilizer.component.ts" } : {}),
  __spreadValues({
    path: "reverser",
    loadComponent: () => import("./chunk-24C4XQ64.js").then((m) => m.ReverserComponent),
    title: "Video Reverser \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, false ? { \u0275entryName: "src/app/modules/video/06-reverser/reverser.component.ts" } : {}),
  __spreadValues({
    path: "speed",
    loadComponent: () => import("./chunk-FVS5422K.js").then((m) => m.SpeedControllerComponent),
    title: "Speed Controller \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, false ? { \u0275entryName: "src/app/modules/video/07-speed-controller/speedController.component.ts" } : {}),
  __spreadValues({
    path: "looper",
    loadComponent: () => import("./chunk-AKBKB7PS.js").then((m) => m.LooperComponent),
    title: "Video Looper \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, false ? { \u0275entryName: "src/app/modules/video/08-looper/looper.component.ts" } : {}),
  __spreadValues({
    path: "flip-rotate",
    loadComponent: () => import("./chunk-T2DOKERS.js").then((m) => m.FlipRotateComponent),
    title: "Flip & Rotate \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, false ? { \u0275entryName: "src/app/modules/video/09-flip-rotate/flipRotate.component.ts" } : {}),
  __spreadValues({
    path: "crop-resize",
    loadComponent: () => import("./chunk-NRDQ7M5S.js").then((m) => m.CropResizeComponent),
    title: "Smart Crop & Resize \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, false ? { \u0275entryName: "src/app/modules/video/10-crop-resize/cropResize.component.ts" } : {}),
  __spreadValues({
    path: "color-grading",
    loadComponent: () => import("./chunk-FXAXCGMZ.js").then((m) => m.ColorGradingComponent),
    title: "Color Grading \u2014 Omni-Tool",
    data: { category: "pro" }
  }, false ? { \u0275entryName: "src/app/modules/video/11-color-grading/colorGrading.component.ts" } : {}),
  __spreadValues({
    path: "subtitles",
    loadComponent: () => import("./chunk-WBRFZJRA.js").then((m) => m.SubtitleBurnerComponent),
    title: "Subtitle Burner \u2014 Omni-Tool",
    data: { category: "pro" }
  }, false ? { \u0275entryName: "src/app/modules/video/12-subtitle-burner/subtitleBurner.component.ts" } : {}),
  __spreadValues({
    path: "thumbnail",
    loadComponent: () => import("./chunk-VD4BPZRB.js").then((m) => m.ThumbnailGeneratorComponent),
    title: "Thumbnail Generator \u2014 Omni-Tool",
    data: { category: "pro" }
  }, false ? { \u0275entryName: "src/app/modules/video/13-thumbnail-generator/thumbnailGenerator.component.ts" } : {}),
  __spreadValues({
    path: "watermark",
    loadComponent: () => import("./chunk-XQAGJUVF.js").then((m) => m.WatermarkComponent),
    title: "Watermark Adder \u2014 Omni-Tool",
    data: { category: "pro" }
  }, false ? { \u0275entryName: "src/app/modules/video/14-watermark/watermark.component.ts" } : {}),
  __spreadValues({
    path: "extract-audio",
    loadComponent: () => import("./chunk-BU6LKC64.js").then((m) => m.AudioExtractorComponent),
    title: "Audio Extractor \u2014 Omni-Tool",
    data: { category: "pro" }
  }, false ? { \u0275entryName: "src/app/modules/video/15-audio-extractor/audioExtractor.component.ts" } : {}),
  __spreadValues({
    path: "replace-audio",
    loadComponent: () => import("./chunk-HLB2MEM7.js").then((m) => m.AudioReplacerComponent),
    title: "Audio Replacer \u2014 Omni-Tool",
    data: { category: "pro" }
  }, false ? { \u0275entryName: "src/app/modules/video/16-audio-replacer/audioReplacer.component.ts" } : {}),
  __spreadValues({
    path: "denoiser",
    loadComponent: () => import("./chunk-35H7WNFS.js").then((m) => m.DenoiserComponent),
    title: "Video Denoiser \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, false ? { \u0275entryName: "src/app/modules/video/17-denoiser/denoiser.component.ts" } : {}),
  __spreadValues({
    path: "interpolate",
    loadComponent: () => import("./chunk-JDV5F5GA.js").then((m) => m.InterpolatorComponent),
    title: "Frame Interpolator \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, false ? { \u0275entryName: "src/app/modules/video/18-interpolator/interpolator.component.ts" } : {}),
  __spreadValues({
    path: "metadata",
    loadComponent: () => import("./chunk-2A6YYH6V.js").then((m) => m.MetadataEditorComponent),
    title: "Metadata Editor \u2014 Omni-Tool",
    data: { category: "pro" }
  }, false ? { \u0275entryName: "src/app/modules/video/19-metadata-editor/metadataEditor.component.ts" } : {}),
  __spreadValues({
    path: "splitter",
    loadComponent: () => import("./chunk-NL2TKJ4L.js").then((m) => m.SplitterComponent),
    title: "Video Splitter \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, false ? { \u0275entryName: "src/app/modules/video/20-splitter/splitter.component.ts" } : {}),
  __spreadValues({
    path: "screen-recorder",
    loadComponent: () => import("./chunk-TJ3CQZ64.js").then((m) => m.ScreenRecorderComponent),
    title: "Screen Recorder \u2014 Omni-Tool",
    data: { category: "pro" }
  }, false ? { \u0275entryName: "src/app/modules/video/21-screen-recorder/screenRecorder.component.ts" } : {}),
  __spreadValues({
    path: "to-gif",
    loadComponent: () => import("./chunk-GXTPUTUA.js").then((m) => m.VideoToGifComponent),
    title: "Video to GIF \u2014 Omni-Tool",
    data: { category: "basic" }
  }, false ? { \u0275entryName: "src/app/modules/video/22-video-to-gif/videoToGif.component.ts" } : {}),
  __spreadValues({
    path: "pip",
    loadComponent: () => import("./chunk-QR6B2LMZ.js").then((m) => m.PipComponent),
    title: "Picture-in-Picture \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, false ? { \u0275entryName: "src/app/modules/video/23-pip/pip.component.ts" } : {}),
  __spreadValues({
    path: "blur",
    loadComponent: () => import("./chunk-OYPJLPPQ.js").then((m) => m.BlurComponent),
    title: "Video Blur \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, false ? { \u0275entryName: "src/app/modules/video/24-blur/blur.component.ts" } : {}),
  __spreadValues({
    path: "transitions",
    loadComponent: () => import("./chunk-J55M5HCH.js").then((m) => m.TransitionsComponent),
    title: "Video Transitions \u2014 Omni-Tool",
    data: { category: "pro" }
  }, false ? { \u0275entryName: "src/app/modules/video/25-transitions/transitions.component.ts" } : {}),
  __spreadValues({
    path: "compare",
    loadComponent: () => import("./chunk-LOVYW5PL.js").then((m) => m.CompareComponent),
    title: "Video Compare \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, false ? { \u0275entryName: "src/app/modules/video/26-compare/compare.component.ts" } : {}),
  __spreadValues({
    path: "slideshow",
    loadComponent: () => import("./chunk-7TFFYYK7.js").then((m) => m.SlideshowComponent),
    title: "Slideshow Maker \u2014 Omni-Tool",
    data: { category: "pro" }
  }, false ? { \u0275entryName: "src/app/modules/video/27-slideshow/slideshow.component.ts" } : {}),
  __spreadValues({
    path: "batch",
    loadComponent: () => import("./chunk-AASQDHNG.js").then((m) => m.BatchComponent),
    title: "Batch Processor \u2014 Omni-Tool",
    data: { category: "pro" }
  }, false ? { \u0275entryName: "src/app/modules/video/28-batch/batch.component.ts" } : {}),
  __spreadValues({
    path: "analyser",
    loadComponent: () => import("./chunk-GAXLZZIW.js").then((m) => m.AnalyserComponent),
    title: "Video Analyser \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, false ? { \u0275entryName: "src/app/modules/video/29-analyser/analyser.component.ts" } : {}),
  __spreadValues({
    path: "upscaler",
    loadComponent: () => import("./chunk-F5XQ6MNG.js").then((m) => m.UpscalerComponent),
    title: "AI Video Upscaler \u2014 Omni-Tool",
    data: { category: "ai" }
  }, false ? { \u0275entryName: "src/app/modules/video/30-upscaler/upscaler.component.ts" } : {}),
  {
    path: "",
    redirectTo: "trimmer",
    pathMatch: "full"
  }
];
export {
  VIDEO_ROUTES
};
//# sourceMappingURL=chunk-CBQY6EIP.js.map
