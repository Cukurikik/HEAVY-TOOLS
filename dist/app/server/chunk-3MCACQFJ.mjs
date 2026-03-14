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

// src/app/modules/video/24-blur/blur.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  mode: "full",
  strength: 10,
  region: null,
  startTime: null,
  endTime: null,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var BlurActions = {
  loadFile: createAction("[Blur] Load File", props()),
  loadMetaSuccess: createAction("[Blur] Meta OK", props()),
  loadMetaFailure: createAction("[Blur] Meta Fail", props()),
  updateConfig: createAction("[Blur] Update Config", props()),
  startProcessing: createAction("[Blur] Start"),
  updateProgress: createAction("[Blur] Progress", props()),
  processingSuccess: createAction("[Blur] Success", props()),
  processingFailure: createAction("[Blur] Failure", props()),
  downloadOutput: createAction("[Blur] Download"),
  resetState: createAction("[Blur] Reset")
};
var blurFeature = createFeature({
  name: "blur",
  reducer: createReducer(init, on(BlurActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(BlurActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(BlurActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(BlurActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(BlurActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(BlurActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(BlurActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(BlurActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(BlurActions.resetState, () => init))
});
var { selectBlurState, selectStatus, selectProgress, selectOutputBlob } = blurFeature;
var selectBlurCanProcess = createSelector(selectBlurState, (s) => !!s.inputFile && s.status === "idle");
var selectBlurIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/24-blur/blur.component.ts
var _forTrack0 = ($index, $item) => $item.value;
function BlurComponent_Conditional_9_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function BlurComponent_Conditional_9_For_23_Template_button_click_0_listener() {
      const bt_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.blurType = bt_r3.value);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const bt_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r3.blurType === bt_r3.value ? "p-3 rounded-xl border-2 border-indigo-400 bg-indigo-400/10 text-indigo-300 text-sm font-semibold" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", bt_r3.icon, " ", bt_r3.label, " ");
  }
}
function BlurComponent_Conditional_9_For_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function BlurComponent_Conditional_9_For_43_Template_button_click_0_listener() {
      const r_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.region = r_r6.value);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r6 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r3.region === r_r6.value ? "p-3 rounded-xl border-2 border-indigo-400 bg-indigo-400/10 text-indigo-300 text-sm font-semibold" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", r_r6.icon, " ", r_r6.label, " ");
  }
}
function BlurComponent_Conditional_9_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 29);
    \u0275\u0275text(1, " Blurring... ");
  }
}
function BlurComponent_Conditional_9_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F32B}\uFE0F Apply Blur ");
  }
}
function BlurComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275text(20, "Blur Algorithm");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 19);
    \u0275\u0275repeaterCreate(22, BlurComponent_Conditional_9_For_23_Template, 2, 4, "button", 20, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 17)(25, "div", 21)(26, "span", 22);
    \u0275\u0275text(27, "Blur Strength");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "span", 23);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "input", 24);
    \u0275\u0275listener("input", function BlurComponent_Conditional_9_Template_input_input_30_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.blurStrength = +ctx_r3.gv($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 25)(32, "span");
    \u0275\u0275text(33, "Subtle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span");
    \u0275\u0275text(35, "Medium");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "span");
    \u0275\u0275text(37, "Heavy");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "div", 17)(39, "p", 18);
    \u0275\u0275text(40, "Blur Region");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "div", 26);
    \u0275\u0275repeaterCreate(42, BlurComponent_Conditional_9_For_43_Template, 2, 4, "button", 20, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "button", 27);
    \u0275\u0275pipe(45, "async");
    \u0275\u0275pipe(46, "async");
    \u0275\u0275listener("click", function BlurComponent_Conditional_9_Template_button_click_44_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onProcess());
    });
    \u0275\u0275conditionalCreate(47, BlurComponent_Conditional_9_Conditional_47_Template, 2, 0);
    \u0275\u0275pipe(48, "async");
    \u0275\u0275conditionalBranchCreate(49, BlurComponent_Conditional_9_Conditional_49_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r7 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 8, meta_r7.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r7.width, "x", meta_r7.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(meta_r7.codec);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r3.blurTypes);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r3.blurStrength);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r3.blurStrength);
    \u0275\u0275advance(12);
    \u0275\u0275repeater(ctx_r3.regions);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(45, 11, ctx_r3.canProcess$) || \u0275\u0275pipeBind1(46, 13, ctx_r3.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(48, 15, ctx_r3.isLoading$) ? 47 : 49);
  }
}
function BlurComponent_Conditional_11_Template(rf, ctx) {
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
function BlurComponent_Conditional_14_Template(rf, ctx) {
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
function BlurComponent_Conditional_16_Template(rf, ctx) {
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
function BlurComponent_Conditional_18_Template(rf, ctx) {
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
var BlurComponent = class _BlurComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectBlurState);
  isLoading$ = this.store.select(selectBlurIsLoading);
  canProcess$ = this.store.select(selectBlurCanProcess);
  blurType = "boxblur";
  blurStrength = 10;
  region = "full";
  blurTypes = [
    { value: "boxblur", label: "Box", icon: "\u2B1C" },
    { value: "gaussblur", label: "Gaussian", icon: "\u{1F535}" },
    { value: "smartblur", label: "Smart", icon: "\u{1F9E0}" }
  ];
  regions = [
    { value: "full", label: "Full Frame", icon: "\u{1F5BC}\uFE0F" },
    { value: "center", label: "Center Region", icon: "\u23FA\uFE0F" }
  ];
  gv(e) {
    return e.target.value;
  }
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(BlurActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(BlurActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(BlurActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read." }));
    }
  }
  onProcess() {
    this.store.dispatch(BlurActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-AVIEI5HD.js", import.meta.url), { type: "module" }), { file: state.inputFile, blurType: this.blurType, strength: this.blurStrength, region: this.region }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(BlurActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const b = msg.data;
          this.store.dispatch(BlurActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(BlurActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Blur failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(BlurActions.resetState());
  }
  static \u0275fac = function BlurComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BlurComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BlurComponent, selectors: [["app-blur"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-indigo-400", "to-blue-300"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video to blur", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_blurred", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-indigo-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "text-sm", "text-white/60"], [1, "grid", "grid-cols-3", "gap-2"], [3, "class"], [1, "flex", "justify-between", "text-sm"], [1, "text-white/60"], [1, "text-indigo-400", "font-mono"], ["type", "range", "min", "1", "max", "30", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-indigo-400", 3, "input", "value"], [1, "flex", "justify-between", "text-xs", "text-white/30"], [1, "grid", "grid-cols-2", "gap-2"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-indigo-500", "to-blue-500", "text-white", "hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [3, "click"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Blurring...", 3, "progress", "size"]], template: function BlurComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u{1F32B}\uFE0F Video Blur");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Apply gaussian, box, or smart blur to the entire video or specific regions");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function BlurComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, BlurComponent_Conditional_9_Template, 50, 17, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, BlurComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, BlurComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, BlurComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, BlurComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BlurComponent, [{
    type: Component,
    args: [{
      selector: "app-blur",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-300">\u{1F32B}\uFE0F Video Blur</h1>
        <p class="text-white/50 text-sm">Apply gaussian, box, or smart blur to the entire video or specific regions</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video to blur" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-indigo-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>
              <!-- Blur Type -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Blur Algorithm</p>
                <div class="grid grid-cols-3 gap-2">
                  @for (bt of blurTypes; track bt.value) {
                    <button (click)="blurType=bt.value"
                      [class]="blurType===bt.value ? 'p-3 rounded-xl border-2 border-indigo-400 bg-indigo-400/10 text-indigo-300 text-sm font-semibold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ bt.icon }} {{ bt.label }}
                    </button>
                  }
                </div>
              </div>
              <!-- Strength -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm"><span class="text-white/60">Blur Strength</span><span class="text-indigo-400 font-mono">{{ blurStrength }}</span></div>
                <input type="range" min="1" max="30" [value]="blurStrength" (input)="blurStrength=+gv($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-400" />
                <div class="flex justify-between text-xs text-white/30"><span>Subtle</span><span>Medium</span><span>Heavy</span></div>
              </div>
              <!-- Region -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Blur Region</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (r of regions; track r.value) {
                    <button (click)="region=r.value"
                      [class]="region===r.value ? 'p-3 rounded-xl border-2 border-indigo-400 bg-indigo-400/10 text-indigo-300 text-sm font-semibold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ r.icon }} {{ r.label }}
                    </button>
                  }
                </div>
              </div>
              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Blurring... } @else { \u{1F32B}\uFE0F Apply Blur }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Blurring..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_blurred" /> }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BlurComponent, { className: "BlurComponent", filePath: "src/app/modules/video/24-blur/blur.component.ts", lineNumber: 80 });
})();
export {
  BlurComponent
};
//# sourceMappingURL=chunk-3MCACQFJ.mjs.map
