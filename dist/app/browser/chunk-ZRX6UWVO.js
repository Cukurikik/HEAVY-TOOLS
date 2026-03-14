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
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-3GKPD7AG.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-KWSTWQNB.js";

// src/app/modules/video/08-looper/looper.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  mode: "count",
  loopCount: 3,
  targetDuration: 60,
  crossfade: false,
  crossfadeDuration: 0.5,
  transitionMode: "cut",
  outputDuration: 0,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var LooperActions = {
  loadFile: createAction("[Looper] Load File", props()),
  loadMetaSuccess: createAction("[Looper] Meta OK", props()),
  loadMetaFailure: createAction("[Looper] Meta Fail", props()),
  updateConfig: createAction("[Looper] Update Config", props()),
  startProcessing: createAction("[Looper] Start"),
  updateProgress: createAction("[Looper] Progress", props()),
  processingSuccess: createAction("[Looper] Success", props()),
  processingFailure: createAction("[Looper] Failure", props()),
  downloadOutput: createAction("[Looper] Download"),
  resetState: createAction("[Looper] Reset")
};
var looperFeature = createFeature({
  name: "looper",
  reducer: createReducer(init, on(LooperActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(LooperActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(LooperActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(LooperActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(LooperActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(LooperActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(LooperActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(LooperActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(LooperActions.resetState, () => init))
});
var { selectLooperState, selectStatus, selectProgress, selectOutputBlob } = looperFeature;
var selectLooperCanProcess = createSelector(selectLooperState, (s) => !!s.inputFile && s.status === "idle");
var selectLooperIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/08-looper/looper.component.ts
var _forTrack0 = ($index, $item) => $item.value;
function LooperComponent_Conditional_9_For_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function LooperComponent_Conditional_9_For_35_Template_button_click_0_listener() {
      const count_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.loopCount = count_r4);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const count_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r1.loopCount === count_r4 ? "py-2 rounded-lg border-2 border-green-400 bg-green-400/10 text-green-400 text-sm font-bold" : "py-2 rounded-lg border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", count_r4, "x ");
  }
}
function LooperComponent_Conditional_9_For_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function LooperComponent_Conditional_9_For_41_Template_button_click_0_listener() {
      const mode_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectedTransition = mode_r6.value);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mode_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r1.selectedTransition === mode_r6.value ? "p-3 rounded-xl border-2 border-green-400 bg-green-400/10 text-green-300 text-sm font-semibold transition-all" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-all");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", mode_r6.icon, " ", mode_r6.label, " ");
  }
}
function LooperComponent_Conditional_9_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 29);
    \u0275\u0275text(1, " Looping... ");
  }
}
function LooperComponent_Conditional_9_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F501} Create Loop ");
  }
}
function LooperComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275text(15, "Output Duration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p", 15);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 17)(20, "div", 18)(21, "span", 19);
    \u0275\u0275text(22, "Number of Loops");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span", 20);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "input", 21);
    \u0275\u0275listener("input", function LooperComponent_Conditional_9_Template_input_input_25_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onLoopCount($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 22)(27, "span");
    \u0275\u0275text(28, "2x");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span");
    \u0275\u0275text(30, "10x");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span");
    \u0275\u0275text(32, "20x");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(33, "div", 23);
    \u0275\u0275repeaterCreate(34, LooperComponent_Conditional_9_For_35_Template, 2, 3, "button", 24, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "div", 17)(37, "p", 25);
    \u0275\u0275text(38, "Loop Transition");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div", 26);
    \u0275\u0275repeaterCreate(40, LooperComponent_Conditional_9_For_41_Template, 2, 4, "button", 24, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "button", 27);
    \u0275\u0275pipe(43, "async");
    \u0275\u0275pipe(44, "async");
    \u0275\u0275listener("click", function LooperComponent_Conditional_9_Template_button_click_42_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(45, LooperComponent_Conditional_9_Conditional_45_Template, 2, 0);
    \u0275\u0275pipe(46, "async");
    \u0275\u0275conditionalBranchCreate(47, LooperComponent_Conditional_9_Conditional_47_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r7 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 8, meta_r7.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r7.width, "x", meta_r7.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(18, 11, meta_r7.duration * ctx_r1.loopCount, "1.0-0"), "s");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", ctx_r1.loopCount, "x");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.loopCount);
    \u0275\u0275advance(9);
    \u0275\u0275repeater(ctx_r1.quickCounts);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.transitionModes);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", \u0275\u0275pipeBind1(43, 14, ctx_r1.canProcess$) === false || \u0275\u0275pipeBind1(44, 16, ctx_r1.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(46, 18, ctx_r1.isLoading$) ? 45 : 47);
  }
}
function LooperComponent_Conditional_11_Template(rf, ctx) {
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
function LooperComponent_Conditional_14_Template(rf, ctx) {
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
function LooperComponent_Conditional_16_Template(rf, ctx) {
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
function LooperComponent_Conditional_18_Template(rf, ctx) {
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
var LooperComponent = class _LooperComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectLooperState);
  isLoading$ = this.store.select(selectLooperIsLoading);
  canProcess$ = this.store.select(selectLooperCanProcess);
  /** Local UI config — avoids Angular Language Service type inference issues */
  loopCount = 3;
  selectedTransition = "cut";
  quickCounts = [2, 3, 5, 10, 15];
  transitionModes = [
    { value: "cut", label: "Hard Cut", icon: "\u2702\uFE0F" },
    { value: "crossfade", label: "Crossfade", icon: "\u{1F30A}" }
  ];
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(LooperActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(LooperActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(LooperActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onLoopCount(e) {
    this.loopCount = +e.target.value;
  }
  onProcess() {
    this.store.dispatch(LooperActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-SLOVHH7N.js", import.meta.url), { type: "module" }), { file: state.inputFile, loopCount: this.loopCount, transitionMode: this.selectedTransition }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(LooperActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const blob = msg.data;
          this.store.dispatch(LooperActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(LooperActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Loop creation failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(LooperActions.resetState());
  }
  static \u0275fac = function LooperComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LooperComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LooperComponent, selectors: [["app-looper"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-green-400", "to-emerald-300"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video to loop", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_looped", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-green-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "flex", "justify-between", "text-sm"], [1, "text-white/60"], [1, "text-green-400", "font-mono", "text-lg", "font-bold"], ["type", "range", "min", "2", "max", "20", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-green-400", 3, "input", "value"], [1, "flex", "justify-between", "text-xs", "text-white/30"], [1, "grid", "grid-cols-5", "gap-2"], [3, "class"], [1, "text-sm", "text-white/60"], [1, "grid", "grid-cols-2", "gap-2"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-green-500", "to-emerald-500", "text-black", "hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [3, "click"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Creating Loop...", 3, "progress", "size"]], template: function LooperComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F501} Video Looper ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Create seamless video loops by repeating content N times");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function LooperComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, LooperComponent_Conditional_9_Template, 48, 20, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, LooperComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, LooperComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, LooperComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, LooperComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LooperComponent, [{
    type: Component,
    args: [{
      selector: "app-looper",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
          \u{1F501} Video Looper
        </h1>
        <p class="text-white/50 text-sm">Create seamless video loops by repeating content N times</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video to loop" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-green-400">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Output Duration</p>
                  <p class="text-sm font-semibold text-green-400">{{ meta.duration * loopCount | number:'1.0-0' }}s</p>
                </div>
              </div>

              <!-- Loop Count -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">Number of Loops</span>
                  <span class="text-green-400 font-mono text-lg font-bold">{{ loopCount }}x</span>
                </div>
                <input type="range" min="2" max="20" [value]="loopCount"
                  (input)="onLoopCount($event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-400" />
                <div class="flex justify-between text-xs text-white/30">
                  <span>2x</span><span>10x</span><span>20x</span>
                </div>
              </div>

              <!-- Quick Count Buttons -->
              <div class="grid grid-cols-5 gap-2">
                @for (count of quickCounts; track count) {
                  <button (click)="loopCount = count"
                    [class]="loopCount === count
                      ? 'py-2 rounded-lg border-2 border-green-400 bg-green-400/10 text-green-400 text-sm font-bold'
                      : 'py-2 rounded-lg border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                    {{ count }}x
                  </button>
                }
              </div>

              <!-- Transition Mode -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Loop Transition</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (mode of transitionModes; track mode.value) {
                    <button (click)="selectedTransition = mode.value"
                      [class]="selectedTransition === mode.value
                        ? 'p-3 rounded-xl border-2 border-green-400 bg-green-400/10 text-green-300 text-sm font-semibold transition-all'
                        : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-all'">
                      {{ mode.icon }} {{ mode.label }}
                    </button>
                  }
                </div>
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Looping...
                } @else { \u{1F501} Create Loop }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Creating Loop..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_looped" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LooperComponent, { className: "LooperComponent", filePath: "src/app/modules/video/08-looper/looper.component.ts", lineNumber: 123 });
})();
export {
  LooperComponent
};
//# sourceMappingURL=chunk-ZRX6UWVO.js.map
