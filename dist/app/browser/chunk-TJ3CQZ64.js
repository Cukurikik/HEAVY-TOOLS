import {
  ExportPanelComponent
} from "./chunk-OOQG5I22.js";
import "./chunk-KAUCEXPZ.js";
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
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
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
  ɵɵtextInterpolate1
} from "./chunk-3GKPD7AG.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-KWSTWQNB.js";

// src/app/modules/video/21-screen-recorder/screenRecorder.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  duration: 0,
  audioSource: "mic",
  resolution: "1080p",
  outputFormat: "webm",
  recordingStatus: "idle",
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var ScreenRecorderActions = {
  loadFile: createAction("[ScreenRecorder] Load File", props()),
  loadMetaSuccess: createAction("[ScreenRecorder] Meta OK", props()),
  loadMetaFailure: createAction("[ScreenRecorder] Meta Fail", props()),
  updateConfig: createAction("[ScreenRecorder] Update Config", props()),
  startProcessing: createAction("[ScreenRecorder] Start"),
  updateProgress: createAction("[ScreenRecorder] Progress", props()),
  processingSuccess: createAction("[ScreenRecorder] Success", props()),
  processingFailure: createAction("[ScreenRecorder] Failure", props()),
  downloadOutput: createAction("[ScreenRecorder] Download"),
  resetState: createAction("[ScreenRecorder] Reset")
};
var screenRecorderFeature = createFeature({
  name: "screenRecorder",
  reducer: createReducer(init, on(ScreenRecorderActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(ScreenRecorderActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(ScreenRecorderActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(ScreenRecorderActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(ScreenRecorderActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(ScreenRecorderActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(ScreenRecorderActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(ScreenRecorderActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(ScreenRecorderActions.resetState, () => init))
});
var { selectScreenRecorderState, selectStatus, selectProgress, selectOutputBlob } = screenRecorderFeature;
var selectScreenRecorderCanProcess = createSelector(selectScreenRecorderState, (s) => !!s.inputFile && s.status === "idle");
var selectScreenRecorderIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/21-screen-recorder/screenRecorder.component.ts
var _forTrack0 = ($index, $item) => $item.value;
function ScreenRecorderComponent_For_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function ScreenRecorderComponent_For_14_Template_button_click_0_listener() {
      const src_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.source = src_r2.value);
    });
    \u0275\u0275text(1);
    \u0275\u0275element(2, "br");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const src_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r2.source === src_r2.value ? "p-3 rounded-xl border-2 border-red-400 bg-red-400/10 text-red-300 text-sm font-semibold" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", src_r2.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", src_r2.label, " ");
  }
}
function ScreenRecorderComponent_For_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function ScreenRecorderComponent_For_28_Template_button_click_0_listener() {
      const q_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.quality = q_r5.value);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const q_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r2.quality === q_r5.value ? "p-2 rounded-lg border-2 border-red-400 bg-red-400/10 text-red-300 text-sm font-bold" : "p-2 rounded-lg border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", q_r5.label, " ");
  }
}
function ScreenRecorderComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15)(1, "div", 20);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 21);
    \u0275\u0275text(4, "Recording in progress...");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("\u{1F534} ", ctx_r2.recordingTime());
  }
}
function ScreenRecorderComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 22);
    \u0275\u0275listener("click", function ScreenRecorderComponent_Conditional_30_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.startRecording());
    });
    \u0275\u0275text(1, " \u{1F534} Start Recording ");
    \u0275\u0275elementEnd();
  }
}
function ScreenRecorderComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function ScreenRecorderComponent_Conditional_31_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.stopRecording());
    });
    \u0275\u0275text(1, " \u23F9\uFE0F Stop Recording ");
    \u0275\u0275elementEnd();
  }
}
function ScreenRecorderComponent_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-export-panel", 18);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275pipe(2, "async");
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("outputBlob", ((tmp_1_0 = \u0275\u0275pipeBind1(1, 2, ctx_r2.state$)) == null ? null : tmp_1_0.outputBlob) ?? null)("outputSizeMB", ((tmp_2_0 = \u0275\u0275pipeBind1(2, 4, ctx_r2.state$)) == null ? null : tmp_2_0.outputSizeMB) ?? null);
  }
}
function ScreenRecorderComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\u26A0\uFE0F ", (tmp_1_0 = \u0275\u0275pipeBind1(2, 1, ctx_r2.state$)) == null ? null : tmp_1_0.errorMessage);
  }
}
var ScreenRecorderComponent = class _ScreenRecorderComponent {
  store = inject(Store);
  state$ = this.store.select(selectScreenRecorderState);
  isLoading$ = this.store.select(selectScreenRecorderIsLoading);
  source = "screen";
  includeAudio = true;
  quality = "high";
  isRecording = signal(false, ...ngDevMode ? [{ debugName: "isRecording" }] : (
    /* istanbul ignore next */
    []
  ));
  recordingTime = signal("00:00", ...ngDevMode ? [{ debugName: "recordingTime" }] : (
    /* istanbul ignore next */
    []
  ));
  mediaRecorder = null;
  chunks = [];
  timer = null;
  startTime = 0;
  sources = [
    { value: "screen", label: "Screen", icon: "\u{1F5A5}\uFE0F" },
    { value: "window", label: "Window", icon: "\u{1FA9F}" },
    { value: "tab", label: "Tab", icon: "\u{1F516}" }
  ];
  qualities = [
    { value: "low", label: "720p" },
    { value: "high", label: "1080p" },
    { value: "ultra", label: "4K" }
  ];
  async startRecording() {
    try {
      const displayMediaOptions = { video: true, audio: this.includeAudio };
      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      if (this.includeAudio) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioStream.getAudioTracks().forEach((t) => stream.addTrack(t));
        } catch {
        }
      }
      this.chunks = [];
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0)
          this.chunks.push(e.data);
      };
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: "video/webm" });
        this.store.dispatch(ScreenRecorderActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
        stream.getTracks().forEach((t) => t.stop());
        this.isRecording.set(false);
        if (this.timer)
          clearInterval(this.timer);
      };
      this.mediaRecorder.start(100);
      this.isRecording.set(true);
      this.startTime = Date.now();
      this.timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1e3);
        const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
        const secs = String(elapsed % 60).padStart(2, "0");
        this.recordingTime.set(`${mins}:${secs}`);
      }, 1e3);
    } catch {
      this.store.dispatch(ScreenRecorderActions.processingFailure({ errorCode: "PERMISSION_DENIED", message: "Screen capture permission was denied." }));
    }
  }
  stopRecording() {
    this.mediaRecorder?.stop();
  }
  ngOnDestroy() {
    this.stopRecording();
    if (this.timer)
      clearInterval(this.timer);
    this.store.dispatch(ScreenRecorderActions.resetState());
  }
  static \u0275fac = function ScreenRecorderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ScreenRecorderComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ScreenRecorderComponent, selectors: [["app-screen-recorder"]], decls: 37, vars: 12, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-red-400", "to-rose-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "space-y-2"], [1, "text-sm", "text-white/60"], [1, "grid", "grid-cols-3", "gap-2"], [3, "class"], [1, "flex", "items-center", "justify-between", "p-3", "rounded-xl", "bg-white/5", "border", "border-white/10"], [1, "text-sm", "text-white/80"], [1, "text-xs", "text-white/40"], [3, "click"], [1, "text-center", "p-6", "rounded-2xl", "bg-red-500/10", "border", "border-red-500/30"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-red-500", "to-rose-500", "text-white", "hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-white/10", "border", "border-white/20", "text-white", "hover:bg-white/20"], ["defaultFilename", "omni_recording", 3, "outputBlob", "outputSizeMB"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [1, "text-4xl", "font-mono", "text-red-400", "animate-pulse"], [1, "text-sm", "text-white/50", "mt-2"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-red-500", "to-rose-500", "text-white", "hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]", 3, "click"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-white/10", "border", "border-white/20", "text-white", "hover:bg-white/20", 3, "click"]], template: function ScreenRecorderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u{1F5A5}\uFE0F Screen Recorder");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Record screen, window, or browser tab with optional audio capture");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "div", 6)(9, "div", 7)(10, "p", 8);
      \u0275\u0275text(11, "Capture Source");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 9);
      \u0275\u0275repeaterCreate(13, ScreenRecorderComponent_For_14_Template, 4, 4, "button", 10, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "div", 11)(16, "div")(17, "p", 12);
      \u0275\u0275text(18, "\u{1F3A4} Include Audio");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "p", 13);
      \u0275\u0275text(20, "System audio + microphone");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "button", 14);
      \u0275\u0275listener("click", function ScreenRecorderComponent_Template_button_click_21_listener() {
        return ctx.includeAudio = !ctx.includeAudio;
      });
      \u0275\u0275element(22, "span");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "div", 7)(24, "p", 8);
      \u0275\u0275text(25, "Recording Quality");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "div", 9);
      \u0275\u0275repeaterCreate(27, ScreenRecorderComponent_For_28_Template, 2, 3, "button", 10, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(29, ScreenRecorderComponent_Conditional_29_Template, 5, 1, "div", 15);
      \u0275\u0275conditionalCreate(30, ScreenRecorderComponent_Conditional_30_Template, 2, 0, "button", 16)(31, ScreenRecorderComponent_Conditional_31_Template, 2, 0, "button", 17);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "div", 5);
      \u0275\u0275conditionalCreate(33, ScreenRecorderComponent_Conditional_33_Template, 3, 6, "app-export-panel", 18);
      \u0275\u0275pipe(34, "async");
      \u0275\u0275conditionalCreate(35, ScreenRecorderComponent_Conditional_35_Template, 3, 3, "div", 19);
      \u0275\u0275pipe(36, "async");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_6_0;
      let tmp_7_0;
      \u0275\u0275advance(13);
      \u0275\u0275repeater(ctx.sources);
      \u0275\u0275advance(8);
      \u0275\u0275classMap(ctx.includeAudio ? "w-12 h-6 rounded-full bg-red-500 relative transition-colors" : "w-12 h-6 rounded-full bg-white/20 relative transition-colors");
      \u0275\u0275advance();
      \u0275\u0275classMap(ctx.includeAudio ? "absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" : "absolute left-1 top-1 w-4 h-4 bg-white/60 rounded-full transition-all");
      \u0275\u0275advance(5);
      \u0275\u0275repeater(ctx.qualities);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.isRecording() ? 29 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.isRecording() ? 30 : 31);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_6_0 = \u0275\u0275pipeBind1(34, 8, ctx.state$)) == null ? null : tmp_6_0.status) === "done" ? 33 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_7_0 = \u0275\u0275pipeBind1(36, 10, ctx.state$)) == null ? null : tmp_7_0.status) === "error" ? 35 : -1);
    }
  }, dependencies: [CommonModule, ExportPanelComponent, AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScreenRecorderComponent, [{
    type: Component,
    args: [{
      selector: "app-screen-recorder",
      standalone: true,
      imports: [CommonModule, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">\u{1F5A5}\uFE0F Screen Recorder</h1>
        <p class="text-white/50 text-sm">Record screen, window, or browser tab with optional audio capture</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <!-- Source -->
            <div class="space-y-2">
              <p class="text-sm text-white/60">Capture Source</p>
              <div class="grid grid-cols-3 gap-2">
                @for (src of sources; track src.value) {
                  <button (click)="source=src.value"
                    [class]="source===src.value ? 'p-3 rounded-xl border-2 border-red-400 bg-red-400/10 text-red-300 text-sm font-semibold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                    {{ src.icon }}<br/>{{ src.label }}
                  </button>
                }
              </div>
            </div>

            <!-- Audio -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div><p class="text-sm text-white/80">\u{1F3A4} Include Audio</p><p class="text-xs text-white/40">System audio + microphone</p></div>
              <button (click)="includeAudio=!includeAudio"
                [class]="includeAudio ? 'w-12 h-6 rounded-full bg-red-500 relative transition-colors' : 'w-12 h-6 rounded-full bg-white/20 relative transition-colors'">
                <span [class]="includeAudio ? 'absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all' : 'absolute left-1 top-1 w-4 h-4 bg-white/60 rounded-full transition-all'"></span>
              </button>
            </div>

            <!-- Quality -->
            <div class="space-y-2">
              <p class="text-sm text-white/60">Recording Quality</p>
              <div class="grid grid-cols-3 gap-2">
                @for (q of qualities; track q.value) {
                  <button (click)="quality=q.value"
                    [class]="quality===q.value ? 'p-2 rounded-lg border-2 border-red-400 bg-red-400/10 text-red-300 text-sm font-bold' : 'p-2 rounded-lg border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                    {{ q.label }}
                  </button>
                }
              </div>
            </div>

            <!-- Timer display -->
            @if (isRecording()) {
              <div class="text-center p-6 rounded-2xl bg-red-500/10 border border-red-500/30">
                <div class="text-4xl font-mono text-red-400 animate-pulse">\u{1F534} {{ recordingTime() }}</div>
                <p class="text-sm text-white/50 mt-2">Recording in progress...</p>
              </div>
            }

            @if (!isRecording()) {
              <button (click)="startRecording()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                \u{1F534} Start Recording
              </button>
            } @else {
              <button (click)="stopRecording()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white hover:bg-white/20">
                \u23F9\uFE0F Stop Recording
              </button>
            }
          </div>
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_recording" />
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div> }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ScreenRecorderComponent, { className: "ScreenRecorderComponent", filePath: "src/app/modules/video/21-screen-recorder/screenrecorder.component.ts", lineNumber: 88 });
})();
export {
  ScreenRecorderComponent
};
//# sourceMappingURL=chunk-TJ3CQZ64.js.map
