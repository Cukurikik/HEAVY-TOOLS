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
  ɵɵpureFunction0,
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

// src/app/modules/video/13-thumbnail-generator/thumbnailGenerator.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  mode: "single",
  timestamp: 0,
  gridCols: 3,
  gridRows: 3,
  intervalSeconds: 5,
  imageFormat: "jpg",
  jpgQuality: 85,
  outputBlobs: [],
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var ThumbnailGeneratorActions = {
  loadFile: createAction("[ThumbnailGenerator] Load File", props()),
  loadMetaSuccess: createAction("[ThumbnailGenerator] Meta OK", props()),
  loadMetaFailure: createAction("[ThumbnailGenerator] Meta Fail", props()),
  updateConfig: createAction("[ThumbnailGenerator] Update Config", props()),
  startProcessing: createAction("[ThumbnailGenerator] Start"),
  updateProgress: createAction("[ThumbnailGenerator] Progress", props()),
  processingSuccess: createAction("[ThumbnailGenerator] Success", props()),
  processingFailure: createAction("[ThumbnailGenerator] Failure", props()),
  downloadOutput: createAction("[ThumbnailGenerator] Download"),
  resetState: createAction("[ThumbnailGenerator] Reset")
};
var thumbnailGeneratorFeature = createFeature({
  name: "thumbnailGenerator",
  reducer: createReducer(init, on(ThumbnailGeneratorActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(ThumbnailGeneratorActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(ThumbnailGeneratorActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(ThumbnailGeneratorActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(ThumbnailGeneratorActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(ThumbnailGeneratorActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(ThumbnailGeneratorActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(ThumbnailGeneratorActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(ThumbnailGeneratorActions.resetState, () => init))
});
var { selectThumbnailGeneratorState, selectStatus, selectProgress, selectOutputBlob } = thumbnailGeneratorFeature;
var selectThumbnailGeneratorCanProcess = createSelector(selectThumbnailGeneratorState, (s) => !!s.inputFile && s.status === "idle");
var selectThumbnailGeneratorIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/13-thumbnail-generator/thumbnailGenerator.component.ts
var _c0 = () => ["png"];
function ThumbnailGeneratorComponent_Conditional_9_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "label", 18);
    \u0275\u0275text(2, "Timestamp (seconds)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 24);
    \u0275\u0275listener("input", function ThumbnailGeneratorComponent_Conditional_9_Conditional_33_Template_input_input_3_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.interval = +$event.target.value);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 25);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r4 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("max", meta_r4.duration)("value", ctx_r1.interval);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(6, 3, ctx_r1.interval, "1.0-1"), "s");
  }
}
function ThumbnailGeneratorComponent_Conditional_9_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 17)(1, "label", 18);
    \u0275\u0275text(2, "Interval between frames (seconds)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 26);
    \u0275\u0275listener("input", function ThumbnailGeneratorComponent_Conditional_9_Conditional_34_Template_input_input_3_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.interval = +$event.target.value);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 25);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r4 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("max", meta_r4.duration / 2)("value", ctx_r1.interval);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Every ", \u0275\u0275pipeBind2(6, 3, ctx_r1.interval, "1.0-0"), "s");
  }
}
function ThumbnailGeneratorComponent_Conditional_9_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 27);
    \u0275\u0275text(1, " Generating... ");
  }
}
function ThumbnailGeneratorComponent_Conditional_9_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F5BC}\uFE0F Generate Thumbnail ");
  }
}
function ThumbnailGeneratorComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275text(21, "Mode");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 19)(23, "button", 20);
    \u0275\u0275listener("click", function ThumbnailGeneratorComponent_Conditional_9_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.mode = "single");
    });
    \u0275\u0275elementStart(24, "span", 21);
    \u0275\u0275text(25, "\u{1F4F7}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span", 22);
    \u0275\u0275text(27, "Single Frame");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "button", 20);
    \u0275\u0275listener("click", function ThumbnailGeneratorComponent_Conditional_9_Template_button_click_28_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.mode = "grid");
    });
    \u0275\u0275elementStart(29, "span", 21);
    \u0275\u0275text(30, "\u{1F5BC}\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span", 22);
    \u0275\u0275text(32, "Grid (4\xD74)");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275conditionalCreate(33, ThumbnailGeneratorComponent_Conditional_9_Conditional_33_Template, 7, 6, "div", 17)(34, ThumbnailGeneratorComponent_Conditional_9_Conditional_34_Template, 7, 6, "div", 17);
    \u0275\u0275elementStart(35, "button", 23);
    \u0275\u0275pipe(36, "async");
    \u0275\u0275pipe(37, "async");
    \u0275\u0275listener("click", function ThumbnailGeneratorComponent_Conditional_9_Template_button_click_35_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(38, ThumbnailGeneratorComponent_Conditional_9_Conditional_38_Template, 2, 0);
    \u0275\u0275pipe(39, "async");
    \u0275\u0275conditionalBranchCreate(40, ThumbnailGeneratorComponent_Conditional_9_Conditional_40_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r4 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 31, meta_r4.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r4.width, "\xD7", meta_r4.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(18, 34, meta_r4.fps, "1.0-0"));
    \u0275\u0275advance(6);
    \u0275\u0275classProp("bg-fuchsia-500", ctx_r1.mode === "single")("text-black", ctx_r1.mode === "single")("border-fuchsia-500", ctx_r1.mode === "single")("bg-white/5", ctx_r1.mode !== "single")("text-white/60", ctx_r1.mode !== "single")("border-white/10", ctx_r1.mode !== "single");
    \u0275\u0275advance(5);
    \u0275\u0275classProp("bg-fuchsia-500", ctx_r1.mode === "grid")("text-black", ctx_r1.mode === "grid")("border-fuchsia-500", ctx_r1.mode === "grid")("bg-white/5", ctx_r1.mode !== "grid")("text-white/60", ctx_r1.mode !== "grid")("border-white/10", ctx_r1.mode !== "grid");
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r1.mode === "single" ? 33 : 34);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(36, 37, ctx_r1.canProcess$) || \u0275\u0275pipeBind1(37, 39, ctx_r1.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(39, 41, ctx_r1.isLoading$) ? 38 : 40);
  }
}
function ThumbnailGeneratorComponent_Conditional_11_Template(rf, ctx) {
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
function ThumbnailGeneratorComponent_Conditional_14_Template(rf, ctx) {
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
function ThumbnailGeneratorComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 28);
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
function ThumbnailGeneratorComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-export-panel", 11);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275pipe(2, "async");
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("outputBlob", ((tmp_1_0 = \u0275\u0275pipeBind1(1, 3, ctx_r1.state$)) == null ? null : tmp_1_0.outputBlob) ?? null)("outputSizeMB", ((tmp_2_0 = \u0275\u0275pipeBind1(2, 5, ctx_r1.state$)) == null ? null : tmp_2_0.outputSizeMB) ?? null)("availableFormats", \u0275\u0275pureFunction0(7, _c0));
  }
}
var ThumbnailGeneratorComponent = class _ThumbnailGeneratorComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectThumbnailGeneratorState);
  isLoading$ = this.store.select(selectThumbnailGeneratorIsLoading);
  canProcess$ = this.store.select(selectThumbnailGeneratorCanProcess);
  mode = "single";
  interval = 5;
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(ThumbnailGeneratorActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(ThumbnailGeneratorActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(ThumbnailGeneratorActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onProcess() {
    this.store.dispatch(ThumbnailGeneratorActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-DU4TMEYB.js", import.meta.url), { type: "module" }), { file: state.inputFile, mode: this.mode, interval: this.interval }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(ThumbnailGeneratorActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const blob = msg.data;
          this.store.dispatch(ThumbnailGeneratorActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(ThumbnailGeneratorActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Thumbnail generation failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(ThumbnailGeneratorActions.resetState());
  }
  static \u0275fac = function ThumbnailGeneratorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ThumbnailGeneratorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ThumbnailGeneratorComponent, selectors: [["app-thumbnail-generator"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-fuchsia-400", "to-pink-200"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video file here or click to browse", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_thumb", 3, "outputBlob", "outputSizeMB", "availableFormats"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-fuchsia-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "text-xs", "text-white/40", "uppercase", "tracking-wider"], [1, "grid", "grid-cols-2", "gap-2"], [1, "py-3", "rounded-xl", "text-center", "transition-all", "duration-200", "border", 3, "click"], [1, "text-xl", "block"], [1, "text-xs", "block", "mt-1"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-fuchsia-500", "to-pink-500", "text-white", "hover:shadow-[0_0_30px_rgba(217,70,239,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], ["type", "range", "min", "0", "step", "0.5", 1, "w-full", "h-2", "rounded-full", "appearance-none", "cursor-pointer", "bg-gradient-to-r", "from-fuchsia-700", "to-fuchsia-400", 3, "input", "max", "value"], [1, "text-center", "text-sm", "font-bold", "text-fuchsia-400"], ["type", "range", "min", "1", "step", "1", 1, "w-full", "h-2", "rounded-full", "appearance-none", "cursor-pointer", "bg-gradient-to-r", "from-fuchsia-700", "to-fuchsia-400", 3, "input", "max", "value"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Generating...", 3, "progress", "size"]], template: function ThumbnailGeneratorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F5BC}\uFE0F Thumbnail Generator ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Generate single thumbnails or grid contact sheets from video");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function ThumbnailGeneratorComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, ThumbnailGeneratorComponent_Conditional_9_Template, 41, 43, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, ThumbnailGeneratorComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, ThumbnailGeneratorComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, ThumbnailGeneratorComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, ThumbnailGeneratorComponent_Conditional_18_Template, 3, 8, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThumbnailGeneratorComponent, [{
    type: Component,
    args: [{
      selector: "app-thumbnail-generator",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-200">
          \u{1F5BC}\uFE0F Thumbnail Generator
        </h1>
        <p class="text-white/50 text-sm">Generate single thumbnails or grid contact sheets from video</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-fuchsia-400">{{ meta.duration | number:'1.0-0' }}s</p>
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

              <!-- Mode Toggle -->
              <div class="space-y-2">
                <label class="text-xs text-white/40 uppercase tracking-wider">Mode</label>
                <div class="grid grid-cols-2 gap-2">
                  <button (click)="mode = 'single'"
                    class="py-3 rounded-xl text-center transition-all duration-200 border"
                    [class.bg-fuchsia-500]="mode === 'single'"
                    [class.text-black]="mode === 'single'"
                    [class.border-fuchsia-500]="mode === 'single'"
                    [class.bg-white/5]="mode !== 'single'"
                    [class.text-white/60]="mode !== 'single'"
                    [class.border-white/10]="mode !== 'single'">
                    <span class="text-xl block">\u{1F4F7}</span>
                    <span class="text-xs block mt-1">Single Frame</span>
                  </button>
                  <button (click)="mode = 'grid'"
                    class="py-3 rounded-xl text-center transition-all duration-200 border"
                    [class.bg-fuchsia-500]="mode === 'grid'"
                    [class.text-black]="mode === 'grid'"
                    [class.border-fuchsia-500]="mode === 'grid'"
                    [class.bg-white/5]="mode !== 'grid'"
                    [class.text-white/60]="mode !== 'grid'"
                    [class.border-white/10]="mode !== 'grid'">
                    <span class="text-xl block">\u{1F5BC}\uFE0F</span>
                    <span class="text-xs block mt-1">Grid (4\xD74)</span>
                  </button>
                </div>
              </div>

              <!-- Timestamp / Interval -->
              @if (mode === 'single') {
                <div class="space-y-2">
                  <label class="text-xs text-white/40 uppercase tracking-wider">Timestamp (seconds)</label>
                  <input type="range" min="0" [max]="meta.duration" step="0.5" [value]="interval"
                    (input)="interval = +($any($event.target)).value"
                    class="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-fuchsia-700 to-fuchsia-400" />
                  <div class="text-center text-sm font-bold text-fuchsia-400">{{ interval | number:'1.0-1' }}s</div>
                </div>
              } @else {
                <div class="space-y-2">
                  <label class="text-xs text-white/40 uppercase tracking-wider">Interval between frames (seconds)</label>
                  <input type="range" min="1" [max]="meta.duration / 2" step="1" [value]="interval"
                    (input)="interval = +($any($event.target)).value"
                    class="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-fuchsia-700 to-fuchsia-400" />
                  <div class="text-center text-sm font-bold text-fuchsia-400">Every {{ interval | number:'1.0-0' }}s</div>
                </div>
              }

              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:shadow-[0_0_30px_rgba(217,70,239,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                } @else { \u{1F5BC}\uFE0F Generate Thumbnail }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Generating..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              [availableFormats]="['png']" defaultFilename="omni_thumb" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ThumbnailGeneratorComponent, { className: "ThumbnailGeneratorComponent", filePath: "src/app/modules/video/13-thumbnail-generator/thumbnailgenerator.component.ts", lineNumber: 128 });
})();
export {
  ThumbnailGeneratorComponent
};
//# sourceMappingURL=chunk-QHKKZGKE.mjs.map
