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

// src/app/modules/video/07-speed-controller/speedController.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  speed: 1,
  audioMode: "pitchCorrect",
  originalDuration: 0,
  newDuration: 0,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var SpeedControllerActions = {
  loadFile: createAction("[SpeedController] Load File", props()),
  loadMetaSuccess: createAction("[SpeedController] Meta OK", props()),
  loadMetaFailure: createAction("[SpeedController] Meta Fail", props()),
  updateConfig: createAction("[SpeedController] Update Config", props()),
  startProcessing: createAction("[SpeedController] Start"),
  updateProgress: createAction("[SpeedController] Progress", props()),
  processingSuccess: createAction("[SpeedController] Success", props()),
  processingFailure: createAction("[SpeedController] Failure", props()),
  downloadOutput: createAction("[SpeedController] Download"),
  resetState: createAction("[SpeedController] Reset")
};
var speedControllerFeature = createFeature({
  name: "speedController",
  reducer: createReducer(init, on(SpeedControllerActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(SpeedControllerActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(SpeedControllerActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(SpeedControllerActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(SpeedControllerActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(SpeedControllerActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(SpeedControllerActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(SpeedControllerActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(SpeedControllerActions.resetState, () => init))
});
var { selectSpeedControllerState, selectStatus, selectProgress, selectOutputBlob } = speedControllerFeature;
var selectSpeedControllerCanProcess = createSelector(selectSpeedControllerState, (s) => !!s.inputFile && s.status === "idle");
var selectSpeedControllerIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/07-speed-controller/speedController.component.ts
var _forTrack0 = ($index, $item) => $item.value;
function SpeedControllerComponent_Conditional_9_For_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function SpeedControllerComponent_Conditional_9_For_35_Template_button_click_0_listener() {
      const p_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSpeedChange(p_r4));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-violet-500", ctx_r1.speed === p_r4)("text-black", ctx_r1.speed === p_r4)("bg-white/5", ctx_r1.speed !== p_r4)("text-white/50", ctx_r1.speed !== p_r4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", p_r4, "x");
  }
}
function SpeedControllerComponent_Conditional_9_For_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 31);
    \u0275\u0275listener("click", function SpeedControllerComponent_Conditional_9_For_41_Template_button_click_0_listener() {
      const mode_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onAudioModeChange(mode_r6.value));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mode_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-violet-500/20", ctx_r1.audioMode === mode_r6.value)("text-violet-300", ctx_r1.audioMode === mode_r6.value)("border", ctx_r1.audioMode === mode_r6.value)("border-violet-500/40", ctx_r1.audioMode === mode_r6.value)("bg-white/5", ctx_r1.audioMode !== mode_r6.value)("text-white/50", ctx_r1.audioMode !== mode_r6.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", mode_r6.icon, " ", mode_r6.label);
  }
}
function SpeedControllerComponent_Conditional_9_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 32);
    \u0275\u0275text(1, " Adjusting Speed... ");
  }
}
function SpeedControllerComponent_Conditional_9_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u26A1 Apply Speed Change ");
  }
}
function SpeedControllerComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 12)(2, "div", 13)(3, "p", 14);
    \u0275\u0275text(4, "Original Duration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 15);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 13)(9, "p", 14);
    \u0275\u0275text(10, "New Duration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p", 16);
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 13)(15, "p", 14);
    \u0275\u0275text(16, "Speed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p", 17);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 18)(20, "div", 19)(21, "label", 20);
    \u0275\u0275text(22, "Speed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span", 21);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "input", 22);
    \u0275\u0275listener("input", function SpeedControllerComponent_Conditional_9_Template_input_input_25_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSpeedChange(+$event.target.value));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 23)(27, "span");
    \u0275\u0275text(28, "\u{1F422} 0.25x");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span");
    \u0275\u0275text(30, "\u25B6\uFE0F 1x");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span");
    \u0275\u0275text(32, "\u{1F407} 4x");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(33, "div", 24);
    \u0275\u0275repeaterCreate(34, SpeedControllerComponent_Conditional_9_For_35_Template, 2, 9, "button", 25, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "div", 26)(37, "label", 20);
    \u0275\u0275text(38, "Audio Mode");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div", 27);
    \u0275\u0275repeaterCreate(40, SpeedControllerComponent_Conditional_9_For_41_Template, 2, 14, "button", 28, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "button", 29);
    \u0275\u0275pipe(43, "async");
    \u0275\u0275pipe(44, "async");
    \u0275\u0275listener("click", function SpeedControllerComponent_Conditional_9_Template_button_click_42_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(45, SpeedControllerComponent_Conditional_9_Conditional_45_Template, 2, 0);
    \u0275\u0275pipe(46, "async");
    \u0275\u0275conditionalBranchCreate(47, SpeedControllerComponent_Conditional_9_Conditional_47_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r7 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 7, meta_r7.duration, "1.0-1"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(13, 10, meta_r7.duration / ctx_r1.speed, "1.0-1"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", ctx_r1.speed, "x");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", ctx_r1.speed, "x");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.speed);
    \u0275\u0275advance(9);
    \u0275\u0275repeater(ctx_r1.speedPresets);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.audioModes);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(43, 13, ctx_r1.canProcess$) || \u0275\u0275pipeBind1(44, 15, ctx_r1.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(46, 17, ctx_r1.isLoading$) ? 45 : 47);
  }
}
function SpeedControllerComponent_Conditional_11_Template(rf, ctx) {
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
function SpeedControllerComponent_Conditional_14_Template(rf, ctx) {
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
function SpeedControllerComponent_Conditional_16_Template(rf, ctx) {
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
function SpeedControllerComponent_Conditional_18_Template(rf, ctx) {
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
var SpeedControllerComponent = class _SpeedControllerComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectSpeedControllerState);
  isLoading$ = this.store.select(selectSpeedControllerIsLoading);
  canProcess$ = this.store.select(selectSpeedControllerCanProcess);
  speed = 1;
  audioMode = "pitchCorrect";
  speedPresets = [0.25, 0.5, 1, 1.5, 2, 4];
  audioModes = [
    { value: "pitchCorrect", label: "Pitch Fix", icon: "\u{1F3B5}" },
    { value: "keep", label: "Keep", icon: "\u{1F50A}" },
    { value: "mute", label: "Mute", icon: "\u{1F507}" }
  ];
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(SpeedControllerActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(SpeedControllerActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(SpeedControllerActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onSpeedChange(value) {
    this.speed = value;
    this.store.dispatch(SpeedControllerActions.updateConfig({ config: { speed: value } }));
  }
  onAudioModeChange(mode) {
    this.audioMode = mode;
    this.store.dispatch(SpeedControllerActions.updateConfig({ config: { audioMode: mode } }));
  }
  onProcess() {
    this.store.dispatch(SpeedControllerActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-63BE2OZF.js", import.meta.url), { type: "module" }), { file: state.inputFile, speed: state.speed, audioMode: state.audioMode }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(SpeedControllerActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const blob = msg.data;
          this.store.dispatch(SpeedControllerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(SpeedControllerActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Speed change failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(SpeedControllerActions.resetState());
  }
  static \u0275fac = function SpeedControllerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SpeedControllerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SpeedControllerComponent, selectors: [["app-speed-controller"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-violet-400", "to-purple-200"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video file here or click to browse", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_speed", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-violet-400"], [1, "text-sm", "font-semibold", "text-emerald-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-3"], [1, "flex", "justify-between", "items-center"], [1, "text-xs", "text-white/40", "uppercase", "tracking-wider"], [1, "text-lg", "font-black", "text-violet-400"], ["type", "range", "min", "0.25", "max", "4", "step", "0.25", 1, "w-full", "h-2", "rounded-full", "appearance-none", "cursor-pointer", "bg-gradient-to-r", "from-blue-500", "via-violet-500", "to-red-500", 3, "input", "value"], [1, "flex", "justify-between", "text-[10px]", "text-white/30"], [1, "grid", "grid-cols-6", "gap-1.5"], [1, "py-2", "rounded-lg", "text-xs", "font-bold", "transition-all", "duration-200", 3, "bg-violet-500", "text-black", "bg-white/5", "text-white/50"], [1, "space-y-2"], [1, "grid", "grid-cols-3", "gap-2"], [1, "py-2", "rounded-lg", "text-xs", "font-semibold", "transition-all", "duration-200", 3, "bg-violet-500/20", "text-violet-300", "border", "border-violet-500/40", "bg-white/5", "text-white/50"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-violet-500", "to-purple-500", "text-white", "hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "py-2", "rounded-lg", "text-xs", "font-bold", "transition-all", "duration-200", 3, "click"], [1, "py-2", "rounded-lg", "text-xs", "font-semibold", "transition-all", "duration-200", 3, "click"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Changing speed...", 3, "progress", "size"]], template: function SpeedControllerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u26A1 Speed Controller ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Change video playback speed from 0.25x slow-mo to 4x fast-forward");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function SpeedControllerComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, SpeedControllerComponent_Conditional_9_Template, 48, 19, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, SpeedControllerComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, SpeedControllerComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, SpeedControllerComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, SpeedControllerComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SpeedControllerComponent, [{
    type: Component,
    args: [{
      selector: "app-speed-controller",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-200">
          \u26A1 Speed Controller
        </h1>
        <p class="text-white/50 text-sm">Change video playback speed from 0.25x slow-mo to 4x fast-forward</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <!-- Metadata -->
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Original Duration</p>
                  <p class="text-sm font-semibold text-violet-400">{{ meta.duration | number:'1.0-1' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">New Duration</p>
                  <p class="text-sm font-semibold text-emerald-400">{{ meta.duration / speed | number:'1.0-1' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Speed</p>
                  <p class="text-sm font-semibold text-white">{{ speed }}x</p>
                </div>
              </div>

              <!-- Speed Slider -->
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <label class="text-xs text-white/40 uppercase tracking-wider">Speed</label>
                  <span class="text-lg font-black text-violet-400">{{ speed }}x</span>
                </div>
                <input type="range" min="0.25" max="4" step="0.25" [value]="speed"
                  (input)="onSpeedChange(+($any($event.target)).value)"
                  class="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-blue-500 via-violet-500 to-red-500" />
                <div class="flex justify-between text-[10px] text-white/30">
                  <span>\u{1F422} 0.25x</span>
                  <span>\u25B6\uFE0F 1x</span>
                  <span>\u{1F407} 4x</span>
                </div>
              </div>

              <!-- Speed Preset Buttons -->
              <div class="grid grid-cols-6 gap-1.5">
                @for (p of speedPresets; track p) {
                  <button (click)="onSpeedChange(p)"
                    class="py-2 rounded-lg text-xs font-bold transition-all duration-200"
                    [class.bg-violet-500]="speed === p"
                    [class.text-black]="speed === p"
                    [class.bg-white/5]="speed !== p"
                    [class.text-white/50]="speed !== p">{{ p }}x</button>
                }
              </div>

              <!-- Audio Mode -->
              <div class="space-y-2">
                <label class="text-xs text-white/40 uppercase tracking-wider">Audio Mode</label>
                <div class="grid grid-cols-3 gap-2">
                  @for (mode of audioModes; track mode.value) {
                    <button (click)="onAudioModeChange(mode.value)"
                      class="py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                      [class.bg-violet-500/20]="audioMode === mode.value"
                      [class.text-violet-300]="audioMode === mode.value"
                      [class.border]="audioMode === mode.value"
                      [class.border-violet-500/40]="audioMode === mode.value"
                      [class.bg-white/5]="audioMode !== mode.value"
                      [class.text-white/50]="audioMode !== mode.value">{{ mode.icon }} {{ mode.label }}</button>
                  }
                </div>
              </div>

              <!-- Process -->
              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Adjusting Speed...
                } @else { \u26A1 Apply Speed Change }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Changing speed..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              defaultFilename="omni_speed" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SpeedControllerComponent, { className: "SpeedControllerComponent", filePath: "src/app/modules/video/07-speed-controller/speedcontroller.component.ts", lineNumber: 130 });
})();
export {
  SpeedControllerComponent
};
//# sourceMappingURL=chunk-XLF7L6JI.js.map
