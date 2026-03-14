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

// src/app/modules/video/16-audio-replacer/audioReplacer.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  audioFile: null,
  mode: "replace",
  originalVolume: 1,
  newAudioVolume: 1,
  loopAudio: false,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var AudioReplacerActions = {
  loadFile: createAction("[AudioReplacer] Load File", props()),
  loadMetaSuccess: createAction("[AudioReplacer] Meta OK", props()),
  loadMetaFailure: createAction("[AudioReplacer] Meta Fail", props()),
  updateConfig: createAction("[AudioReplacer] Update Config", props()),
  startProcessing: createAction("[AudioReplacer] Start"),
  updateProgress: createAction("[AudioReplacer] Progress", props()),
  processingSuccess: createAction("[AudioReplacer] Success", props()),
  processingFailure: createAction("[AudioReplacer] Failure", props()),
  downloadOutput: createAction("[AudioReplacer] Download"),
  resetState: createAction("[AudioReplacer] Reset")
};
var audioReplacerFeature = createFeature({
  name: "audioReplacer",
  reducer: createReducer(init, on(AudioReplacerActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(AudioReplacerActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(AudioReplacerActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(AudioReplacerActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(AudioReplacerActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(AudioReplacerActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(AudioReplacerActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(AudioReplacerActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(AudioReplacerActions.resetState, () => init))
});
var { selectAudioReplacerState, selectStatus, selectProgress, selectOutputBlob } = audioReplacerFeature;
var selectAudioReplacerCanProcess = createSelector(selectAudioReplacerState, (s) => !!s.inputFile && s.status === "idle");
var selectAudioReplacerIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/16-audio-replacer/audioReplacer.component.ts
var _forTrack0 = ($index, $item) => $item.value;
function AudioReplacerComponent_Conditional_9_For_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function AudioReplacerComponent_Conditional_9_For_35_Template_button_click_0_listener() {
      const mode_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.mixMode = mode_r4.value);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "p", 27);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const mode_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r1.mixMode === mode_r4.value ? "p-3 rounded-xl border-2 border-rose-400 bg-rose-400/10 text-rose-300 font-semibold text-sm" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", mode_r4.icon, " ", mode_r4.label, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(mode_r4.desc);
  }
}
function AudioReplacerComponent_Conditional_9_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 28)(2, "span", 29);
    \u0275\u0275text(3, "Original Volume");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 30);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "input", 31);
    \u0275\u0275listener("input", function AudioReplacerComponent_Conditional_9_Conditional_36_Template_input_input_6_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.origVolume = +ctx_r1.getVal($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 17)(8, "div", 28)(9, "span", 29);
    \u0275\u0275text(10, "New Audio Volume");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 30);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "input", 32);
    \u0275\u0275listener("input", function AudioReplacerComponent_Conditional_9_Conditional_36_Template_input_input_13_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.newVolume = +ctx_r1.getVal($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r1.origVolume, "%");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.origVolume);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", ctx_r1.newVolume, "%");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.newVolume);
  }
}
function AudioReplacerComponent_Conditional_9_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 33);
    \u0275\u0275text(1, " Replacing... ");
  }
}
function AudioReplacerComponent_Conditional_9_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F50A} Replace Audio ");
  }
}
function AudioReplacerComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275text(20, "New Audio Track");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "label", 19)(22, "span", 20);
    \u0275\u0275text(23, "\u{1F3B5}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div")(25, "p", 21);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "p", 14);
    \u0275\u0275text(28, ".mp3, .wav, .aac, .ogg");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "input", 22);
    \u0275\u0275listener("change", function AudioReplacerComponent_Conditional_9_Template_input_change_29_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onAudioFile($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "div", 17)(31, "p", 18);
    \u0275\u0275text(32, "Audio Mode");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 23);
    \u0275\u0275repeaterCreate(34, AudioReplacerComponent_Conditional_9_For_35_Template, 4, 5, "button", 24, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(36, AudioReplacerComponent_Conditional_9_Conditional_36_Template, 14, 4);
    \u0275\u0275elementStart(37, "button", 25);
    \u0275\u0275pipe(38, "async");
    \u0275\u0275pipe(39, "async");
    \u0275\u0275listener("click", function AudioReplacerComponent_Conditional_9_Template_button_click_37_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(40, AudioReplacerComponent_Conditional_9_Conditional_40_Template, 2, 0);
    \u0275\u0275pipe(41, "async");
    \u0275\u0275conditionalBranchCreate(42, AudioReplacerComponent_Conditional_9_Conditional_42_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r6 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 8, meta_r6.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r6.width, "x", meta_r6.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(meta_r6.codec);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.audioFileName || "Select audio file");
    \u0275\u0275advance(8);
    \u0275\u0275repeater(ctx_r1.mixModes);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.mixMode === "overlay" ? 36 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(38, 11, ctx_r1.canProcess$) || \u0275\u0275pipeBind1(39, 13, ctx_r1.isLoading$) || !ctx_r1.audioFile);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(41, 15, ctx_r1.isLoading$) ? 40 : 42);
  }
}
function AudioReplacerComponent_Conditional_11_Template(rf, ctx) {
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
function AudioReplacerComponent_Conditional_14_Template(rf, ctx) {
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
function AudioReplacerComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 34);
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
function AudioReplacerComponent_Conditional_18_Template(rf, ctx) {
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
var AudioReplacerComponent = class _AudioReplacerComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectAudioReplacerState);
  isLoading$ = this.store.select(selectAudioReplacerIsLoading);
  canProcess$ = this.store.select(selectAudioReplacerCanProcess);
  audioFile = null;
  audioFileName = "";
  mixMode = "replace";
  origVolume = 50;
  newVolume = 100;
  mixModes = [
    { value: "replace", label: "Replace", icon: "\u{1F504}", desc: "Remove original audio" },
    { value: "overlay", label: "Mix/Overlay", icon: "\u{1F39A}\uFE0F", desc: "Blend both tracks" }
  ];
  getVal(e) {
    return e.target.value;
  }
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(AudioReplacerActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(AudioReplacerActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(AudioReplacerActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onAudioFile(e) {
    const f = e.target.files?.[0];
    if (f) {
      this.audioFile = f;
      this.audioFileName = f.name;
    }
  }
  onProcess() {
    this.store.dispatch(AudioReplacerActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile || !this.audioFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-SMJ7FK3Q.js", import.meta.url), { type: "module" }), { file: state.inputFile, audioFile: this.audioFile, mixMode: this.mixMode, origVolume: this.origVolume / 100, newVolume: this.newVolume / 100 }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(AudioReplacerActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const b = msg.data;
          this.store.dispatch(AudioReplacerActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(AudioReplacerActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Audio replacement failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(AudioReplacerActions.resetState());
  }
  static \u0275fac = function AudioReplacerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AudioReplacerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AudioReplacerComponent, selectors: [["app-audio-replacer"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-rose-400", "to-pink-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video file here", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_audio_replaced", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-rose-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "text-sm", "text-white/60"], [1, "flex", "items-center", "gap-3", "p-4", "rounded-xl", "border-2", "border-dashed", "border-white/20", "hover:border-rose-400/50", "bg-white/5", "cursor-pointer", "transition-all"], [1, "text-2xl"], [1, "text-sm", "text-white/80"], ["type", "file", "accept", "audio/*", 1, "hidden", 3, "change"], [1, "grid", "grid-cols-2", "gap-2"], [3, "class"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-rose-500", "to-pink-500", "text-white", "hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [3, "click"], [1, "text-xs", "mt-1", "opacity-60"], [1, "flex", "justify-between", "text-sm"], [1, "text-white/60"], [1, "text-rose-400", "font-mono"], ["type", "range", "min", "0", "max", "100", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-rose-400", 3, "input", "value"], ["type", "range", "min", "0", "max", "200", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-rose-400", 3, "input", "value"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Replacing Audio...", 3, "progress", "size"]], template: function AudioReplacerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u{1F50A} Audio Replacer");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Replace or mix a new audio track into your video");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function AudioReplacerComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, AudioReplacerComponent_Conditional_9_Template, 43, 17, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, AudioReplacerComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, AudioReplacerComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, AudioReplacerComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, AudioReplacerComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AudioReplacerComponent, [{
    type: Component,
    args: [{
      selector: "app-audio-replacer",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">\u{1F50A} Audio Replacer</h1>
        <p class="text-white/50 text-sm">Replace or mix a new audio track into your video</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-rose-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>

              <!-- Audio Upload -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">New Audio Track</p>
                <label class="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-rose-400/50 bg-white/5 cursor-pointer transition-all">
                  <span class="text-2xl">\u{1F3B5}</span>
                  <div><p class="text-sm text-white/80">{{ audioFileName || 'Select audio file' }}</p><p class="text-xs text-white/40">.mp3, .wav, .aac, .ogg</p></div>
                  <input type="file" accept="audio/*" (change)="onAudioFile($event)" class="hidden" />
                </label>
              </div>

              <!-- Mix Mode -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Audio Mode</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (mode of mixModes; track mode.value) {
                    <button (click)="mixMode=mode.value"
                      [class]="mixMode===mode.value ? 'p-3 rounded-xl border-2 border-rose-400 bg-rose-400/10 text-rose-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ mode.icon }} {{ mode.label }}
                      <p class="text-xs mt-1 opacity-60">{{ mode.desc }}</p>
                    </button>
                  }
                </div>
              </div>

              @if (mixMode === 'overlay') {
                <!-- Volume Slider -->
                <div class="space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-white/60">Original Volume</span><span class="text-rose-400 font-mono">{{ origVolume }}%</span></div>
                  <input type="range" min="0" max="100" [value]="origVolume" (input)="origVolume=+getVal($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-400" />
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-white/60">New Audio Volume</span><span class="text-rose-400 font-mono">{{ newVolume }}%</span></div>
                  <input type="range" min="0" max="200" [value]="newVolume" (input)="newVolume=+getVal($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-400" />
                </div>
              }

              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async) || !audioFile" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Replacing... } @else { \u{1F50A} Replace Audio }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Replacing Audio..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_audio_replaced" /> }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AudioReplacerComponent, { className: "AudioReplacerComponent", filePath: "src/app/modules/video/16-audio-replacer/audioreplacer.component.ts", lineNumber: 87 });
})();
export {
  AudioReplacerComponent
};
//# sourceMappingURL=chunk-OEW3XBGP.mjs.map
