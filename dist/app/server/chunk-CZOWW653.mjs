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

// src/app/modules/video/17-denoiser/denoiser.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  algorithm: "hqdn3d",
  lumaStrength: 4,
  chromaStrength: 4,
  temporalStrength: 3,
  denoiseAudio: false,
  audioNoiseLevel: 50,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var DenoiserActions = {
  loadFile: createAction("[Denoiser] Load File", props()),
  loadMetaSuccess: createAction("[Denoiser] Meta OK", props()),
  loadMetaFailure: createAction("[Denoiser] Meta Fail", props()),
  updateConfig: createAction("[Denoiser] Update Config", props()),
  startProcessing: createAction("[Denoiser] Start"),
  updateProgress: createAction("[Denoiser] Progress", props()),
  processingSuccess: createAction("[Denoiser] Success", props()),
  processingFailure: createAction("[Denoiser] Failure", props()),
  downloadOutput: createAction("[Denoiser] Download"),
  resetState: createAction("[Denoiser] Reset")
};
var denoiserFeature = createFeature({
  name: "denoiser",
  reducer: createReducer(init, on(DenoiserActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(DenoiserActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(DenoiserActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(DenoiserActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(DenoiserActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(DenoiserActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(DenoiserActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(DenoiserActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(DenoiserActions.resetState, () => init))
});
var { selectDenoiserState, selectStatus, selectProgress, selectOutputBlob } = denoiserFeature;
var selectDenoiserCanProcess = createSelector(selectDenoiserState, (s) => !!s.inputFile && s.status === "idle");
var selectDenoiserIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/17-denoiser/denoiser.component.ts
var _forTrack0 = ($index, $item) => $item.value;
function DenoiserComponent_Conditional_9_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function DenoiserComponent_Conditional_9_For_23_Template_button_click_0_listener() {
      const algo_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.algorithm = algo_r3.value);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "p", 26);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const algo_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r3.algorithm === algo_r3.value ? "p-3 rounded-xl border-2 border-blue-400 bg-blue-400/10 text-blue-300 font-semibold text-sm" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", algo_r3.icon, " ", algo_r3.label, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(algo_r3.desc);
  }
}
function DenoiserComponent_Conditional_9_For_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function DenoiserComponent_Conditional_9_For_29_Template_button_click_0_listener() {
      const s_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.strength = s_r6.value);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r6 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r3.strength === s_r6.value ? "p-3 rounded-xl border-2 border-blue-400 bg-blue-400/10 text-blue-300 text-sm font-bold" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", s_r6.icon, " ", s_r6.label, " ");
  }
}
function DenoiserComponent_Conditional_9_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 27);
    \u0275\u0275text(1, " Denoising... ");
  }
}
function DenoiserComponent_Conditional_9_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F507} Denoise Video ");
  }
}
function DenoiserComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275text(20, "Algorithm");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 19);
    \u0275\u0275repeaterCreate(22, DenoiserComponent_Conditional_9_For_23_Template, 4, 5, "button", 20, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 17)(25, "p", 18);
    \u0275\u0275text(26, "Denoise Strength");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 21);
    \u0275\u0275repeaterCreate(28, DenoiserComponent_Conditional_9_For_29_Template, 2, 4, "button", 20, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 22)(31, "div")(32, "p", 23);
    \u0275\u0275text(33, "Temporal Denoising");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "p", 14);
    \u0275\u0275text(35, "Reduces flicker between frames");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "button", 24);
    \u0275\u0275listener("click", function DenoiserComponent_Conditional_9_Template_button_click_36_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.temporal = !ctx_r3.temporal);
    });
    \u0275\u0275element(37, "span");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "button", 25);
    \u0275\u0275pipe(39, "async");
    \u0275\u0275pipe(40, "async");
    \u0275\u0275listener("click", function DenoiserComponent_Conditional_9_Template_button_click_38_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onProcess());
    });
    \u0275\u0275conditionalCreate(41, DenoiserComponent_Conditional_9_Conditional_41_Template, 2, 0);
    \u0275\u0275pipe(42, "async");
    \u0275\u0275conditionalBranchCreate(43, DenoiserComponent_Conditional_9_Conditional_43_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r7 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 10, meta_r7.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r7.width, "x", meta_r7.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(meta_r7.codec);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r3.algorithms);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r3.strengths);
    \u0275\u0275advance(8);
    \u0275\u0275classMap(ctx_r3.temporal ? "w-12 h-6 rounded-full bg-blue-500 relative transition-colors" : "w-12 h-6 rounded-full bg-white/20 relative transition-colors");
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r3.temporal ? "absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" : "absolute left-1 top-1 w-4 h-4 bg-white/60 rounded-full transition-all");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(39, 13, ctx_r3.canProcess$) || \u0275\u0275pipeBind1(40, 15, ctx_r3.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(42, 17, ctx_r3.isLoading$) ? 41 : 43);
  }
}
function DenoiserComponent_Conditional_11_Template(rf, ctx) {
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
function DenoiserComponent_Conditional_14_Template(rf, ctx) {
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
function DenoiserComponent_Conditional_16_Template(rf, ctx) {
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
function DenoiserComponent_Conditional_18_Template(rf, ctx) {
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
var DenoiserComponent = class _DenoiserComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectDenoiserState);
  isLoading$ = this.store.select(selectDenoiserIsLoading);
  canProcess$ = this.store.select(selectDenoiserCanProcess);
  algorithm = "hqdn3d";
  strength = "medium";
  temporal = true;
  algorithms = [
    { value: "hqdn3d", label: "HQ Denoise 3D", icon: "\u26A1", desc: "Fast, good quality" },
    { value: "nlmeans", label: "NL-Means", icon: "\u{1F48E}", desc: "Slow, best quality" }
  ];
  strengths = [
    { value: "light", label: "Light", icon: "\u{1F324}\uFE0F" },
    { value: "medium", label: "Medium", icon: "\u2601\uFE0F" },
    { value: "heavy", label: "Heavy", icon: "\u{1F327}\uFE0F" }
  ];
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(DenoiserActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(DenoiserActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(DenoiserActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onProcess() {
    this.store.dispatch(DenoiserActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-4QN6VIPB.js", import.meta.url), { type: "module" }), { file: state.inputFile, algorithm: this.algorithm, strength: this.strength, temporal: this.temporal }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(DenoiserActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const b = msg.data;
          this.store.dispatch(DenoiserActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(DenoiserActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Denoising failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(DenoiserActions.resetState());
  }
  static \u0275fac = function DenoiserComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DenoiserComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DenoiserComponent, selectors: [["app-denoiser"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-blue-400", "to-indigo-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop noisy video here", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_denoised", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-blue-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "text-sm", "text-white/60"], [1, "grid", "grid-cols-2", "gap-2"], [3, "class"], [1, "grid", "grid-cols-3", "gap-2"], [1, "flex", "items-center", "justify-between", "p-3", "rounded-xl", "bg-white/5", "border", "border-white/10"], [1, "text-sm", "text-white/80"], [3, "click"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-blue-500", "to-indigo-500", "text-white", "hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "text-xs", "mt-1", "opacity-60"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Denoising...", 3, "progress", "size"]], template: function DenoiserComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u{1F507} Video Denoiser");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Remove grain and noise from video using hqdn3d / nlmeans filters");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function DenoiserComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, DenoiserComponent_Conditional_9_Template, 44, 19, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, DenoiserComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, DenoiserComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, DenoiserComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, DenoiserComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DenoiserComponent, [{
    type: Component,
    args: [{
      selector: "app-denoiser",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">\u{1F507} Video Denoiser</h1>
        <p class="text-white/50 text-sm">Remove grain and noise from video using hqdn3d / nlmeans filters</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop noisy video here" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-blue-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>

              <!-- Denoise Algorithm -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Algorithm</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (algo of algorithms; track algo.value) {
                    <button (click)="algorithm=algo.value"
                      [class]="algorithm===algo.value ? 'p-3 rounded-xl border-2 border-blue-400 bg-blue-400/10 text-blue-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ algo.icon }} {{ algo.label }}
                      <p class="text-xs mt-1 opacity-60">{{ algo.desc }}</p>
                    </button>
                  }
                </div>
              </div>

              <!-- Strength Presets -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Denoise Strength</p>
                <div class="grid grid-cols-3 gap-2">
                  @for (s of strengths; track s.value) {
                    <button (click)="strength=s.value"
                      [class]="strength===s.value ? 'p-3 rounded-xl border-2 border-blue-400 bg-blue-400/10 text-blue-300 text-sm font-bold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ s.icon }} {{ s.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Temporal Toggle -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p class="text-sm text-white/80">Temporal Denoising</p>
                  <p class="text-xs text-white/40">Reduces flicker between frames</p>
                </div>
                <button (click)="temporal=!temporal"
                  [class]="temporal ? 'w-12 h-6 rounded-full bg-blue-500 relative transition-colors' : 'w-12 h-6 rounded-full bg-white/20 relative transition-colors'">
                  <span [class]="temporal ? 'absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all' : 'absolute left-1 top-1 w-4 h-4 bg-white/60 rounded-full transition-all'"></span>
                </button>
              </div>

              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Denoising... } @else { \u{1F507} Denoise Video }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Denoising..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_denoised" /> }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DenoiserComponent, { className: "DenoiserComponent", filePath: "src/app/modules/video/17-denoiser/denoiser.component.ts", lineNumber: 90 });
})();
export {
  DenoiserComponent
};
//# sourceMappingURL=chunk-CZOWW653.mjs.map
