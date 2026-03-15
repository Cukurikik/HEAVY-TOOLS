import './polyfills.server.mjs';
import {
  AudioContextService,
  AudioDropZoneComponent,
  AudioExportPanelComponent,
  AudioPlayerComponent,
  AudioProgressRingComponent,
  AudioWorkerBridgeService,
  DefaultValueAccessor,
  FFmpegAudioService,
  FormsModule,
  NgControlStatus,
  NgModel,
  OfflineRendererService,
  RangeValueAccessor,
  WaveformDisplayComponent
} from "./chunk-XX4RG26Z.mjs";
import {
  Actions,
  createEffect,
  ofType
} from "./chunk-QYVPZRB4.mjs";
import {
  Store,
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
  on,
  props
} from "./chunk-GPJTNT77.mjs";
import {
  AsyncPipe,
  CommonModule
} from "./chunk-PHM5A5ZP.mjs";
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
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-CX47CWGJ.mjs";
import "./chunk-7JBYDEMK.mjs";
import "./chunk-FKVKDVZ6.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-UFAUNXOA.mjs";

// src/app/modules/audio/07-pitch-shifter/pitch-shifter.service.ts
var PitchShifterService = class _PitchShifterService {
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
  static \u0275fac = function PitchShifterService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PitchShifterService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PitchShifterService, factory: _PitchShifterService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PitchShifterService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/modules/audio/07-pitch-shifter/pitch-shifter.store.ts
var initialState = {
  inputFile: null,
  audioMeta: null,
  waveformData: null,
  semitones: 0,
  cents: 0,
  formantCorrection: false,
  outputFormat: "wav",
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var pitchShifterActions = createActionGroup({
  source: "PitchShifter",
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
var pitchShifterFeature = createFeature({
  name: "pitchShifter",
  reducer: createReducer(initialState, on(pitchShifterActions.loadFile, (s, { file }) => __spreadProps(__spreadValues({}, s), { inputFile: file, status: "loading", errorCode: null, errorMessage: null })), on(pitchShifterActions.loadFileSuccess, (s, { meta, waveformData }) => __spreadProps(__spreadValues({}, s), { audioMeta: meta, waveformData, status: "idle" })), on(pitchShifterActions.loadFileFailure, (s, { errorCode, message }) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode, errorMessage: message, retryable: true })), on(pitchShifterActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, errorCode: null, errorMessage: null })), on(pitchShifterActions.updateProgress, (s, { value }) => __spreadProps(__spreadValues({}, s), { progress: value })), on(pitchShifterActions.processingSuccess, (s, { outputBlob, outputSizeMB }) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob, outputSizeMB })), on(pitchShifterActions.processingFailure, (s, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode, errorMessage: message, retryable })), on(pitchShifterActions.resetState, () => initialState))
});
var PitchShifterEffects = class _PitchShifterEffects {
  actions$ = inject(Actions);
  store = inject(Store);
  svc = inject(PitchShifterService);
  bridge = inject(AudioWorkerBridgeService);
  loadFile$ = createEffect(() => this.actions$.pipe(ofType(pitchShifterActions.loadFile), switchMap(({ file }) => from(this.svc.decodeAndAnalyze(file)).pipe(map(({ meta, waveformData }) => pitchShifterActions.loadFileSuccess({ meta, waveformData })), catchError((err) => of(pitchShifterActions.loadFileFailure({ errorCode: "DECODE_FAILED", message: err?.message ?? "Decode failed" })))))));
  startProcessing$ = createEffect(() => this.actions$.pipe(ofType(pitchShifterActions.startProcessing), withLatestFrom(this.store.select(pitchShifterFeature.selectPitchShifterState)), exhaustMap(([, state]) => {
    if (!state.inputFile)
      return of(pitchShifterActions.processingFailure({ errorCode: "INVALID_PARAMS", message: "No input file", retryable: true }));
    return from(this.svc.processAudio(state.inputFile, {})).pipe(map((blob) => pitchShifterActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 })), catchError((err) => of(pitchShifterActions.processingFailure({ errorCode: "WORKER_CRASHED", message: err?.message ?? "Processing failed", retryable: true }))));
  })));
  download$ = createEffect(() => this.actions$.pipe(ofType(pitchShifterActions.downloadOutput), withLatestFrom(this.store.select(pitchShifterFeature.selectPitchShifterState)), tap(([, state]) => {
    if (state.outputBlob && state.inputFile) {
      this.bridge.downloadBlob(state.outputBlob, "omni_pitch_shifter_" + state.inputFile.name.replace(/\.[^.]+$/, "") + ".wav");
    }
  })), { dispatch: false });
  static \u0275fac = function PitchShifterEffects_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PitchShifterEffects)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PitchShifterEffects, factory: _PitchShifterEffects.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PitchShifterEffects, [{
    type: Injectable
  }], null, null);
})();

