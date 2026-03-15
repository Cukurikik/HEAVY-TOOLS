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
  MinValidator,
  NgControlStatus,
  NgModel,
  NumberValueAccessor,
  OfflineRendererService,
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

// src/app/modules/audio/02-trimmer/trimmer.service.ts
var TrimmerService = class _TrimmerService {
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
  static \u0275fac = function TrimmerService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TrimmerService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TrimmerService, factory: _TrimmerService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TrimmerService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/modules/audio/02-trimmer/trimmer.store.ts
var initialState = {
  inputFile: null,
  audioMeta: null,
  waveformData: null,
  startTime: 0,
  endTime: 0,
  snapToZero: false,
  outputFormat: "wav",
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var trimmerActions = createActionGroup({
  source: "Trimmer",
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
var trimmerFeature = createFeature({
  name: "trimmer",
  reducer: createReducer(initialState, on(trimmerActions.loadFile, (s, { file }) => __spreadProps(__spreadValues({}, s), { inputFile: file, status: "loading", errorCode: null, errorMessage: null })), on(trimmerActions.loadFileSuccess, (s, { meta, waveformData }) => __spreadProps(__spreadValues({}, s), { audioMeta: meta, waveformData, status: "idle" })), on(trimmerActions.loadFileFailure, (s, { errorCode, message }) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode, errorMessage: message, retryable: true })), on(trimmerActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, errorCode: null, errorMessage: null })), on(trimmerActions.updateProgress, (s, { value }) => __spreadProps(__spreadValues({}, s), { progress: value })), on(trimmerActions.processingSuccess, (s, { outputBlob, outputSizeMB }) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob, outputSizeMB })), on(trimmerActions.processingFailure, (s, { errorCode, message, retryable }) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode, errorMessage: message, retryable })), on(trimmerActions.resetState, () => initialState))
});
var TrimmerEffects = class _TrimmerEffects {
  actions$ = inject(Actions);
  store = inject(Store);
  svc = inject(TrimmerService);
  bridge = inject(AudioWorkerBridgeService);
  loadFile$ = createEffect(() => this.actions$.pipe(ofType(trimmerActions.loadFile), switchMap(({ file }) => from(this.svc.decodeAndAnalyze(file)).pipe(map(({ meta, waveformData }) => trimmerActions.loadFileSuccess({ meta, waveformData })), catchError((err) => of(trimmerActions.loadFileFailure({ errorCode: "DECODE_FAILED", message: err?.message ?? "Decode failed" })))))));
  startProcessing$ = createEffect(() => this.actions$.pipe(ofType(trimmerActions.startProcessing), withLatestFrom(this.store.select(trimmerFeature.selectTrimmerState)), exhaustMap(([, state]) => {
    if (!state.inputFile)
      return of(trimmerActions.processingFailure({ errorCode: "INVALID_PARAMS", message: "No input file", retryable: true }));
    return from(this.svc.processAudio(state.inputFile, {})).pipe(map((blob) => trimmerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 })), catchError((err) => of(trimmerActions.processingFailure({ errorCode: "WORKER_CRASHED", message: err?.message ?? "Processing failed", retryable: true }))));
  })));
  download$ = createEffect(() => this.actions$.pipe(ofType(trimmerActions.downloadOutput), withLatestFrom(this.store.select(trimmerFeature.selectTrimmerState)), tap(([, state]) => {
    if (state.outputBlob && state.inputFile) {
      this.bridge.downloadBlob(state.outputBlob, "omni_trimmer_" + state.inputFile.name.replace(/\.[^.]+$/, "") + ".wav");
    }
  })), { dispatch: false });
  static \u0275fac = function TrimmerEffects_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TrimmerEffects)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TrimmerEffects, factory: _TrimmerEffects.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TrimmerEffects, [{
    type: Injectable
  }], null, null);
})();

