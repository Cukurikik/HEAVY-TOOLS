import {
  VideoPreviewComponent
} from "./chunk-SPI6KAK2.js";
import {
  ProgressRingComponent
} from "./chunk-3HJT6LV5.js";
import {
  FFmpegService
} from "./chunk-6QJMH4AU.js";
import {
  FileDropZoneComponent
} from "./chunk-GR2AEFM7.js";
import {
  ExportPanelComponent
} from "./chunk-MZRPAO44.js";
import {
  WorkerBridgeService
} from "./chunk-EYLA2ZDN.js";
import {
  Store,
  createAction,
  createFeature,
  createReducer,
  createSelector,
  on,
  props
} from "./chunk-KGVNL5XR.js";
import {
  AsyncPipe,
  CommonModule
} from "./chunk-UWT53CRV.js";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
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
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-3GKPD7AG.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-KWSTWQNB.js";

// src/app/modules/video/30-upscaler/upscaler.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  scaleFactor: 2,
  model: "realesrgan",
  webGpuAvailable: false,
  totalFrames: 0,
  processedFrames: 0,
  currentFrameIndex: 0,
  modelLoaded: false,
  memoryWarning: false,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var UpscalerActions = {
  loadFile: createAction("[Upscaler] Load File", props()),
  loadMetaSuccess: createAction("[Upscaler] Meta OK", props()),
  loadMetaFailure: createAction("[Upscaler] Meta Fail", props()),
  updateConfig: createAction("[Upscaler] Update Config", props()),
  startProcessing: createAction("[Upscaler] Start"),
  updateProgress: createAction("[Upscaler] Progress", props()),
  processingSuccess: createAction("[Upscaler] Success", props()),
  processingFailure: createAction("[Upscaler] Failure", props()),
  downloadOutput: createAction("[Upscaler] Download"),
  resetState: createAction("[Upscaler] Reset")
};
var upscalerFeature = createFeature({
  name: "upscaler",
  reducer: createReducer(init, on(UpscalerActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(UpscalerActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(UpscalerActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(UpscalerActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(UpscalerActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(UpscalerActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(UpscalerActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(UpscalerActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(UpscalerActions.resetState, () => init))
});
var { selectUpscalerState, selectStatus, selectProgress, selectOutputBlob } = upscalerFeature;
var selectUpscalerCanProcess = createSelector(selectUpscalerState, (s) => !!s.inputFile && s.status === "idle");
var selectUpscalerIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/30-upscaler/upscaler.component.ts
var _forTrack0 = ($index, $item) => $item.value;
function UpscalerComponent_Conditional_9_For_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function UpscalerComponent_Conditional_9_For_22_Template_button_click_0_listener() {
      const s_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.scaleFactor = s_r3);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r3.scaleFactor === s_r3 ? "p-3 rounded-xl border-2 border-fuchsia-400 bg-fuchsia-400/10 text-fuchsia-300 text-lg font-bold" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-lg hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", s_r3, "x ");
  }
}
function UpscalerComponent_Conditional_9_For_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function UpscalerComponent_Conditional_9_For_28_Template_button_click_0_listener() {
      const m_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.model = m_r6.value);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "p", 30);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const m_r6 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r3.model === m_r6.value ? "p-3 rounded-xl border-2 border-fuchsia-400 bg-fuchsia-400/10 text-fuchsia-300 text-sm font-semibold" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", m_r6.icon, " ", m_r6.label, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r6.desc);
  }
}
function UpscalerComponent_Conditional_9_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 31);
    \u0275\u0275text(1, " Upscaling... ");
  }
}
function UpscalerComponent_Conditional_9_Conditional_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F916} Upscale with AI ");
  }
}
function UpscalerComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 12)(2, "div", 13)(3, "p", 14);
    \u0275\u0275text(4, "Current");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 15);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 13)(8, "p", 14);
    \u0275\u0275text(9, "\u2192 Scale");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 16);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 13)(13, "p", 14);
    \u0275\u0275text(14, "Output");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p", 17);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "div", 18)(18, "p", 19);
    \u0275\u0275text(19, "Upscale Factor");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 20);
    \u0275\u0275repeaterCreate(21, UpscalerComponent_Conditional_9_For_22_Template, 2, 3, "button", 21, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 18)(24, "p", 19);
    \u0275\u0275text(25, "AI Model");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 20);
    \u0275\u0275repeaterCreate(27, UpscalerComponent_Conditional_9_For_28_Template, 4, 5, "button", 21, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 18)(30, "div", 22)(31, "span", 23);
    \u0275\u0275text(32, "Denoise Level");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 24);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "input", 25);
    \u0275\u0275listener("input", function UpscalerComponent_Conditional_9_Template_input_input_35_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.denoiseLevel = +ctx_r3.gv($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "div", 26)(37, "span");
    \u0275\u0275text(38, "None");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "span");
    \u0275\u0275text(40, "Medium");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "span");
    \u0275\u0275text(42, "Strong");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(43, "div", 27);
    \u0275\u0275text(44, " \u26A0\uFE0F AI upscaling is GPU-intensive. Processing may take several minutes depending on video length and resolution. WebGPU acceleration is used when available. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "button", 28);
    \u0275\u0275pipe(46, "async");
    \u0275\u0275pipe(47, "async");
    \u0275\u0275listener("click", function UpscalerComponent_Conditional_9_Template_button_click_45_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onProcess());
    });
    \u0275\u0275conditionalCreate(48, UpscalerComponent_Conditional_9_Conditional_48_Template, 2, 0);
    \u0275\u0275pipe(49, "async");
    \u0275\u0275conditionalBranchCreate(50, UpscalerComponent_Conditional_9_Conditional_50_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r7 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r7.width, "\xD7", meta_r7.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r3.scaleFactor, "x");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", meta_r7.width * ctx_r3.scaleFactor, "\xD7", meta_r7.height * ctx_r3.scaleFactor);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r3.scaleFactors);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r3.models);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r3.denoiseLevel);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r3.denoiseLevel);
    \u0275\u0275advance(10);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(46, 9, ctx_r3.canProcess$) || \u0275\u0275pipeBind1(47, 11, ctx_r3.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(49, 13, ctx_r3.isLoading$) ? 48 : 50);
  }
}
function UpscalerComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\u26A0\uFE0F ", (tmp_1_0 = \u0275\u0275pipeBind1(2, 1, ctx_r3.state$)) == null ? null : tmp_1_0.errorMessage);
  }
}
function UpscalerComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-video-preview", 9);
    \u0275\u0275pipe(1, "async");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("file", ((tmp_1_0 = \u0275\u0275pipeBind1(1, 2, ctx_r3.state$)) == null ? null : tmp_1_0.inputFile) ?? null)("showControls", true);
  }
}
function UpscalerComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 32);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("progress", ((tmp_1_0 = \u0275\u0275pipeBind1(2, 2, ctx_r3.state$)) == null ? null : tmp_1_0.progress) ?? 0)("size", 120);
  }
}
function UpscalerComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-export-panel", 11);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275pipe(2, "async");
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("outputBlob", ((tmp_1_0 = \u0275\u0275pipeBind1(1, 2, ctx_r3.state$)) == null ? null : tmp_1_0.outputBlob) ?? null)("outputSizeMB", ((tmp_2_0 = \u0275\u0275pipeBind1(2, 4, ctx_r3.state$)) == null ? null : tmp_2_0.outputSizeMB) ?? null);
  }
}
var UpscalerComponent = class _UpscalerComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectUpscalerState);
  isLoading$ = this.store.select(selectUpscalerIsLoading);
  canProcess$ = this.store.select(selectUpscalerCanProcess);
  scaleFactor = 2;
  model = "esrgan";
  denoiseLevel = 10;
  scaleFactors = [2, 4];
  models = [
    { value: "esrgan", label: "ESRGAN", icon: "\u26A1", desc: "Fast, good quality" },
    { value: "swinir", label: "SwinIR", icon: "\u{1F48E}", desc: "Slower, best quality" }
  ];
  gv(e) {
    return e.target.value;
  }
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(UpscalerActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(UpscalerActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(UpscalerActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onProcess() {
    this.store.dispatch(UpscalerActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-HKFCMU5R.js", import.meta.url), { type: "module" }), { file: state.inputFile, scale: this.scaleFactor, model: this.model, denoise: this.denoiseLevel }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(UpscalerActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const b = msg.data;
          this.store.dispatch(UpscalerActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(UpscalerActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Upscaling failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(UpscalerActions.resetState());
  }
  static \u0275fac = function UpscalerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UpscalerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UpscalerComponent, selectors: [["app-upscaler"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-fuchsia-400", "via-purple-400", "to-cyan-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video to upscale", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_upscaled", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-white"], [1, "text-sm", "font-semibold", "text-fuchsia-400"], [1, "text-sm", "font-semibold", "text-cyan-400"], [1, "space-y-2"], [1, "text-sm", "text-white/60"], [1, "grid", "grid-cols-2", "gap-2"], [3, "class"], [1, "flex", "justify-between", "text-sm"], [1, "text-white/60"], [1, "text-fuchsia-400", "font-mono"], ["type", "range", "min", "0", "max", "50", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-fuchsia-400", 3, "input", "value"], [1, "flex", "justify-between", "text-xs", "text-white/30"], [1, "p-3", "rounded-xl", "bg-purple-500/10", "border", "border-purple-500/20", "text-xs", "text-purple-300/80"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "bg-gradient-to-r", "from-fuchsia-500", "via-purple-500", "to-cyan-500", "text-white", "hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [3, "click"], [1, "text-xs", "mt-1", "opacity-60"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin", "inline-block"], ["label", "AI Upscaling...", 3, "progress", "size"]], template: function UpscalerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u{1F916} AI Video Upscaler");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Upscale video resolution using ESRGAN/SwinIR AI models via ONNX Runtime");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function UpscalerComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, UpscalerComponent_Conditional_9_Template, 51, 15, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, UpscalerComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, UpscalerComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, UpscalerComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, UpscalerComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  }, dependencies: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent, AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UpscalerComponent, [{
    type: Component,
    args: [{
      selector: "app-upscaler",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400">\u{1F916} AI Video Upscaler</h1>
        <p class="text-white/50 text-sm">Upscale video resolution using ESRGAN/SwinIR AI models via ONNX Runtime</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video to upscale" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Current</p><p class="text-sm font-semibold text-white">{{ meta.width }}\xD7{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">\u2192 Scale</p><p class="text-sm font-semibold text-fuchsia-400">{{ scaleFactor }}x</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Output</p><p class="text-sm font-semibold text-cyan-400">{{ meta.width * scaleFactor }}\xD7{{ meta.height * scaleFactor }}</p></div>
              </div>

              <!-- Scale Factor -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Upscale Factor</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (s of scaleFactors; track s) {
                    <button (click)="scaleFactor=s"
                      [class]="scaleFactor===s ? 'p-3 rounded-xl border-2 border-fuchsia-400 bg-fuchsia-400/10 text-fuchsia-300 text-lg font-bold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-lg hover:bg-white/10'">
                      {{ s }}x
                    </button>
                  }
                </div>
              </div>

              <!-- Model -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">AI Model</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (m of models; track m.value) {
                    <button (click)="model=m.value"
                      [class]="model===m.value ? 'p-3 rounded-xl border-2 border-fuchsia-400 bg-fuchsia-400/10 text-fuchsia-300 text-sm font-semibold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ m.icon }} {{ m.label }}
                      <p class="text-xs mt-1 opacity-60">{{ m.desc }}</p>
                    </button>
                  }
                </div>
              </div>

              <!-- Denoise -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm"><span class="text-white/60">Denoise Level</span><span class="text-fuchsia-400 font-mono">{{ denoiseLevel }}</span></div>
                <input type="range" min="0" max="50" [value]="denoiseLevel" (input)="denoiseLevel=+gv($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-400" />
                <div class="flex justify-between text-xs text-white/30"><span>None</span><span>Medium</span><span>Strong</span></div>
              </div>

              <div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300/80">
                \u26A0\uFE0F AI upscaling is GPU-intensive. Processing may take several minutes depending on video length and resolution. WebGPU acceleration is used when available.
              </div>

              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></div> Upscaling... } @else { \u{1F916} Upscale with AI }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="AI Upscaling..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_upscaled" /> }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UpscalerComponent, { className: "UpscalerComponent", filePath: "src/app/modules/video/30-upscaler/upscaler.component.ts", lineNumber: 89 });
})();
export {
  UpscalerComponent
};
//# sourceMappingURL=chunk-27ONSWDY.js.map
