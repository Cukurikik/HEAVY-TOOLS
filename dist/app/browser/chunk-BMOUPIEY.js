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
} from "./chunk-3GKPD7AG.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-KWSTWQNB.js";

// src/app/modules/video/10-crop-resize/cropResize.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  mode: "resize",
  cropRegion: { x: 0, y: 0, w: 1920, h: 1080 },
  targetWidth: 1920,
  targetHeight: 1080,
  lockAspectRatio: true,
  padMode: "pad",
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var CropResizeActions = {
  loadFile: createAction("[CropResize] Load File", props()),
  loadMetaSuccess: createAction("[CropResize] Meta OK", props()),
  loadMetaFailure: createAction("[CropResize] Meta Fail", props()),
  updateConfig: createAction("[CropResize] Update Config", props()),
  startProcessing: createAction("[CropResize] Start"),
  updateProgress: createAction("[CropResize] Progress", props()),
  processingSuccess: createAction("[CropResize] Success", props()),
  processingFailure: createAction("[CropResize] Failure", props()),
  downloadOutput: createAction("[CropResize] Download"),
  resetState: createAction("[CropResize] Reset")
};
var cropResizeFeature = createFeature({
  name: "cropResize",
  reducer: createReducer(init, on(CropResizeActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(CropResizeActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(CropResizeActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(CropResizeActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(CropResizeActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(CropResizeActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(CropResizeActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(CropResizeActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(CropResizeActions.resetState, () => init))
});
var { selectCropResizeState, selectStatus, selectProgress, selectOutputBlob } = cropResizeFeature;
var selectCropResizeCanProcess = createSelector(selectCropResizeState, (s) => !!s.inputFile && s.status === "idle");
var selectCropResizeIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/10-crop-resize/cropResize.component.ts
var _forTrack0 = ($index, $item) => $item.label;
var _forTrack1 = ($index, $item) => $item.value;
function CropResizeComponent_Conditional_9_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function CropResizeComponent_Conditional_9_For_23_Template_button_click_0_listener() {
      const res_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.onResPreset(res_r3.w, res_r3.h));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const res_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-teal-500", ctx_r3.targetWidth === res_r3.w && ctx_r3.targetHeight === res_r3.h)("text-black", ctx_r3.targetWidth === res_r3.w && ctx_r3.targetHeight === res_r3.h)("border-teal-500", ctx_r3.targetWidth === res_r3.w && ctx_r3.targetHeight === res_r3.h)("bg-white/5", ctx_r3.targetWidth !== res_r3.w || ctx_r3.targetHeight !== res_r3.h)("text-white/60", ctx_r3.targetWidth !== res_r3.w || ctx_r3.targetHeight !== res_r3.h)("border-white/10", ctx_r3.targetWidth !== res_r3.w || ctx_r3.targetHeight !== res_r3.h);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(res_r3.label);
  }
}
function CropResizeComponent_Conditional_9_For_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function CropResizeComponent_Conditional_9_For_38_Template_button_click_0_listener() {
      const m_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.onPadMode(m_r6.value));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r6 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-teal-500/20", ctx_r3.padMode === m_r6.value)("text-teal-300", ctx_r3.padMode === m_r6.value)("bg-white/5", ctx_r3.padMode !== m_r6.value)("text-white/50", ctx_r3.padMode !== m_r6.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", m_r6.icon, " ", m_r6.label);
  }
}
function CropResizeComponent_Conditional_9_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 29);
    \u0275\u0275text(1, " Resizing... ");
  }
}
function CropResizeComponent_Conditional_9_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F4D0} Resize Video ");
  }
}
function CropResizeComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 12)(2, "div", 13)(3, "p", 14);
    \u0275\u0275text(4, "Current");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 15);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 13)(8, "p", 14);
    \u0275\u0275text(9, "Target");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 16);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 13)(13, "p", 14);
    \u0275\u0275text(14, "Duration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p", 17);
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 18)(19, "label", 19);
    \u0275\u0275text(20, "Resolution Preset");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 20);
    \u0275\u0275repeaterCreate(22, CropResizeComponent_Conditional_9_For_23_Template, 2, 13, "button", 21, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 22)(25, "div")(26, "label", 14);
    \u0275\u0275text(27, "Width");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "input", 23);
    \u0275\u0275listener("change", function CropResizeComponent_Conditional_9_Template_input_change_28_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onCustomWidth(+$event.target.value));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div")(30, "label", 14);
    \u0275\u0275text(31, "Height");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "input", 23);
    \u0275\u0275listener("change", function CropResizeComponent_Conditional_9_Template_input_change_32_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onCustomHeight(+$event.target.value));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(33, "div", 18)(34, "label", 19);
    \u0275\u0275text(35, "Fit Mode");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "div", 24);
    \u0275\u0275repeaterCreate(37, CropResizeComponent_Conditional_9_For_38_Template, 2, 10, "button", 25, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "button", 26);
    \u0275\u0275pipe(40, "async");
    \u0275\u0275pipe(41, "async");
    \u0275\u0275listener("click", function CropResizeComponent_Conditional_9_Template_button_click_39_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onProcess());
    });
    \u0275\u0275conditionalCreate(42, CropResizeComponent_Conditional_9_Conditional_42_Template, 2, 0);
    \u0275\u0275pipe(43, "async");
    \u0275\u0275conditionalBranchCreate(44, CropResizeComponent_Conditional_9_Conditional_44_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r7 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r7.width, "\xD7", meta_r7.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", ctx_r3.targetWidth, "\xD7", ctx_r3.targetHeight);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(17, 9, meta_r7.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r3.resPresets);
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r3.targetWidth);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r3.targetHeight);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r3.padModes);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(40, 12, ctx_r3.canProcess$) || \u0275\u0275pipeBind1(41, 14, ctx_r3.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(43, 16, ctx_r3.isLoading$) ? 42 : 44);
  }
}
function CropResizeComponent_Conditional_11_Template(rf, ctx) {
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
function CropResizeComponent_Conditional_14_Template(rf, ctx) {
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
function CropResizeComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 30);
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
function CropResizeComponent_Conditional_18_Template(rf, ctx) {
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
var CropResizeComponent = class _CropResizeComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectCropResizeState);
  isLoading$ = this.store.select(selectCropResizeIsLoading);
  canProcess$ = this.store.select(selectCropResizeCanProcess);
  targetWidth = 1920;
  targetHeight = 1080;
  padMode = "pad";
  resPresets = [
    { label: "4K", w: 3840, h: 2160 },
    { label: "1080p", w: 1920, h: 1080 },
    { label: "720p", w: 1280, h: 720 },
    { label: "480p", w: 854, h: 480 }
  ];
  padModes = [
    { value: "pad", label: "Letterbox", icon: "\u2B1B" },
    { value: "crop-to-fit", label: "Crop Fill", icon: "\u2702\uFE0F" },
    { value: "stretch", label: "Stretch", icon: "\u2194\uFE0F" }
  ];
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(CropResizeActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(CropResizeActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(CropResizeActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onResPreset(w, h) {
    this.targetWidth = w;
    this.targetHeight = h;
    this.syncConfig();
  }
  onCustomWidth(w) {
    this.targetWidth = w % 2 === 0 ? w : w - 1;
    this.syncConfig();
  }
  onCustomHeight(h) {
    this.targetHeight = h % 2 === 0 ? h : h - 1;
    this.syncConfig();
  }
  onPadMode(mode) {
    this.padMode = mode;
    this.syncConfig();
  }
  syncConfig() {
    this.store.dispatch(CropResizeActions.updateConfig({ config: { targetWidth: this.targetWidth, targetHeight: this.targetHeight, padMode: this.padMode } }));
  }
  onProcess() {
    this.store.dispatch(CropResizeActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-TYMX5QYN.js", import.meta.url), { type: "module" }), { file: state.inputFile, mode: "resize", targetWidth: this.targetWidth, targetHeight: this.targetHeight, padMode: this.padMode }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(CropResizeActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const blob = msg.data;
          this.store.dispatch(CropResizeActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(CropResizeActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Resize failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(CropResizeActions.resetState());
  }
  static \u0275fac = function CropResizeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CropResizeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CropResizeComponent, selectors: [["app-crop-resize"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-teal-400", "to-emerald-200"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video file here or click to browse", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_resized", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-teal-400"], [1, "text-sm", "font-semibold", "text-emerald-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "text-xs", "text-white/40", "uppercase", "tracking-wider"], [1, "grid", "grid-cols-4", "gap-2"], [1, "py-2.5", "rounded-xl", "text-xs", "font-bold", "transition-all", "duration-200", "border", 3, "bg-teal-500", "text-black", "border-teal-500", "bg-white/5", "text-white/60", "border-white/10"], [1, "grid", "grid-cols-2", "gap-3"], ["type", "number", "min", "2", "step", "2", 1, "w-full", "px-2", "py-1.5", "mt-1", "text-sm", "bg-white/5", "border", "border-white/15", "rounded-lg", "text-white", "focus:outline-none", "focus:border-teal-400", 3, "change", "value"], [1, "grid", "grid-cols-3", "gap-2"], [1, "py-2", "rounded-lg", "text-xs", "font-semibold", "transition-all", "duration-200", 3, "bg-teal-500/20", "text-teal-300", "bg-white/5", "text-white/50"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-teal-500", "to-emerald-500", "text-black", "hover:shadow-[0_0_30px_rgba(20,184,166,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "py-2.5", "rounded-xl", "text-xs", "font-bold", "transition-all", "duration-200", "border", 3, "click"], [1, "py-2", "rounded-lg", "text-xs", "font-semibold", "transition-all", "duration-200", 3, "click"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Resizing...", 3, "progress", "size"]], template: function CropResizeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F4D0} Crop & Resize ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Resize to preset resolutions or custom dimensions with smart padding");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function CropResizeComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, CropResizeComponent_Conditional_9_Template, 45, 18, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, CropResizeComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, CropResizeComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, CropResizeComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, CropResizeComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CropResizeComponent, [{
    type: Component,
    args: [{
      selector: "app-crop-resize",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-200">
          \u{1F4D0} Crop & Resize
        </h1>
        <p class="text-white/50 text-sm">Resize to preset resolutions or custom dimensions with smart padding</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Current</p>
                  <p class="text-sm font-semibold text-teal-400">{{ meta.width }}\xD7{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Target</p>
                  <p class="text-sm font-semibold text-emerald-400">{{ targetWidth }}\xD7{{ targetHeight }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-white">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
              </div>

              <!-- Resolution Presets -->
              <div class="space-y-2">
                <label class="text-xs text-white/40 uppercase tracking-wider">Resolution Preset</label>
                <div class="grid grid-cols-4 gap-2">
                  @for (res of resPresets; track res.label) {
                    <button (click)="onResPreset(res.w, res.h)"
                      class="py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border"
                      [class.bg-teal-500]="targetWidth === res.w && targetHeight === res.h"
                      [class.text-black]="targetWidth === res.w && targetHeight === res.h"
                      [class.border-teal-500]="targetWidth === res.w && targetHeight === res.h"
                      [class.bg-white/5]="targetWidth !== res.w || targetHeight !== res.h"
                      [class.text-white/60]="targetWidth !== res.w || targetHeight !== res.h"
                      [class.border-white/10]="targetWidth !== res.w || targetHeight !== res.h">{{ res.label }}</button>
                  }
                </div>
              </div>

              <!-- Custom Dimensions -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-white/40">Width</label>
                  <input type="number" min="2" step="2" [value]="targetWidth"
                    (change)="onCustomWidth(+($any($event.target)).value)"
                    class="w-full px-2 py-1.5 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-teal-400" />
                </div>
                <div>
                  <label class="text-xs text-white/40">Height</label>
                  <input type="number" min="2" step="2" [value]="targetHeight"
                    (change)="onCustomHeight(+($any($event.target)).value)"
                    class="w-full px-2 py-1.5 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-teal-400" />
                </div>
              </div>

              <!-- Pad Mode -->
              <div class="space-y-2">
                <label class="text-xs text-white/40 uppercase tracking-wider">Fit Mode</label>
                <div class="grid grid-cols-3 gap-2">
                  @for (m of padModes; track m.value) {
                    <button (click)="onPadMode(m.value)"
                      class="py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                      [class.bg-teal-500/20]="padMode === m.value"
                      [class.text-teal-300]="padMode === m.value"
                      [class.bg-white/5]="padMode !== m.value"
                      [class.text-white/50]="padMode !== m.value">{{ m.icon }} {{ m.label }}</button>
                  }
                </div>
              </div>

              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-black hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Resizing...
                } @else { \u{1F4D0} Resize Video }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Resizing..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_resized" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CropResizeComponent, { className: "CropResizeComponent", filePath: "src/app/modules/video/10-crop-resize/cropresize.component.ts", lineNumber: 127 });
})();
export {
  CropResizeComponent
};
//# sourceMappingURL=chunk-BMOUPIEY.js.map
