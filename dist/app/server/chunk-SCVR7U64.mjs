import './polyfills.server.mjs';
import {
  __spreadValues
} from "./chunk-UFAUNXOA.mjs";

// src/app/modules/video/video.routes.ts
var VIDEO_ROUTES = [
  __spreadValues({
    path: "trimmer",
    loadComponent: () => import("./chunk-4EQ4QXX2.mjs").then((m) => m.TrimmerComponent),
    title: "Video Trimmer \u2014 Omni-Tool",
    data: { category: "basic" }
  }, true ? { \u0275entryName: "src/app/modules/video/01-trimmer/trimmer.component.ts" } : {}),
  __spreadValues({
    path: "merger",
    loadComponent: () => import("./chunk-VDMTWTWQ.mjs").then((m) => m.MergerComponent),
    title: "Video Merger \u2014 Omni-Tool",
    data: { category: "basic" }
  }, true ? { \u0275entryName: "src/app/modules/video/02-merger/merger.component.ts" } : {}),
  __spreadValues({
    path: "converter",
    loadComponent: () => import("./chunk-RLTVR7M5.mjs").then((m) => m.ConverterComponent),
    title: "Format Converter \u2014 Omni-Tool",
    data: { category: "basic" }
  }, true ? { \u0275entryName: "src/app/modules/video/03-converter/converter.component.ts" } : {}),
  __spreadValues({
    path: "compressor",
    loadComponent: () => import("./chunk-NEARWNNK.mjs").then((m) => m.CompressorComponent),
    title: "Video Compressor \u2014 Omni-Tool",
    data: { category: "basic" }
  }, true ? { \u0275entryName: "src/app/modules/video/04-compressor/compressor.component.ts" } : {}),
  __spreadValues({
    path: "stabilizer",
    loadComponent: () => import("./chunk-H4KD2YFI.mjs").then((m) => m.StabilizerComponent),
    title: "Video Stabilizer \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, true ? { \u0275entryName: "src/app/modules/video/05-stabilizer/stabilizer.component.ts" } : {}),
  __spreadValues({
    path: "reverser",
    loadComponent: () => import("./chunk-75I3FRZ6.mjs").then((m) => m.ReverserComponent),
    title: "Video Reverser \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, true ? { \u0275entryName: "src/app/modules/video/06-reverser/reverser.component.ts" } : {}),
  __spreadValues({
    path: "speed",
    loadComponent: () => import("./chunk-STK2SF3K.mjs").then((m) => m.SpeedControllerComponent),
    title: "Speed Controller \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, true ? { \u0275entryName: "src/app/modules/video/07-speed-controller/speedController.component.ts" } : {}),
  __spreadValues({
    path: "looper",
    loadComponent: () => import("./chunk-XZ4SRORM.mjs").then((m) => m.LooperComponent),
    title: "Video Looper \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, true ? { \u0275entryName: "src/app/modules/video/08-looper/looper.component.ts" } : {}),
  __spreadValues({
    path: "flip-rotate",
    loadComponent: () => import("./chunk-Y424JBBV.mjs").then((m) => m.FlipRotateComponent),
    title: "Flip & Rotate \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, true ? { \u0275entryName: "src/app/modules/video/09-flip-rotate/flipRotate.component.ts" } : {}),
  __spreadValues({
    path: "crop-resize",
    loadComponent: () => import("./chunk-S72QAYQ3.mjs").then((m) => m.CropResizeComponent),
    title: "Smart Crop & Resize \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, true ? { \u0275entryName: "src/app/modules/video/10-crop-resize/cropResize.component.ts" } : {}),
  __spreadValues({
    path: "color-grading",
    loadComponent: () => import("./chunk-4SCHT43C.mjs").then((m) => m.ColorGradingComponent),
    title: "Color Grading \u2014 Omni-Tool",
    data: { category: "pro" }
  }, true ? { \u0275entryName: "src/app/modules/video/11-color-grading/colorGrading.component.ts" } : {}),
  __spreadValues({
    path: "subtitles",
    loadComponent: () => import("./chunk-24ELTCSE.mjs").then((m) => m.SubtitleBurnerComponent),
    title: "Subtitle Burner \u2014 Omni-Tool",
    data: { category: "pro" }
  }, true ? { \u0275entryName: "src/app/modules/video/12-subtitle-burner/subtitleBurner.component.ts" } : {}),
  __spreadValues({
    path: "thumbnail",
    loadComponent: () => import("./chunk-QHKKZGKE.mjs").then((m) => m.ThumbnailGeneratorComponent),
    title: "Thumbnail Generator \u2014 Omni-Tool",
    data: { category: "pro" }
  }, true ? { \u0275entryName: "src/app/modules/video/13-thumbnail-generator/thumbnailGenerator.component.ts" } : {}),
  __spreadValues({
    path: "watermark",
    loadComponent: () => import("./chunk-R2PZDNCM.mjs").then((m) => m.WatermarkComponent),
    title: "Watermark Adder \u2014 Omni-Tool",
    data: { category: "pro" }
  }, true ? { \u0275entryName: "src/app/modules/video/14-watermark/watermark.component.ts" } : {}),
  __spreadValues({
    path: "extract-audio",
    loadComponent: () => import("./chunk-2RCVCZTK.mjs").then((m) => m.AudioExtractorComponent),
    title: "Audio Extractor \u2014 Omni-Tool",
    data: { category: "pro" }
  }, true ? { \u0275entryName: "src/app/modules/video/15-audio-extractor/audioExtractor.component.ts" } : {}),
  __spreadValues({
    path: "replace-audio",
    loadComponent: () => import("./chunk-OEW3XBGP.mjs").then((m) => m.AudioReplacerComponent),
    title: "Audio Replacer \u2014 Omni-Tool",
    data: { category: "pro" }
  }, true ? { \u0275entryName: "src/app/modules/video/16-audio-replacer/audioReplacer.component.ts" } : {}),
  __spreadValues({
    path: "denoiser",
    loadComponent: () => import("./chunk-CZOWW653.mjs").then((m) => m.DenoiserComponent),
    title: "Video Denoiser \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, true ? { \u0275entryName: "src/app/modules/video/17-denoiser/denoiser.component.ts" } : {}),
  __spreadValues({
    path: "interpolate",
    loadComponent: () => import("./chunk-AHKYB7MD.mjs").then((m) => m.InterpolatorComponent),
    title: "Frame Interpolator \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, true ? { \u0275entryName: "src/app/modules/video/18-interpolator/interpolator.component.ts" } : {}),
  __spreadValues({
    path: "metadata",
    loadComponent: () => import("./chunk-UAHHHBP4.mjs").then((m) => m.MetadataEditorComponent),
    title: "Metadata Editor \u2014 Omni-Tool",
    data: { category: "pro" }
  }, true ? { \u0275entryName: "src/app/modules/video/19-metadata-editor/metadataEditor.component.ts" } : {}),
  __spreadValues({
    path: "splitter",
    loadComponent: () => import("./chunk-X3DHZRQB.mjs").then((m) => m.SplitterComponent),
    title: "Video Splitter \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, true ? { \u0275entryName: "src/app/modules/video/20-splitter/splitter.component.ts" } : {}),
  __spreadValues({
    path: "screen-recorder",
    loadComponent: () => import("./chunk-Y7VQ7DMM.mjs").then((m) => m.ScreenRecorderComponent),
    title: "Screen Recorder \u2014 Omni-Tool",
    data: { category: "pro" }
  }, true ? { \u0275entryName: "src/app/modules/video/21-screen-recorder/screenRecorder.component.ts" } : {}),
  __spreadValues({
    path: "to-gif",
    loadComponent: () => import("./chunk-YQHLPABR.mjs").then((m) => m.VideoToGifComponent),
    title: "Video to GIF \u2014 Omni-Tool",
    data: { category: "basic" }
  }, true ? { \u0275entryName: "src/app/modules/video/22-video-to-gif/videoToGif.component.ts" } : {}),
  __spreadValues({
    path: "pip",
    loadComponent: () => import("./chunk-K4E5NX3Y.mjs").then((m) => m.PipComponent),
    title: "Picture-in-Picture \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, true ? { \u0275entryName: "src/app/modules/video/23-pip/pip.component.ts" } : {}),
  __spreadValues({
    path: "blur",
    loadComponent: () => import("./chunk-M2LFLFBQ.mjs").then((m) => m.BlurComponent),
    title: "Video Blur \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, true ? { \u0275entryName: "src/app/modules/video/24-blur/blur.component.ts" } : {}),
  __spreadValues({
    path: "transitions",
    loadComponent: () => import("./chunk-TXCTOIKU.mjs").then((m) => m.TransitionsComponent),
    title: "Video Transitions \u2014 Omni-Tool",
    data: { category: "pro" }
  }, true ? { \u0275entryName: "src/app/modules/video/25-transitions/transitions.component.ts" } : {}),
  __spreadValues({
    path: "compare",
    loadComponent: () => import("./chunk-RHPPRDTT.mjs").then((m) => m.CompareComponent),
    title: "Video Compare \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, true ? { \u0275entryName: "src/app/modules/video/26-compare/compare.component.ts" } : {}),
  __spreadValues({
    path: "slideshow",
    loadComponent: () => import("./chunk-L4NDWVJ2.mjs").then((m) => m.SlideshowComponent),
    title: "Slideshow Maker \u2014 Omni-Tool",
    data: { category: "pro" }
  }, true ? { \u0275entryName: "src/app/modules/video/27-slideshow/slideshow.component.ts" } : {}),
  __spreadValues({
    path: "batch",
    loadComponent: () => import("./chunk-MWY5UTJV.mjs").then((m) => m.BatchComponent),
    title: "Batch Processor \u2014 Omni-Tool",
    data: { category: "pro" }
  }, true ? { \u0275entryName: "src/app/modules/video/28-batch/batch.component.ts" } : {}),
  __spreadValues({
    path: "analyser",
    loadComponent: () => import("./chunk-ZIRHOZ5S.mjs").then((m) => m.AnalyserComponent),
    title: "Video Analyser \u2014 Omni-Tool",
    data: { category: "advanced" }
  }, true ? { \u0275entryName: "src/app/modules/video/29-analyser/analyser.component.ts" } : {}),
  __spreadValues({
    path: "upscaler",
    loadComponent: () => import("./chunk-LXY5Z5UN.mjs").then((m) => m.UpscalerComponent),
    title: "AI Video Upscaler \u2014 Omni-Tool",
    data: { category: "ai" }
  }, true ? { \u0275entryName: "src/app/modules/video/30-upscaler/upscaler.component.ts" } : {}),
  {
    path: "",
    redirectTo: "trimmer",
    pathMatch: "full"
  }
];
export {
  VIDEO_ROUTES
};
//# sourceMappingURL=chunk-SCVR7U64.mjs.map
