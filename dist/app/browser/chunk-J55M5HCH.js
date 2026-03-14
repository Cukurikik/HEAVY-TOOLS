import {
  VideoPreviewComponent
} from "./chunk-K6T6M4FG.js";
import {
  ProgressRingComponent
} from "./chunk-5RQOTGLT.js";
import {
  FFmpegService
} from "./chunk-BYCJNMIZ.js";
import {
  FileDropZoneComponent
} from "./chunk-XTIE2Y63.js";
import {
  ExportPanelComponent
} from "./chunk-OOQG5I22.js";
import {
  WorkerBridgeService
} from "./chunk-KAUCEXPZ.js";
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

// src/app/modules/video/25-transitions/transitions.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  clips: [],
  transitionList: [],
  applyAllType: "fade",
  applyAllDuration: 0.5,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var TransitionsActions = {
  loadFile: createAction("[Transitions] Load File", props()),
  loadMetaSuccess: createAction("[Transitions] Meta OK", props()),
  loadMetaFailure: createAction("[Transitions] Meta Fail", props()),
  updateConfig: createAction("[Transitions] Update Config", props()),
  startProcessing: createAction("[Transitions] Start"),
  updateProgress: createAction("[Transitions] Progress", props()),
  processingSuccess: createAction("[Transitions] Success", props()),
  processingFailure: createAction("[Transitions] Failure", props()),
  downloadOutput: createAction("[Transitions] Download"),
  resetState: createAction("[Transitions] Reset")
};
var transitionsFeature = createFeature({
  name: "transitions",
  reducer: createReducer(init, on(TransitionsActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(TransitionsActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(TransitionsActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(TransitionsActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(TransitionsActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(TransitionsActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(TransitionsActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(TransitionsActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(TransitionsActions.resetState, () => init))
});
var { selectTransitionsState, selectStatus, selectProgress, selectOutputBlob } = transitionsFeature;
var selectTransitionsCanProcess = createSelector(selectTransitionsState, (s) => !!s.inputFile && s.status === "idle");
var selectTransitionsIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/25-transitions/transitions.component.ts
var _forTrack0 = ($index, $item) => $item.value;
function TransitionsComponent_Conditional_9_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function TransitionsComponent_Conditional_9_For_23_Template_button_click_0_listener() {
      const t_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.transition = t_r3.value);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r3.transition === t_r3.value ? "p-3 rounded-xl border-2 border-fuchsia-400 bg-fuchsia-400/10 text-fuchsia-300 text-sm font-semibold" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", t_r3.icon, " ", t_r3.label, " ");
  }
}
function TransitionsComponent_Conditional_9_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 28);
    \u0275\u0275text(1, " Applying... ");
  }
}
function TransitionsComponent_Conditional_9_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u2728 Apply Transition ");
  }
}
function TransitionsComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275text(20, "Transition Effect");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 19);
    \u0275\u0275repeaterCreate(22, TransitionsComponent_Conditional_9_For_23_Template, 2, 4, "button", 20, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 17)(25, "div", 21)(26, "span", 22);
    \u0275\u0275text(27, "Transition Duration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "span", 23);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "input", 24);
    \u0275\u0275listener("input", function TransitionsComponent_Conditional_9_Template_input_input_30_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.transitionDuration = +ctx_r3.gv($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 25)(32, "span");
    \u0275\u0275text(33, "0.5s");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span");
    \u0275\u0275text(35, "2.5s");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "span");
    \u0275\u0275text(37, "5s");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "button", 26);
    \u0275\u0275pipe(39, "async");
    \u0275\u0275pipe(40, "async");
    \u0275\u0275listener("click", function TransitionsComponent_Conditional_9_Template_button_click_38_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onProcess());
    });
    \u0275\u0275conditionalCreate(41, TransitionsComponent_Conditional_9_Conditional_41_Template, 2, 0);
    \u0275\u0275pipe(42, "async");
    \u0275\u0275conditionalBranchCreate(43, TransitionsComponent_Conditional_9_Conditional_43_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r5 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 8, meta_r5.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r5.width, "x", meta_r5.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(meta_r5.codec);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r3.transitionTypes);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", ctx_r3.transitionDuration, "s");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r3.transitionDuration);
    \u0275\u0275advance(8);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(39, 11, ctx_r3.canProcess$) || \u0275\u0275pipeBind1(40, 13, ctx_r3.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(42, 15, ctx_r3.isLoading$) ? 41 : 43);
  }
}
function TransitionsComponent_Conditional_11_Template(rf, ctx) {
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
function TransitionsComponent_Conditional_14_Template(rf, ctx) {
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
function TransitionsComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 29);
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
function TransitionsComponent_Conditional_18_Template(rf, ctx) {
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
var TransitionsComponent = class _TransitionsComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectTransitionsState);
  isLoading$ = this.store.select(selectTransitionsIsLoading);
  canProcess$ = this.store.select(selectTransitionsCanProcess);
  transition = "fade";
  transitionDuration = 1;
  transitionTypes = [
    { value: "fade", label: "Fade", icon: "\u{1F305}" },
    { value: "wipeleft", label: "Wipe Left", icon: "\u{1F448}" },
    { value: "wiperight", label: "Wipe Right", icon: "\u{1F449}" },
    { value: "dissolve", label: "Dissolve", icon: "\u{1F4AB}" }
  ];
  gv(e) {
    return e.target.value;
  }
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(TransitionsActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(TransitionsActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(TransitionsActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read." }));
    }
  }
  onProcess() {
    this.store.dispatch(TransitionsActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-FOCTJ7RU.js", import.meta.url), { type: "module" }), { file: state.inputFile, transition: this.transition, duration: this.transitionDuration }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(TransitionsActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const b = msg.data;
          this.store.dispatch(TransitionsActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(TransitionsActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Transition failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(TransitionsActions.resetState());
  }
  static \u0275fac = function TransitionsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TransitionsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TransitionsComponent, selectors: [["app-transitions"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-fuchsia-400", "to-pink-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video file", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_transition", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-fuchsia-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "text-sm", "text-white/60"], [1, "grid", "grid-cols-2", "gap-2"], [3, "class"], [1, "flex", "justify-between", "text-sm"], [1, "text-white/60"], [1, "text-fuchsia-400", "font-mono"], ["type", "range", "min", "0.5", "max", "5", "step", "0.5", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-fuchsia-400", 3, "input", "value"], [1, "flex", "justify-between", "text-xs", "text-white/30"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-fuchsia-500", "to-pink-500", "text-white", "hover:shadow-[0_0_30px_rgba(217,70,239,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [3, "click"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Applying...", 3, "progress", "size"]], template: function TransitionsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u2728 Video Transitions");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Apply fade, wipe, dissolve, or zoom transitions between clips");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function TransitionsComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, TransitionsComponent_Conditional_9_Template, 44, 17, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, TransitionsComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, TransitionsComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, TransitionsComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, TransitionsComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TransitionsComponent, [{
    type: Component,
    args: [{
      selector: "app-transitions",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">\u2728 Video Transitions</h1>
        <p class="text-white/50 text-sm">Apply fade, wipe, dissolve, or zoom transitions between clips</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-fuchsia-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>
              <!-- Transition Type -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Transition Effect</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (t of transitionTypes; track t.value) {
                    <button (click)="transition=t.value"
                      [class]="transition===t.value ? 'p-3 rounded-xl border-2 border-fuchsia-400 bg-fuchsia-400/10 text-fuchsia-300 text-sm font-semibold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ t.icon }} {{ t.label }}
                    </button>
                  }
                </div>
              </div>
              <!-- Duration -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm"><span class="text-white/60">Transition Duration</span><span class="text-fuchsia-400 font-mono">{{ transitionDuration }}s</span></div>
                <input type="range" min="0.5" max="5" step="0.5" [value]="transitionDuration" (input)="transitionDuration=+gv($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-fuchsia-400" />
                <div class="flex justify-between text-xs text-white/30"><span>0.5s</span><span>2.5s</span><span>5s</span></div>
              </div>
              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:shadow-[0_0_30px_rgba(217,70,239,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Applying... } @else { \u2728 Apply Transition }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Applying..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_transition" /> }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TransitionsComponent, { className: "TransitionsComponent", filePath: "src/app/modules/video/25-transitions/transitions.component.ts", lineNumber: 68 });
})();
export {
  TransitionsComponent
};
//# sourceMappingURL=chunk-J55M5HCH.js.map
