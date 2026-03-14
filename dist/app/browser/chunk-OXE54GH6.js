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
} from "./chunk-7JJGW6JN.js";
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
  CommonModule
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
  ɵɵpureFunction6,
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

// src/app/modules/audio/20-channel-mixer/channel-mixer.service.ts
var ChannelMixerService = class _ChannelMixerService {
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
  static \u0275fac = function ChannelMixerService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChannelMixerService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ChannelMixerService, factory: _ChannelMixerService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChannelMixerService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/modules/audio/20-channel-mixer/channel-mixer.store.ts
var initialState = {
  inputFile: null,
  audioMeta: null,
  waveformData: null,
  operation: "toMono",
  monoMode: "average",
  outputFormat: "wav",
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var channelMixerActions = createActionGroup({
  source: "ChannelMixer",
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
var channelMixerFeature = createFeature({
  name: "channelMixer",
  reducer: createReducer(initialState, on(channelMixerActions.loadFile, (s, { file }) => __spreadProps(__spreadValues({}, s), { inputFile: file, status: "loading", errorCode: null, errorMessage: null })), on(channelMixerActions.loadFileSuccess, (s, { meta, waveformData }) => __spreadProps(__spreadValues({}, s), { audioMeta: meta, waveformData, status: "idle" })), on(channelMixerActions.loadFileFailure, (s, { errorCode, message }) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode, errorMessage: message, retryable: true })), on(channelMixerActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, errorCode: null, errorMessage: null })), on(channelMixerActions.updateProgress, (s, { value }) => __spreadProps(__spreadValues({}, s), { progress: value })), on(channelMixerActions.processingSuccess, (s, { outputBlob, outputSizeMB }) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob, outputSizeMB })), on(channelMixerActions.processingFailure, (s, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode, errorMessage: message, retryable })), on(channelMixerActions.resetState, () => initialState))
});
var ChannelMixerEffects = class _ChannelMixerEffects {
  actions$ = inject(Actions);
  store = inject(Store);
  svc = inject(ChannelMixerService);
  bridge = inject(AudioWorkerBridgeService);
  loadFile$ = createEffect(() => this.actions$.pipe(ofType(channelMixerActions.loadFile), switchMap(({ file }) => from(this.svc.decodeAndAnalyze(file)).pipe(map(({ meta, waveformData }) => channelMixerActions.loadFileSuccess({ meta, waveformData })), catchError((err) => of(channelMixerActions.loadFileFailure({ errorCode: "DECODE_FAILED", message: err?.message ?? "Decode failed" })))))));
  startProcessing$ = createEffect(() => this.actions$.pipe(ofType(channelMixerActions.startProcessing), withLatestFrom(this.store.select(channelMixerFeature.selectChannelMixerState)), exhaustMap(([, state]) => {
    if (!state.inputFile)
      return of(channelMixerActions.processingFailure({ errorCode: "INVALID_PARAMS", message: "No input file", retryable: true }));
    return from(this.svc.processAudio(state.inputFile, {})).pipe(map((blob) => channelMixerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 })), catchError((err) => of(channelMixerActions.processingFailure({ errorCode: "WORKER_CRASHED", message: err?.message ?? "Processing failed", retryable: true }))));
  })));
  download$ = createEffect(() => this.actions$.pipe(ofType(channelMixerActions.downloadOutput), withLatestFrom(this.store.select(channelMixerFeature.selectChannelMixerState)), tap(([, state]) => {
    if (state.outputBlob && state.inputFile) {
      this.bridge.downloadBlob(state.outputBlob, "omni_channel_mixer_" + state.inputFile.name.replace(/\.[^.]+$/, "") + ".wav");
    }
  })), { dispatch: false });
  static \u0275fac = function ChannelMixerEffects_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChannelMixerEffects)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ChannelMixerEffects, factory: _ChannelMixerEffects.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChannelMixerEffects, [{
    type: Injectable
  }], null, null);
})();

