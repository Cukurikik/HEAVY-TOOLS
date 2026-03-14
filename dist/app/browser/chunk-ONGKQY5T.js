import {
  VideoPreviewComponent
} from "./chunk-SPI6KAK2.js";
import {
  FFmpegService
} from "./chunk-6QJMH4AU.js";
import {
  FileDropZoneComponent
} from "./chunk-GR2AEFM7.js";
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

// src/app/modules/video/29-analyser/analyser.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  metadata: null,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var AnalyserActions = {
  loadFile: createAction("[Analyser] Load File", props()),
  loadMetaSuccess: createAction("[Analyser] Meta OK", props()),
  loadMetaFailure: createAction("[Analyser] Meta Fail", props()),
  updateConfig: createAction("[Analyser] Update Config", props()),
  startProcessing: createAction("[Analyser] Start"),
  updateProgress: createAction("[Analyser] Progress", props()),
  processingSuccess: createAction("[Analyser] Success", props()),
  processingFailure: createAction("[Analyser] Failure", props()),
  downloadOutput: createAction("[Analyser] Download"),
  resetState: createAction("[Analyser] Reset")
};
var analyserFeature = createFeature({
  name: "analyser",
  reducer: createReducer(init, on(AnalyserActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(AnalyserActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(AnalyserActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(AnalyserActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(AnalyserActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(AnalyserActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(AnalyserActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(AnalyserActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(AnalyserActions.resetState, () => init))
});
var { selectAnalyserState, selectStatus, selectProgress, selectOutputBlob } = analyserFeature;
var selectAnalyserCanProcess = createSelector(selectAnalyserState, (s) => !!s.inputFile && s.status === "idle");
var selectAnalyserIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/29-analyser/analyser.component.ts
function AnalyserComponent_Conditional_9_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 19);
    \u0275\u0275text(1, " Analysing... ");
  }
}
function AnalyserComponent_Conditional_9_Conditional_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F52C} Deep Analysis (FFprobe) ");
  }
}
function AnalyserComponent_Conditional_9_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "h3", 20);
    \u0275\u0275text(2, "\u{1F4CB} Raw FFprobe Output");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "pre", 21);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.deepAnalysis);
  }
}
function AnalyserComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 10)(2, "h3", 11);
    \u0275\u0275text(3, "\u{1F3AC} Video Stream");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 12)(5, "div", 13)(6, "p", 14);
    \u0275\u0275text(7, "Codec");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 15);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 13)(11, "p", 14);
    \u0275\u0275text(12, "Resolution");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p", 15);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 13)(16, "p", 14);
    \u0275\u0275text(17, "Duration");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "p", 15);
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 13)(22, "p", 14);
    \u0275\u0275text(23, "Frame Rate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "p", 15);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 13)(27, "p", 14);
    \u0275\u0275text(28, "Bitrate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "p", 15);
    \u0275\u0275text(30);
    \u0275\u0275pipe(31, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 13)(33, "p", 14);
    \u0275\u0275text(34, "File Size");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "p", 15);
    \u0275\u0275text(36);
    \u0275\u0275pipe(37, "number");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(38, "div", 10)(39, "h3", 11);
    \u0275\u0275text(40, "\u{1F50A} Audio Stream");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "div", 12)(42, "div", 13)(43, "p", 14);
    \u0275\u0275text(44, "Audio Codec");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "p", 16);
    \u0275\u0275text(46);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "div", 13)(48, "p", 14);
    \u0275\u0275text(49, "Sample Rate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "p", 16);
    \u0275\u0275text(51);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(52, "div", 13)(53, "p", 14);
    \u0275\u0275text(54, "Channels");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "p", 16);
    \u0275\u0275text(56, "Stereo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(57, "div", 13)(58, "p", 14);
    \u0275\u0275text(59, "Audio Bitrate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "p", 16);
    \u0275\u0275text(61);
    \u0275\u0275pipe(62, "number");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(63, "button", 17);
    \u0275\u0275pipe(64, "async");
    \u0275\u0275listener("click", function AnalyserComponent_Conditional_9_Template_button_click_63_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onDeepAnalyse());
    });
    \u0275\u0275conditionalCreate(65, AnalyserComponent_Conditional_9_Conditional_65_Template, 2, 0);
    \u0275\u0275pipe(66, "async");
    \u0275\u0275conditionalBranchCreate(67, AnalyserComponent_Conditional_9_Conditional_67_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(68, AnalyserComponent_Conditional_9_Conditional_68_Template, 5, 1, "div", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const meta_r3 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(meta_r3.codec);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", meta_r3.width, "x", meta_r3.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(20, 13, meta_r3.duration, "1.2-2"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", meta_r3.fps, " FPS");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(meta_r3.bitrate ? \u0275\u0275pipeBind2(31, 16, meta_r3.bitrate / 1e3, "1.0-0") + " kbps" : "N/A");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(37, 19, ctx_r1.fileSize, "1.1-1"), " MB");
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(meta_r3.audioCodec ?? "N/A");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", meta_r3.sampleRate ?? "N/A", " Hz");
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(meta_r3.audioBitrate ? \u0275\u0275pipeBind2(62, 22, meta_r3.audioBitrate / 1e3, "1.0-0") + " kbps" : "N/A");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", \u0275\u0275pipeBind1(64, 25, ctx_r1.isLoading$));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(66, 27, ctx_r1.isLoading$) ? 65 : 67);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.deepAnalysis ? 68 : -1);
  }
}
function AnalyserComponent_Conditional_11_Template(rf, ctx) {
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
function AnalyserComponent_Conditional_14_Template(rf, ctx) {
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
var AnalyserComponent = class _AnalyserComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectAnalyserState);
  isLoading$ = this.store.select(selectAnalyserIsLoading);
  canProcess$ = this.store.select(selectAnalyserCanProcess);
  fileSize = 0;
  deepAnalysis = "";
  async onFileSelected(files) {
    const file = files[0];
    this.fileSize = file.size / 1048576;
    this.store.dispatch(AnalyserActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(AnalyserActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(AnalyserActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onDeepAnalyse() {
    this.store.dispatch(AnalyserActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-USXMV7DJ.js", import.meta.url), { type: "module" }), { file: state.inputFile, mode: "probe" }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(AnalyserActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const reader = new FileReader();
          reader.onload = () => {
            this.deepAnalysis = reader.result;
          };
          reader.readAsText(msg.data);
          this.store.dispatch(AnalyserActions.processingSuccess({ outputBlob: msg.data, outputSizeMB: 0 }));
        } else if (msg.type === "error") {
          this.store.dispatch(AnalyserActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Analysis failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(AnalyserActions.resetState());
  }
  static \u0275fac = function AnalyserComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AnalyserComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AnalyserComponent, selectors: [["app-analyser"]], decls: 16, vars: 9, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-slate-300", "to-zinc-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video to analyse", 3, "filesSelected"], [1, "space-y-3"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-3"], [1, "text-sm", "font-semibold", "text-white/80", "flex", "items-center", "gap-2"], [1, "grid", "grid-cols-2", "gap-2"], [1, "p-3", "rounded-xl", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-mono", "text-cyan-400"], [1, "text-sm", "font-mono", "text-green-400"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "bg-gradient-to-r", "from-slate-600", "to-zinc-600", "text-white", "hover:shadow-[0_0_20px_rgba(148,163,184,0.3)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin", "inline-block"], [1, "text-sm", "font-semibold", "text-white/80", "mb-2"], [1, "text-xs", "text-white/60", "font-mono", "overflow-x-auto", "max-h-60", "overflow-y-auto", "whitespace-pre-wrap"]], template: function AnalyserComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u{1F4CA} Video Analyser");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Deep analysis of video properties: codec, bitrate, frame rate, audio channels");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function AnalyserComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, AnalyserComponent_Conditional_9_Template, 69, 29, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, AnalyserComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, AnalyserComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_0_0;
      let tmp_1_0;
      let tmp_2_0;
      \u0275\u0275advance(9);
      \u0275\u0275conditional((tmp_0_0 = (tmp_0_0 = \u0275\u0275pipeBind1(10, 3, ctx.state$)) == null ? null : tmp_0_0.videoMeta) ? 9 : -1, tmp_0_0);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_1_0 = \u0275\u0275pipeBind1(12, 5, ctx.state$)) == null ? null : tmp_1_0.status) === "error" ? 11 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_2_0 = \u0275\u0275pipeBind1(15, 7, ctx.state$)) == null ? null : tmp_2_0.inputFile) ? 14 : -1);
    }
  }, dependencies: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, AsyncPipe, DecimalPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnalyserComponent, [{
    type: Component,
    args: [{
      selector: "app-analyser",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-zinc-400">\u{1F4CA} Video Analyser</h1>
        <p class="text-white/50 text-sm">Deep analysis of video properties: codec, bitrate, frame rate, audio channels</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video to analyse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="space-y-3">
              <!-- Video Info Cards -->
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h3 class="text-sm font-semibold text-white/80 flex items-center gap-2">\u{1F3AC} Video Stream</h3>
                <div class="grid grid-cols-2 gap-2">
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Codec</p><p class="text-sm font-mono text-cyan-400">{{ meta.codec }}</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Resolution</p><p class="text-sm font-mono text-cyan-400">{{ meta.width }}x{{ meta.height }}</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Duration</p><p class="text-sm font-mono text-cyan-400">{{ meta.duration | number:'1.2-2' }}s</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Frame Rate</p><p class="text-sm font-mono text-cyan-400">{{ meta.fps }} FPS</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Bitrate</p><p class="text-sm font-mono text-cyan-400">{{ meta.bitrate ? (meta.bitrate / 1000 | number:'1.0-0') + ' kbps' : 'N/A' }}</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">File Size</p><p class="text-sm font-mono text-cyan-400">{{ fileSize | number:'1.1-1' }} MB</p></div>
                </div>
              </div>

              <!-- Audio Info -->
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h3 class="text-sm font-semibold text-white/80 flex items-center gap-2">\u{1F50A} Audio Stream</h3>
                <div class="grid grid-cols-2 gap-2">
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Audio Codec</p><p class="text-sm font-mono text-green-400">{{ meta.audioCodec ?? 'N/A' }}</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Sample Rate</p><p class="text-sm font-mono text-green-400">{{ meta.sampleRate ?? 'N/A' }} Hz</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Channels</p><p class="text-sm font-mono text-green-400">Stereo</p></div>
                  <div class="p-3 rounded-xl bg-white/5"><p class="text-xs text-white/40">Audio Bitrate</p><p class="text-sm font-mono text-green-400">{{ meta.audioBitrate ? (meta.audioBitrate / 1000 | number:'1.0-0') + ' kbps' : 'N/A' }}</p></div>
                </div>
              </div>

              <!-- Additional Analysis -->
              <button [disabled]="(isLoading$ | async)" (click)="onDeepAnalyse()"
                class="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-slate-600 to-zinc-600 text-white hover:shadow-[0_0_20px_rgba(148,163,184,0.3)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></div> Analysing... } @else { \u{1F52C} Deep Analysis (FFprobe) }
              </button>

              @if (deepAnalysis) {
                <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h3 class="text-sm font-semibold text-white/80 mb-2">\u{1F4CB} Raw FFprobe Output</h3>
                  <pre class="text-xs text-white/60 font-mono overflow-x-auto max-h-60 overflow-y-auto whitespace-pre-wrap">{{ deepAnalysis }}</pre>
                </div>
              }
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) { <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" /> }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AnalyserComponent, { className: "AnalyserComponent", filePath: "src/app/modules/video/29-analyser/analyser.component.ts", lineNumber: 74 });
})();
export {
  AnalyserComponent
};
//# sourceMappingURL=chunk-ONGKQY5T.js.map
