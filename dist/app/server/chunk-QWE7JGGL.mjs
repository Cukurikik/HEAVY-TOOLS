import './polyfills.server.mjs';
import {
  VideoPreviewComponent
} from "./chunk-ULW5AGBH.mjs";
import {
  ProgressRingComponent
} from "./chunk-IFRKZ5TO.mjs";
import {
  FFmpegService
} from "./chunk-KDRYMVOJ.mjs";
import {
  FileDropZoneComponent
} from "./chunk-WUM57JDS.mjs";
import {
  ExportPanelComponent
} from "./chunk-RDQAVJY3.mjs";
import {
  WorkerBridgeService
} from "./chunk-3HE7FIEH.mjs";
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
} from "./chunk-CX47CWGJ.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-UFAUNXOA.mjs";

// src/app/modules/video/01-trimmer/trimmer.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  startTime: 0,
  endTime: 0,
  outputFormat: "mp4",
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var TrimmerActions = {
  loadFile: createAction("[Trimmer] Load File", props()),
  loadMetaSuccess: createAction("[Trimmer] Meta OK", props()),
  loadMetaFailure: createAction("[Trimmer] Meta Fail", props()),
  updateConfig: createAction("[Trimmer] Update Config", props()),
  startProcessing: createAction("[Trimmer] Start"),
  updateProgress: createAction("[Trimmer] Progress", props()),
  processingSuccess: createAction("[Trimmer] Success", props()),
  processingFailure: createAction("[Trimmer] Failure", props()),
  downloadOutput: createAction("[Trimmer] Download"),
  resetState: createAction("[Trimmer] Reset")
};
var trimmerFeature = createFeature({
  name: "trimmer",
  reducer: createReducer(init, on(TrimmerActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(TrimmerActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, endTime: a.meta.duration, status: "idle" })), on(TrimmerActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(TrimmerActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a)), on(TrimmerActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(TrimmerActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(TrimmerActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(TrimmerActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(TrimmerActions.resetState, () => init))
});
var { selectTrimmerState, selectStatus, selectProgress } = trimmerFeature;
var selectTrimmerCanProcess = createSelector(selectTrimmerState, (s) => !!s.inputFile && s.status === "idle" && !!s.videoMeta);
var selectTrimmerIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/01-trimmer/trimmer.component.ts
function TrimmerComponent_Conditional_9_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 21);
    \u0275\u0275text(1, " Processing... ");
  }
}
function TrimmerComponent_Conditional_9_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u2702\uFE0F Trim Video ");
  }
}
function TrimmerComponent_Conditional_9_Template(rf, ctx) {
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
    \u0275\u0275text(15, "FPS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p", 16);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 17)(20, "div", 18)(21, "label", 14);
    \u0275\u0275text(22, "Start (s)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "input", 19);
    \u0275\u0275pipe(24, "async");
    \u0275\u0275listener("change", function TrimmerComponent_Conditional_9_Template_input_change_23_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onStartChange(+$event.target.value));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 18)(26, "label", 14);
    \u0275\u0275text(27, "End (s)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "input", 19);
    \u0275\u0275pipe(29, "async");
    \u0275\u0275listener("change", function TrimmerComponent_Conditional_9_Template_input_change_28_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onEndChange(+$event.target.value));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "button", 20);
    \u0275\u0275pipe(31, "async");
    \u0275\u0275pipe(32, "async");
    \u0275\u0275listener("click", function TrimmerComponent_Conditional_9_Template_button_click_30_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(33, TrimmerComponent_Conditional_9_Conditional_33_Template, 2, 0);
    \u0275\u0275pipe(34, "async");
    \u0275\u0275conditionalBranchCreate(35, TrimmerComponent_Conditional_9_Conditional_35_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_6_0;
    let tmp_8_0;
    const meta_r3 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(7, 10, meta_r3.duration, "1.0-1"), "s");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", meta_r3.width, "\xD7", meta_r3.height);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(18, 13, meta_r3.fps, "1.0-1"));
    \u0275\u0275advance(6);
    \u0275\u0275property("max", meta_r3.duration)("value", ((tmp_6_0 = \u0275\u0275pipeBind1(24, 16, ctx_r1.state$)) == null ? null : tmp_6_0.startTime) ?? 0);
    \u0275\u0275advance(5);
    \u0275\u0275property("max", meta_r3.duration)("value", ((tmp_8_0 = \u0275\u0275pipeBind1(29, 18, ctx_r1.state$)) == null ? null : tmp_8_0.endTime) ?? meta_r3.duration);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(31, 20, ctx_r1.canProcess$) || \u0275\u0275pipeBind1(32, 22, ctx_r1.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(34, 24, ctx_r1.isLoading$) ? 33 : 35);
  }
}
function TrimmerComponent_Conditional_11_Template(rf, ctx) {
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
    \u0275\u0275textInterpolate1(" \u26A0\uFE0F ", (tmp_1_0 = \u0275\u0275pipeBind1(2, 1, ctx_r1.state$)) == null ? null : tmp_1_0.errorMessage, " ");
  }
}
function TrimmerComponent_Conditional_14_Template(rf, ctx) {
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
function TrimmerComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 22);
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
function TrimmerComponent_Conditional_18_Template(rf, ctx) {
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
var TrimmerComponent = class _TrimmerComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectTrimmerState);
  isLoading$ = this.store.select(selectTrimmerIsLoading);
  canProcess$ = this.store.select(selectTrimmerCanProcess);
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(TrimmerActions.loadFile({ file }));
    try {
      const meta = await this.ffmpeg.getMetadata(file);
      this.store.dispatch(TrimmerActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(TrimmerActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read video metadata." }));
    }
  }
  onStartChange(value) {
    this.store.dispatch(TrimmerActions.updateConfig({ startTime: value }));
  }
  onEndChange(value) {
    this.store.dispatch(TrimmerActions.updateConfig({ endTime: value }));
  }
  onProcess() {
    this.store.dispatch(TrimmerActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile || !state.videoMeta)
        return;
      this.bridge.process(() => new Worker(new URL("worker-5CGSZP6J.js", import.meta.url), { type: "module" }), { file: state.inputFile, startTime: state.startTime, endTime: state.endTime, outputFormat: state.outputFormat }).subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(TrimmerActions.updateProgress({ progress: msg.value ?? 0 }));
        else if (msg.type === "complete" && msg.data) {
          const blob = msg.data;
          this.store.dispatch(TrimmerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
        } else if (msg.type === "error") {
          this.store.dispatch(TrimmerActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Processing failed" }));
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(TrimmerActions.resetState());
  }
  static \u0275fac = function TrimmerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TrimmerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TrimmerComponent, selectors: [["app-trimmer"]], decls: 20, vars: 15, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-cyan-400", "to-cyan-200"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video file here or click to browse", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file", "showControls"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_trimmed", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-3", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-cyan-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "flex", "gap-2"], [1, "flex-1"], ["type", "number", "min", "0", "step", "0.1", 1, "w-full", "px-2", "py-1", "mt-1", "text-sm", "bg-white/5", "border", "border-white/15", "rounded-lg", "text-white", "focus:outline-none", "focus:border-cyan-400", 3, "change", "max", "value"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-cyan-500", "to-blue-500", "text-black", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Trimming video...", 3, "progress", "size"]], template: function TrimmerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u2702\uFE0F Video Trimmer ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Precision frame-level trimming powered by FFmpeg WASM");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function TrimmerComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, TrimmerComponent_Conditional_9_Template, 36, 26, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, TrimmerComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, TrimmerComponent_Conditional_14_Template, 2, 4, "app-video-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275conditionalCreate(16, TrimmerComponent_Conditional_16_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, TrimmerComponent_Conditional_18_Template, 3, 6, "app-export-panel", 11);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TrimmerComponent, [{
    type: Component,
    args: [{
      selector: "app-trimmer",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, VideoPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
          \u2702\uFE0F Video Trimmer
        </h1>
        <p class="text-white/50 text-sm">Precision frame-level trimming powered by FFmpeg WASM</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video file here or click to browse" (filesSelected)="onFileSelected($event)" />

          @if ((state$ | async)?.videoMeta; as meta) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Duration</p>
                  <p class="text-sm font-semibold text-cyan-400">{{ meta.duration | number:'1.0-1' }}s</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">Resolution</p>
                  <p class="text-sm font-semibold text-white">{{ meta.width }}\xD7{{ meta.height }}</p>
                </div>
                <div class="p-2 rounded-lg bg-white/5">
                  <p class="text-xs text-white/40">FPS</p>
                  <p class="text-sm font-semibold text-white">{{ meta.fps | number:'1.0-1' }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <div class="flex-1">
                  <label class="text-xs text-white/40">Start (s)</label>
                  <input type="number" min="0" [max]="meta.duration" step="0.1"
                    [value]="(state$ | async)?.startTime ?? 0"
                    (change)="onStartChange(+($any($event.target)).value)"
                    class="w-full px-2 py-1 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400">
                </div>
                <div class="flex-1">
                  <label class="text-xs text-white/40">End (s)</label>
                  <input type="number" min="0" [max]="meta.duration" step="0.1"
                    [value]="(state$ | async)?.endTime ?? meta.duration"
                    (change)="onEndChange(+($any($event.target)).value)"
                    class="w-full px-2 py-1 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:border-cyan-400">
                </div>
              </div>
              <button
                [disabled]="!(canProcess$ | async) || (isLoading$ | async)"
                (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                } @else { \u2702\uFE0F Trim Video }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              \u26A0\uFE0F {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.inputFile) {
            <app-video-preview [file]="(state$ | async)?.inputFile ?? null" [showControls]="true" />
          }
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Trimming video..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_trimmed" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TrimmerComponent, { className: "TrimmerComponent", filePath: "src/app/modules/video/01-trimmer/trimmer.component.ts", lineNumber: 98 });
})();
export {
  TrimmerComponent
};
//# sourceMappingURL=chunk-QWE7JGGL.mjs.map
