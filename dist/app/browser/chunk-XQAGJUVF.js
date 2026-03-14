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

// src/app/modules/video/14-watermark/watermark.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  watermarkFile: null,
  mode: "text",
  text: "OMNI-TOOL",
  fontFamily: "Arial",
  fontSize: 36,
  fontColor: "#FFFFFF",
  position: "BR",
  opacity: 0.7,
  scale: 0.2,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var WatermarkActions = {
  loadFile: createAction("[Watermark] Load File", props()),
  loadMetaSuccess: createAction("[Watermark] Meta OK", props()),
  loadMetaFailure: createAction("[Watermark] Meta Fail", props()),
  updateConfig: createAction("[Watermark] Update Config", props()),
  startProcessing: createAction("[Watermark] Start"),
  updateProgress: createAction("[Watermark] Progress", props()),
  processingSuccess: createAction("[Watermark] Success", props()),
  processingFailure: createAction("[Watermark] Failure", props()),
  downloadOutput: createAction("[Watermark] Download"),
  resetState: createAction("[Watermark] Reset")
};
var watermarkFeature = createFeature({
  name: "watermark",
  reducer: createReducer(init, on(WatermarkActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(WatermarkActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(WatermarkActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(WatermarkActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(WatermarkActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(WatermarkActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(WatermarkActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(WatermarkActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(WatermarkActions.resetState, () => init))
});
var { selectWatermarkState, selectStatus, selectProgress, selectOutputBlob } = watermarkFeature;
var selectWatermarkCanProcess = createSelector(selectWatermarkState, (s) => !!s.inputFile && s.status === "idle");
var selectWatermarkIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/14-watermark/watermark.component.ts
function WatermarkComponent_Conditional_9_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "p", 18);
    \u0275\u0275text(2, "Watermark Text");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 29);
    \u0275\u0275listener("input", function WatermarkComponent_Conditional_9_Conditional_26_Template_input_input_3_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onWmText($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 17)(5, "div", 24)(6, "span", 25);
    \u0275\u0275text(7, "Font Size");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 26);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "input", 30);
    \u0275\u0275listener("input", function WatermarkComponent_Conditional_9_Conditional_26_Template_input_input_10_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.wmFontSize = +ctx_r1.getValue($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx_r1.wmText);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", ctx_r1.wmFontSize, "px");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.wmFontSize);
  }
}
function WatermarkComponent_Conditional_9_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 21)(1, "span", 31);
    \u0275\u0275text(2, "\u{1F5BC}\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "p", 32);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 14);
    \u0275\u0275text(7, "PNG with transparency recommended");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "input", 33);
    \u0275\u0275listener("change", function WatermarkComponent_Conditional_9_Conditional_27_Template_input_change_8_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onWmImage($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.wmImageName || "Select watermark image");
  }
}
function WatermarkComponent_Conditional_9_For_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 20);
    \u0275\u0275listener("click", function WatermarkComponent_Conditional_9_For_33_Template_button_click_0_listener() {
      const pos_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.wmPosition = pos_r6);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pos_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r1.wmPosition === pos_r6 ? "w-14 h-10 rounded bg-teal-400/30 border-2 border-teal-400 text-xs text-teal-300" : "w-14 h-10 rounded bg-white/5 border border-white/10 text-xs text-white/40 hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(pos_r6);
  }
}
function WatermarkComponent_Conditional_9_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 34);
    \u0275\u0275text(1, " Adding... ");
  }
}
function WatermarkComponent_Conditional_9_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F4A7} Add Watermark ");
  }
}
function WatermarkComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275elementStart(18, "div", 17)(19, "p", 18);
    \u0275\u0275text(20, "Watermark Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 19)(22, "button", 20);
    \u0275\u0275listener("click", function WatermarkComponent_Conditional_9_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.wmMode = "text");
    });
    \u0275\u0275text(23, "\u270F\uFE0F Text");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "button", 20);
    \u0275\u0275listener("click", function WatermarkComponent_Conditional_9_Template_button_click_24_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.wmMode = "image");
    });
    \u0275\u0275text(25, "\u{1F5BC}\uFE0F Image");
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(26, WatermarkComponent_Conditional_9_Conditional_26_Template, 11, 3);
    \u0275\u0275conditionalCreate(27, WatermarkComponent_Conditional_9_Conditional_27_Template, 9, 1, "label", 21);
    \u0275\u0275elementStart(28, "div", 17)(29, "p", 18);
    \u0275\u0275text(30, "Position");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 22);
    \u0275\u0275repeaterCreate(32, WatermarkComponent_Conditional_9_For_33_Template, 2, 3, "button", 23, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "div", 17)(35, "div", 24)(36, "span", 25);
    \u0275\u0275text(37, "Opacity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "span", 26);
    \u0275\u0275text(39);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "input", 27);
    \u0275\u0275listener("input", function WatermarkComponent_Conditional_9_Template_input_input_40_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.wmOpacity = +ctx_r1.getValue($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "button", 28);
    \u0275\u0275pipe(42, "async");
    \u0275\u0275pipe(43, "async");
    \u0275\u0275listener("click", function WatermarkComponent_Conditional_9_Template_button_click_41_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(44, WatermarkComponent_Conditional_9_Conditional_44_Template, 2, 0);
    \u0275\u0275pipe(45, "async");
    \u0275\u0275conditionalBranchCreate(46, WatermarkComponent_Conditional_9_Conditional_46_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r7 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 14, meta_r7.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r7.width, "x", meta_r7.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(meta_r7.codec);
    \u0275\u0275advance(5);
    \u0275\u0275classMap(ctx_r1.wmMode === "text" ? "p-3 rounded-xl border-2 border-teal-400 bg-teal-400/10 text-teal-300 font-semibold text-sm" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r1.wmMode === "image" ? "p-3 rounded-xl border-2 border-teal-400 bg-teal-400/10 text-teal-300 font-semibold text-sm" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.wmMode === "text" ? 26 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.wmMode === "image" ? 27 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r1.positionGrid);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", ctx_r1.wmOpacity, "%");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.wmOpacity);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(42, 17, ctx_r1.canProcess$) || \u0275\u0275pipeBind1(43, 19, ctx_r1.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(45, 21, ctx_r1.isLoading$) ? 44 : 46);
  }
}
function WatermarkComponent_Conditional_11_Template(rf, ctx) {
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
function WatermarkComponent_Conditional_14_Template(rf, ctx) {
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
function WatermarkComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 35);
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
function WatermarkComponent_Conditional_18_Template(rf, ctx) {
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
var WatermarkComponent = class _WatermarkComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectWatermarkState);
  isLoading$ = this.store.select(selectWatermarkIsLoading);
  canProcess$ = this.store.select(selectWatermarkCanProcess);
  wmMode = "text";
  wmText = "Omni-Tool";
  wmFontSize = 24;
  wmImage = null;
  wmImageName = "";
  wmPosition = "BR";
  wmOpacity = 80;
  positionGrid = ["TL", "TC", "TR", "ML", "MC", "MR", "BL", "BC", "BR"];
  getValue(e) {
    return e.target.value;
  }
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(WatermarkActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(WatermarkActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(WatermarkActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onWmText(e) {
    this.wmText = e.target.value;
  }
  onWmImage(e) {
    const f = e.target.files?.[0];
    if (f) {
      this.wmImage = f;
      this.wmImageName = f.name;
    }
  }
  onProcess() {
    this.store.dispatch(WatermarkActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-KPFNU4EG.js", import.meta.url), { type: "module" }), { file: state.inputFile, mode: this.wmMode, text: this.wmText, fontSize: this.wmFontSize, imageFile: this.wmImage, position: this.wmPosition, opacity: this.wmOpacity / 100 }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(WatermarkActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const b = msg.data;
          this.store.dispatch(WatermarkActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(WatermarkActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Watermark failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(WatermarkActions.resetState());
  }
  static \u0275fac = function WatermarkComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WatermarkComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _WatermarkComponent, selectors: [["app-watermark"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-teal-400", "to-cyan-300"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video file here", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_watermark", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-teal-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "text-sm", "text-white/60"], [1, "grid", "grid-cols-2", "gap-2"], [3, "click"], [1, "flex", "items-center", "gap-3", "p-4", "rounded-xl", "border-2", "border-dashed", "border-white/20", "hover:border-teal-400/50", "bg-white/5", "cursor-pointer", "transition-all"], [1, "grid", "grid-cols-3", "gap-1", "w-48", "mx-auto"], [3, "class"], [1, "flex", "justify-between", "text-sm"], [1, "text-white/60"], [1, "text-teal-400", "font-mono"], ["type", "range", "min", "10", "max", "100", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-teal-400", 3, "input", "value"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-teal-500", "to-cyan-500", "text-black", "hover:shadow-[0_0_30px_rgba(20,184,166,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], ["type", "text", "placeholder", "Enter watermark text...", 1, "w-full", "px-4", "py-3", "rounded-xl", "bg-white/5", "border", "border-white/10", "text-white", "text-sm", "focus:border-teal-400", "focus:outline-none", 3, "input", "value"], ["type", "range", "min", "12", "max", "72", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-teal-400", 3, "input", "value"], [1, "text-2xl"], [1, "text-sm", "text-white/80"], ["type", "file", "accept", "image/*", 1, "hidden", 3, "change"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Adding Watermark...", 3, "progress", "size"]], template: function WatermarkComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u{1F4A7} Watermark Adder");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Overlay text or image watermark with position and opacity control");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function WatermarkComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, WatermarkComponent_Conditional_9_Template, 47, 23, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, WatermarkComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, WatermarkComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, WatermarkComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, WatermarkComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WatermarkComponent, [{
    type: Component,
    args: [{
      selector: "app-watermark",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">\u{1F4A7} Watermark Adder</h1>
        <p class="text-white/50 text-sm">Overlay text or image watermark with position and opacity control</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-teal-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>

              <!-- Watermark Mode -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Watermark Type</p>
                <div class="grid grid-cols-2 gap-2">
                  <button (click)="wmMode='text'" [class]="wmMode==='text' ? 'p-3 rounded-xl border-2 border-teal-400 bg-teal-400/10 text-teal-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">\u270F\uFE0F Text</button>
                  <button (click)="wmMode='image'" [class]="wmMode==='image' ? 'p-3 rounded-xl border-2 border-teal-400 bg-teal-400/10 text-teal-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">\u{1F5BC}\uFE0F Image</button>
                </div>
              </div>

              @if (wmMode === 'text') {
                <div class="space-y-2">
                  <p class="text-sm text-white/60">Watermark Text</p>
                  <input type="text" [value]="wmText" (input)="onWmText($event)" placeholder="Enter watermark text..."
                    class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-teal-400 focus:outline-none" />
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-white/60">Font Size</span><span class="text-teal-400 font-mono">{{ wmFontSize }}px</span></div>
                  <input type="range" min="12" max="72" [value]="wmFontSize" (input)="wmFontSize=+getValue($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-400" />
                </div>
              }
              @if (wmMode === 'image') {
                <label class="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-teal-400/50 bg-white/5 cursor-pointer transition-all">
                  <span class="text-2xl">\u{1F5BC}\uFE0F</span>
                  <div><p class="text-sm text-white/80">{{ wmImageName || 'Select watermark image' }}</p><p class="text-xs text-white/40">PNG with transparency recommended</p></div>
                  <input type="file" accept="image/*" (change)="onWmImage($event)" class="hidden" />
                </label>
              }

              <!-- Position Grid -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Position</p>
                <div class="grid grid-cols-3 gap-1 w-48 mx-auto">
                  @for (pos of positionGrid; track pos) {
                    <button (click)="wmPosition=pos" [class]="wmPosition===pos ? 'w-14 h-10 rounded bg-teal-400/30 border-2 border-teal-400 text-xs text-teal-300' : 'w-14 h-10 rounded bg-white/5 border border-white/10 text-xs text-white/40 hover:bg-white/10'">{{ pos }}</button>
                  }
                </div>
              </div>

              <!-- Opacity -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm"><span class="text-white/60">Opacity</span><span class="text-teal-400 font-mono">{{ wmOpacity }}%</span></div>
                <input type="range" min="10" max="100" [value]="wmOpacity" (input)="wmOpacity=+getValue($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-400" />
              </div>

              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-black hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Adding... } @else { \u{1F4A7} Add Watermark }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Adding Watermark..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_watermark" /> }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(WatermarkComponent, { className: "WatermarkComponent", filePath: "src/app/modules/video/14-watermark/watermark.component.ts", lineNumber: 95 });
})();
export {
  WatermarkComponent
};
//# sourceMappingURL=chunk-XQAGJUVF.js.map
