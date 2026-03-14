import {
  AudioContextService,
  AudioDropZoneComponent,
  AudioExportPanelComponent,
  AudioPlayerComponent,
  AudioProgressRingComponent,
  AudioWorkerBridgeService,
  FFmpegAudioService,
  FormsModule,
  OfflineRendererService,
  WaveformDisplayComponent
} from "./chunk-GMZBUNBF.js";
import {
  Actions,
  createEffect,
  ofType
} from "./chunk-UO3JI5KX.js";
import "./chunk-LDUFDWZC.js";
import "./chunk-E5UMSLFW.js";
import {
  Store,
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
  on,
  props
} from "./chunk-KGVNL5XR.js";
import {
  AsyncPipe,
  CommonModule,
  TitleCasePipe
} from "./chunk-UWT53CRV.js";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injectable,
  catchError,
  exhaustMap,
  from,
  inject,
  map,
  of,
  setClassMetadata,
  switchMap,
  tap,
  withLatestFrom,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalBranchCreate,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
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

// src/app/modules/audio/15-analyser/analyser.service.ts
var AudioAnalyserService = class _AudioAnalyserService {
  audioCtx = inject(AudioContextService);
  renderer = inject(OfflineRendererService);
  ffmpeg = inject(FFmpegAudioService);
  async decodeAndAnalyze(file) {
    const buffer = await this.audioCtx.decodeFile(file);
    const peaks = this.audioCtx.buildWaveformPeaks(buffer);
    const meta = {
      filename: file.name,
      fileSizeMB: file.size / 1048576,
      duration: buffer.duration,
      sampleRate: buffer.sampleRate,
      channels: buffer.numberOfChannels,
      bitDepth: 16,
      bitrate: 0,
      codec: "pcm",
      hasVideo: false
    };
    const waveformData = { peaks, duration: buffer.duration, sampleRate: buffer.sampleRate };
    return { meta, waveformData };
  }
  async processAudio(file, config) {
    const buffer = await this.audioCtx.decodeFile(file);
    const wavData = this.renderer.encodeToWav(buffer);
    return new Blob([new Uint8Array(wavData)], { type: "audio/wav" });
  }
  static \u0275fac = function AudioAnalyserService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AudioAnalyserService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AudioAnalyserService, factory: _AudioAnalyserService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AudioAnalyserService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/modules/audio/15-analyser/analyser.store.ts
var initialState = {
  inputFile: null,
  audioMeta: null,
  waveformData: null,
  activeTab: "waveform",
  integratedLUFS: null,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var audioAnalyserActions = createActionGroup({
  source: "AudioAnalyser",
  events: {
    "Load File": props(),
    "Load File Success": props(),
    "Load File Failure": props(),
    "Start Processing": emptyProps(),
    "Update Progress": props(),
    "Processing Success": props(),
    "Processing Failure": props(),
    "Download Output": emptyProps(),
    "Reset State": emptyProps()
  }
});
var audioAnalyserFeature = createFeature({
  name: "audioAnalyser",
  reducer: createReducer(initialState, on(audioAnalyserActions.loadFile, (s, { file }) => __spreadProps(__spreadValues({}, s), { inputFile: file, status: "loading", errorCode: null, errorMessage: null })), on(audioAnalyserActions.loadFileSuccess, (s, { meta, waveformData }) => __spreadProps(__spreadValues({}, s), { audioMeta: meta, waveformData, status: "idle" })), on(audioAnalyserActions.loadFileFailure, (s, { errorCode, message }) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode, errorMessage: message, retryable: true })), on(audioAnalyserActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, errorCode: null, errorMessage: null })), on(audioAnalyserActions.updateProgress, (s, { value }) => __spreadProps(__spreadValues({}, s), { progress: value })), on(audioAnalyserActions.processingSuccess, (s, { outputBlob, outputSizeMB }) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob, outputSizeMB })), on(audioAnalyserActions.processingFailure, (s, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode, errorMessage: message, retryable })), on(audioAnalyserActions.resetState, () => initialState))
});
var AudioAnalyserEffects = class _AudioAnalyserEffects {
  actions$ = inject(Actions);
  store = inject(Store);
  svc = inject(AudioAnalyserService);
  bridge = inject(AudioWorkerBridgeService);
  loadFile$ = createEffect(() => this.actions$.pipe(ofType(audioAnalyserActions.loadFile), switchMap(({ file }) => from(this.svc.decodeAndAnalyze(file)).pipe(map(({ meta, waveformData }) => audioAnalyserActions.loadFileSuccess({ meta, waveformData })), catchError((err) => of(audioAnalyserActions.loadFileFailure({ errorCode: "DECODE_FAILED", message: err?.message ?? "Decode failed" })))))));
  startProcessing$ = createEffect(() => this.actions$.pipe(ofType(audioAnalyserActions.startProcessing), withLatestFrom(this.store.select(audioAnalyserFeature.selectAudioAnalyserState)), exhaustMap(([, state]) => {
    if (!state.inputFile)
      return of(audioAnalyserActions.processingFailure({ errorCode: "INVALID_PARAMS", message: "No input file", retryable: true }));
    return from(this.svc.processAudio(state.inputFile, {})).pipe(map((blob) => audioAnalyserActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 })), catchError((err) => of(audioAnalyserActions.processingFailure({ errorCode: "WORKER_CRASHED", message: err?.message ?? "Processing failed", retryable: true }))));
  })));
  download$ = createEffect(() => this.actions$.pipe(ofType(audioAnalyserActions.downloadOutput), withLatestFrom(this.store.select(audioAnalyserFeature.selectAudioAnalyserState)), tap(([, state]) => {
    if (state.outputBlob && state.inputFile) {
      this.bridge.downloadBlob(state.outputBlob, "omni_analyser_" + state.inputFile.name.replace(/\.[^.]+$/, "") + ".wav");
    }
  })), { dispatch: false });
  static \u0275fac = function AudioAnalyserEffects_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AudioAnalyserEffects)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AudioAnalyserEffects, factory: _AudioAnalyserEffects.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AudioAnalyserEffects, [{
    type: Injectable
  }], null, null);
})();