// src/app/modules/audio/02-trimmer/trimmer.component.ts
function TrimmerComponent_Conditional_12_Conditional_13_Template(rf, ctx) {
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
function TrimmerComponent_Conditional_12_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275listener("click", function TrimmerComponent_Conditional_12_Conditional_16_Template_button_click_0_listener() {
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
function TrimmerComponent_Conditional_12_Conditional_17_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275listener("click", function TrimmerComponent_Conditional_12_Conditional_17_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275text(1, "Retry");
    \u0275\u0275elementEnd();
  }
}
function TrimmerComponent_Conditional_12_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275conditionalCreate(3, TrimmerComponent_Conditional_12_Conditional_17_Conditional_3_Template, 2, 0, "button", 18);
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
function TrimmerComponent_Conditional_12_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "app-audio-player", 20);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275elementStart(2, "app-audio-export-panel", 21);
    \u0275\u0275pipe(3, "async");
    \u0275\u0275pipe(4, "async");
    \u0275\u0275listener("download", function TrimmerComponent_Conditional_12_Conditional_19_Template_app_audio_export_panel_download_2_listener() {
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
function TrimmerComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "app-waveform-display", 9);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275elementStart(3, "div", 10)(4, "div")(5, "label", 11);
    \u0275\u0275text(6, "Start Time");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 12);
    \u0275\u0275twoWayListener("ngModelChange", function TrimmerComponent_Conditional_12_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.localStart, $event) || (ctx_r1.localStart = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "label", 11);
    \u0275\u0275text(10, "End Time");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 12);
    \u0275\u0275twoWayListener("ngModelChange", function TrimmerComponent_Conditional_12_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.localEnd, $event) || (ctx_r1.localEnd = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "div", 2);
    \u0275\u0275conditionalCreate(13, TrimmerComponent_Conditional_12_Conditional_13_Template, 4, 3);
    \u0275\u0275pipe(14, "async");
    \u0275\u0275pipe(15, "async");
    \u0275\u0275conditionalBranchCreate(16, TrimmerComponent_Conditional_12_Conditional_16_Template, 3, 3, "button", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(17, TrimmerComponent_Conditional_12_Conditional_17_Template, 5, 6, "div", 14);
    \u0275\u0275pipe(18, "async");
    \u0275\u0275conditionalCreate(19, TrimmerComponent_Conditional_12_Conditional_19_Template, 5, 9);
    \u0275\u0275pipe(20, "async");
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("waveformData", ((tmp_1_0 = \u0275\u0275pipeBind1(2, 6, ctx_r1.state$)) == null ? null : tmp_1_0.waveformData) ?? null);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.localStart);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.localEnd);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_4_0 = \u0275\u0275pipeBind1(14, 8, ctx_r1.state$)) == null ? null : tmp_4_0.status) === "processing" || ((tmp_4_0 = \u0275\u0275pipeBind1(15, 10, ctx_r1.state$)) == null ? null : tmp_4_0.status) === "rendering" ? 13 : 16);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_5_0 = \u0275\u0275pipeBind1(18, 12, ctx_r1.state$)) == null ? null : tmp_5_0.status) === "error" ? 17 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_6_0 = \u0275\u0275pipeBind1(20, 14, ctx_r1.state$)) == null ? null : tmp_6_0.outputBlob) ? 19 : -1);
  }
}
var TrimmerComponent = class _TrimmerComponent {
  store = inject(Store);
  destroyRef = inject(DestroyRef);
  state$ = this.store.select(trimmerFeature.selectTrimmerState);
  localStart = 0;
  localEnd = 0;
  onFilesSelected(files) {
    this.store.dispatch(trimmerActions.loadFile({ file: files[0] }));
  }
  onProcess() {
    this.store.dispatch(trimmerActions.startProcessing());
  }
  onDownload() {
    this.store.dispatch(trimmerActions.downloadOutput());
  }
  ngOnDestroy() {
    this.store.dispatch(trimmerActions.resetState());
  }
  static \u0275fac = function TrimmerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TrimmerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TrimmerComponent, selectors: [["app-02-trimmer"]], decls: 14, vars: 4, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6"], [1, "max-w-4xl", "mx-auto", "space-y-6"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-xl", "bg-gradient-to-br", "from-cyan-500/20", "to-purple-500/20", "flex", "items-center", "justify-center", "border", "border-white/10"], [1, "text-2xl"], [1, "text-xl", "font-bold", "text-white"], [1, "text-sm", "text-white/40"], [3, "filesSelected", "multiple"], [1, "bg-[#12121a]", "rounded-2xl", "p-6", "border", "border-white/5", "space-y-4"], [3, "waveformData"], [1, "grid", "grid-cols-2", "gap-4"], [1, "text-xs", "text-white/40"], ["type", "number", "min", "0", "step", "0.01", 1, "w-full", "bg-white/5", "rounded-lg", "px-3", "py-2", "text-white", "text-sm", 3, "ngModelChange", "ngModel"], [1, "flex-1", "py-3", "rounded-xl", "bg-gradient-to-r", "from-cyan-500", "to-purple-500", "text-white", "font-bold", "text-sm", "hover:opacity-90", "transition-opacity", 3, "disabled"], [1, "bg-red-500/10", "border", "border-red-500/30", "rounded-xl", "p-4", "text-red-400", "text-sm"], [3, "progress"], [1, "text-sm", "text-white/50"], [1, "flex-1", "py-3", "rounded-xl", "bg-gradient-to-r", "from-cyan-500", "to-purple-500", "text-white", "font-bold", "text-sm", "hover:opacity-90", "transition-opacity", 3, "click", "disabled"], [1, "ml-3", "underline"], [1, "ml-3", "underline", 3, "click"], [3, "audioBlob"], [3, "download", "disabled", "outputSizeMB"]], template: function TrimmerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "span", 4);
      \u0275\u0275text(5, "\u{1F3B5}");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div")(7, "h1", 5);
      \u0275\u0275text(8, "Audio Trimmer");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 6);
      \u0275\u0275text(10, "Precision trim audio with waveform scrubber");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "app-audio-drop-zone", 7);
      \u0275\u0275listener("filesSelected", function TrimmerComponent_Template_app_audio_drop_zone_filesSelected_11_listener($event) {
        return ctx.onFilesSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(12, TrimmerComponent_Conditional_12_Template, 21, 16);
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
  }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, MinValidator, NgModel, AudioDropZoneComponent, AudioPlayerComponent, AudioExportPanelComponent, AudioProgressRingComponent, WaveformDisplayComponent, AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TrimmerComponent, [{
    type: Component,
    args: [{
      selector: "app-02-trimmer",
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
            <h1 class="text-xl font-bold text-white">Audio Trimmer</h1>
            <p class="text-sm text-white/40">Precision trim audio with waveform scrubber</p>
          </div>
        </div>

        <!-- Drop Zone -->
        <app-audio-drop-zone (filesSelected)="onFilesSelected($event)"
          [multiple]="false"></app-audio-drop-zone>

        <!-- Controls -->
        @if ((state$ | async)?.inputFile) {
          <div class="bg-[#12121a] rounded-2xl p-6 border border-white/5 space-y-4">
            <app-waveform-display [waveformData]="(state$ | async)?.waveformData ?? null"></app-waveform-display>
            <div class="grid grid-cols-2 gap-4"><div><label class="text-xs text-white/40">Start Time</label><input type="number" class="w-full bg-white/5 rounded-lg px-3 py-2 text-white text-sm" [(ngModel)]="localStart" min="0" step="0.01"></div><div><label class="text-xs text-white/40">End Time</label><input type="number" class="w-full bg-white/5 rounded-lg px-3 py-2 text-white text-sm" [(ngModel)]="localEnd" min="0" step="0.01"></div></div>
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TrimmerComponent, { className: "TrimmerComponent", filePath: "src/app/modules/audio/02-trimmer/trimmer.component.ts", lineNumber: 79 });
})();
export {
  TrimmerComponent
};
//# sourceMappingURL=chunk-LS2BAWI6.mjs.map