// src/app/modules/audio/20-channel-mixer/channel-mixer.component.ts
var _c0 = () => ["toMono", "Stereo\u2192Mono"];
var _c1 = () => ["toStereo", "Mono\u2192Stereo"];
var _c2 = () => ["swapLR", "Swap L/R"];
var _c3 = () => ["extractL", "Extract L"];
var _c4 = () => ["extractR", "Extract R"];
var _c5 = () => ["midSideEncode", "M/S Encode"];
var _c6 = (a0, a1, a2, a3, a4, a5) => [a0, a1, a2, a3, a4, a5];
var _forTrack0 = ($index, $item) => $item[0];
function ChannelMixerComponent_Conditional_12_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function ChannelMixerComponent_Conditional_12_For_5_Template_button_click_0_listener() {
      const op_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.localChOp = op_r2[0]);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const op_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-cyan-500", ctx_r2.localChOp === op_r2[0])("bg-white/5", ctx_r2.localChOp !== op_r2[0]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(op_r2[1]);
  }
}
function ChannelMixerComponent_Conditional_12_Conditional_7_Template(rf, ctx) {
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
function ChannelMixerComponent_Conditional_12_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275listener("click", function ChannelMixerComponent_Conditional_12_Conditional_10_Template_button_click_0_listener() {
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
function ChannelMixerComponent_Conditional_12_Conditional_11_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275listener("click", function ChannelMixerComponent_Conditional_12_Conditional_11_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.onProcess());
    });
    \u0275\u0275text(1, "Retry");
    \u0275\u0275elementEnd();
  }
}
function ChannelMixerComponent_Conditional_12_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275conditionalCreate(3, ChannelMixerComponent_Conditional_12_Conditional_11_Conditional_3_Template, 2, 0, "button", 18);
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
function ChannelMixerComponent_Conditional_12_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "app-audio-player", 20);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275elementStart(2, "app-audio-export-panel", 21);
    \u0275\u0275pipe(3, "async");
    \u0275\u0275pipe(4, "async");
    \u0275\u0275listener("download", function ChannelMixerComponent_Conditional_12_Conditional_13_Template_app_audio_export_panel_download_2_listener() {
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
function ChannelMixerComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "app-waveform-display", 9);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275elementStart(3, "div", 10);
    \u0275\u0275repeaterCreate(4, ChannelMixerComponent_Conditional_12_For_5_Template, 2, 5, "button", 11, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 2);
    \u0275\u0275conditionalCreate(7, ChannelMixerComponent_Conditional_12_Conditional_7_Template, 4, 3);
    \u0275\u0275pipe(8, "async");
    \u0275\u0275pipe(9, "async");
    \u0275\u0275conditionalBranchCreate(10, ChannelMixerComponent_Conditional_12_Conditional_10_Template, 3, 3, "button", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, ChannelMixerComponent_Conditional_12_Conditional_11_Template, 5, 6, "div", 13);
    \u0275\u0275pipe(12, "async");
    \u0275\u0275conditionalCreate(13, ChannelMixerComponent_Conditional_12_Conditional_13_Template, 5, 9);
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
    \u0275\u0275repeater(\u0275\u0275pureFunction6(20, _c6, \u0275\u0275pureFunction0(14, _c0), \u0275\u0275pureFunction0(15, _c1), \u0275\u0275pureFunction0(16, _c2), \u0275\u0275pureFunction0(17, _c3), \u0275\u0275pureFunction0(18, _c4), \u0275\u0275pureFunction0(19, _c5)));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(((tmp_3_0 = \u0275\u0275pipeBind1(8, 6, ctx_r2.state$)) == null ? null : tmp_3_0.status) === "processing" || ((tmp_3_0 = \u0275\u0275pipeBind1(9, 8, ctx_r2.state$)) == null ? null : tmp_3_0.status) === "rendering" ? 7 : 10);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_4_0 = \u0275\u0275pipeBind1(12, 10, ctx_r2.state$)) == null ? null : tmp_4_0.status) === "error" ? 11 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_5_0 = \u0275\u0275pipeBind1(14, 12, ctx_r2.state$)) == null ? null : tmp_5_0.outputBlob) ? 13 : -1);
  }
}
var ChannelMixerComponent = class _ChannelMixerComponent {
  store = inject(Store);
  destroyRef = inject(DestroyRef);
  state$ = this.store.select(channelMixerFeature.selectChannelMixerState);
  localChOp = "toMono";
  onFilesSelected(files) {
    this.store.dispatch(channelMixerActions.loadFile({ file: files[0] }));
  }
  onProcess() {
    this.store.dispatch(channelMixerActions.startProcessing());
  }
  onDownload() {
    this.store.dispatch(channelMixerActions.downloadOutput());
  }
  ngOnDestroy() {
    this.store.dispatch(channelMixerActions.resetState());
  }
  static \u0275fac = function ChannelMixerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChannelMixerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChannelMixerComponent, selectors: [["app-20-channel-mixer"]], decls: 14, vars: 4, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6"], [1, "max-w-4xl", "mx-auto", "space-y-6"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-xl", "bg-gradient-to-br", "from-cyan-500/20", "to-purple-500/20", "flex", "items-center", "justify-center", "border", "border-white/10"], [1, "text-2xl"], [1, "text-xl", "font-bold", "text-white"], [1, "text-sm", "text-white/40"], [3, "filesSelected", "multiple"], [1, "bg-[#12121a]", "rounded-2xl", "p-6", "border", "border-white/5", "space-y-4"], [3, "waveformData"], [1, "grid", "grid-cols-2", "gap-2"], [1, "px-3", "py-2", "rounded-lg", "text-xs", "text-left", 3, "bg-cyan-500", "bg-white/5"], [1, "flex-1", "py-3", "rounded-xl", "bg-gradient-to-r", "from-cyan-500", "to-purple-500", "text-white", "font-bold", "text-sm", "hover:opacity-90", "transition-opacity", 3, "disabled"], [1, "bg-red-500/10", "border", "border-red-500/30", "rounded-xl", "p-4", "text-red-400", "text-sm"], [1, "px-3", "py-2", "rounded-lg", "text-xs", "text-left", 3, "click"], [3, "progress"], [1, "text-sm", "text-white/50"], [1, "flex-1", "py-3", "rounded-xl", "bg-gradient-to-r", "from-cyan-500", "to-purple-500", "text-white", "font-bold", "text-sm", "hover:opacity-90", "transition-opacity", 3, "click", "disabled"], [1, "ml-3", "underline"], [1, "ml-3", "underline", 3, "click"], [3, "audioBlob"], [3, "download", "disabled", "outputSizeMB"]], template: function ChannelMixerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "span", 4);
      \u0275\u0275text(5, "\u{1F3B5}");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div")(7, "h1", 5);
      \u0275\u0275text(8, "Channel Mixer");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 6);
      \u0275\u0275text(10, "Convert mono/stereo, swap L/R, extract channels");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "app-audio-drop-zone", 7);
      \u0275\u0275listener("filesSelected", function ChannelMixerComponent_Template_app_audio_drop_zone_filesSelected_11_listener($event) {
        return ctx.onFilesSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(12, ChannelMixerComponent_Conditional_12_Template, 15, 27);
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
  }, dependencies: [CommonModule, FormsModule, AudioDropZoneComponent, AudioPlayerComponent, AudioExportPanelComponent, AudioProgressRingComponent, WaveformDisplayComponent, AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChannelMixerComponent, [{
    type: Component,
    args: [{
      selector: "app-20-channel-mixer",
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
            <h1 class="text-xl font-bold text-white">Channel Mixer</h1>
            <p class="text-sm text-white/40">Convert mono/stereo, swap L/R, extract channels</p>
          </div>
        </div>

        <!-- Drop Zone -->
        <app-audio-drop-zone (filesSelected)="onFilesSelected($event)"
          [multiple]="false"></app-audio-drop-zone>

        <!-- Controls -->
        @if ((state$ | async)?.inputFile) {
          <div class="bg-[#12121a] rounded-2xl p-6 border border-white/5 space-y-4">
            <app-waveform-display [waveformData]="(state$ | async)?.waveformData ?? null"></app-waveform-display>
            <div class="grid grid-cols-2 gap-2">@for(op of [['toMono','Stereo\u2192Mono'],['toStereo','Mono\u2192Stereo'],['swapLR','Swap L/R'],['extractL','Extract L'],['extractR','Extract R'],['midSideEncode','M/S Encode']];track op[0]){<button class="px-3 py-2 rounded-lg text-xs text-left" [class.bg-cyan-500]="localChOp===op[0]" [class.bg-white/5]="localChOp!==op[0]" (click)="localChOp=op[0]">{{op[1]}}</button>}</div>
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChannelMixerComponent, { className: "ChannelMixerComponent", filePath: "src/app/modules/audio/20-channel-mixer/channel-mixer.component.ts", lineNumber: 79 });
})();
export {
  ChannelMixerComponent
};
//# sourceMappingURL=chunk-OXE54GH6.js.map
