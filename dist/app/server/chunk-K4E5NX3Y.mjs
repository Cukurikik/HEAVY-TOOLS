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

// src/app/modules/video/23-pip/pip.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  mainFile: null,
  overlayFile: null,
  pipWidth: 25,
  position: "TR",
  startTime: null,
  endTime: null,
  borderRadius: 8,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var PipActions = {
  loadFile: createAction("[Pip] Load File", props()),
  loadMetaSuccess: createAction("[Pip] Meta OK", props()),
  loadMetaFailure: createAction("[Pip] Meta Fail", props()),
  updateConfig: createAction("[Pip] Update Config", props()),
  startProcessing: createAction("[Pip] Start"),
  updateProgress: createAction("[Pip] Progress", props()),
  processingSuccess: createAction("[Pip] Success", props()),
  processingFailure: createAction("[Pip] Failure", props()),
  downloadOutput: createAction("[Pip] Download"),
  resetState: createAction("[Pip] Reset")
};
var pipFeature = createFeature({
  name: "pip",
  reducer: createReducer(init, on(PipActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(PipActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(PipActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(PipActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(PipActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(PipActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(PipActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(PipActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(PipActions.resetState, () => init))
});
var { selectPipState, selectStatus, selectProgress, selectOutputBlob } = pipFeature;
var selectPipCanProcess = createSelector(selectPipState, (s) => !!s.inputFile && s.status === "idle");
var selectPipIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/23-pip/pip.component.ts
var _forTrack0 = ($index, $item) => $item.value;
function PipComponent_Conditional_9_For_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function PipComponent_Conditional_9_For_32_Template_button_click_0_listener() {
      const pos_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.pipPosition = pos_r4.value);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pos_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r1.pipPosition === pos_r4.value ? "p-3 rounded-xl border-2 border-sky-400 bg-sky-400/10 text-sky-300 font-semibold text-sm" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", pos_r4.icon, " ", pos_r4.label, " ");
  }
}
function PipComponent_Conditional_9_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 31);
    \u0275\u0275text(1, " Processing... ");
  }
}
function PipComponent_Conditional_9_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F4FA} Create PiP ");
  }
}
function PipComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275elementStart(18, "label", 17)(19, "span", 18);
    \u0275\u0275text(20, "\u{1F3AC}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div")(22, "p", 19);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "p", 14);
    \u0275\u0275text(25, "This will appear in the corner");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "input", 20);
    \u0275\u0275listener("change", function PipComponent_Conditional_9_Template_input_change_26_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onOverlay($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 21)(28, "p", 22);
    \u0275\u0275text(29, "PiP Position");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 23);
    \u0275\u0275repeaterCreate(31, PipComponent_Conditional_9_For_32_Template, 2, 4, "button", 24, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div", 21)(34, "div", 25)(35, "span", 26);
    \u0275\u0275text(36, "PiP Size");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "span", 27);
    \u0275\u0275text(38);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "input", 28);
    \u0275\u0275listener("input", function PipComponent_Conditional_9_Template_input_input_39_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.pipScale = +ctx_r1.gv($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "button", 29);
    \u0275\u0275pipe(41, "async");
    \u0275\u0275pipe(42, "async");
    \u0275\u0275listener("click", function PipComponent_Conditional_9_Template_button_click_40_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(43, PipComponent_Conditional_9_Conditional_43_Template, 2, 0);
    \u0275\u0275pipe(44, "async");
    \u0275\u0275conditionalBranchCreate(45, PipComponent_Conditional_9_Conditional_45_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r5 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 9, meta_r5.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r5.width, "x", meta_r5.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(meta_r5.codec);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.overlayName || "Select overlay (PiP) video");
    \u0275\u0275advance(8);
    \u0275\u0275repeater(ctx_r1.positions);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", ctx_r1.pipScale, "%");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.pipScale);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(41, 12, ctx_r1.canProcess$) || \u0275\u0275pipeBind1(42, 14, ctx_r1.isLoading$) || !ctx_r1.overlayFile);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(44, 16, ctx_r1.isLoading$) ? 43 : 45);
  }
}
function PipComponent_Conditional_11_Template(rf, ctx) {
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
function PipComponent_Conditional_14_Template(rf, ctx) {
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
function PipComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 32);
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
function PipComponent_Conditional_18_Template(rf, ctx) {
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
var PipComponent = class _PipComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectPipState);
  isLoading$ = this.store.select(selectPipIsLoading);
  canProcess$ = this.store.select(selectPipCanProcess);
  overlayFile = null;
  overlayName = "";
  pipPosition = "BR";
  pipScale = 25;
  positions = [
    { value: "TL", label: "Top Left", icon: "\u2196\uFE0F" },
    { value: "TR", label: "Top Right", icon: "\u2197\uFE0F" },
    { value: "BL", label: "Bottom Left", icon: "\u2199\uFE0F" },
    { value: "BR", label: "Bottom Right", icon: "\u2198\uFE0F" }
  ];
  gv(e) {
    return e.target.value;
  }
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(PipActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(PipActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(PipActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read." }));
    }
  }
  onOverlay(e) {
    const f = e.target.files?.[0];
    if (f) {
      this.overlayFile = f;
      this.overlayName = f.name;
    }
  }
  onProcess() {
    this.store.dispatch(PipActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile || !this.overlayFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-RAT3SBPM.js", import.meta.url), { type: "module" }), { file: state.inputFile, overlayFile: this.overlayFile, position: this.pipPosition, scale: this.pipScale }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(PipActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const b = msg.data;
          this.store.dispatch(PipActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(PipActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "PiP failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(PipActions.resetState());
  }
  static \u0275fac = function PipComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PipComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PipComponent, selectors: [["app-pip"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-sky-400", "to-blue-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop MAIN video", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_pip", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-sky-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "flex", "items-center", "gap-3", "p-4", "rounded-xl", "border-2", "border-dashed", "border-white/20", "hover:border-sky-400/50", "bg-white/5", "cursor-pointer", "transition-all"], [1, "text-2xl"], [1, "text-sm", "text-white/80"], ["type", "file", "accept", "video/*", 1, "hidden", 3, "change"], [1, "space-y-2"], [1, "text-sm", "text-white/60"], [1, "grid", "grid-cols-2", "gap-2"], [3, "class"], [1, "flex", "justify-between", "text-sm"], [1, "text-white/60"], [1, "text-sky-400", "font-mono"], ["type", "range", "min", "10", "max", "50", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-sky-400", 3, "input", "value"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-sky-500", "to-blue-500", "text-white", "hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [3, "click"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Creating PiP...", 3, "progress", "size"]], template: function PipComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u{1F4FA} Picture-in-Picture");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Overlay a smaller video on top of a main video");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function PipComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, PipComponent_Conditional_9_Template, 46, 18, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, PipComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, PipComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, PipComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, PipComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PipComponent, [{
    type: Component,
    args: [{
      selector: "app-pip",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">\u{1F4FA} Picture-in-Picture</h1>
        <p class="text-white/50 text-sm">Overlay a smaller video on top of a main video</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop MAIN video" (filesSelected)="onFileSelected($event)" />
          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-semibold text-sky-400">{{ meta.duration | number:'1.0-0' }}s</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-semibold text-white">{{ meta.width }}x{{ meta.height }}</p></div>
                <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-semibold text-white">{{ meta.codec }}</p></div>
              </div>
              <!-- Overlay Upload -->
              <label class="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-white/20 hover:border-sky-400/50 bg-white/5 cursor-pointer transition-all">
                <span class="text-2xl">\u{1F3AC}</span>
                <div><p class="text-sm text-white/80">{{ overlayName || 'Select overlay (PiP) video' }}</p><p class="text-xs text-white/40">This will appear in the corner</p></div>
                <input type="file" accept="video/*" (change)="onOverlay($event)" class="hidden" />
              </label>
              <!-- Position -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">PiP Position</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (pos of positions; track pos.value) {
                    <button (click)="pipPosition=pos.value"
                      [class]="pipPosition===pos.value ? 'p-3 rounded-xl border-2 border-sky-400 bg-sky-400/10 text-sky-300 font-semibold text-sm' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ pos.icon }} {{ pos.label }}
                    </button>
                  }
                </div>
              </div>
              <!-- Size -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm"><span class="text-white/60">PiP Size</span><span class="text-sky-400 font-mono">{{ pipScale }}%</span></div>
                <input type="range" min="10" max="50" [value]="pipScale" (input)="pipScale=+gv($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-400" />
              </div>
              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async) || !overlayFile" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Processing... } @else { \u{1F4FA} Create PiP }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Creating PiP..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_pip" /> }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PipComponent, { className: "PipComponent", filePath: "src/app/modules/video/23-pip/pip.component.ts", lineNumber: 73 });
})();
export {
  PipComponent
};
//# sourceMappingURL=chunk-K4E5NX3Y.mjs.map
