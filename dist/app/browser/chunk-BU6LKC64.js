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
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-3GKPD7AG.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-KWSTWQNB.js";

// src/app/modules/video/15-audio-extractor/audioExtractor.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  outputFormat: "mp3",
  bitrate: 192,
  waveformData: null,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var AudioExtractorActions = {
  loadFile: createAction("[AudioExtractor] Load File", props()),
  loadMetaSuccess: createAction("[AudioExtractor] Meta OK", props()),
  loadMetaFailure: createAction("[AudioExtractor] Meta Fail", props()),
  updateConfig: createAction("[AudioExtractor] Update Config", props()),
  startProcessing: createAction("[AudioExtractor] Start"),
  updateProgress: createAction("[AudioExtractor] Progress", props()),
  processingSuccess: createAction("[AudioExtractor] Success", props()),
  processingFailure: createAction("[AudioExtractor] Failure", props()),
  downloadOutput: createAction("[AudioExtractor] Download"),
  resetState: createAction("[AudioExtractor] Reset")
};
var audioExtractorFeature = createFeature({
  name: "audioExtractor",
  reducer: createReducer(init, on(AudioExtractorActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(AudioExtractorActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(AudioExtractorActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(AudioExtractorActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(AudioExtractorActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(AudioExtractorActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(AudioExtractorActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(AudioExtractorActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(AudioExtractorActions.resetState, () => init))
});
var { selectAudioExtractorState, selectStatus, selectProgress, selectOutputBlob } = audioExtractorFeature;
var selectAudioExtractorCanProcess = createSelector(selectAudioExtractorState, (s) => !!s.inputFile && s.status === "idle");
var selectAudioExtractorIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/15-audio-extractor/audioExtractor.component.ts
var _c0 = (a0) => [a0];
var _forTrack0 = ($index, $item) => $item.value;
function AudioExtractorComponent_Conditional_9_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 22);
    \u0275\u0275listener("click", function AudioExtractorComponent_Conditional_9_For_23_Template_button_click_0_listener() {
      const fmt_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.onFormatChange(fmt_r3.value));
    });
    \u0275\u0275elementStart(1, "span", 23);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 24);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 25);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const fmt_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-amber-500", ctx_r3.outputFormat === fmt_r3.value)("text-black", ctx_r3.outputFormat === fmt_r3.value)("border-amber-500", ctx_r3.outputFormat === fmt_r3.value)("shadow-[0_0_20px_rgba(245,158,11,0", ctx_r3.outputFormat === fmt_r3.value)("bg-white/5", ctx_r3.outputFormat !== fmt_r3.value)("text-white/60", ctx_r3.outputFormat !== fmt_r3.value)("border-white/10", ctx_r3.outputFormat !== fmt_r3.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fmt_r3.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fmt_r3.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fmt_r3.desc);
  }
}
function AudioExtractorComponent_Conditional_9_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 26);
    \u0275\u0275text(1, " Extracting Audio... ");
  }
}
function AudioExtractorComponent_Conditional_9_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F3B5} Extract Audio ");
  }
}
function AudioExtractorComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275text(10, "Audio Codec");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p", 16);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 13)(14, "p", 14);
    \u0275\u0275text(15, "Channels");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p", 16);
    \u0275\u0275text(17, "Stereo");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 17)(19, "label", 18);
    \u0275\u0275text(20, "Output Format");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 19);
    \u0275\u0275repeaterCreate(22, AudioExtractorComponent_Conditional_9_For_23_Template, 7, 17, "button", 20, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "button", 21);
    \u0275\u0275pipe(25, "async");
    \u0275\u0275pipe(26, "async");
    \u0275\u0275listener("click", function AudioExtractorComponent_Conditional_9_Template_button_click_24_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onProcess());
    });
    \u0275\u0275conditionalCreate(27, AudioExtractorComponent_Conditional_9_Conditional_27_Template, 2, 0);
    \u0275\u0275pipe(28, "async");
    \u0275\u0275conditionalBranchCreate(29, AudioExtractorComponent_Conditional_9_Conditional_29_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r5 = ctx;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 4, meta_r5.duration, "1.0-0"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(meta_r5.audioCodec || "N/A");
    \u0275\u0275advance(10);
    \u0275\u0275repeater(ctx_r3.audioFormats);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(25, 7, ctx_r3.canProcess$) || \u0275\u0275pipeBind1(26, 9, ctx_r3.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(28, 11, ctx_r3.isLoading$) ? 27 : 29);
  }
}
function AudioExtractorComponent_Conditional_11_Template(rf, ctx) {
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
function AudioExtractorComponent_Conditional_14_Template(rf, ctx) {
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
function AudioExtractorComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 27);
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
function AudioExtractorComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-export-panel", 11);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275pipe(2, "async");
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("outputBlob", ((tmp_1_0 = \u0275\u0275pipeBind1(1, 3, ctx_r3.state$)) == null ? null : tmp_1_0.outputBlob) ?? null)("outputSizeMB", ((tmp_2_0 = \u0275\u0275pipeBind1(2, 5, ctx_r3.state$)) == null ? null : tmp_2_0.outputSizeMB) ?? null)("availableFormats", \u0275\u0275pureFunction1(7, _c0, ctx_r3.outputFormat));
  }
}
var AudioExtractorComponent = class _AudioExtractorComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectAudioExtractorState);
  isLoading$ = this.store.select(selectAudioExtractorIsLoading);
  canProcess$ = this.store.select(selectAudioExtractorCanProcess);
  outputFormat = "mp3";
  audioFormats = [
    { value: "mp3", label: "MP3", icon: "\u{1F3B5}", desc: "Universal" },
    { value: "wav", label: "WAV", icon: "\u{1F3BC}", desc: "Lossless" },
    { value: "aac", label: "AAC", icon: "\u{1F50A}", desc: "Efficient" }
  ];
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(AudioExtractorActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(AudioExtractorActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(AudioExtractorActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onFormatChange(fmt) {
    this.outputFormat = fmt;
  }
  onProcess() {
    this.store.dispatch(AudioExtractorActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-WEAPADIC.js", import.meta.url), { type: "module" }), { file: state.inputFile, outputFormat: this.outputFormat }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(AudioExtractorActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const blob = msg.data;
          this.store.dispatch(AudioExtractorActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(AudioExtractorActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Audio extraction failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(AudioExtractorActions.resetState());
  }
  static \u0275fac = function AudioExtractorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AudioExtractorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AudioExtractorComponent, selectors: [["app-audio-extractor"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-amber-400", "to-yellow-200"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video file here or click to browse", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_audio", 3, "outputBlob", "outputSizeMB", "availableFormats"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-amber-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "space-y-2"], [1, "text-xs", "text-white/40", "uppercase", "tracking-wider"], [1, "grid", "grid-cols-3", "gap-3"], [1, "py-4", "rounded-xl", "text-center", "transition-all", "duration-200", "border", 3, "bg-amber-500", "text-black", "border-amber-500", "shadow-[0_0_20px_rgba(245,158,11,0", "bg-white/5", "text-white/60", "border-white/10"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-amber-500", "to-yellow-500", "text-black", "hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "py-4", "rounded-xl", "text-center", "transition-all", "duration-200", "border", 3, "click"], [1, "text-2xl", "block"], [1, "text-xs", "font-bold", "block", "mt-1"], [1, "text-[10px]", "block", "text-white/40", "mt-0.5"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Extracting...", 3, "progress", "size"]], template: function AudioExtractorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F3B5} Audio Extractor ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Extract audio track from video as MP3, WAV, or AAC");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function AudioExtractorComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, AudioExtractorComponent_Conditional_9_Template, 30, 13, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, AudioExtractorComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, AudioExtractorComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, AudioExtractorComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, AudioExtractorComponent_Conditional_18_Template, 3, 9, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AudioExtractorComponent, [{
    type: Component,
    args: [{
      selector: "app-audio-extractor",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
          \u{1F3B5} Audio Extractor
        </h1>
        <p class="text-white/50 text-sm">Extract audio track from video as MP3, WAV, or AAC</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-amber-400">{{ meta.duration | number:'1.0-0' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Audio Codec</p>
                  <p class="text-sm font-semibold text-white">{{ meta.audioCodec || 'N/A' }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Channels</p>
                  <p class="text-sm font-semibold text-white">Stereo</p>
                </div>
              </div>

              <!-- Output Format -->
              <div class="space-y-2">
                <label class="text-xs text-white/40 uppercase tracking-wider">Output Format</label>
                <div class="grid grid-cols-3 gap-3">
                  @for (fmt of audioFormats; track fmt.value) {
                    <button (click)="onFormatChange(fmt.value)"
                      class="py-4 rounded-xl text-center transition-all duration-200 border"
                      [class.bg-amber-500]="outputFormat === fmt.value"
                      [class.text-black]="outputFormat === fmt.value"
                      [class.border-amber-500]="outputFormat === fmt.value"
                      [class.shadow-[0_0_20px_rgba(245,158,11,0.3)]]="outputFormat === fmt.value"
                      [class.bg-white/5]="outputFormat !== fmt.value"
                      [class.text-white/60]="outputFormat !== fmt.value"
                      [class.border-white/10]="outputFormat !== fmt.value">
                      <span class="text-2xl block">{{ fmt.icon }}</span>
                      <span class="text-xs font-bold block mt-1">{{ fmt.label }}</span>
                      <span class="text-[10px] block text-white/40 mt-0.5">{{ fmt.desc }}</span>
                    </button>
                  }
                </div>
              </div>

              <button [disabled]="!(canProcess$ | async) || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Extracting Audio...
                } @else { \u{1F3B5} Extract Audio }
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
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Extracting..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              [availableFormats]="[outputFormat]" defaultFilename="omni_audio" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AudioExtractorComponent, { className: "AudioExtractorComponent", filePath: "src/app/modules/video/15-audio-extractor/audioextractor.component.ts", lineNumber: 102 });
})();
export {
  AudioExtractorComponent
};
//# sourceMappingURL=chunk-BU6LKC64.js.map
