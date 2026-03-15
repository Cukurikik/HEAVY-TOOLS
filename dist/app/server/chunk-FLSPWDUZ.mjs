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

// src/app/modules/video/11-color-grading/colorGrading.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  brightness: 0,
  contrast: 1,
  saturation: 1,
  hue: 0,
  gamma: 1,
  lutFile: null,
  activeLutPreset: null,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var ColorGradingActions = {
  loadFile: createAction("[ColorGrading] Load File", props()),
  loadMetaSuccess: createAction("[ColorGrading] Meta OK", props()),
  loadMetaFailure: createAction("[ColorGrading] Meta Fail", props()),
  updateConfig: createAction("[ColorGrading] Update Config", props()),
  startProcessing: createAction("[ColorGrading] Start"),
  updateProgress: createAction("[ColorGrading] Progress", props()),
  processingSuccess: createAction("[ColorGrading] Success", props()),
  processingFailure: createAction("[ColorGrading] Failure", props()),
  downloadOutput: createAction("[ColorGrading] Download"),
  resetState: createAction("[ColorGrading] Reset")
};
var colorGradingFeature = createFeature({
  name: "colorGrading",
  reducer: createReducer(init, on(ColorGradingActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(ColorGradingActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(ColorGradingActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(ColorGradingActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(ColorGradingActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(ColorGradingActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(ColorGradingActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(ColorGradingActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(ColorGradingActions.resetState, () => init))
});
var { selectColorGradingState, selectStatus, selectProgress, selectOutputBlob } = colorGradingFeature;
var selectColorGradingCanProcess = createSelector(selectColorGradingState, (s) => !!s.inputFile && s.status === "idle");
var selectColorGradingIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/11-color-grading/colorGrading.component.ts
var _forTrack0 = ($index, $item) => $item.label;
function ColorGradingComponent_Conditional_9_For_51_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 29);
    \u0275\u0275listener("click", function ColorGradingComponent_Conditional_9_For_51_Template_button_click_0_listener() {
      const preset_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.applyLut(preset_r4));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const preset_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", preset_r4.icon, " ", preset_r4.label, " ");
  }
}
function ColorGradingComponent_Conditional_9_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 30);
    \u0275\u0275text(1, " Grading... ");
  }
}
function ColorGradingComponent_Conditional_9_Conditional_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F3A8} Apply Color Grading ");
  }
}
function ColorGradingComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275elementStart(18, "div", 1)(19, "div", 17)(20, "span", 18);
    \u0275\u0275text(21, "\u2600\uFE0F Brightness");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 19);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "input", 20);
    \u0275\u0275listener("input", function ColorGradingComponent_Conditional_9_Template_input_input_24_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSlider("brightness", $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 1)(26, "div", 17)(27, "span", 18);
    \u0275\u0275text(28, "\u{1F532} Contrast");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span", 19);
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "input", 21);
    \u0275\u0275listener("input", function ColorGradingComponent_Conditional_9_Template_input_input_31_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSlider("contrast", $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 1)(33, "div", 17)(34, "span", 18);
    \u0275\u0275text(35, "\u{1F308} Saturation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "span", 19);
    \u0275\u0275text(37);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "input", 21);
    \u0275\u0275listener("input", function ColorGradingComponent_Conditional_9_Template_input_input_38_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSlider("saturation", $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "div", 1)(40, "div", 17)(41, "span", 18);
    \u0275\u0275text(42, "\u{1F313} Gamma");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "span", 19);
    \u0275\u0275text(44);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(45, "input", 22);
    \u0275\u0275listener("input", function ColorGradingComponent_Conditional_9_Template_input_input_45_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSlider("gamma", $event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 23)(47, "p", 24);
    \u0275\u0275text(48, "Quick LUT Presets");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "div", 25);
    \u0275\u0275repeaterCreate(50, ColorGradingComponent_Conditional_9_For_51_Template, 2, 2, "button", 26, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(52, "button", 27);
    \u0275\u0275listener("click", function ColorGradingComponent_Conditional_9_Template_button_click_52_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.resetGrading());
    });
    \u0275\u0275text(53, " \u{1F504} Reset to Default ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "button", 28);
    \u0275\u0275pipe(55, "async");
    \u0275\u0275pipe(56, "async");
    \u0275\u0275listener("click", function ColorGradingComponent_Conditional_9_Template_button_click_54_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(57, ColorGradingComponent_Conditional_9_Conditional_57_Template, 2, 0);
    \u0275\u0275pipe(58, "async");
    \u0275\u0275conditionalBranchCreate(59, ColorGradingComponent_Conditional_9_Conditional_59_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r5 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 14, meta_r5.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r5.width, "x", meta_r5.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(meta_r5.codec);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.brightness);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.brightness);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.contrast);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.contrast);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.saturation);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.saturation);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.gamma);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.gamma);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r1.lutPresets);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(55, 17, ctx_r1.canProcess$) || \u0275\u0275pipeBind1(56, 19, ctx_r1.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(58, 21, ctx_r1.isLoading$) ? 57 : 59);
  }
}
function ColorGradingComponent_Conditional_11_Template(rf, ctx) {
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
function ColorGradingComponent_Conditional_14_Template(rf, ctx) {
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
function ColorGradingComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 31);
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
function ColorGradingComponent_Conditional_18_Template(rf, ctx) {
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
var ColorGradingComponent = class _ColorGradingComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectColorGradingState);
  isLoading$ = this.store.select(selectColorGradingIsLoading);
  canProcess$ = this.store.select(selectColorGradingCanProcess);
  brightness = 0;
  contrast = 1;
  saturation = 1;
  gamma = 1;
  lutPresets = [
    { label: "Warm", icon: "\u{1F305}", brightness: 0.05, contrast: 1.1, saturation: 1.3, gamma: 0.9 },
    { label: "Cool", icon: "\u{1F9CA}", brightness: -0.05, contrast: 1.1, saturation: 0.8, gamma: 1.1 },
    { label: "Vintage", icon: "\u{1F4F7}", brightness: 0.1, contrast: 0.9, saturation: 0.6, gamma: 1.2 },
    { label: "Vivid", icon: "\u{1F386}", brightness: 0, contrast: 1.3, saturation: 1.8, gamma: 0.95 },
    { label: "B&W", icon: "\u26AB", brightness: 0, contrast: 1.2, saturation: 0, gamma: 1 },
    { label: "Cinematic", icon: "\u{1F3AC}", brightness: -0.1, contrast: 1.4, saturation: 0.9, gamma: 1.3 }
  ];
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(ColorGradingActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(ColorGradingActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(ColorGradingActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onSlider(key, e) {
    const val = +e.target.value;
    this[key] = val;
    this.store.dispatch(ColorGradingActions.updateConfig({ config: { [key]: val } }));
  }
  applyLut(p) {
    this.brightness = p.brightness;
    this.contrast = p.contrast;
    this.saturation = p.saturation;
    this.gamma = p.gamma;
    this.store.dispatch(ColorGradingActions.updateConfig({ config: { brightness: p.brightness, contrast: p.contrast, saturation: p.saturation, gamma: p.gamma } }));
  }
  resetGrading() {
    this.brightness = 0;
    this.contrast = 1;
    this.saturation = 1;
    this.gamma = 1;
    this.store.dispatch(ColorGradingActions.updateConfig({ config: { brightness: 0, contrast: 1, saturation: 1, gamma: 1 } }));
  }
  onProcess() {
    this.store.dispatch(ColorGradingActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-HDQWD6RK.js", import.meta.url), { type: "module" }), { file: state.inputFile, brightness: this.brightness, contrast: this.contrast, saturation: this.saturation, gamma: this.gamma }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(ColorGradingActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const blob = msg.data;
          this.store.dispatch(ColorGradingActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(ColorGradingActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Grading failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(ColorGradingActions.resetState());
  }
  static \u0275fac = function ColorGradingComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ColorGradingComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ColorGradingComponent, selectors: [["app-color-grading"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-amber-400", "to-orange-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video to color grade", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_graded", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-amber-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "flex", "justify-between", "text-sm"], [1, "text-white/60"], [1, "text-amber-400", "font-mono"], ["type", "range", "min", "-1", "max", "1", "step", "0.05", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-amber-400", 3, "input", "value"], ["type", "range", "min", "0", "max", "3", "step", "0.1", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-amber-400", 3, "input", "value"], ["type", "range", "min", "0.1", "max", "5", "step", "0.1", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-amber-400", 3, "input", "value"], [1, "space-y-2"], [1, "text-sm", "text-white/60"], [1, "grid", "grid-cols-3", "gap-2"], [1, "p-2", "rounded-lg", "border", "border-white/10", "bg-white/5", "text-xs", "text-white/70", "hover:bg-amber-400/10", "hover:border-amber-400/30", "hover:text-amber-400", "transition-all"], [1, "w-full", "py-2", "text-xs", "text-white/40", "hover:text-white/70", "transition-colors", 3, "click"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-amber-500", "to-orange-500", "text-black", "hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "p-2", "rounded-lg", "border", "border-white/10", "bg-white/5", "text-xs", "text-white/70", "hover:bg-amber-400/10", "hover:border-amber-400/30", "hover:text-amber-400", "transition-all", 3, "click"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Grading...", 3, "progress", "size"]], template: function ColorGradingComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F3A8} Color Grading ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Adjust brightness, contrast, saturation, hue of the entire video");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function ColorGradingComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, ColorGradingComponent_Conditional_9_Template, 60, 23, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, ColorGradingComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, ColorGradingComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, ColorGradingComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, ColorGradingComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ColorGradingComponent, [{
    type: Component,
    args: [{
      selector: "app-color-grading",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
          \u{1F3A8} Color Grading
        </h1>
        <p class="text-white/50 text-sm">Adjust brightness, contrast, saturation, hue of the entire video</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video to color grade" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-amber-400">{{ meta.duration | number:'1.0-0' }}s</p>
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

              <!-- Brightness -->
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">\u2600\uFE0F Brightness</span>
                  <span class="text-amber-400 font-mono">{{ brightness }}</span>
                </div>
                <input type="range" min="-1" max="1" step="0.05" [value]="brightness"
                  (input)="onSlider('brightness', $event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400" />
              </div>

              <!-- Contrast -->
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">\u{1F532} Contrast</span>
                  <span class="text-amber-400 font-mono">{{ contrast }}</span>
                </div>
                <input type="range" min="0" max="3" step="0.1" [value]="contrast"
                  (input)="onSlider('contrast', $event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400" />
              </div>

              <!-- Saturation -->
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">\u{1F308} Saturation</span>
                  <span class="text-amber-400 font-mono">{{ saturation }}</span>
                </div>
                <input type="range" min="0" max="3" step="0.1" [value]="saturation"
                  (input)="onSlider('saturation', $event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400" />
              </div>

              <!-- Gamma -->
              <div class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">\u{1F313} Gamma</span>
                  <span class="text-amber-400 font-mono">{{ gamma }}</span>
                </div>
                <input type="range" min="0.1" max="5" step="0.1" [value]="gamma"
                  (input)="onSlider('gamma', $event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400" />
              </div>

              <!-- LUT Presets -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Quick LUT Presets</p>
                <div class="grid grid-cols-3 gap-2">
                  @for (preset of lutPresets; track preset.label) {
                    <button (click)="applyLut(preset)"
                      class="p-2 rounded-lg border border-white/10 bg-white/5 text-xs text-white/70 hover:bg-amber-400/10 hover:border-amber-400/30 hover:text-amber-400 transition-all">
                      {{ preset.icon }} {{ preset.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Reset -->
              <button (click)="resetGrading()" class="w-full py-2 text-xs text-white/40 hover:text-white/70 transition-colors">
                \u{1F504} Reset to Default
              </button>

              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Grading...
                } @else { \u{1F3A8} Apply Color Grading }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Grading..." [size]="120" /></div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_graded" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ColorGradingComponent, { className: "ColorGradingComponent", filePath: "src/app/modules/video/11-color-grading/colorgrading.component.ts", lineNumber: 137 });
})();
export {
  ColorGradingComponent
};
//# sourceMappingURL=chunk-FLSPWDUZ.mjs.map