// src/app/modules/audio/07-pitch-shifter/pitch-shifter.component.ts
function PitchShifterComponent_Conditional_12_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-audio-progress-ring", 15);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275elementStart(2, "span", 16);
    \u0275\u0275text(3, "Processing...");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("progress", ((tmp_2_0 = \u0275\u0275pipeBind1(1, 1, ctx_r1.state$)) == null ? null : tmp_2_0.progress) ?? 0);
  }
}
function PitchShifterComponent_Conditional_12_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275listener("click", function PitchShifterComponent_Conditional_12_Conditional_13_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275text(2, " \u26A1 Process ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ((tmp_2_0 = \u0275\u0275pipeBind1(1, 1, ctx_r1.state$)) == null ? null : tmp_2_0.status) !== "idle");
  }
}
function PitchShifterComponent_Conditional_12_Conditional_14_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275listener("click", function PitchShifterComponent_Conditional_12_Conditional_14_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275text(1, "Retry");
    \u0275\u0275elementEnd();
  }
}
function PitchShifterComponent_Conditional_12_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275conditionalCreate(3, PitchShifterComponent_Conditional_12_Conditional_14_Conditional_3_Template, 2, 0, "button", 18);
    \u0275\u0275pipe(4, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", (tmp_2_0 = \u0275\u0275pipeBind1(2, 2, ctx_r1.state$)) == null ? null : tmp_2_0.errorMessage, " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_3_0 = \u0275\u0275pipeBind1(4, 4, ctx_r1.state$)) == null ? null : tmp_3_0.retryable) ? 3 : -1);
  }
}
function PitchShifterComponent_Conditional_12_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "app-audio-player", 20);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275elementStart(2, "app-audio-export-panel", 21);
    \u0275\u0275pipe(3, "async");
    \u0275\u0275pipe(4, "async");
    \u0275\u0275listener("download", function PitchShifterComponent_Conditional_12_Conditional_16_Template_app_audio_export_panel_download_2_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onDownload());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("audioBlob", ((tmp_2_0 = \u0275\u0275pipeBind1(1, 3, ctx_r1.state$)) == null ? null : tmp_2_0.outputBlob) ?? null);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !((tmp_3_0 = \u0275\u0275pipeBind1(3, 5, ctx_r1.state$)) == null ? null : tmp_3_0.outputBlob))("outputSizeMB", ((tmp_4_0 = \u0275\u0275pipeBind1(4, 7, ctx_r1.state$)) == null ? null : tmp_4_0.outputSizeMB) ?? null);
  }
}
function PitchShifterComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "app-waveform-display", 9);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275elementStart(3, "div")(4, "label", 10);
    \u0275\u0275text(5, "Semitones (-12 to +12)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "input", 11);
    \u0275\u0275twoWayListener("ngModelChange", function PitchShifterComponent_Conditional_12_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.localSemitones, $event) || (ctx_r1.localSemitones = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 12);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 2);
    \u0275\u0275conditionalCreate(10, PitchShifterComponent_Conditional_12_Conditional_10_Template, 4, 3);
    \u0275\u0275pipe(11, "async");
    \u0275\u0275pipe(12, "async");
    \u0275\u0275conditionalBranchCreate(13, PitchShifterComponent_Conditional_12_Conditional_13_Template, 3, 3, "button", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(14, PitchShifterComponent_Conditional_12_Conditional_14_Template, 5, 6, "div", 14);
    \u0275\u0275pipe(15, "async");
    \u0275\u0275conditionalCreate(16, PitchShifterComponent_Conditional_12_Conditional_16_Template, 5, 9);
    \u0275\u0275pipe(17, "async");
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("waveformData", ((tmp_1_0 = \u0275\u0275pipeBind1(2, 11, ctx_r1.state$)) == null ? null : tmp_1_0.waveformData) ?? null);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.localSemitones);
    \u0275\u0275advance();
    \u0275\u0275classProp("text-green-400", ctx_r1.localSemitones > 0)("text-red-400", ctx_r1.localSemitones < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r1.localSemitones > 0 ? "+" : "", "", ctx_r1.localSemitones, " st");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_6_0 = \u0275\u0275pipeBind1(11, 13, ctx_r1.state$)) == null ? null : tmp_6_0.status) === "processing" || ((tmp_6_0 = \u0275\u0275pipeBind1(12, 15, ctx_r1.state$)) == null ? null : tmp_6_0.status) === "rendering" ? 10 : 13);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_7_0 = \u0275\u0275pipeBind1(15, 17, ctx_r1.state$)) == null ? null : tmp_7_0.status) === "error" ? 14 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_8_0 = \u0275\u0275pipeBind1(17, 19, ctx_r1.state$)) == null ? null : tmp_8_0.outputBlob) ? 16 : -1);
  }
}
var PitchShifterComponent = class _PitchShifterComponent {
  store = inject(Store);
  destroyRef = inject(DestroyRef);
  state$ = this.store.select(pitchShifterFeature.selectPitchShifterState);
  localSemitones = 0;
  onFilesSelected(files) {
    this.store.dispatch(pitchShifterActions.loadFile({ file: files[0] }));
  }
  onProcess() {
    this.store.dispatch(pitchShifterActions.startProcessing());
  }
  onDownload() {
    this.store.dispatch(pitchShifterActions.downloadOutput());
  }
  ngOnDestroy() {
    this.store.dispatch(pitchShifterActions.resetState());
  }
  static \u0275fac = function PitchShifterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PitchShifterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PitchShifterComponent, selectors: [["app-07-pitch-shifter"]], decls: 14, vars: 4, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6"], [1, "max-w-4xl", "mx-auto", "space-y-6"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-xl", "bg-gradient-to-br", "from-cyan-500/20", "to-purple-500/20", "flex", "items-center", "justify-center", "border", "border-white/10"], [1, "text-2xl"], [1, "text-xl", "font-bold", "text-white"], [1, "text-sm", "text-white/40"], [3, "filesSelected", "multiple"], [1, "bg-[#12121a]", "rounded-2xl", "p-6", "border", "border-white/5", "space-y-4"], [3, "waveformData"], [1, "text-xs", "text-white/40"], ["type", "range", "min", "-12", "max", "12", "step", "1", 1, "w-full", "accent-purple-400", 3, "ngModelChange", "ngModel"], [1, "text-center", "text-lg", "font-bold"], [1, "flex-1", "py-3", "rounded-xl", "bg-gradient-to-r", "from-cyan-500", "to-purple-500", "text-white", "font-bold", "text-sm", "hover:opacity-90", "transition-opacity", 3, "disabled"], [1, "bg-red-500/10", "border", "border-red-500/30", "rounded-xl", "p-4", "text-red-400", "text-sm"], [3, "progress"], [1, "text-sm", "text-white/50"], [1, "flex-1", "py-3", "rounded-xl", "bg-gradient-to-r", "from-cyan-500", "to-purple-500", "text-white", "font-bold", "text-sm", "hover:opacity-90", "transition-opacity", 3, "click", "disabled"], [1, "ml-3", "underline"], [1, "ml-3", "underline", 3, "click"], [3, "audioBlob"], [3, "download", "disabled", "outputSizeMB"]], template: function PitchShifterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "span", 4);
      \u0275\u0275text(5, "\u{1F3B5}");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div")(7, "h1", 5);
      \u0275\u0275text(8, "Pitch Shifter");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 6);
      \u0275\u0275text(10, "Shift pitch without changing speed");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "app-audio-drop-zone", 7);
      \u0275\u0275listener("filesSelected", function PitchShifterComponent_Template_app_audio_drop_zone_filesSelected_11_listener($event) {
        return ctx.onFilesSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(12, PitchShifterComponent_Conditional_12_Template, 18, 21);
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
  }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, RangeValueAccessor, NgControlStatus, NgModel, AudioDropZoneComponent, AudioPlayerComponent, AudioExportPanelComponent, AudioProgressRingComponent, WaveformDisplayComponent, AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PitchShifterComponent, [{
    type: Component,
    args: [{
      selector: "app-07-pitch-shifter",
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
            <h1 class="text-xl font-bold text-white">Pitch Shifter</h1>
            <p class="text-sm text-white/40">Shift pitch without changing speed</p>
          </div>
        </div>

        <!-- Drop Zone -->
        <app-audio-drop-zone (filesSelected)="onFilesSelected($event)"
          [multiple]="false"></app-audio-drop-zone>

        <!-- Controls -->
        @if ((state$ | async)?.inputFile) {
          <div class="bg-[#12121a] rounded-2xl p-6 border border-white/5 space-y-4">
            <app-waveform-display [waveformData]="(state$ | async)?.waveformData ?? null"></app-waveform-display>
            <div><label class="text-xs text-white/40">Semitones (-12 to +12)</label><input type="range" class="w-full accent-purple-400" min="-12" max="12" step="1" [(ngModel)]="localSemitones"><p class="text-center text-lg font-bold" [class.text-green-400]="localSemitones>0" [class.text-red-400]="localSemitones<0">{{localSemitones > 0 ? '+' : ''}}{{localSemitones}} st</p></div>
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PitchShifterComponent, { className: "PitchShifterComponent", filePath: "src/app/modules/audio/07-pitch-shifter/pitch-shifter.component.ts", lineNumber: 79 });
})();
export {
  PitchShifterComponent
};
//# sourceMappingURL=chunk-44FVW5KY.mjs.map
