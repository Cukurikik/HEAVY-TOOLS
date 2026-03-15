import './polyfills.server.mjs';
import {
  VideoPreviewComponent
} from "./chunk-ULW5AGBH.mjs";
import {
  ProgressRingComponent
} from "./chunk-IFRKZ5TO.mjs";
import {
  FFmpegService
} from "./chunk-KDRYMVOJ.mjs";
import {
  FileDropZoneComponent
} from "./chunk-WUM57JDS.mjs";
import {
  ExportPanelComponent
} from "./chunk-RDQAVJY3.mjs";
import {
  WorkerBridgeService
} from "./chunk-3HE7FIEH.mjs";
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
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
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

// src/app/modules/video/05-stabilizer/stabilizer.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  shakiness: 5,
  smoothing: 30,
  cropMode: "black",
  analysisComplete: false,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var StabilizerActions = {
  loadFile: createAction("[Stabilizer] Load File", props()),
  loadMetaSuccess: createAction("[Stabilizer] Meta OK", props()),
  loadMetaFailure: createAction("[Stabilizer] Meta Fail", props()),
  updateConfig: createAction("[Stabilizer] Update Config", props()),
  startProcessing: createAction("[Stabilizer] Start"),
  updateProgress: createAction("[Stabilizer] Progress", props()),
  processingSuccess: createAction("[Stabilizer] Success", props()),
  processingFailure: createAction("[Stabilizer] Failure", props()),
  downloadOutput: createAction("[Stabilizer] Download"),
  resetState: createAction("[Stabilizer] Reset")
};
var stabilizerFeature = createFeature({
  name: "stabilizer",
  reducer: createReducer(init, on(StabilizerActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(StabilizerActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(StabilizerActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(StabilizerActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(StabilizerActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(StabilizerActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(StabilizerActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(StabilizerActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(StabilizerActions.resetState, () => init))
});
var { selectStabilizerState, selectStatus, selectProgress, selectOutputBlob } = stabilizerFeature;
var selectStabilizerCanProcess = createSelector(selectStabilizerState, (s) => !!s.inputFile && s.status === "idle");
var selectStabilizerIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/05-stabilizer/stabilizer.component.ts
var _forTrack0 = ($index, $item) => $item.value;
var _forTrack1 = ($index, $item) => $item.label;
function StabilizerComponent_Conditional_9_For_55_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275listener("click", function StabilizerComponent_Conditional_9_For_55_Template_button_click_0_listener() {
      const mode_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onCropMode(mode_r4.value));
    });
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_12_0;
    const mode_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(((tmp_12_0 = \u0275\u0275pipeBind1(1, 4, ctx_r1.state$)) == null ? null : tmp_12_0.cropMode) === mode_r4.value ? "p-3 rounded-xl border-2 border-cyan-400 bg-cyan-400/10 text-cyan-400 text-sm font-semibold transition-all" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-all");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", mode_r4.icon, " ", mode_r4.label, " ");
  }
}
function StabilizerComponent_Conditional_9_For_61_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 31);
    \u0275\u0275listener("click", function StabilizerComponent_Conditional_9_For_61_Template_button_click_0_listener() {
      const preset_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.applyPreset(preset_r6));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const preset_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", preset_r6.icon, " ", preset_r6.label, " ");
  }
}
function StabilizerComponent_Conditional_9_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 32);
    \u0275\u0275text(1, " Stabilizing... ");
  }
}
function StabilizerComponent_Conditional_9_Conditional_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F4F8} Stabilize Video ");
  }
}
function StabilizerComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275elementStart(18, "div", 17)(19, "div", 18)(20, "span", 19);
    \u0275\u0275text(21, "Shakiness Detection");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 20);
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "async");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "input", 21);
    \u0275\u0275pipe(26, "async");
    \u0275\u0275listener("input", function StabilizerComponent_Conditional_9_Template_input_input_25_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onShakiness($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 22)(28, "span");
    \u0275\u0275text(29, "Low");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "span");
    \u0275\u0275text(31, "Medium");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "span");
    \u0275\u0275text(33, "High");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(34, "div", 17)(35, "div", 18)(36, "span", 19);
    \u0275\u0275text(37, "Smoothing Strength");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "span", 20);
    \u0275\u0275text(39);
    \u0275\u0275pipe(40, "async");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "input", 23);
    \u0275\u0275pipe(42, "async");
    \u0275\u0275listener("input", function StabilizerComponent_Conditional_9_Template_input_input_41_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSmoothing($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "div", 22)(44, "span");
    \u0275\u0275text(45, "Subtle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "span");
    \u0275\u0275text(47, "Moderate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "span");
    \u0275\u0275text(49, "Aggressive");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(50, "div", 17)(51, "p", 24);
    \u0275\u0275text(52, "Edge Fill Mode");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "div", 25);
    \u0275\u0275repeaterCreate(54, StabilizerComponent_Conditional_9_For_55_Template, 3, 6, "button", 26, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(56, "div", 17)(57, "p", 24);
    \u0275\u0275text(58, "Quick Presets");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "div", 27);
    \u0275\u0275repeaterCreate(60, StabilizerComponent_Conditional_9_For_61_Template, 2, 2, "button", 28, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(62, "button", 29);
    \u0275\u0275pipe(63, "async");
    \u0275\u0275pipe(64, "async");
    \u0275\u0275listener("click", function StabilizerComponent_Conditional_9_Template_button_click_62_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(65, StabilizerComponent_Conditional_9_Conditional_65_Template, 2, 0);
    \u0275\u0275pipe(66, "async");
    \u0275\u0275conditionalBranchCreate(67, StabilizerComponent_Conditional_9_Conditional_67_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    const meta_r7 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 10, meta_r7.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r7.width, "x", meta_r7.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(meta_r7.codec);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate((tmp_5_0 = \u0275\u0275pipeBind1(24, 13, ctx_r1.state$)) == null ? null : tmp_5_0.shakiness);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", (tmp_6_0 = \u0275\u0275pipeBind1(26, 15, ctx_r1.state$)) == null ? null : tmp_6_0.shakiness);
    \u0275\u0275advance(14);
    \u0275\u0275textInterpolate((tmp_7_0 = \u0275\u0275pipeBind1(40, 17, ctx_r1.state$)) == null ? null : tmp_7_0.smoothing);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", (tmp_8_0 = \u0275\u0275pipeBind1(42, 19, ctx_r1.state$)) == null ? null : tmp_8_0.smoothing);
    \u0275\u0275advance(13);
    \u0275\u0275repeater(ctx_r1.cropModes);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.presets);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(63, 21, ctx_r1.canProcess$) || \u0275\u0275pipeBind1(64, 23, ctx_r1.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(66, 25, ctx_r1.isLoading$) ? 65 : 67);
  }
}
function StabilizerComponent_Conditional_11_Template(rf, ctx) {
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
    \u0275\u0275textInterpolate1(" \u26A0\uFE0F ", (tmp_1_0 = \u0275\u0275pipeBind1(2, 1, ctx_r1.state$)) == null ? null : tmp_1_0.errorMessage, " ");
  }
}
function StabilizerComponent_Conditional_14_Template(rf, ctx) {
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
function StabilizerComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 33);
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
function StabilizerComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-export-panel", 11);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275pipe(2, "async");
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("outputBlob", ((tmp_1_0 = \u0275\u0275pipeBind1(1, 2, ctx_r1.state$)) == null ? null : tmp_1_0.outputBlob) ?? null)("outputSizeMB", ((tmp_2_0 = \u0275\u0275pipeBind1(2, 4, ctx_r1.state$)) == null ? null : tmp_2_0.outputSizeMB) ?? null);
  }
}
var StabilizerComponent = class _StabilizerComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectStabilizerState);
  isLoading$ = this.store.select(selectStabilizerIsLoading);
  canProcess$ = this.store.select(selectStabilizerCanProcess);
  cropModes = [
    { value: "black", label: "Black Edges", icon: "\u2B1B" },
    { value: "fill", label: "Fill (Zoom)", icon: "\u{1F50D}" }
  ];
  presets = [
    { label: "Handheld", icon: "\u{1F933}", shakiness: 5, smoothing: 10 },
    { label: "Walking", icon: "\u{1F6B6}", shakiness: 7, smoothing: 30 },
    { label: "Action", icon: "\u{1F3C3}", shakiness: 10, smoothing: 50 }
  ];
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(StabilizerActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(StabilizerActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(StabilizerActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onShakiness(e) {
    this.store.dispatch(StabilizerActions.updateConfig({ config: { shakiness: +e.target.value } }));
  }
  onSmoothing(e) {
    this.store.dispatch(StabilizerActions.updateConfig({ config: { smoothing: +e.target.value } }));
  }
  onCropMode(mode) {
    this.store.dispatch(StabilizerActions.updateConfig({ config: { cropMode: mode } }));
  }
  applyPreset(p) {
    this.store.dispatch(StabilizerActions.updateConfig({ config: { shakiness: p.shakiness, smoothing: p.smoothing } }));
  }
  onProcess() {
    this.store.dispatch(StabilizerActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-XKAYUYIQ.js", import.meta.url), { type: "module" }), { file: state.inputFile, shakiness: state.shakiness, smoothing: state.smoothing, cropMode: state.cropMode }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(StabilizerActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const blob = msg.data;
          this.store.dispatch(StabilizerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(StabilizerActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Stabilization failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(StabilizerActions.resetState());
  }
  static \u0275fac = function StabilizerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StabilizerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _StabilizerComponent, selectors: [["app-stabilizer"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-cyan-400", "to-cyan-200"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop shaky video here", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_stabilized", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-cyan-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "flex", "justify-between", "text-sm"], [1, "text-white/60"], [1, "text-cyan-400", "font-mono"], ["type", "range", "min", "1", "max", "10", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-cyan-400", 3, "input", "value"], [1, "flex", "justify-between", "text-xs", "text-white/30"], ["type", "range", "min", "1", "max", "100", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-cyan-400", 3, "input", "value"], [1, "text-sm", "text-white/60"], [1, "grid", "grid-cols-2", "gap-2"], [3, "class"], [1, "grid", "grid-cols-3", "gap-2"], [1, "p-2", "rounded-lg", "bg-white/5", "border", "border-white/10", "text-xs", "text-white/70", "hover:bg-cyan-400/10", "hover:border-cyan-400/30", "hover:text-cyan-400", "transition-all"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-cyan-500", "to-blue-500", "text-black", "hover:shadow-[0_0_30px_rgba(0,245,255,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [3, "click"], [1, "p-2", "rounded-lg", "bg-white/5", "border", "border-white/10", "text-xs", "text-white/70", "hover:bg-cyan-400/10", "hover:border-cyan-400/30", "hover:text-cyan-400", "transition-all", 3, "click"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Stabilizing...", 3, "progress", "size"]], template: function StabilizerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F4F8} Video Stabilizer ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Remove camera shake with 2-pass stabilization (vidstabdetect + vidstabtransform)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function StabilizerComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, StabilizerComponent_Conditional_9_Template, 68, 27, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, StabilizerComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, StabilizerComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, StabilizerComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, StabilizerComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StabilizerComponent, [{
    type: Component,
    args: [{
      selector: "app-stabilizer",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
          \u{1F4F8} Video Stabilizer
        </h1>
        <p class="text-white/50 text-sm">Remove camera shake with 2-pass stabilization (vidstabdetect + vidstabtransform)</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop shaky video here" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-cyan-400">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Codec</p>
                  <p class="text-sm font-semibold text-white">{{ meta.codec }}</p>
                </div>
              </div>

              <!-- Shakiness Detection -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">Shakiness Detection</span>
                  <span class="text-cyan-400 font-mono">{{ (state$ | async)?.shakiness }}</span>
                </div>
                <input type="range" min="1" max="10" [value]="(state$ | async)?.shakiness"
                  (input)="onShakiness($event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
                <div class="flex justify-between text-xs text-white/30">
                  <span>Low</span><span>Medium</span><span>High</span>
                </div>
              </div>

              <!-- Smoothing Strength -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">Smoothing Strength</span>
                  <span class="text-cyan-400 font-mono">{{ (state$ | async)?.smoothing }}</span>
                </div>
                <input type="range" min="1" max="100" [value]="(state$ | async)?.smoothing"
                  (input)="onSmoothing($event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
                <div class="flex justify-between text-xs text-white/30">
                  <span>Subtle</span><span>Moderate</span><span>Aggressive</span>
                </div>
              </div>

              <!-- Crop Mode -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Edge Fill Mode</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (mode of cropModes; track mode.value) {
                    <button (click)="onCropMode(mode.value)"
                      [class]="(state$ | async)?.cropMode === mode.value
                        ? 'p-3 rounded-xl border-2 border-cyan-400 bg-cyan-400/10 text-cyan-400 text-sm font-semibold transition-all'
                        : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-all'">
                      {{ mode.icon }} {{ mode.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Quick Presets -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Quick Presets</p>
                <div class="grid grid-cols-3 gap-2">
                  @for (preset of presets; track preset.label) {
                    <button (click)="applyPreset(preset)"
                      class="p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 hover:bg-cyan-400/10 hover:border-cyan-400/30 hover:text-cyan-400 transition-all">
                      {{ preset.icon }} {{ preset.label }}
                    </button>
                  }
                </div>
              </div>

              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Stabilizing...
                } @else { \u{1F4F8} Stabilize Video }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Stabilizing..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_stabilized" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(StabilizerComponent, { className: "StabilizerComponent", filePath: "src/app/modules/video/05-stabilizer/stabilizer.component.ts", lineNumber: 138 });
})();
export {
  StabilizerComponent
};
//# sourceMappingURL=chunk-QRN42YLO.mjs.map
