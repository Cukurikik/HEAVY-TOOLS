import {
  ProgressRingComponent
} from "./chunk-3HJT6LV5.js";
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
  CommonModule
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

// src/app/modules/video/27-slideshow/slideshow.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  images: [],
  defaultDuration: 3,
  kenBurns: false,
  musicFile: null,
  transitionType: "fade",
  transitionDuration: 0.5,
  outputResolution: "1080p",
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var SlideshowActions = {
  loadFile: createAction("[Slideshow] Load File", props()),
  loadMetaSuccess: createAction("[Slideshow] Meta OK", props()),
  loadMetaFailure: createAction("[Slideshow] Meta Fail", props()),
  updateConfig: createAction("[Slideshow] Update Config", props()),
  startProcessing: createAction("[Slideshow] Start"),
  updateProgress: createAction("[Slideshow] Progress", props()),
  processingSuccess: createAction("[Slideshow] Success", props()),
  processingFailure: createAction("[Slideshow] Failure", props()),
  downloadOutput: createAction("[Slideshow] Download"),
  resetState: createAction("[Slideshow] Reset")
};
var slideshowFeature = createFeature({
  name: "slideshow",
  reducer: createReducer(init, on(SlideshowActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(SlideshowActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(SlideshowActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(SlideshowActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(SlideshowActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(SlideshowActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(SlideshowActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(SlideshowActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(SlideshowActions.resetState, () => init))
});
var { selectSlideshowState, selectStatus, selectProgress, selectOutputBlob } = slideshowFeature;
var selectSlideshowCanProcess = createSelector(selectSlideshowState, (s) => !!s.inputFile && s.status === "idle");
var selectSlideshowIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/27-slideshow/slideshow.component.ts
var _forTrack0 = ($index, $item) => $item.name;
var _forTrack1 = ($index, $item) => $item.value;
function SlideshowComponent_Conditional_9_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 14)(1, "div", 28);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 29);
    \u0275\u0275listener("click", function SlideshowComponent_Conditional_9_For_6_Template_button_click_3_listener() {
      const \u0275$index_27_r3 = \u0275\u0275restoreView(_r2).$index;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.removeImage(\u0275$index_27_r3));
    });
    \u0275\u0275text(4, "\xD7");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const \u0275$index_27_r3 = ctx.$index;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_27_r3 + 1);
  }
}
function SlideshowComponent_Conditional_9_For_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function SlideshowComponent_Conditional_9_For_19_Template_button_click_0_listener() {
      const t_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.slideTransition = t_r6.value);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r6 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r3.slideTransition === t_r6.value ? "p-2 rounded-lg border-2 border-amber-400 bg-amber-400/10 text-amber-300 text-sm font-semibold" : "p-2 rounded-lg border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", t_r6.icon, " ", t_r6.label, " ");
  }
}
function SlideshowComponent_Conditional_9_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 30);
    \u0275\u0275text(1, " Creating... ");
  }
}
function SlideshowComponent_Conditional_9_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F3A0} Create Slideshow ");
  }
}
function SlideshowComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 11)(2, "p", 12);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 13);
    \u0275\u0275repeaterCreate(5, SlideshowComponent_Conditional_9_For_6_Template, 5, 1, "div", 14, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 11)(8, "div", 15)(9, "span", 16);
    \u0275\u0275text(10, "Duration Per Slide");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 17);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "input", 18);
    \u0275\u0275listener("input", function SlideshowComponent_Conditional_9_Template_input_input_13_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.slideDuration = +ctx_r3.gv($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 11)(15, "p", 12);
    \u0275\u0275text(16, "Slide Transition");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 19);
    \u0275\u0275repeaterCreate(18, SlideshowComponent_Conditional_9_For_19_Template, 2, 4, "button", 20, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 21)(21, "div")(22, "p", 22);
    \u0275\u0275text(23, "\u{1F3A5} Ken Burns Effect");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "p", 23);
    \u0275\u0275text(25, "Slow zoom & pan on each image");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "button", 24);
    \u0275\u0275listener("click", function SlideshowComponent_Conditional_9_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.kenBurns = !ctx_r3.kenBurns);
    });
    \u0275\u0275element(27, "span");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 25)(29, "p", 23);
    \u0275\u0275text(30, "Estimated Duration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "p", 26);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "button", 27);
    \u0275\u0275pipe(34, "async");
    \u0275\u0275listener("click", function SlideshowComponent_Conditional_9_Template_button_click_33_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onProcess());
    });
    \u0275\u0275conditionalCreate(35, SlideshowComponent_Conditional_9_Conditional_35_Template, 2, 0);
    \u0275\u0275pipe(36, "async");
    \u0275\u0275conditionalBranchCreate(37, SlideshowComponent_Conditional_9_Conditional_37_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r3.images.length, " images selected");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r3.images);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", ctx_r3.slideDuration, "s");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r3.slideDuration);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r3.transitions);
    \u0275\u0275advance(8);
    \u0275\u0275classMap(ctx_r3.kenBurns ? "w-12 h-6 rounded-full bg-amber-500 relative transition-colors" : "w-12 h-6 rounded-full bg-white/20 relative transition-colors");
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r3.kenBurns ? "absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" : "absolute left-1 top-1 w-4 h-4 bg-white/60 rounded-full transition-all");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r3.images.length * ctx_r3.slideDuration, "s");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", \u0275\u0275pipeBind1(34, 10, ctx_r3.isLoading$) || ctx_r3.images.length < 2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(36, 12, ctx_r3.isLoading$) ? 35 : 37);
  }
}
function SlideshowComponent_Conditional_10_Template(rf, ctx) {
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
function SlideshowComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "app-progress-ring", 31);
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
function SlideshowComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-export-panel", 10);
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
var SlideshowComponent = class _SlideshowComponent {
  store = inject(Store);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectSlideshowState);
  isLoading$ = this.store.select(selectSlideshowIsLoading);
  canProcess$ = this.store.select(selectSlideshowCanProcess);
  images = [];
  slideDuration = 3;
  slideTransition = "fade";
  kenBurns = true;
  transitions = [
    { value: "none", label: "None", icon: "\u2796" },
    { value: "fade", label: "Fade", icon: "\u{1F305}" },
    { value: "wipe", label: "Wipe", icon: "\u{1F448}" }
  ];
  gv(e) {
    return e.target.value;
  }
  onImagesSelected(files) {
    this.images = [...this.images, ...files];
    this.store.dispatch(SlideshowActions.loadFile({ file: files[0] }));
  }
  removeImage(i) {
    this.images = this.images.filter((_, idx) => idx !== i);
  }
  onProcess() {
    this.store.dispatch(SlideshowActions.startProcessing());
    this.bridge.process(() => new Worker(new URL("worker-J7MP72PR.js", import.meta.url), { type: "module" }), { images: this.images, duration: this.slideDuration, transition: this.slideTransition, kenBurns: this.kenBurns }).subscribe((msg) => {
      if (msg.type === "progress")
        this.store.dispatch(SlideshowActions.updateProgress({ progress: msg.value ?? 0 }));
      else if (msg.type === "complete" && msg.data) {
        const b = msg.data;
        this.store.dispatch(SlideshowActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1048576 }));
      } else if (msg.type === "error") {
        this.store.dispatch(SlideshowActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Slideshow failed" }));
      }
    });
  }
  ngOnDestroy() {
    this.store.dispatch(SlideshowActions.resetState());
  }
  static \u0275fac = function SlideshowComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SlideshowComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SlideshowComponent, selectors: [["app-slideshow"]], decls: 17, vars: 11, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-amber-400", "to-yellow-300"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "image/*", "label", "Drop images for slideshow", 3, "filesSelected", "multiple"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_slideshow", 3, "outputBlob", "outputSizeMB"], [1, "space-y-2"], [1, "text-sm", "text-white/60"], [1, "grid", "grid-cols-4", "gap-2", "max-h-48", "overflow-y-auto"], [1, "relative", "rounded-lg", "overflow-hidden", "bg-white/5", "aspect-square"], [1, "flex", "justify-between", "text-sm"], [1, "text-white/60"], [1, "text-amber-400", "font-mono"], ["type", "range", "min", "1", "max", "10", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-amber-400", 3, "input", "value"], [1, "grid", "grid-cols-3", "gap-2"], [3, "class"], [1, "flex", "items-center", "justify-between", "p-3", "rounded-xl", "bg-white/5", "border", "border-white/10"], [1, "text-sm", "text-white/80"], [1, "text-xs", "text-white/40"], [3, "click"], [1, "p-3", "rounded-xl", "bg-amber-500/10", "border", "border-amber-500/20", "text-center"], [1, "text-lg", "font-mono", "text-amber-400"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "bg-gradient-to-r", "from-amber-500", "to-yellow-500", "text-black", "hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "absolute", "inset-0", "flex", "items-center", "justify-center", "text-white/40", "text-xs"], [1, "absolute", "top-1", "right-1", "w-5", "h-5", "bg-red-500/80", "rounded-full", "text-xs", "text-white", "flex", "items-center", "justify-center", "hover:bg-red-600", 3, "click"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin", "inline-block"], ["label", "Creating...", 3, "progress", "size"]], template: function SlideshowComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u{1F3A0} Slideshow Maker");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Turn multiple images into a video slideshow with transitions and Ken Burns effect");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function SlideshowComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onImagesSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, SlideshowComponent_Conditional_9_Template, 38, 14, "div", 7);
      \u0275\u0275conditionalCreate(10, SlideshowComponent_Conditional_10_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(11, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 5);
      \u0275\u0275conditionalCreate(13, SlideshowComponent_Conditional_13_Template, 3, 4, "div", 9);
      \u0275\u0275pipe(14, "async");
      \u0275\u0275conditionalCreate(15, SlideshowComponent_Conditional_15_Template, 3, 6, "app-export-panel", 10);
      \u0275\u0275pipe(16, "async");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_3_0;
      let tmp_4_0;
      \u0275\u0275advance(8);
      \u0275\u0275property("multiple", true);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.images.length > 0 ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(((tmp_2_0 = \u0275\u0275pipeBind1(11, 5, ctx.state$)) == null ? null : tmp_2_0.status) === "error" ? 10 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_3_0 = \u0275\u0275pipeBind1(14, 7, ctx.state$)) == null ? null : tmp_3_0.status) === "processing" ? 13 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_4_0 = \u0275\u0275pipeBind1(16, 9, ctx.state$)) == null ? null : tmp_4_0.status) === "done" ? 15 : -1);
    }
  }, dependencies: [CommonModule, FileDropZoneComponent, ProgressRingComponent, ExportPanelComponent, AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SlideshowComponent, [{
    type: Component,
    args: [{
      selector: "app-slideshow",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">\u{1F3A0} Slideshow Maker</h1>
        <p class="text-white/50 text-sm">Turn multiple images into a video slideshow with transitions and Ken Burns effect</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="image/*" label="Drop images for slideshow" [multiple]="true" (filesSelected)="onImagesSelected($event)" />

          @if (images.length > 0) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <!-- Image List -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">{{ images.length }} images selected</p>
                <div class="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  @for (img of images; track img.name; let i = $index) {
                    <div class="relative rounded-lg overflow-hidden bg-white/5 aspect-square">
                      <div class="absolute inset-0 flex items-center justify-center text-white/40 text-xs">{{ i + 1 }}</div>
                      <button (click)="removeImage(i)" class="absolute top-1 right-1 w-5 h-5 bg-red-500/80 rounded-full text-xs text-white flex items-center justify-center hover:bg-red-600">\xD7</button>
                    </div>
                  }
                </div>
              </div>

              <!-- Duration Per Slide -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm"><span class="text-white/60">Duration Per Slide</span><span class="text-amber-400 font-mono">{{ slideDuration }}s</span></div>
                <input type="range" min="1" max="10" [value]="slideDuration" (input)="slideDuration=+gv($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400" />
              </div>

              <!-- Transition -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Slide Transition</p>
                <div class="grid grid-cols-3 gap-2">
                  @for (t of transitions; track t.value) {
                    <button (click)="slideTransition=t.value"
                      [class]="slideTransition===t.value ? 'p-2 rounded-lg border-2 border-amber-400 bg-amber-400/10 text-amber-300 text-sm font-semibold' : 'p-2 rounded-lg border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ t.icon }} {{ t.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Ken Burns Toggle -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div><p class="text-sm text-white/80">\u{1F3A5} Ken Burns Effect</p><p class="text-xs text-white/40">Slow zoom & pan on each image</p></div>
                <button (click)="kenBurns=!kenBurns"
                  [class]="kenBurns ? 'w-12 h-6 rounded-full bg-amber-500 relative transition-colors' : 'w-12 h-6 rounded-full bg-white/20 relative transition-colors'">
                  <span [class]="kenBurns ? 'absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all' : 'absolute left-1 top-1 w-4 h-4 bg-white/60 rounded-full transition-all'"></span>
                </button>
              </div>

              <!-- Total Duration -->
              <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <p class="text-xs text-white/40">Estimated Duration</p>
                <p class="text-lg font-mono text-amber-400">{{ images.length * slideDuration }}s</p>
              </div>

              <button [disabled]="(isLoading$ | async) || images.length < 2" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></div> Creating... } @else { \u{1F3A0} Create Slideshow }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Creating..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_slideshow" /> }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SlideshowComponent, { className: "SlideshowComponent", filePath: "src/app/modules/video/27-slideshow/slideshow.component.ts", lineNumber: 90 });
})();
export {
  SlideshowComponent
};
//# sourceMappingURL=chunk-BWI5KVLP.js.map
