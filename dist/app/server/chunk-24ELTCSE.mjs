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
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-CX47CWGJ.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-UFAUNXOA.mjs";

// src/app/modules/video/12-subtitle-burner/subtitleBurner.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  subtitleFile: null,
  subtitleContent: "",
  fontFamily: "Arial",
  fontSize: 24,
  fontColor: "#FFFFFF",
  outlineColor: "#000000",
  position: "bottom",
  offsetSeconds: 0,
  aiGenerating: false,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var SubtitleBurnerActions = {
  loadFile: createAction("[SubtitleBurner] Load File", props()),
  loadMetaSuccess: createAction("[SubtitleBurner] Meta OK", props()),
  loadMetaFailure: createAction("[SubtitleBurner] Meta Fail", props()),
  updateConfig: createAction("[SubtitleBurner] Update Config", props()),
  startProcessing: createAction("[SubtitleBurner] Start"),
  updateProgress: createAction("[SubtitleBurner] Progress", props()),
  processingSuccess: createAction("[SubtitleBurner] Success", props()),
  processingFailure: createAction("[SubtitleBurner] Failure", props()),
  downloadOutput: createAction("[SubtitleBurner] Download"),
  resetState: createAction("[SubtitleBurner] Reset")
};
var subtitleBurnerFeature = createFeature({
  name: "subtitleBurner",
  reducer: createReducer(init, on(SubtitleBurnerActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(SubtitleBurnerActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(SubtitleBurnerActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(SubtitleBurnerActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(SubtitleBurnerActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(SubtitleBurnerActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(SubtitleBurnerActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(SubtitleBurnerActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(SubtitleBurnerActions.resetState, () => init))
});
var { selectSubtitleBurnerState, selectStatus, selectProgress, selectOutputBlob } = subtitleBurnerFeature;
var selectSubtitleBurnerCanProcess = createSelector(selectSubtitleBurnerState, (s) => !!s.inputFile && s.status === "idle");
var selectSubtitleBurnerIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/12-subtitle-burner/subtitleBurner.component.ts
var _forTrack0 = ($index, $item) => $item.value;
function SubtitleBurnerComponent_Conditional_9_For_49_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275listener("click", function SubtitleBurnerComponent_Conditional_9_For_49_Template_button_click_0_listener() {
      const pos_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onPosition(pos_r4.value));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pos_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r1.position === pos_r4.value ? "p-2 rounded-lg border-2 border-yellow-400 bg-yellow-400/10 text-yellow-300 text-sm font-semibold" : "p-2 rounded-lg border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", pos_r4.icon, " ", pos_r4.label, " ");
  }
}
function SubtitleBurnerComponent_Conditional_9_For_55_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 33);
    \u0275\u0275listener("click", function SubtitleBurnerComponent_Conditional_9_For_55_Template_button_click_0_listener() {
      const color_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onFontColor(color_r6));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const color_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r1.fontColor === color_r6 ? "w-8 h-8 rounded-full ring-2 ring-yellow-400 ring-offset-2 ring-offset-[#0a0a0f]" : "w-8 h-8 rounded-full border border-white/20 hover:scale-110 transition-transform");
    \u0275\u0275styleProp("background", color_r6);
  }
}
function SubtitleBurnerComponent_Conditional_9_Conditional_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 34);
    \u0275\u0275text(1, " Burning... ");
  }
}
function SubtitleBurnerComponent_Conditional_9_Conditional_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F4AC} Burn Subtitles ");
  }
}
function SubtitleBurnerComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275text(20, "Subtitle File (.srt / .ass)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "label", 19)(22, "span", 20);
    \u0275\u0275text(23, "\u{1F4C4}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div")(25, "p", 21);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "p", 14);
    \u0275\u0275text(28, "Supports .srt, .ass, .ssa");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "input", 22);
    \u0275\u0275listener("change", function SubtitleBurnerComponent_Conditional_9_Template_input_change_29_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSubtitleFile($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "div", 17)(31, "div", 23)(32, "span", 24);
    \u0275\u0275text(33, "Font Size");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span", 25);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "input", 26);
    \u0275\u0275listener("input", function SubtitleBurnerComponent_Conditional_9_Template_input_input_36_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onFontSize($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "div", 27)(38, "span");
    \u0275\u0275text(39, "12px");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "span");
    \u0275\u0275text(41, "42px");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "span");
    \u0275\u0275text(43, "72px");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(44, "div", 17)(45, "p", 18);
    \u0275\u0275text(46, "Subtitle Position");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "div", 28);
    \u0275\u0275repeaterCreate(48, SubtitleBurnerComponent_Conditional_9_For_49_Template, 2, 4, "button", 29, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "div", 17)(51, "p", 18);
    \u0275\u0275text(52, "Font Color");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "div", 30);
    \u0275\u0275repeaterCreate(54, SubtitleBurnerComponent_Conditional_9_For_55_Template, 1, 4, "button", 31, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(56, "button", 32);
    \u0275\u0275pipe(57, "async");
    \u0275\u0275pipe(58, "async");
    \u0275\u0275listener("click", function SubtitleBurnerComponent_Conditional_9_Template_button_click_56_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(59, SubtitleBurnerComponent_Conditional_9_Conditional_59_Template, 2, 0);
    \u0275\u0275pipe(60, "async");
    \u0275\u0275conditionalBranchCreate(61, SubtitleBurnerComponent_Conditional_9_Conditional_61_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r7 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 9, meta_r7.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r7.width, "x", meta_r7.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(meta_r7.codec);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.subtitleFileName || "Click to select subtitle file");
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1("", ctx_r1.fontSize, "px");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.fontSize);
    \u0275\u0275advance(12);
    \u0275\u0275repeater(ctx_r1.positions);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.fontColors);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(57, 12, ctx_r1.canProcess$) || \u0275\u0275pipeBind1(58, 14, ctx_r1.isLoading$) || !ctx_r1.subtitleFile);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(60, 16, ctx_r1.isLoading$) ? 59 : 61);
  }
}
function SubtitleBurnerComponent_Conditional_11_Template(rf, ctx) {
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
function SubtitleBurnerComponent_Conditional_14_Template(rf, ctx) {
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
function SubtitleBurnerComponent_Conditional_16_Template(rf, ctx) {
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
function SubtitleBurnerComponent_Conditional_18_Template(rf, ctx) {
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
var SubtitleBurnerComponent = class _SubtitleBurnerComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectSubtitleBurnerState);
  isLoading$ = this.store.select(selectSubtitleBurnerIsLoading);
  canProcess$ = this.store.select(selectSubtitleBurnerCanProcess);
  subtitleFile = null;
  subtitleFileName = "";
  fontSize = 24;
  position = "bottom";
  fontColor = "#ffffff";
  positions = [
    { value: "top", label: "Top", icon: "\u2B06\uFE0F" },
    { value: "center", label: "Center", icon: "\u23FA\uFE0F" },
    { value: "bottom", label: "Bottom", icon: "\u2B07\uFE0F" }
  ];
  fontColors = ["#ffffff", "#ffff00", "#00ff00", "#00ffff", "#ff6600", "#ff0000"];
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(SubtitleBurnerActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(SubtitleBurnerActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(SubtitleBurnerActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onSubtitleFile(e) {
    const input = e.target;
    if (input.files?.[0]) {
      this.subtitleFile = input.files[0];
      this.subtitleFileName = input.files[0].name;
    }
  }
  onFontSize(e) {
    this.fontSize = +e.target.value;
  }
  onPosition(p) {
    this.position = p;
  }
  onFontColor(c) {
    this.fontColor = c;
  }
  onProcess() {
    this.store.dispatch(SubtitleBurnerActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile || !this.subtitleFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-HCDTK2BU.js", import.meta.url), { type: "module" }), { file: state.inputFile, subtitleFile: this.subtitleFile, fontSize: this.fontSize, position: this.position, fontColor: this.fontColor }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(SubtitleBurnerActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const blob = msg.data;
          this.store.dispatch(SubtitleBurnerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(SubtitleBurnerActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Burning failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(SubtitleBurnerActions.resetState());
  }
  static \u0275fac = function SubtitleBurnerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SubtitleBurnerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SubtitleBurnerComponent, selectors: [["app-subtitle-burner"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-yellow-400", "to-amber-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video file here", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_subtitled", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-yellow-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "text-sm", "text-white/60"], [1, "flex", "items-center", "gap-3", "p-4", "rounded-xl", "border-2", "border-dashed", "border-white/20", "hover:border-yellow-400/50", "bg-white/5", "cursor-pointer", "transition-all"], [1, "text-2xl"], [1, "text-sm", "text-white/80"], ["type", "file", "accept", ".srt,.ass,.ssa,.vtt", 1, "hidden", 3, "change"], [1, "flex", "justify-between", "text-sm"], [1, "text-white/60"], [1, "text-yellow-400", "font-mono"], ["type", "range", "min", "12", "max", "72", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-yellow-400", 3, "input", "value"], [1, "flex", "justify-between", "text-xs", "text-white/30"], [1, "grid", "grid-cols-3", "gap-2"], [3, "class"], [1, "grid", "grid-cols-6", "gap-2"], [3, "background", "class"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-yellow-500", "to-amber-500", "text-black", "hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [3, "click"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Burning...", 3, "progress", "size"]], template: function SubtitleBurnerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u{1F4AC} Subtitle Burner");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Hardcode SRT/ASS subtitles permanently into the video");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function SubtitleBurnerComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, SubtitleBurnerComponent_Conditional_9_Template, 62, 18, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, SubtitleBurnerComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, SubtitleBurnerComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, SubtitleBurnerComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, SubtitleBurnerComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SubtitleBurnerComponent, [{
    type: Component,
    args: [{
      selector: "app-subtitle-burner",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400">\u{1F4AC} Subtitle Burner</h1>
        <p class="text-white/50 text-sm">Hardcode SRT/ASS subtitles permanently into the video</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-yellow-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>

              <!-- SRT Upload -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Subtitle File (.srt / .ass)</p>
                <label class="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-yellow-400/50 bg-white/5 cursor-pointer transition-all">
                  <span class="text-2xl">\u{1F4C4}</span>
                  <div>
                    <p class="text-sm text-white/80">{{ subtitleFileName || 'Click to select subtitle file' }}</p>
                    <p class="text-xs text-white/40">Supports .srt, .ass, .ssa</p>
                  </div>
                  <input type="file" accept=".srt,.ass,.ssa,.vtt" (change)="onSubtitleFile($event)" class="hidden" />
                </label>
              </div>

              <!-- Font Size -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-white/60">Font Size</span>
                  <span class="text-yellow-400 font-mono">{{ fontSize }}px</span>
                </div>
                <input type="range" min="12" max="72" [value]="fontSize" (input)="onFontSize($event)"
                  class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                <div class="flex justify-between text-xs text-white/30"><span>12px</span><span>42px</span><span>72px</span></div>
              </div>

              <!-- Position -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Subtitle Position</p>
                <div class="grid grid-cols-3 gap-2">
                  @for (pos of positions; track pos.value) {
                    <button (click)="onPosition(pos.value)"
                      [class]="position === pos.value
                        ? 'p-2 rounded-lg border-2 border-yellow-400 bg-yellow-400/10 text-yellow-300 text-sm font-semibold'
                        : 'p-2 rounded-lg border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ pos.icon }} {{ pos.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Font Color -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Font Color</p>
                <div class="grid grid-cols-6 gap-2">
                  @for (color of fontColors; track color) {
                    <button (click)="onFontColor(color)" [style.background]="color"
                      [class]="fontColor === color
                        ? 'w-8 h-8 rounded-full ring-2 ring-yellow-400 ring-offset-2 ring-offset-[#0a0a0f]'
                        : 'w-8 h-8 rounded-full border border-white/20 hover:scale-110 transition-transform'">
                    </button>
                  }
                </div>
              </div>

              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async) || !subtitleFile" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Burning...
                } @else { \u{1F4AC} Burn Subtitles }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div>
          }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Burning..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_subtitled" /> }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SubtitleBurnerComponent, { className: "SubtitleBurnerComponent", filePath: "src/app/modules/video/12-subtitle-burner/subtitleburner.component.ts", lineNumber: 109 });
})();
export {
  SubtitleBurnerComponent
};
//# sourceMappingURL=chunk-24ELTCSE.mjs.map
