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
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3
} from "./chunk-CX47CWGJ.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-UFAUNXOA.mjs";

// src/app/modules/video/09-flip-rotate/flipRotate.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  flipH: false,
  flipV: false,
  rotation: 0,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var FlipRotateActions = {
  loadFile: createAction("[FlipRotate] Load File", props()),
  loadMetaSuccess: createAction("[FlipRotate] Meta OK", props()),
  loadMetaFailure: createAction("[FlipRotate] Meta Fail", props()),
  updateConfig: createAction("[FlipRotate] Update Config", props()),
  startProcessing: createAction("[FlipRotate] Start"),
  updateProgress: createAction("[FlipRotate] Progress", props()),
  processingSuccess: createAction("[FlipRotate] Success", props()),
  processingFailure: createAction("[FlipRotate] Failure", props()),
  downloadOutput: createAction("[FlipRotate] Download"),
  resetState: createAction("[FlipRotate] Reset")
};
var flipRotateFeature = createFeature({
  name: "flipRotate",
  reducer: createReducer(init, on(FlipRotateActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(FlipRotateActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(FlipRotateActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(FlipRotateActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(FlipRotateActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(FlipRotateActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(FlipRotateActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(FlipRotateActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(FlipRotateActions.resetState, () => init))
});
var { selectFlipRotateState, selectStatus, selectProgress, selectOutputBlob } = flipRotateFeature;
var selectFlipRotateCanProcess = createSelector(selectFlipRotateState, (s) => !!s.inputFile && s.status === "idle");
var selectFlipRotateIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/09-flip-rotate/flipRotate.component.ts
var _forTrack0 = ($index, $item) => $item.deg;
function FlipRotateComponent_Conditional_9_For_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 22);
    \u0275\u0275listener("click", function FlipRotateComponent_Conditional_9_For_24_Template_button_click_0_listener() {
      const r_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.onRotate(r_r3.deg));
    });
    \u0275\u0275elementStart(1, "span", 25);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 26);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-pink-500", ctx_r3.rotation === r_r3.deg)("text-black", ctx_r3.rotation === r_r3.deg)("border-pink-500", ctx_r3.rotation === r_r3.deg)("bg-white/5", ctx_r3.rotation !== r_r3.deg)("text-white/60", ctx_r3.rotation !== r_r3.deg)("border-white/10", ctx_r3.rotation !== r_r3.deg);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r3.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r3.label);
  }
}
function FlipRotateComponent_Conditional_9_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 27);
    \u0275\u0275text(1, " Transforming... ");
  }
}
function FlipRotateComponent_Conditional_9_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F501} Apply Transform ");
  }
}
function FlipRotateComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275elementStart(19, "div", 17)(20, "label", 18);
    \u0275\u0275text(21, "Rotation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 19);
    \u0275\u0275repeaterCreate(23, FlipRotateComponent_Conditional_9_For_24_Template, 5, 14, "button", 20, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 17)(26, "label", 18);
    \u0275\u0275text(27, "Flip");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 21)(29, "button", 22);
    \u0275\u0275listener("click", function FlipRotateComponent_Conditional_9_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleFlipH());
    });
    \u0275\u0275text(30, " \u2194\uFE0F Flip Horizontal ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "button", 22);
    \u0275\u0275listener("click", function FlipRotateComponent_Conditional_9_Template_button_click_31_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.toggleFlipV());
    });
    \u0275\u0275text(32, " \u2195\uFE0F Flip Vertical ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(33, "div", 23);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "button", 24);
    \u0275\u0275pipe(36, "async");
    \u0275\u0275pipe(37, "async");
    \u0275\u0275listener("click", function FlipRotateComponent_Conditional_9_Template_button_click_35_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onProcess());
    });
    \u0275\u0275conditionalCreate(38, FlipRotateComponent_Conditional_9_Conditional_38_Template, 2, 0);
    \u0275\u0275pipe(39, "async");
    \u0275\u0275conditionalBranchCreate(40, FlipRotateComponent_Conditional_9_Conditional_40_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r5 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 33, meta_r5.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r5.width, "\xD7", meta_r5.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(18, 36, meta_r5.fps, "1.0-0"));
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r3.rotations);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("bg-pink-500/20", ctx_r3.flipH)("text-pink-300", ctx_r3.flipH)("border-pink-500/40", ctx_r3.flipH)("bg-white/5", !ctx_r3.flipH)("text-white/60", !ctx_r3.flipH)("border-white/10", !ctx_r3.flipH);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("bg-pink-500/20", ctx_r3.flipV)("text-pink-300", ctx_r3.flipV)("border-pink-500/40", ctx_r3.flipV)("bg-white/5", !ctx_r3.flipV)("text-white/60", !ctx_r3.flipV)("border-white/10", !ctx_r3.flipV);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3(" Transforms: ", ctx_r3.rotation === 0 ? "No rotation" : ctx_r3.rotation + "\xB0", " ", ctx_r3.flipH ? "\u2022 Flip H" : "", " ", ctx_r3.flipV ? "\u2022 Flip V" : "", " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(36, 39, ctx_r3.canProcess$) || \u0275\u0275pipeBind1(37, 41, ctx_r3.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(39, 43, ctx_r3.isLoading$) ? 38 : 40);
  }
}
function FlipRotateComponent_Conditional_11_Template(rf, ctx) {
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
function FlipRotateComponent_Conditional_14_Template(rf, ctx) {
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
function FlipRotateComponent_Conditional_16_Template(rf, ctx) {
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
function FlipRotateComponent_Conditional_18_Template(rf, ctx) {
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
var FlipRotateComponent = class _FlipRotateComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectFlipRotateState);
  isLoading$ = this.store.select(selectFlipRotateIsLoading);
  canProcess$ = this.store.select(selectFlipRotateCanProcess);
  rotation = 0;
  flipH = false;
  flipV = false;
  rotations = [
    { deg: 0, label: "None", icon: "\u23F9\uFE0F" },
    { deg: 90, label: "90\xB0 CW", icon: "\u21A9\uFE0F" },
    { deg: 180, label: "180\xB0", icon: "\u{1F503}" },
    { deg: 270, label: "90\xB0 CCW", icon: "\u21AA\uFE0F" }
  ];
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(FlipRotateActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(FlipRotateActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(FlipRotateActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onRotate(deg) {
    this.rotation = deg;
    this.store.dispatch(FlipRotateActions.updateConfig({ config: { rotation: deg } }));
  }
  toggleFlipH() {
    this.flipH = !this.flipH;
    this.store.dispatch(FlipRotateActions.updateConfig({ config: { flipH: this.flipH } }));
  }
  toggleFlipV() {
    this.flipV = !this.flipV;
    this.store.dispatch(FlipRotateActions.updateConfig({ config: { flipV: this.flipV } }));
  }
  onProcess() {
    this.store.dispatch(FlipRotateActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-DFKMXLCH.js", import.meta.url), { type: "module" }), { file: state.inputFile, flipH: this.flipH, flipV: this.flipV, rotation: this.rotation }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(FlipRotateActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const blob = msg.data;
          this.store.dispatch(FlipRotateActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(FlipRotateActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Transform failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(FlipRotateActions.resetState());
  }
  static \u0275fac = function FlipRotateComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FlipRotateComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FlipRotateComponent, selectors: [["app-flip-rotate"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-pink-400", "to-rose-200"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video file here or click to browse", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_flipped", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-pink-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "text-xs", "text-white/40", "uppercase", "tracking-wider"], [1, "grid", "grid-cols-4", "gap-2"], [1, "py-3", "rounded-xl", "text-center", "transition-all", "duration-200", "border", 3, "bg-pink-500", "text-black", "border-pink-500", "bg-white/5", "text-white/60", "border-white/10"], [1, "grid", "grid-cols-2", "gap-2"], [1, "py-3", "rounded-xl", "text-center", "transition-all", "duration-200", "border", 3, "click"], [1, "p-3", "rounded-xl", "bg-white/5", "text-xs", "text-white/50"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-pink-500", "to-rose-500", "text-white", "hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "text-xl", "block"], [1, "text-[10px]", "block", "mt-1"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Transforming...", 3, "progress", "size"]], template: function FlipRotateComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F501} Flip & Rotate ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Flip horizontally/vertically and rotate by 90\xB0/180\xB0/270\xB0");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function FlipRotateComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, FlipRotateComponent_Conditional_9_Template, 41, 45, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, FlipRotateComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, FlipRotateComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, FlipRotateComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, FlipRotateComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FlipRotateComponent, [{
    type: Component,
    args: [{
      selector: "app-flip-rotate",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-200">
          \u{1F501} Flip & Rotate
        </h1>
        <p class="text-white/50 text-sm">Flip horizontally/vertically and rotate by 90\xB0/180\xB0/270\xB0</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-pink-400">{{ meta.duration | number:'1.0-0' }}s</p>
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

              <!-- Rotation Buttons -->
              <div class="space-y-2">
                <label class="text-xs text-white/40 uppercase tracking-wider">Rotation</label>
                <div class="grid grid-cols-4 gap-2">
                  @for (r of rotations; track r.deg) {
                    <button (click)="onRotate(r.deg)"
                      class="py-3 rounded-xl text-center transition-all duration-200 border"
                      [class.bg-pink-500]="rotation === r.deg"
                      [class.text-black]="rotation === r.deg"
                      [class.border-pink-500]="rotation === r.deg"
                      [class.bg-white/5]="rotation !== r.deg"
                      [class.text-white/60]="rotation !== r.deg"
                      [class.border-white/10]="rotation !== r.deg">
                      <span class="text-xl block">{{ r.icon }}</span>
                      <span class="text-[10px] block mt-1">{{ r.label }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Flip Buttons -->
              <div class="space-y-2">
                <label class="text-xs text-white/40 uppercase tracking-wider">Flip</label>
                <div class="grid grid-cols-2 gap-2">
                  <button (click)="toggleFlipH()"
                    class="py-3 rounded-xl text-center transition-all duration-200 border"
                    [class.bg-pink-500/20]="flipH"
                    [class.text-pink-300]="flipH"
                    [class.border-pink-500/40]="flipH"
                    [class.bg-white/5]="!flipH"
                    [class.text-white/60]="!flipH"
                    [class.border-white/10]="!flipH">
                    \u2194\uFE0F Flip Horizontal
                  </button>
                  <button (click)="toggleFlipV()"
                    class="py-3 rounded-xl text-center transition-all duration-200 border"
                    [class.bg-pink-500/20]="flipV"
                    [class.text-pink-300]="flipV"
                    [class.border-pink-500/40]="flipV"
                    [class.bg-white/5]="!flipV"
                    [class.text-white/60]="!flipV"
                    [class.border-white/10]="!flipV">
                    \u2195\uFE0F Flip Vertical
                  </button>
                </div>
              </div>

              <!-- Active Transforms Summary -->
              <div class="p-3 rounded-xl bg-white/5 text-xs text-white/50">
                Transforms: {{ rotation === 0 ? 'No rotation' : rotation + '\xB0' }}
                {{ flipH ? '\u2022 Flip H' : '' }} {{ flipV ? '\u2022 Flip V' : '' }}
              </div>

              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Transforming...
                } @else { \u{1F501} Apply Transform }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Transforming..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_flipped" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FlipRotateComponent, { className: "FlipRotateComponent", filePath: "src/app/modules/video/09-flip-rotate/fliprotate.component.ts", lineNumber: 132 });
})();
export {
  FlipRotateComponent
};
//# sourceMappingURL=chunk-Y424JBBV.mjs.map
