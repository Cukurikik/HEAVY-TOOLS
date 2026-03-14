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

// src/app/modules/video/20-splitter/splitter.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  mode: "equal",
  markers: [],
  equalParts: 3,
  outputSegments: [],
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var SplitterActions = {
  loadFile: createAction("[Splitter] Load File", props()),
  loadMetaSuccess: createAction("[Splitter] Meta OK", props()),
  loadMetaFailure: createAction("[Splitter] Meta Fail", props()),
  updateConfig: createAction("[Splitter] Update Config", props()),
  startProcessing: createAction("[Splitter] Start"),
  updateProgress: createAction("[Splitter] Progress", props()),
  processingSuccess: createAction("[Splitter] Success", props()),
  processingFailure: createAction("[Splitter] Failure", props()),
  downloadOutput: createAction("[Splitter] Download"),
  resetState: createAction("[Splitter] Reset")
};
var splitterFeature = createFeature({
  name: "splitter",
  reducer: createReducer(init, on(SplitterActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(SplitterActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(SplitterActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(SplitterActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(SplitterActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(SplitterActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(SplitterActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(SplitterActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(SplitterActions.resetState, () => init))
});
var { selectSplitterState, selectStatus, selectProgress, selectOutputBlob } = splitterFeature;
var selectSplitterCanProcess = createSelector(selectSplitterState, (s) => !!s.inputFile && s.status === "idle");
var selectSplitterIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/20-splitter/splitter.component.ts
function SplitterComponent_Conditional_9_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 23)(2, "span", 24);
    \u0275\u0275text(3, "Number of Segments");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 25);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "input", 26);
    \u0275\u0275listener("input", function SplitterComponent_Conditional_9_Conditional_27_Template_input_input_6_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.segmentCount = +ctx_r1.getVal($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 27)(8, "span");
    \u0275\u0275text(9, "2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11, "10");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13, "20");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.segmentCount);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.segmentCount);
  }
}
function SplitterComponent_Conditional_9_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 23)(2, "span", 24);
    \u0275\u0275text(3, "Segment Duration (seconds)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 25);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "input", 28);
    \u0275\u0275listener("input", function SplitterComponent_Conditional_9_Conditional_28_Template_input_input_6_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.segmentDuration = +ctx_r1.getVal($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 27)(8, "span");
    \u0275\u0275text(9, "5s");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11, "2min");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13, "5min");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r1.segmentDuration, "s");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.segmentDuration);
  }
}
function SplitterComponent_Conditional_9_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 29);
    \u0275\u0275text(1, " Splitting... ");
  }
}
function SplitterComponent_Conditional_9_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u2702\uFE0F Split Video ");
  }
}
function SplitterComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275text(15, "Segments");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p", 15);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 17)(20, "p", 18);
    \u0275\u0275text(21, "Split Mode");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 19)(23, "button", 20);
    \u0275\u0275listener("click", function SplitterComponent_Conditional_9_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.splitMode = "count");
    });
    \u0275\u0275text(24, " \u{1F522} By Count ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "button", 20);
    \u0275\u0275listener("click", function SplitterComponent_Conditional_9_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.splitMode = "duration");
    });
    \u0275\u0275text(26, " \u23F1\uFE0F By Duration ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(27, SplitterComponent_Conditional_9_Conditional_27_Template, 14, 2, "div", 17);
    \u0275\u0275conditionalCreate(28, SplitterComponent_Conditional_9_Conditional_28_Template, 14, 2, "div", 17);
    \u0275\u0275elementStart(29, "div", 21);
    \u0275\u0275text(30, " \u2139\uFE0F Uses stream copy (-c copy) for instant lossless splitting. Output is ZIP file with all segments. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "button", 22);
    \u0275\u0275pipe(32, "async");
    \u0275\u0275pipe(33, "async");
    \u0275\u0275listener("click", function SplitterComponent_Conditional_9_Template_button_click_31_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(34, SplitterComponent_Conditional_9_Conditional_34_Template, 2, 0);
    \u0275\u0275pipe(35, "async");
    \u0275\u0275conditionalBranchCreate(36, SplitterComponent_Conditional_9_Conditional_36_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r5 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 12, meta_r5.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r5.width, "x", meta_r5.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.splitMode === "count" ? ctx_r1.segmentCount : \u0275\u0275pipeBind2(18, 15, meta_r5.duration / ctx_r1.segmentDuration, "1.0-0"));
    \u0275\u0275advance(6);
    \u0275\u0275classMap(ctx_r1.splitMode === "count" ? "p-3 rounded-xl border-2 border-orange-400 bg-orange-400/10 text-orange-300 font-semibold text-sm" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r1.splitMode === "duration" ? "p-3 rounded-xl border-2 border-orange-400 bg-orange-400/10 text-orange-300 font-semibold text-sm" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.splitMode === "count" ? 27 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.splitMode === "duration" ? 28 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(32, 18, ctx_r1.canProcess$) || \u0275\u0275pipeBind1(33, 20, ctx_r1.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(35, 22, ctx_r1.isLoading$) ? 34 : 36);
  }
}
function SplitterComponent_Conditional_11_Template(rf, ctx) {
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
function SplitterComponent_Conditional_14_Template(rf, ctx) {
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
function SplitterComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 30);
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
function SplitterComponent_Conditional_18_Template(rf, ctx) {
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
var SplitterComponent = class _SplitterComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectSplitterState);
  isLoading$ = this.store.select(selectSplitterIsLoading);
  canProcess$ = this.store.select(selectSplitterCanProcess);
  splitMode = "count";
  segmentCount = 3;
  segmentDuration = 30;
  getVal(e) {
    return e.target.value;
  }
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(SplitterActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(SplitterActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(SplitterActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onProcess() {
    this.store.dispatch(SplitterActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-7N6U34NZ.js", import.meta.url), { type: "module" }), { file: state.inputFile, splitMode: this.splitMode, segmentCount: this.segmentCount, segmentDuration: this.segmentDuration, duration: state.videoMeta?.duration ?? 0 }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(SplitterActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const b = msg.data;
          this.store.dispatch(SplitterActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(SplitterActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Splitting failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(SplitterActions.resetState());
  }
  static \u0275fac = function SplitterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SplitterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SplitterComponent, selectors: [["app-splitter"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-orange-400", "to-red-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video to split", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_split", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-orange-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "text-sm", "text-white/60"], [1, "grid", "grid-cols-2", "gap-2"], [3, "click"], [1, "p-3", "rounded-xl", "bg-orange-500/10", "border", "border-orange-500/20", "text-xs", "text-orange-300/80"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-orange-500", "to-red-500", "text-white", "hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "flex", "justify-between", "text-sm"], [1, "text-white/60"], [1, "text-orange-400", "font-mono"], ["type", "range", "min", "2", "max", "20", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-orange-400", 3, "input", "value"], [1, "flex", "justify-between", "text-xs", "text-white/30"], ["type", "range", "min", "5", "max", "300", "step", "5", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-orange-400", 3, "input", "value"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Splitting...", 3, "progress", "size"]], template: function SplitterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u2702\uFE0F Video Splitter");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Split video into equal segments or by custom duration");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function SplitterComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, SplitterComponent_Conditional_9_Template, 37, 24, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, SplitterComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, SplitterComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, SplitterComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, SplitterComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SplitterComponent, [{
    type: Component,
    args: [{
      selector: "app-splitter",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">\u2702\uFE0F Video Splitter</h1>
        <p class="text-white/50 text-sm">Split video into equal segments or by custom duration</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video to split" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-orange-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Segments</p>
                  <p class="text-sm font-semibold text-orange-400">{{ splitMode === 'count' ? segmentCount : (meta.duration / segmentDuration | number:'1.0-0') }}</p>
                </div>
              </div>

              <!-- Split Mode -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Split Mode</p>
                <div class="grid grid-cols-2 gap-2">
                  <button (click)="splitMode='count'"
                    [class]="splitMode==='count' ? 'p-3 rounded-xl border-2 border-orange-400 bg-orange-400/10 text-orange-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                    \u{1F522} By Count
                  </button>
                  <button (click)="splitMode='duration'"
                    [class]="splitMode==='duration' ? 'p-3 rounded-xl border-2 border-orange-400 bg-orange-400/10 text-orange-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                    \u23F1\uFE0F By Duration
                  </button>
                </div>
              </div>

              @if (splitMode === 'count') {
                <div class="space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-white/60">Number of Segments</span><span class="text-orange-400 font-mono">{{ segmentCount }}</span></div>
                  <input type="range" min="2" max="20" [value]="segmentCount" (input)="segmentCount=+getVal($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-400" />
                  <div class="flex justify-between text-xs text-white/30"><span>2</span><span>10</span><span>20</span></div>
                </div>
              }
              @if (splitMode === 'duration') {
                <div class="space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-white/60">Segment Duration (seconds)</span><span class="text-orange-400 font-mono">{{ segmentDuration }}s</span></div>
                  <input type="range" min="5" max="300" step="5" [value]="segmentDuration" (input)="segmentDuration=+getVal($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-400" />
                  <div class="flex justify-between text-xs text-white/30"><span>5s</span><span>2min</span><span>5min</span></div>
                </div>
              }

              <div class="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300/80">
                \u2139\uFE0F Uses stream copy (-c copy) for instant lossless splitting. Output is ZIP file with all segments.
              </div>

              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Splitting... } @else { \u2702\uFE0F Split Video }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Splitting..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_split" /> }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SplitterComponent, { className: "SplitterComponent", filePath: "src/app/modules/video/20-splitter/splitter.component.ts", lineNumber: 87 });
})();
export {
  SplitterComponent
};
//# sourceMappingURL=chunk-NL2TKJ4L.js.map
