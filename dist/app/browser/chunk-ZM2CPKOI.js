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
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-3GKPD7AG.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-KWSTWQNB.js";

// src/app/modules/video/18-interpolator/interpolator.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  inputFPS: 30,
  targetFPS: 60,
  algorithm: "duplicate",
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var InterpolatorActions = {
  loadFile: createAction("[Interpolator] Load File", props()),
  loadMetaSuccess: createAction("[Interpolator] Meta OK", props()),
  loadMetaFailure: createAction("[Interpolator] Meta Fail", props()),
  updateConfig: createAction("[Interpolator] Update Config", props()),
  startProcessing: createAction("[Interpolator] Start"),
  updateProgress: createAction("[Interpolator] Progress", props()),
  processingSuccess: createAction("[Interpolator] Success", props()),
  processingFailure: createAction("[Interpolator] Failure", props()),
  downloadOutput: createAction("[Interpolator] Download"),
  resetState: createAction("[Interpolator] Reset")
};
var interpolatorFeature = createFeature({
  name: "interpolator",
  reducer: createReducer(init, on(InterpolatorActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(InterpolatorActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(InterpolatorActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(InterpolatorActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(InterpolatorActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(InterpolatorActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(InterpolatorActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(InterpolatorActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(InterpolatorActions.resetState, () => init))
});
var { selectInterpolatorState, selectStatus, selectProgress, selectOutputBlob } = interpolatorFeature;
var selectInterpolatorCanProcess = createSelector(selectInterpolatorState, (s) => !!s.inputFile && s.status === "idle");
var selectInterpolatorIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/18-interpolator/interpolator.component.ts
var _forTrack0 = ($index, $item) => $item.value;
function InterpolatorComponent_Conditional_9_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function InterpolatorComponent_Conditional_9_For_23_Template_button_click_0_listener() {
      const fps_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.targetFps = fps_r3);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const fps_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r3.targetFps === fps_r3 ? "p-3 rounded-xl border-2 border-violet-400 bg-violet-400/10 text-violet-300 text-sm font-bold" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", fps_r3, " FPS ");
  }
}
function InterpolatorComponent_Conditional_9_For_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function InterpolatorComponent_Conditional_9_For_29_Template_button_click_0_listener() {
      const algo_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.algo_mode = algo_r6.value);
    });
    \u0275\u0275text(1);
    \u0275\u0275element(2, "br");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const algo_r6 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r3.algo_mode === algo_r6.value ? "p-3 rounded-xl border-2 border-violet-400 bg-violet-400/10 text-violet-300 text-sm font-semibold" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", algo_r6.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", algo_r6.label, " ");
  }
}
function InterpolatorComponent_Conditional_9_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 25);
    \u0275\u0275text(1, " Interpolating... ");
  }
}
function InterpolatorComponent_Conditional_9_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F39E}\uFE0F Interpolate Frames ");
  }
}
function InterpolatorComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275text(10, "Current FPS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p", 16);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 13)(14, "p", 14);
    \u0275\u0275text(15, "Target FPS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p", 15);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 17)(19, "p", 18);
    \u0275\u0275text(20, "Target Frame Rate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 19);
    \u0275\u0275repeaterCreate(22, InterpolatorComponent_Conditional_9_For_23_Template, 2, 3, "button", 20, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 17)(25, "p", 18);
    \u0275\u0275text(26, "Interpolation Method");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 21);
    \u0275\u0275repeaterCreate(28, InterpolatorComponent_Conditional_9_For_29_Template, 4, 4, "button", 20, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 22);
    \u0275\u0275text(31, " \u2139\uFE0F Higher FPS = more frames generated = longer processing time. MCI gives best motion quality. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "button", 23);
    \u0275\u0275pipe(33, "async");
    \u0275\u0275pipe(34, "async");
    \u0275\u0275listener("click", function InterpolatorComponent_Conditional_9_Template_button_click_32_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onProcess());
    });
    \u0275\u0275conditionalCreate(35, InterpolatorComponent_Conditional_9_Conditional_35_Template, 2, 0);
    \u0275\u0275pipe(36, "async");
    \u0275\u0275conditionalBranchCreate(37, InterpolatorComponent_Conditional_9_Conditional_37_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r7 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 5, meta_r7.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(meta_r7.fps);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r3.targetFps);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r3.fpsOptions);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r3.algos);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", \u0275\u0275pipeBind1(33, 8, ctx_r3.canProcess$) === false || \u0275\u0275pipeBind1(34, 10, ctx_r3.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(36, 12, ctx_r3.isLoading$) ? 35 : 37);
  }
}
function InterpolatorComponent_Conditional_11_Template(rf, ctx) {
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
function InterpolatorComponent_Conditional_14_Template(rf, ctx) {
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
function InterpolatorComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 26);
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
function InterpolatorComponent_Conditional_18_Template(rf, ctx) {
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
var InterpolatorComponent = class _InterpolatorComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectInterpolatorState);
  isLoading$ = this.store.select(selectInterpolatorIsLoading);
  canProcess$ = this.store.select(selectInterpolatorCanProcess);
  targetFps = 60;
  algo_mode = "mci";
  fpsOptions = [30, 60, 120, 240];
  algos = [
    { value: "blend", label: "Blend", icon: "\u{1F30A}" },
    { value: "mci", label: "MCI", icon: "\u{1F3AF}" },
    { value: "dup", label: "Duplicate", icon: "\u{1F4CB}" }
  ];
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(InterpolatorActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(InterpolatorActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(InterpolatorActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onProcess() {
    this.store.dispatch(InterpolatorActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-UWIN2YFJ.js", import.meta.url), { type: "module" }), { file: state.inputFile, targetFps: this.targetFps, algorithm: this.algo_mode }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(InterpolatorActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const b = msg.data;
          this.store.dispatch(InterpolatorActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(InterpolatorActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Interpolation failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(InterpolatorActions.resetState());
  }
  static \u0275fac = function InterpolatorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InterpolatorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _InterpolatorComponent, selectors: [["app-interpolator"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-violet-400", "to-purple-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video to interpolate", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_interpolated", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-violet-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "text-sm", "text-white/60"], [1, "grid", "grid-cols-4", "gap-2"], [3, "class"], [1, "grid", "grid-cols-3", "gap-2"], [1, "p-3", "rounded-xl", "bg-violet-500/10", "border", "border-violet-500/20", "text-xs", "text-violet-300/80"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-violet-500", "to-purple-500", "text-white", "hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [3, "click"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Interpolating...", 3, "progress", "size"]], template: function InterpolatorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u{1F39E}\uFE0F Frame Interpolator");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Increase frame rate for smoother playback with AI-powered interpolation");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function InterpolatorComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, InterpolatorComponent_Conditional_9_Template, 38, 14, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, InterpolatorComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, InterpolatorComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, InterpolatorComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, InterpolatorComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InterpolatorComponent, [{
    type: Component,
    args: [{
      selector: "app-interpolator",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">\u{1F39E}\uFE0F Frame Interpolator</h1>
        <p class="text-white/50 text-sm">Increase frame rate for smoother playback with AI-powered interpolation</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video to interpolate" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-violet-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Current FPS</p><p class="text-sm font-semibold text-white">{{ meta.fps }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Target FPS</p><p class="text-sm font-semibold text-violet-400">{{ targetFps }}</p></div>
              </div>

              <!-- Target FPS -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Target Frame Rate</p>
                <div class="grid grid-cols-4 gap-2">
                  @for (fps of fpsOptions; track fps) {
                    <button (click)="targetFps=fps"
                      [class]="targetFps===fps ? 'p-3 rounded-xl border-2 border-violet-400 bg-violet-400/10 text-violet-300 text-sm font-bold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ fps }} FPS
                    </button>
                  }
                </div>
              </div>

              <!-- Algorithm -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Interpolation Method</p>
                <div class="grid grid-cols-3 gap-2">
                  @for (algo of algos; track algo.value) {
                    <button (click)="algo_mode=algo.value"
                      [class]="algo_mode===algo.value ? 'p-3 rounded-xl border-2 border-violet-400 bg-violet-400/10 text-violet-300 text-sm font-semibold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ algo.icon }}<br/>{{ algo.label }}
                    </button>
                  }
                </div>
              </div>

              <div class="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300/80">
                \u2139\uFE0F Higher FPS = more frames generated = longer processing time. MCI gives best motion quality.
              </div>

              <button [disabled]="(canProcess$ | async) === false || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Interpolating... } @else { \u{1F39E}\uFE0F Interpolate Frames }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Interpolating..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_interpolated" /> }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(InterpolatorComponent, { className: "InterpolatorComponent", filePath: "src/app/modules/video/18-interpolator/interpolator.component.ts", lineNumber: 81 });
})();
export {
  InterpolatorComponent
};
//# sourceMappingURL=chunk-ZM2CPKOI.js.map