// src/app/modules/audio/15-analyser/analyser.component.ts
var _c0 = () => ["waveform", "spectrogram", "spectrum", "loudness"];
function AudioAnalyserComponent_Conditional_12_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function AudioAnalyserComponent_Conditional_12_For_5_Template_button_click_0_listener() {
      const tab_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.localTab = tab_r2);
    });
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "titlecase");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tab_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-cyan-500", ctx_r2.localTab === tab_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 3, tab_r2));
  }
}
function AudioAnalyserComponent_Conditional_12_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-audio-progress-ring", 15);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275elementStart(2, "span", 16);
    \u0275\u0275text(3, "Processing...");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("progress", ((tmp_2_0 = \u0275\u0275pipeBind1(1, 1, ctx_r2.state$)) == null ? null : tmp_2_0.progress) ?? 0);
  }
}
function AudioAnalyserComponent_Conditional_12_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275listener("click", function AudioAnalyserComponent_Conditional_12_Conditional_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onProcess());
    });
    \u0275\u0275text(2, " \u26A1 Process ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ((tmp_2_0 = \u0275\u0275pipeBind1(1, 1, ctx_r2.state$)) == null ? null : tmp_2_0.status) !== "idle");
  }
}
function AudioAnalyserComponent_Conditional_12_Conditional_11_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275listener("click", function AudioAnalyserComponent_Conditional_12_Conditional_11_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onProcess());
    });
    \u0275\u0275text(1, "Retry");
    \u0275\u0275elementEnd();
  }
}
function AudioAnalyserComponent_Conditional_12_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275conditionalCreate(3, AudioAnalyserComponent_Conditional_12_Conditional_11_Conditional_3_Template, 2, 0, "button", 18);
    \u0275\u0275pipe(4, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", (tmp_2_0 = \u0275\u0275pipeBind1(2, 2, ctx_r2.state$)) == null ? null : tmp_2_0.errorMessage, " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_3_0 = \u0275\u0275pipeBind1(4, 4, ctx_r2.state$)) == null ? null : tmp_3_0.retryable) ? 3 : -1);
  }
}
function AudioAnalyserComponent_Conditional_12_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "app-audio-player", 20);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275elementStart(2, "app-audio-export-panel", 21);
    \u0275\u0275pipe(3, "async");
    \u0275\u0275pipe(4, "async");
    \u0275\u0275listener("download", function AudioAnalyserComponent_Conditional_12_Conditional_13_Template_app_audio_export_panel_download_2_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onDownload());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("audioBlob", ((tmp_2_0 = \u0275\u0275pipeBind1(1, 3, ctx_r2.state$)) == null ? null : tmp_2_0.outputBlob) ?? null);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !((tmp_3_0 = \u0275\u0275pipeBind1(3, 5, ctx_r2.state$)) == null ? null : tmp_3_0.outputBlob))("outputSizeMB", ((tmp_4_0 = \u0275\u0275pipeBind1(4, 7, ctx_r2.state$)) == null ? null : tmp_4_0.outputSizeMB) ?? null);
  }
}
function AudioAnalyserComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "app-waveform-display", 9);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275elementStart(3, "div", 10);
    \u0275\u0275repeaterCreate(4, AudioAnalyserComponent_Conditional_12_For_5_Template, 3, 5, "button", 11, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 2);
    \u0275\u0275conditionalCreate(7, AudioAnalyserComponent_Conditional_12_Conditional_7_Template, 4, 3);
    \u0275\u0275pipe(8, "async");
    \u0275\u0275pipe(9, "async");
    \u0275\u0275conditionalBranchCreate(10, AudioAnalyserComponent_Conditional_12_Conditional_10_Template, 3, 3, "button", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, AudioAnalyserComponent_Conditional_12_Conditional_11_Template, 5, 6, "div", 13);
    \u0275\u0275pipe(12, "async");
    \u0275\u0275conditionalCreate(13, AudioAnalyserComponent_Conditional_12_Conditional_13_Template, 5, 9);
    \u0275\u0275pipe(14, "async");
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("waveformData", ((tmp_1_0 = \u0275\u0275pipeBind1(2, 4, ctx_r2.state$)) == null ? null : tmp_1_0.waveformData) ?? null);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(\u0275\u0275pureFunction0(14, _c0));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(((tmp_3_0 = \u0275\u0275pipeBind1(8, 6, ctx_r2.state$)) == null ? null : tmp_3_0.status) === "processing" || ((tmp_3_0 = \u0275\u0275pipeBind1(9, 8, ctx_r2.state$)) == null ? null : tmp_3_0.status) === "rendering" ? 7 : 10);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_4_0 = \u0275\u0275pipeBind1(12, 10, ctx_r2.state$)) == null ? null : tmp_4_0.status) === "error" ? 11 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_5_0 = \u0275\u0275pipeBind1(14, 12, ctx_r2.state$)) == null ? null : tmp_5_0.outputBlob) ? 13 : -1);
  }
}
var AudioAnalyserComponent = class _AudioAnalyserComponent {
  store = inject(Store);
  destroyRef = inject(DestroyRef);
  state$ = this.store.select(audioAnalyserFeature.selectAudioAnalyserState);
  localTab = "waveform";
  onFilesSelected(files) {
    this.store.dispatch(audioAnalyserActions.loadFile({ file: files[0] }));
  }
  onProcess() {
    this.store.dispatch(audioAnalyserActions.startProcessing());
  }
  onDownload() {
    this.store.dispatch(audioAnalyserActions.downloadOutput());
  }
  ngOnDestroy() {
    this.store.dispatch(audioAnalyserActions.resetState());
  }
  static \u0275fac = function AudioAnalyserComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AudioAnalyserComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AudioAnalyserComponent, selectors: [["app-15-analyser"]], decls: 14, vars: 4, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6"], [1, "max-w-4xl", "mx-auto", "space-y-6"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-xl", "bg-gradient-to-br", "from-cyan-500/20", "to-purple-500/20", "flex", "items-center", "justify-center", "border", "border-white/10"], [1, "text-2xl"], [1, "text-xl", "font-bold", "text-white"], [1, "text-sm", "text-white/40"], [3, "filesSelected", "multiple"], [1, "bg-[#12121a]", "rounded-2xl", "p-6", "border", "border-white/5", "space-y-4"], [3, "waveformData"], [1, "flex", "gap-2", "mb-4"], [1, "px-3", "py-1.5", "rounded-lg", "text-xs", 3, "bg-cyan-500"], [1, "flex-1", "py-3", "rounded-xl", "bg-gradient-to-r", "from-cyan-500", "to-purple-500", "text-white", "font-bold", "text-sm", "hover:opacity-90", "transition-opacity", 3, "disabled"], [1, "bg-red-500/10", "border", "border-red-500/30", "rounded-xl", "p-4", "text-red-400", "text-sm"], [1, "px-3", "py-1.5", "rounded-lg", "text-xs", 3, "click"], [3, "progress"], [1, "text-sm", "text-white/50"], [1, "flex-1", "py-3", "rounded-xl", "bg-gradient-to-r", "from-cyan-500", "to-purple-500", "text-white", "font-bold", "text-sm", "hover:opacity-90", "transition-opacity", 3, "click", "disabled"], [1, "ml-3", "underline"], [1, "ml-3", "underline", 3, "click"], [3, "audioBlob"], [3, "download", "disabled", "outputSizeMB"]], template: function AudioAnalyserComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "span", 4);
      \u0275\u0275text(5, "\u{1F3B5}");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div")(7, "h1", 5);
      \u0275\u0275text(8, "Audio Analyser");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 6);
      \u0275\u0275text(10, "Waveform, spectrogram, spectrum, and loudness analysis");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "app-audio-drop-zone", 7);
      \u0275\u0275listener("filesSelected", function AudioAnalyserComponent_Template_app_audio_drop_zone_filesSelected_11_listener($event) {
        return ctx.onFilesSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(12, AudioAnalyserComponent_Conditional_12_Template, 15, 15);
      \u0275\u0275pipe(13, "async");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance(11);
      \u0275\u0275property("multiple", false);
      \u0275\u0275advance();
      \u0275\u0275conditional(((tmp_1_0 = \u0275\u0275pipeBind1(13, 2, ctx.state$)) == null ? null : tmp_1_0.inputFile) ? 12 : -1);
    }
  }, dependencies: [CommonModule, FormsModule, AudioDropZoneComponent, AudioPlayerComponent, AudioExportPanelComponent, AudioProgressRingComponent, WaveformDisplayComponent, AsyncPipe, TitleCasePipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AudioAnalyserComponent, [{
    type: Component,
    args: [{
      selector: "app-15-analyser",
      standalone: true,
      imports: [CommonModule, FormsModule, AudioDropZoneComponent, AudioPlayerComponent, AudioExportPanelComponent, AudioProgressRingComponent, WaveformDisplayComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Header -->
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
            <span class="text-2xl">\u{1F3B5}</span>
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">Audio Analyser</h1>
            <p class="text-sm text-white/40">Waveform, spectrogram, spectrum, and loudness analysis</p>
          </div>
        </div>

        <!-- Drop Zone -->
        <app-audio-drop-zone (filesSelected)="onFilesSelected($event)"
          [multiple]="false"></app-audio-drop-zone>

        <!-- Controls -->
        @if ((state$ | async)?.inputFile) {
          <div class="bg-[#12121a] rounded-2xl p-6 border border-white/5 space-y-4">
            <app-waveform-display [waveformData]="(state$ | async)?.waveformData ?? null"></app-waveform-display>
            <div class="flex gap-2 mb-4">@for(tab of ['waveform','spectrogram','spectrum','loudness'];track tab){<button class="px-3 py-1.5 rounded-lg text-xs" [class.bg-cyan-500]="localTab===tab" (click)="localTab=tab">{{tab|titlecase}}</button>}</div>
          </div>

          <!-- Processing -->
          <div class="flex items-center gap-4">
            @if ((state$ | async)?.status === 'processing' || (state$ | async)?.status === 'rendering') {
              <app-audio-progress-ring [progress]="(state$ | async)?.progress ?? 0"></app-audio-progress-ring>
              <span class="text-sm text-white/50">Processing...</span>
            } @else {
              <button class="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
                      [disabled]="(state$ | async)?.status !== 'idle'" (click)="onProcess()">
                \u26A1 Process
              </button>
            }
          </div>

          <!-- Error -->
          @if ((state$ | async)?.status === 'error') {
            <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {{ (state$ | async)?.errorMessage }}
              @if ((state$ | async)?.retryable) {
                <button class="ml-3 underline" (click)="onProcess()">Retry</button>
              }
            </div>
          }

          <!-- Player + Export -->
          @if ((state$ | async)?.outputBlob) {
            <app-audio-player [audioBlob]="(state$ | async)?.outputBlob ?? null"></app-audio-player>
            <app-audio-export-panel [disabled]="!(state$ | async)?.outputBlob"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              (download)="onDownload()"></app-audio-export-panel>
          }
        }
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AudioAnalyserComponent, { className: "AudioAnalyserComponent", filePath: "src/app/modules/audio/15-analyser/analyser.component.ts", lineNumber: 79 });
})();
export {
  AudioAnalyserComponent
};
//# sourceMappingURL=chunk-TYDEEIKS.js.map
