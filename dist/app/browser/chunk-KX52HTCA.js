import {
  VideoPreviewComponent
} from "./chunk-K6T6M4FG.js";
import {
  ProgressRingComponent
} from "./chunk-5RQOTGLT.js";
import {
  FFmpegService
} from "./chunk-BYCJNMIZ.js";
import {
  FileDropZoneComponent
} from "./chunk-XTIE2Y63.js";
import {
  ExportPanelComponent
} from "./chunk-OOQG5I22.js";
import {
  WorkerBridgeService
} from "./chunk-KAUCEXPZ.js";
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
  CommonModule,
  DecimalPipe
} from "./chunk-UWT53CRV.js";
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
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
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

// src/app/modules/video/03-converter/converter.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  targetFormat: "mp4",
  codec: "libx264",
  qualityPreset: "balanced",
  estimatedSizeMB: 0,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var ConverterActions = {
  loadFile: createAction("[Converter] Load File", props()),
  loadMetaSuccess: createAction("[Converter] Meta OK", props()),
  loadMetaFailure: createAction("[Converter] Meta Fail", props()),
  updateConfig: createAction("[Converter] Update Config", props()),
  startProcessing: createAction("[Converter] Start"),
  updateProgress: createAction("[Converter] Progress", props()),
  processingSuccess: createAction("[Converter] Success", props()),
  processingFailure: createAction("[Converter] Failure", props()),
  downloadOutput: createAction("[Converter] Download"),
  resetState: createAction("[Converter] Reset")
};
var converterFeature = createFeature({
  name: "converter",
  reducer: createReducer(init, on(ConverterActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(ConverterActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(ConverterActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(ConverterActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(ConverterActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(ConverterActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(ConverterActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(ConverterActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(ConverterActions.resetState, () => init))
});
var { selectConverterState, selectStatus, selectProgress, selectOutputBlob } = converterFeature;
var selectConverterCanProcess = createSelector(selectConverterState, (s) => !!s.inputFile && s.status === "idle");
var selectConverterIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/03-converter/converter.component.ts
var _c0 = (a0) => [a0];
var _forTrack0 = ($index, $item) => $item.value;
function ConverterComponent_Conditional_9_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275pipe(2, "async");
    \u0275\u0275pipe(3, "async");
    \u0275\u0275pipe(4, "async");
    \u0275\u0275pipe(5, "async");
    \u0275\u0275pipe(6, "async");
    \u0275\u0275pipe(7, "async");
    \u0275\u0275pipe(8, "async");
    \u0275\u0275listener("click", function ConverterComponent_Conditional_9_For_23_Template_button_click_0_listener() {
      const fmt_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.onFormatChange(fmt_r3.value));
    });
    \u0275\u0275elementStart(9, "span", 25);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "br");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    let tmp_15_0;
    let tmp_16_0;
    let tmp_17_0;
    let tmp_18_0;
    let tmp_19_0;
    const fmt_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-cyan-500", ((tmp_12_0 = \u0275\u0275pipeBind1(1, 18, ctx_r3.state$)) == null ? null : tmp_12_0.targetFormat) === fmt_r3.value)("text-black", ((tmp_13_0 = \u0275\u0275pipeBind1(2, 20, ctx_r3.state$)) == null ? null : tmp_13_0.targetFormat) === fmt_r3.value)("border-cyan-500", ((tmp_14_0 = \u0275\u0275pipeBind1(3, 22, ctx_r3.state$)) == null ? null : tmp_14_0.targetFormat) === fmt_r3.value)("shadow-[0_0_20px_rgba(0,245,255,0", ((tmp_15_0 = \u0275\u0275pipeBind1(4, 24, ctx_r3.state$)) == null ? null : tmp_15_0.targetFormat) === fmt_r3.value)("bg-white/5", ((tmp_16_0 = \u0275\u0275pipeBind1(5, 26, ctx_r3.state$)) == null ? null : tmp_16_0.targetFormat) !== fmt_r3.value)("text-white/60", ((tmp_17_0 = \u0275\u0275pipeBind1(6, 28, ctx_r3.state$)) == null ? null : tmp_17_0.targetFormat) !== fmt_r3.value)("border-white/10", ((tmp_18_0 = \u0275\u0275pipeBind1(7, 30, ctx_r3.state$)) == null ? null : tmp_18_0.targetFormat) !== fmt_r3.value)("hover:bg-white/10", ((tmp_19_0 = \u0275\u0275pipeBind1(8, 32, ctx_r3.state$)) == null ? null : tmp_19_0.targetFormat) !== fmt_r3.value);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(fmt_r3.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", fmt_r3.label, " ");
  }
}
function ConverterComponent_Conditional_9_For_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275pipe(2, "async");
    \u0275\u0275pipe(3, "async");
    \u0275\u0275pipe(4, "async");
    \u0275\u0275pipe(5, "async");
    \u0275\u0275pipe(6, "async");
    \u0275\u0275listener("click", function ConverterComponent_Conditional_9_For_29_Template_button_click_0_listener() {
      const preset_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.onPresetChange(preset_r6.value));
    });
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    let tmp_15_0;
    let tmp_16_0;
    let tmp_17_0;
    const preset_r6 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-gradient-to-r", ((tmp_12_0 = \u0275\u0275pipeBind1(1, 14, ctx_r3.state$)) == null ? null : tmp_12_0.qualityPreset) === preset_r6.value)("from-emerald-500", ((tmp_13_0 = \u0275\u0275pipeBind1(2, 16, ctx_r3.state$)) == null ? null : tmp_13_0.qualityPreset) === preset_r6.value)("to-cyan-500", ((tmp_14_0 = \u0275\u0275pipeBind1(3, 18, ctx_r3.state$)) == null ? null : tmp_14_0.qualityPreset) === preset_r6.value)("text-black", ((tmp_15_0 = \u0275\u0275pipeBind1(4, 20, ctx_r3.state$)) == null ? null : tmp_15_0.qualityPreset) === preset_r6.value)("bg-white/5", ((tmp_16_0 = \u0275\u0275pipeBind1(5, 22, ctx_r3.state$)) == null ? null : tmp_16_0.qualityPreset) !== preset_r6.value)("text-white/50", ((tmp_17_0 = \u0275\u0275pipeBind1(6, 24, ctx_r3.state$)) == null ? null : tmp_17_0.qualityPreset) !== preset_r6.value);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate2("", preset_r6.icon, " ", preset_r6.label);
  }
}
function ConverterComponent_Conditional_9_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 27);
    \u0275\u0275text(1, " Converting... ");
  }
}
function ConverterComponent_Conditional_9_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F504} Convert Video ");
  }
}
function ConverterComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275text(15, "Codec");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p", 16);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 17)(19, "label", 18);
    \u0275\u0275text(20, "Target Format");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 19);
    \u0275\u0275repeaterCreate(22, ConverterComponent_Conditional_9_For_23_Template, 13, 34, "button", 20, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 17)(25, "label", 18);
    \u0275\u0275text(26, "Quality Preset");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 21);
    \u0275\u0275repeaterCreate(28, ConverterComponent_Conditional_9_For_29_Template, 8, 26, "button", 22, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "button", 23);
    \u0275\u0275pipe(31, "async");
    \u0275\u0275pipe(32, "async");
    \u0275\u0275listener("click", function ConverterComponent_Conditional_9_Template_button_click_30_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onProcess());
    });
    \u0275\u0275conditionalCreate(33, ConverterComponent_Conditional_9_Conditional_33_Template, 2, 0);
    \u0275\u0275pipe(34, "async");
    \u0275\u0275conditionalBranchCreate(35, ConverterComponent_Conditional_9_Conditional_35_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r7 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 6, meta_r7.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r7.width, "\xD7", meta_r7.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(meta_r7.codec);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r3.formats);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r3.presets);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(31, 9, ctx_r3.canProcess$) || \u0275\u0275pipeBind1(32, 11, ctx_r3.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(34, 13, ctx_r3.isLoading$) ? 33 : 35);
  }
}
function ConverterComponent_Conditional_11_Template(rf, ctx) {
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
    \u0275\u0275textInterpolate1(" \u26A0\uFE0F ", (tmp_1_0 = \u0275\u0275pipeBind1(2, 1, ctx_r3.state$)) == null ? null : tmp_1_0.errorMessage, " ");
  }
}
function ConverterComponent_Conditional_14_Template(rf, ctx) {
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
function ConverterComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 28);
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
function ConverterComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-export-panel", 11);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275pipe(2, "async");
    \u0275\u0275pipe(3, "async");
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("outputBlob", ((tmp_1_0 = \u0275\u0275pipeBind1(1, 3, ctx_r3.state$)) == null ? null : tmp_1_0.outputBlob) ?? null)("outputSizeMB", ((tmp_2_0 = \u0275\u0275pipeBind1(2, 5, ctx_r3.state$)) == null ? null : tmp_2_0.outputSizeMB) ?? null)("availableFormats", \u0275\u0275pureFunction1(9, _c0, ((tmp_3_0 = \u0275\u0275pipeBind1(3, 7, ctx_r3.state$)) == null ? null : tmp_3_0.targetFormat) ?? "mp4"));
  }
}
var ConverterComponent = class _ConverterComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectConverterState);
  isLoading$ = this.store.select(selectConverterIsLoading);
  canProcess$ = this.store.select(selectConverterCanProcess);
  formats = [
    { value: "mp4", label: "MP4", icon: "\u{1F3AC}" },
    { value: "webm", label: "WebM", icon: "\u{1F310}" },
    { value: "mov", label: "MOV", icon: "\u{1F34E}" },
    { value: "gif", label: "GIF", icon: "\u{1F39E}\uFE0F" }
  ];
  presets = [
    { value: "fast", label: "Fast", icon: "\u26A1" },
    { value: "balanced", label: "Balanced", icon: "\u2696\uFE0F" },
    { value: "best", label: "Best", icon: "\u{1F48E}" }
  ];
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(ConverterActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(ConverterActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(ConverterActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onFormatChange(format) {
    this.store.dispatch(ConverterActions.updateConfig({ config: { targetFormat: format } }));
  }
  onPresetChange(preset) {
    this.store.dispatch(ConverterActions.updateConfig({ config: { qualityPreset: preset } }));
  }
  onProcess() {
    this.store.dispatch(ConverterActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-MNDGRKXV.js", import.meta.url), { type: "module" }), { file: state.inputFile, targetFormat: state.targetFormat, qualityPreset: state.qualityPreset }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(ConverterActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const blob = msg.data;
          this.store.dispatch(ConverterActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(ConverterActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Conversion failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(ConverterActions.resetState());
  }
  static \u0275fac = function ConverterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConverterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ConverterComponent, selectors: [["app-converter"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-cyan-400", "to-cyan-200"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video file here or click to browse", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_converted", 3, "outputBlob", "outputSizeMB", "availableFormats"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-cyan-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "text-xs", "text-white/40", "uppercase", "tracking-wider"], [1, "grid", "grid-cols-4", "gap-2"], [1, "py-2.5", "rounded-xl", "text-xs", "font-bold", "uppercase", "tracking-wide", "transition-all", "duration-200", "border", 3, "bg-cyan-500", "text-black", "border-cyan-500", "shadow-[0_0_20px_rgba(0,245,255,0", "bg-white/5", "text-white/60", "border-white/10", "hover:bg-white/10"], [1, "grid", "grid-cols-3", "gap-2"], [1, "py-2", "rounded-lg", "text-xs", "font-semibold", "transition-all", "duration-200", 3, "bg-gradient-to-r", "from-emerald-500", "to-cyan-500", "text-black", "bg-white/5", "text-white/50"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-cyan-500", "to-blue-500", "text-black", "hover:shadow-[0_0_30px_rgba(0,245,255,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "py-2.5", "rounded-xl", "text-xs", "font-bold", "uppercase", "tracking-wide", "transition-all", "duration-200", "border", 3, "click"], [1, "text-lg"], [1, "py-2", "rounded-lg", "text-xs", "font-semibold", "transition-all", "duration-200", 3, "click"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Converting...", 3, "progress", "size"]], template: function ConverterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F504} Format Converter ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Convert video between MP4, WebM, MOV, GIF with codec selection");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function ConverterComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, ConverterComponent_Conditional_9_Template, 36, 15, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, ConverterComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, ConverterComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, ConverterComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, ConverterComponent_Conditional_18_Template, 4, 11, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConverterComponent, [{
    type: Component,
    args: [{
      selector: "app-converter",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
          \u{1F504} Format Converter
        </h1>
        <p class="text-white/50 text-sm">Convert video between MP4, WebM, MOV, GIF with codec selection</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <!-- Metadata Display -->
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-cyan-400">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}\xD7{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Codec</p>
                  <p class="text-sm font-semibold text-white">{{ meta.codec }}</p>
                </div>
              </div>

              <!-- Target Format Selector -->
              <div class="space-y-2">
                <label class="text-xs text-white/40 uppercase tracking-wider">Target Format</label>
                <div class="grid grid-cols-4 gap-2">
                  @for (fmt of formats; track fmt.value) {
                    <button (click)="onFormatChange(fmt.value)"
                      class="py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200 border"
                      [class.bg-cyan-500]="(state$ | async)?.targetFormat === fmt.value"
                      [class.text-black]="(state$ | async)?.targetFormat === fmt.value"
                      [class.border-cyan-500]="(state$ | async)?.targetFormat === fmt.value"
                      [class.shadow-[0_0_20px_rgba(0,245,255,0.3)]]="(state$ | async)?.targetFormat === fmt.value"
                      [class.bg-white/5]="(state$ | async)?.targetFormat !== fmt.value"
                      [class.text-white/60]="(state$ | async)?.targetFormat !== fmt.value"
                      [class.border-white/10]="(state$ | async)?.targetFormat !== fmt.value"
                      [class.hover:bg-white/10]="(state$ | async)?.targetFormat !== fmt.value"
                    >
                      <span class="text-lg">{{ fmt.icon }}</span><br/>{{ fmt.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Quality Preset -->
              <div class="space-y-2">
                <label class="text-xs text-white/40 uppercase tracking-wider">Quality Preset</label>
                <div class="grid grid-cols-3 gap-2">
                  @for (preset of presets; track preset.value) {
                    <button (click)="onPresetChange(preset.value)"
                      class="py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                      [class.bg-gradient-to-r]="(state$ | async)?.qualityPreset === preset.value"
                      [class.from-emerald-500]="(state$ | async)?.qualityPreset === preset.value"
                      [class.to-cyan-500]="(state$ | async)?.qualityPreset === preset.value"
                      [class.text-black]="(state$ | async)?.qualityPreset === preset.value"
                      [class.bg-white/5]="(state$ | async)?.qualityPreset !== preset.value"
                      [class.text-white/50]="(state$ | async)?.qualityPreset !== preset.value"
                    >{{ preset.icon }} {{ preset.label }}</button>
                  }
                </div>
              </div>

              <!-- Process Button -->
              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Converting...
                } @else { \u{1F504} Convert Video }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              \u26A0\uFE0F {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) {
            <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" />
          }
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Converting..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              [availableFormats]="[(state$ | async)?.targetFormat ?? 'mp4']"
              defaultFilename="omni_converted" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConverterComponent, { className: "ConverterComponent", filePath: "src/app/modules/video/03-converter/converter.component.ts", lineNumber: 126 });
})();
export {
  ConverterComponent
};
//# sourceMappingURL=chunk-KX52HTCA.js.map
