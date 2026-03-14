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

// src/app/modules/video/04-compressor/compressor.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  mode: "crf",
  targetSizeMB: 50,
  crfValue: 23,
  originalSizeMB: 0,
  estimatedOutputMB: 0,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var CompressorActions = {
  loadFile: createAction("[Compressor] Load File", props()),
  loadMetaSuccess: createAction("[Compressor] Meta OK", props()),
  loadMetaFailure: createAction("[Compressor] Meta Fail", props()),
  updateConfig: createAction("[Compressor] Update Config", props()),
  startProcessing: createAction("[Compressor] Start"),
  updateProgress: createAction("[Compressor] Progress", props()),
  processingSuccess: createAction("[Compressor] Success", props()),
  processingFailure: createAction("[Compressor] Failure", props()),
  downloadOutput: createAction("[Compressor] Download"),
  resetState: createAction("[Compressor] Reset")
};
var compressorFeature = createFeature({
  name: "compressor",
  reducer: createReducer(init, on(CompressorActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(CompressorActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(CompressorActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(CompressorActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(CompressorActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(CompressorActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(CompressorActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(CompressorActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(CompressorActions.resetState, () => init))
});
var { selectCompressorState, selectStatus, selectProgress, selectOutputBlob } = compressorFeature;
var selectCompressorCanProcess = createSelector(selectCompressorState, (s) => !!s.inputFile && s.status === "idle");
var selectCompressorIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/04-compressor/compressor.component.ts
var _forTrack0 = ($index, $item) => $item.crf;
function CompressorComponent_Conditional_9_For_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function CompressorComponent_Conditional_9_For_36_Template_button_click_0_listener() {
      const p_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onCrfChange(p_r4.crf));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-orange-500", ctx_r1.crfValue === p_r4.crf)("text-black", ctx_r1.crfValue === p_r4.crf)("bg-white/5", ctx_r1.crfValue !== p_r4.crf)("text-white/50", ctx_r1.crfValue !== p_r4.crf);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r4.label);
  }
}
function CompressorComponent_Conditional_9_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "span", 14);
    \u0275\u0275text(2, "Estimated Output");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 27);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("~", \u0275\u0275pipeBind2(5, 1, ctx_r1.estimateSize(ctx), "1.0-1"), " MB");
  }
}
function CompressorComponent_Conditional_9_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 28);
    \u0275\u0275text(1, " Compressing... ");
  }
}
function CompressorComponent_Conditional_9_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F4E6} Compress Video ");
  }
}
function CompressorComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275text(15, "Original Size");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p", 16);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "async");
    \u0275\u0275pipe(19, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "div", 11)(21, "div", 17)(22, "label", 18);
    \u0275\u0275text(23, "Quality (CRF)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span", 19);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "input", 20);
    \u0275\u0275listener("input", function CompressorComponent_Conditional_9_Template_input_input_26_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCrfChange(+$event.target.value));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 21)(28, "span");
    \u0275\u0275text(29, "\u{1F52C} Lossless");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "span");
    \u0275\u0275text(31, "\u2696\uFE0F Balanced");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "span");
    \u0275\u0275text(33, "\u{1F4E6} Tiny File");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(34, "div", 22);
    \u0275\u0275repeaterCreate(35, CompressorComponent_Conditional_9_For_36_Template, 2, 9, "button", 23, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(37, CompressorComponent_Conditional_9_Conditional_37_Template, 6, 4, "div", 24);
    \u0275\u0275pipe(38, "async");
    \u0275\u0275elementStart(39, "button", 25);
    \u0275\u0275pipe(40, "async");
    \u0275\u0275pipe(41, "async");
    \u0275\u0275listener("click", function CompressorComponent_Conditional_9_Template_button_click_39_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(42, CompressorComponent_Conditional_9_Conditional_42_Template, 2, 0);
    \u0275\u0275pipe(43, "async");
    \u0275\u0275conditionalBranchCreate(44, CompressorComponent_Conditional_9_Conditional_44_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_12_0;
    const meta_r5 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 17, meta_r5.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r5.width, "\xD7", meta_r5.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(19, 22, (tmp_4_0 = \u0275\u0275pipeBind1(18, 20, ctx_r1.state$)) == null ? null : tmp_4_0.originalSizeMB, "1.0-1"), " MB");
    \u0275\u0275advance(7);
    \u0275\u0275classProp("text-emerald-400", ctx_r1.crfValue < 20)("text-cyan-400", ctx_r1.crfValue >= 20 && ctx_r1.crfValue < 30)("text-orange-400", ctx_r1.crfValue >= 30 && ctx_r1.crfValue < 40)("text-red-400", ctx_r1.crfValue >= 40);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.crfValue);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.crfValue);
    \u0275\u0275advance(9);
    \u0275\u0275repeater(ctx_r1.crfPresets);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_12_0 = (tmp_12_0 = \u0275\u0275pipeBind1(38, 25, ctx_r1.state$)) == null ? null : tmp_12_0.originalSizeMB) ? 37 : -1, tmp_12_0);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(40, 27, ctx_r1.canProcess$) || \u0275\u0275pipeBind1(41, 29, ctx_r1.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(43, 31, ctx_r1.isLoading$) ? 42 : 44);
  }
}
function CompressorComponent_Conditional_11_Template(rf, ctx) {
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
function CompressorComponent_Conditional_14_Template(rf, ctx) {
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
function CompressorComponent_Conditional_16_Template(rf, ctx) {
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
function CompressorComponent_Conditional_18_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275pipe(3, "number");
    \u0275\u0275pipe(4, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" \u2705 Compressed! ", \u0275\u0275pipeBind2(3, 4, (tmp_3_0 = \u0275\u0275pipeBind1(2, 2, ctx_r1.state$)) == null ? null : tmp_3_0.originalSizeMB, "1.0-1"), " MB \u2192 ", \u0275\u0275pipeBind2(4, 7, ctx, "1.0-1"), " MB ");
  }
}
function CompressorComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275conditionalCreate(1, CompressorComponent_Conditional_18_Conditional_1_Template, 5, 10, "div", 30);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275element(3, "app-export-panel", 31);
    \u0275\u0275pipe(4, "async");
    \u0275\u0275pipe(5, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_1_0 = (tmp_1_0 = \u0275\u0275pipeBind1(2, 3, ctx_r1.state$)) == null ? null : tmp_1_0.outputSizeMB) ? 1 : -1, tmp_1_0);
    \u0275\u0275advance(2);
    \u0275\u0275property("outputBlob", ((tmp_2_0 = \u0275\u0275pipeBind1(4, 5, ctx_r1.state$)) == null ? null : tmp_2_0.outputBlob) ?? null)("outputSizeMB", ((tmp_3_0 = \u0275\u0275pipeBind1(5, 7, ctx_r1.state$)) == null ? null : tmp_3_0.outputSizeMB) ?? null);
  }
}
var CompressorComponent = class _CompressorComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectCompressorState);
  isLoading$ = this.store.select(selectCompressorIsLoading);
  canProcess$ = this.store.select(selectCompressorCanProcess);
  crfValue = 23;
  crfPresets = [
    { crf: 18, label: "\u{1F52C} High" },
    { crf: 23, label: "\u2696\uFE0F Medium" },
    { crf: 28, label: "\u{1F4E6} Small" },
    { crf: 35, label: "\u{1F5DC}\uFE0F Tiny" }
  ];
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(CompressorActions.loadFile({ file }));
    this.store.dispatch(CompressorActions.updateConfig({ config: { originalSizeMB: file.size / 1048576 } }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(CompressorActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(CompressorActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onCrfChange(value) {
    this.crfValue = value;
    this.store.dispatch(CompressorActions.updateConfig({ config: { crfValue: value } }));
  }
  estimateSize(originalMB) {
    const ratio = Math.pow(0.5, (this.crfValue - 18) / 6);
    return originalMB * Math.max(ratio, 0.02);
  }
  onProcess() {
    this.store.dispatch(CompressorActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-CKYH2PTL.js", import.meta.url), { type: "module" }), { file: state.inputFile, crfValue: state.crfValue, outputFormat: "mp4" }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(CompressorActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const blob = msg.data;
          this.store.dispatch(CompressorActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(CompressorActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Compression failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(CompressorActions.resetState());
  }
  static \u0275fac = function CompressorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CompressorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CompressorComponent, selectors: [["app-compressor"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-orange-400", "to-amber-200"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video file here or click to browse", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], [1, "space-y-3"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-orange-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "flex", "justify-between", "items-center"], [1, "text-xs", "text-white/40", "uppercase", "tracking-wider"], [1, "text-sm", "font-bold"], ["type", "range", "min", "0", "max", "51", "step", "1", 1, "w-full", "h-2", "rounded-full", "appearance-none", "cursor-pointer", "bg-gradient-to-r", "from-emerald-500", "via-cyan-500", "via-orange-400", "to-red-500", 3, "input", "value"], [1, "flex", "justify-between", "text-[10px]", "text-white/30"], [1, "grid", "grid-cols-4", "gap-2"], [1, "py-1.5", "rounded-lg", "text-xs", "font-semibold", "transition-all", "duration-200", 3, "bg-orange-500", "text-black", "bg-white/5", "text-white/50"], [1, "p-3", "rounded-xl", "bg-white/5", "border", "border-white/10", "flex", "items-center", "justify-between"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-orange-500", "to-amber-500", "text-black", "hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "py-1.5", "rounded-lg", "text-xs", "font-semibold", "transition-all", "duration-200", 3, "click"], [1, "text-sm", "font-bold", "text-orange-400"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Compressing...", 3, "progress", "size"], [1, "p-3", "rounded-xl", "bg-emerald-500/10", "border", "border-emerald-500/30", "text-sm", "text-emerald-400", "text-center"], ["defaultFilename", "omni_compressed", 3, "outputBlob", "outputSizeMB"]], template: function CompressorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F4E6} Video Compressor ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Reduce file size with CRF quality control \u2014 powered by FFmpeg WASM");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function CompressorComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, CompressorComponent_Conditional_9_Template, 45, 33, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, CompressorComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, CompressorComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, CompressorComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, CompressorComponent_Conditional_18_Template, 6, 9, "div", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CompressorComponent, [{
    type: Component,
    args: [{
      selector: "app-compressor",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
          \u{1F4E6} Video Compressor
        </h1>
        <p class="text-white/50 text-sm">Reduce file size with CRF quality control \u2014 powered by FFmpeg WASM</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <!-- Metadata -->
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-orange-400">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}\xD7{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Original Size</p>
                  <p class="text-sm font-semibold text-white">{{ (state$ | async)?.originalSizeMB | number:'1.0-1' }} MB</p>
                </div>
              </div>

              <!-- CRF Slider -->
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <label class="text-xs text-white/40 uppercase tracking-wider">Quality (CRF)</label>
                  <span class="text-sm font-bold" [class.text-emerald-400]="crfValue < 20"
                    [class.text-cyan-400]="crfValue >= 20 && crfValue < 30"
                    [class.text-orange-400]="crfValue >= 30 && crfValue < 40"
                    [class.text-red-400]="crfValue >= 40">{{ crfValue }}</span>
                </div>
                <input type="range" min="0" max="51" step="1" [value]="crfValue"
                  (input)="onCrfChange(+($any($event.target)).value)"
                  class="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-emerald-500 via-cyan-500 via-orange-400 to-red-500" />
                <div class="flex justify-between text-[10px] text-white/30">
                  <span>\u{1F52C} Lossless</span>
                  <span>\u2696\uFE0F Balanced</span>
                  <span>\u{1F4E6} Tiny File</span>
                </div>
              </div>

              <!-- Quick CRF Presets -->
              <div class="grid grid-cols-4 gap-2">
                @for (p of crfPresets; track p.crf) {
                  <button (click)="onCrfChange(p.crf)"
                    class="py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                    [class.bg-orange-500]="crfValue === p.crf"
                    [class.text-black]="crfValue === p.crf"
                    [class.bg-white/5]="crfValue !== p.crf"
                    [class.text-white/50]="crfValue !== p.crf">{{ p.label }}</button>
                }
              </div>

              <!-- Estimated Output -->
              @if ((state$ | async)?.originalSizeMB; as origMB) {
                <div class="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span class="text-xs text-white/40">Estimated Output</span>
                  <span class="text-sm font-bold text-orange-400">~{{ estimateSize(origMB) | number:'1.0-1' }} MB</span>
                </div>
              }

              <!-- Process Button -->
              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Compressing...
                } @else { \u{1F4E6} Compress Video }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Compressing..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <div class="space-y-3">
              @if ((state$ | async)?.outputSizeMB; as outMB) {
                <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-400 text-center">
                  \u2705 Compressed! {{ (state$ | async)?.originalSizeMB | number:'1.0-1' }} MB \u2192 {{ outMB | number:'1.0-1' }} MB
                </div>
              }
              <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null"
                [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
                defaultFilename="omni_compressed" />
            </div>
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CompressorComponent, { className: "CompressorComponent", filePath: "src/app/modules/video/04-compressor/compressor.component.ts", lineNumber: 131 });
})();
export {
  CompressorComponent
};
//# sourceMappingURL=chunk-NEARWNNK.mjs.map
