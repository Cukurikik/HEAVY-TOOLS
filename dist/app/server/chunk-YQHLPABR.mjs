import './polyfills.server.mjs';
import {
  VideoPreviewComponent
} from "./chunk-6PSCKHSH.mjs";
import {
  ProgressRingComponent
} from "./chunk-KEW7E4YQ.mjs";
import {
  FFmpegService
} from "./chunk-RBKSEVDY.mjs";
import {
  FileDropZoneComponent
} from "./chunk-3HMIAJ6S.mjs";
import {
  ExportPanelComponent
} from "./chunk-DRCAXV2I.mjs";
import {
  WorkerBridgeService
} from "./chunk-43AJVV2P.mjs";
import {
  Store,
  createAction,
  createFeature,
  createReducer,
  createSelector,
  on,
  props
} from "./chunk-GPJTNT77.mjs";
import {
  AsyncPipe,
  CommonModule,
  DecimalPipe
} from "./chunk-PHM5A5ZP.mjs";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalBranchCreate,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-CX47CWGJ.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-UFAUNXOA.mjs";

// src/app/modules/video/22-video-to-gif/videoToGif.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  startTime: 0,
  endTime: 10,
  fps: 10,
  width: 480,
  dither: "bayer",
  estimatedSizeKB: 0,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var VideoToGifActions = {
  loadFile: createAction("[VideoToGif] Load File", props()),
  loadMetaSuccess: createAction("[VideoToGif] Meta OK", props()),
  loadMetaFailure: createAction("[VideoToGif] Meta Fail", props()),
  updateConfig: createAction("[VideoToGif] Update Config", props()),
  startProcessing: createAction("[VideoToGif] Start"),
  updateProgress: createAction("[VideoToGif] Progress", props()),
  processingSuccess: createAction("[VideoToGif] Success", props()),
  processingFailure: createAction("[VideoToGif] Failure", props()),
  downloadOutput: createAction("[VideoToGif] Download"),
  resetState: createAction("[VideoToGif] Reset")
};
var videoToGifFeature = createFeature({
  name: "videoToGif",
  reducer: createReducer(init, on(VideoToGifActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(VideoToGifActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(VideoToGifActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(VideoToGifActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(VideoToGifActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(VideoToGifActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(VideoToGifActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(VideoToGifActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(VideoToGifActions.resetState, () => init))
});
var { selectVideoToGifState, selectStatus, selectProgress, selectOutputBlob } = videoToGifFeature;
var selectVideoToGifCanProcess = createSelector(selectVideoToGifState, (s) => !!s.inputFile && s.status === "idle");
var selectVideoToGifIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/22-video-to-gif/videoToGif.component.ts
var _c0 = () => ["gif"];
function VideoToGifComponent_Conditional_9_For_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function VideoToGifComponent_Conditional_9_For_38_Template_button_click_0_listener() {
      const s_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onScaleChange(s_r4));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-green-500", ctx_r1.scale === s_r4)("text-black", ctx_r1.scale === s_r4)("bg-white/5", ctx_r1.scale !== s_r4)("text-white/50", ctx_r1.scale !== s_r4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", s_r4, "px");
  }
}
function VideoToGifComponent_Conditional_9_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 28);
    \u0275\u0275text(1, " Converting to GIF... ");
  }
}
function VideoToGifComponent_Conditional_9_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F39E}\uFE0F Create GIF ");
  }
}
function VideoToGifComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 12)(2, "div", 13)(3, "p", 14);
    \u0275\u0275text(4, "Duration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 15);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 13)(9, "p", 14);
    \u0275\u0275text(10, "Resolution");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p", 16);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 13)(14, "p", 14);
    \u0275\u0275text(15, "FPS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p", 16);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 17)(20, "div", 18)(21, "span", 19);
    \u0275\u0275text(22, "GIF Frame Rate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span", 20);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "input", 21);
    \u0275\u0275listener("input", function VideoToGifComponent_Conditional_9_Template_input_input_25_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFpsChange(+$event.target.value));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 22)(27, "span");
    \u0275\u0275text(28, "5 fps (small)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span");
    \u0275\u0275text(30, "15");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span");
    \u0275\u0275text(32, "30 fps (smooth)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(33, "div", 17)(34, "span", 19);
    \u0275\u0275text(35, "Output Width");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "div", 23);
    \u0275\u0275repeaterCreate(37, VideoToGifComponent_Conditional_9_For_38_Template, 2, 9, "button", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "div", 25)(40, "span", 14);
    \u0275\u0275text(41, "Estimated GIF size");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "span", 20);
    \u0275\u0275text(43);
    \u0275\u0275pipe(44, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(45, "button", 26);
    \u0275\u0275pipe(46, "async");
    \u0275\u0275pipe(47, "async");
    \u0275\u0275listener("click", function VideoToGifComponent_Conditional_9_Template_button_click_45_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(48, VideoToGifComponent_Conditional_9_Conditional_48_Template, 2, 0);
    \u0275\u0275pipe(49, "async");
    \u0275\u0275conditionalBranchCreate(50, VideoToGifComponent_Conditional_9_Conditional_50_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r5 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 9, meta_r5.duration, "1.0-1"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r5.width, "\xD7", meta_r5.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(18, 12, meta_r5.fps, "1.0-0"));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", ctx_r1.fps, " fps");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.fps);
    \u0275\u0275advance(12);
    \u0275\u0275repeater(ctx_r1.scalePresets);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("~", \u0275\u0275pipeBind2(44, 15, ctx_r1.estimateGifSize(meta_r5.duration), "1.0-1"), " MB");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", \u0275\u0275pipeBind1(46, 18, ctx_r1.canProcess$) === false || \u0275\u0275pipeBind1(47, 20, ctx_r1.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(49, 22, ctx_r1.isLoading$) ? 48 : 50);
  }
}
function VideoToGifComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\u26A0\uFE0F ", (tmp_1_0 = \u0275\u0275pipeBind1(2, 1, ctx_r1.state$)) == null ? null : tmp_1_0.errorMessage);
  }
}
function VideoToGifComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-video-preview", 9);
    \u0275\u0275pipe(1, "async");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("file", ((tmp_1_0 = \u0275\u0275pipeBind1(1, 2, ctx_r1.state$)) == null ? null : tmp_1_0.inputFile) ?? null)("showControls", true);
  }
}
function VideoToGifComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 29);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("progress", ((tmp_1_0 = \u0275\u0275pipeBind1(2, 2, ctx_r1.state$)) == null ? null : tmp_1_0.progress) ?? 0)("size", 120);
  }
}
function VideoToGifComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-export-panel", 11);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275pipe(2, "async");
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("outputBlob", ((tmp_1_0 = \u0275\u0275pipeBind1(1, 3, ctx_r1.state$)) == null ? null : tmp_1_0.outputBlob) ?? null)("outputSizeMB", ((tmp_2_0 = \u0275\u0275pipeBind1(2, 5, ctx_r1.state$)) == null ? null : tmp_2_0.outputSizeMB) ?? null)("availableFormats", \u0275\u0275pureFunction0(7, _c0));
  }
}
var VideoToGifComponent = class _VideoToGifComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectVideoToGifState);
  isLoading$ = this.store.select(selectVideoToGifIsLoading);
  canProcess$ = this.store.select(selectVideoToGifCanProcess);
  fps = 10;
  scale = 480;
  scalePresets = [240, 320, 480, 640];
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(VideoToGifActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(VideoToGifActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(VideoToGifActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onFpsChange(value) {
    this.fps = value;
  }
  onScaleChange(value) {
    this.scale = value;
  }
  estimateGifSize(duration) {
    return duration * this.fps * (this.scale / 480) * 0.05;
  }
  onProcess() {
    this.store.dispatch(VideoToGifActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-PODNI7YO.js", import.meta.url), { type: "module" }), { file: state.inputFile, fps: this.fps, scale: this.scale }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(VideoToGifActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const blob = msg.data;
          this.store.dispatch(VideoToGifActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(VideoToGifActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "GIF conversion failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(VideoToGifActions.resetState());
  }
  static \u0275fac = function VideoToGifComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VideoToGifComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VideoToGifComponent, selectors: [["app-video-to-gif"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-green-400", "to-lime-200"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video file here or click to browse", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_animation", 3, "outputBlob", "outputSizeMB", "availableFormats"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-green-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "flex", "justify-between", "items-center"], [1, "text-xs", "text-white/40", "uppercase", "tracking-wider"], [1, "text-sm", "font-bold", "text-green-400"], ["type", "range", "min", "5", "max", "30", "step", "1", 1, "w-full", "h-2", "rounded-full", "appearance-none", "cursor-pointer", "bg-gradient-to-r", "from-green-800", "to-green-400", 3, "input", "value"], [1, "flex", "justify-between", "text-[10px]", "text-white/30"], [1, "grid", "grid-cols-4", "gap-2"], [1, "py-2", "rounded-lg", "text-xs", "font-bold", "transition-all", "duration-200", 3, "bg-green-500", "text-black", "bg-white/5", "text-white/50"], [1, "p-3", "rounded-xl", "bg-white/5", "border", "border-white/10", "flex", "items-center", "justify-between"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-green-500", "to-lime-500", "text-black", "hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "py-2", "rounded-lg", "text-xs", "font-bold", "transition-all", "duration-200", 3, "click"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Creating GIF...", 3, "progress", "size"]], template: function VideoToGifComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F39E}\uFE0F Video to GIF ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Convert video to high-quality GIF with 2-pass palette generation");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function VideoToGifComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, VideoToGifComponent_Conditional_9_Template, 51, 24, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, VideoToGifComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, VideoToGifComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, VideoToGifComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, VideoToGifComponent_Conditional_18_Template, 3, 8, "app-export-panel", 11);
      \u0275\u0275pipe(19, "async");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_0_0;
      let tmp_1_0;
      let tmp_2_0;
      let tmp_3_0;
      let tmp_4_0;
      \u0275\u0275advance(9);
      \u0275\u0275conditional((tmp_0_0 = (tmp_0_0 = \u0275\u0275pipeBind1(10, 5, ctx.state$)) == null ? null : tmp_0_0.videoMeta) ? 9 : -1, tmp_0_0);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_1_0 = \u0275\u0275pipeBind1(12, 7, ctx.state$)) == null ? null : tmp_1_0.status) === "error" ? 11 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_2_0 = \u0275\u0275pipeBind1(15, 9, ctx.state$)) == null ? null : tmp_2_0.inputFile) ? 14 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_3_0 = \u0275\u0275pipeBind1(17, 11, ctx.state$)) == null ? null : tmp_3_0.status) === "processing" ? 16 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_4_0 = \u0275\u0275pipeBind1(19, 13, ctx.state$)) == null ? null : tmp_4_0.status) === "done" ? 18 : -1);
    }
  }, dependencies: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent, AsyncPipe, DecimalPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VideoToGifComponent, [{
    type: Component,
    args: [{
      selector: "app-video-to-gif",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-200">
          \u{1F39E}\uFE0F Video to GIF
        </h1>
        <p class="text-white/50 text-sm">Convert video to high-quality GIF with 2-pass palette generation</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-green-400">{{ meta.duration | number:'1.0-1' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}\xD7{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">FPS</p>
                  <p class="text-sm font-semibold text-white">{{ meta.fps | number:'1.0-0' }}</p>
                </div>
              </div>

              <!-- FPS Slider -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-white/40 uppercase tracking-wider">GIF Frame Rate</span>
                  <span class="text-sm font-bold text-green-400">{{ fps }} fps</span>
                </div>
                <input type="range" min="5" max="30" step="1" [value]="fps"
                  (input)="onFpsChange(+($any($event.target)).value)"
                  class="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-green-800 to-green-400" />
                <div class="flex justify-between text-[10px] text-white/30">
                  <span>5 fps (small)</span>
                  <span>15</span>
                  <span>30 fps (smooth)</span>
                </div>
              </div>

              <!-- Scale Width -->
              <div class="space-y-2">
                <span class="text-xs text-white/40 uppercase tracking-wider">Output Width</span>
                <div class="grid grid-cols-4 gap-2">
                  @for (s of scalePresets; track s) {
                    <button (click)="onScaleChange(s)"
                      class="py-2 rounded-lg text-xs font-bold transition-all duration-200"
                      [class.bg-green-500]="scale === s"
                      [class.text-black]="scale === s"
                      [class.bg-white/5]="scale !== s"
                      [class.text-white/50]="scale !== s">{{ s }}px</button>
                  }
                </div>
              </div>

              <!-- Estimated Size -->
              <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span class="text-xs text-white/40">Estimated GIF size</span>
                <span class="text-sm font-bold text-green-400">~{{ estimateGifSize(meta.duration) | number:'1.0-1' }} MB</span>
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-lime-500 text-black hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Converting to GIF...
                } @else { \u{1F39E}\uFE0F Create GIF }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) {
            <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" />
          }
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Creating GIF..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              [availableFormats]="['gif']" defaultFilename="omni_animation" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VideoToGifComponent, { className: "VideoToGifComponent", filePath: "src/app/modules/video/22-video-to-gif/videotogif.component.ts", lineNumber: 117 });
})();
export {
  VideoToGifComponent
};
//# sourceMappingURL=chunk-YQHLPABR.mjs.map
