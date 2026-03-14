import './polyfills.server.mjs';
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
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CX47CWGJ.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-UFAUNXOA.mjs";

// src/app/modules/video/02-merger/merger.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  clips: [],
  encodeMode: "copy",
  outputFormat: "mp4",
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var MergerActions = {
  loadFile: createAction("[Merger] Load File", props()),
  loadMetaSuccess: createAction("[Merger] Meta OK", props()),
  loadMetaFailure: createAction("[Merger] Meta Fail", props()),
  updateConfig: createAction("[Merger] Update Config", props()),
  startProcessing: createAction("[Merger] Start"),
  updateProgress: createAction("[Merger] Progress", props()),
  processingSuccess: createAction("[Merger] Success", props()),
  processingFailure: createAction("[Merger] Failure", props()),
  downloadOutput: createAction("[Merger] Download"),
  resetState: createAction("[Merger] Reset")
};
var mergerFeature = createFeature({
  name: "merger",
  reducer: createReducer(init, on(MergerActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(MergerActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(MergerActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(MergerActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(MergerActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(MergerActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(MergerActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(MergerActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(MergerActions.resetState, () => init))
});
var { selectMergerState, selectStatus, selectProgress, selectOutputBlob } = mergerFeature;
var selectMergerCanProcess = createSelector(selectMergerState, (s) => !!s.inputFile && s.status === "idle");
var selectMergerIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/02-merger/merger.component.ts
function MergerComponent_Conditional_9_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "span", 20);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 21)(4, "p", 22);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 23);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "button", 24);
    \u0275\u0275listener("click", function MergerComponent_Conditional_9_For_8_Template_button_click_9_listener() {
      const $index_r4 = \u0275\u0275restoreView(_r3).$index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeClip($index_r4));
    });
    \u0275\u0275text(10, "\u2715");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const clip_r5 = ctx.$implicit;
    const $index_r4 = ctx.$index;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate($index_r4 + 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(clip_r5.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(8, 3, clip_r5.size / 1048576, "1.0-1"), " MB");
  }
}
function MergerComponent_Conditional_9_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 25);
    \u0275\u0275text(1, " Merging... ");
  }
}
function MergerComponent_Conditional_9_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" \u{1F517} Merge ", ctx_r1.clips.length, " Clips ");
  }
}
function MergerComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 12)(2, "span", 13);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 14);
    \u0275\u0275listener("click", function MergerComponent_Conditional_9_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearClips());
    });
    \u0275\u0275text(5, "Clear All");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 15);
    \u0275\u0275repeaterCreate(7, MergerComponent_Conditional_9_For_8_Template, 11, 6, "div", 16, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 17);
    \u0275\u0275listener("click", function MergerComponent_Conditional_9_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r1);
      const addMoreInput_r6 = \u0275\u0275reference(12);
      return \u0275\u0275resetView(addMoreInput_r6.click());
    });
    \u0275\u0275text(10, " + Add More Clips ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 18, 0);
    \u0275\u0275listener("change", function MergerComponent_Conditional_9_Template_input_change_11_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onAddMore($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 19);
    \u0275\u0275pipe(14, "async");
    \u0275\u0275listener("click", function MergerComponent_Conditional_9_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(15, MergerComponent_Conditional_9_Conditional_15_Template, 2, 0);
    \u0275\u0275pipe(16, "async");
    \u0275\u0275conditionalBranchCreate(17, MergerComponent_Conditional_9_Conditional_17_Template, 1, 1);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Clips (", ctx_r1.clips.length, ")");
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.clips);
    \u0275\u0275advance(6);
    \u0275\u0275property("disabled", ctx_r1.clips.length < 2 || \u0275\u0275pipeBind1(14, 3, ctx_r1.isLoading$));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(16, 5, ctx_r1.isLoading$) ? 15 : 17);
  }
}
function MergerComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
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
function MergerComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-progress-ring", 26);
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
function MergerComponent_Conditional_15_Template(rf, ctx) {
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
var MergerComponent = class _MergerComponent {
  store = inject(Store);
  ffmpeg = inject(FFmpegService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectMergerState);
  isLoading$ = this.store.select(selectMergerIsLoading);
  canProcess$ = this.store.select(selectMergerCanProcess);
  clips = [];
  onFilesSelected(files) {
    this.clips = [...this.clips, ...files];
    if (files.length > 0) {
      this.store.dispatch(MergerActions.loadFile({ file: files[0] }));
    }
  }
  onAddMore(event) {
    const input = event.target;
    if (input.files) {
      this.clips = [...this.clips, ...Array.from(input.files)];
    }
    input.value = "";
  }
  removeClip(index) {
    this.clips = this.clips.filter((_, i) => i !== index);
  }
  clearClips() {
    this.clips = [];
  }
  onProcess() {
    this.store.dispatch(MergerActions.startProcessing());
    this.bridge.process(() => new Worker(new URL("worker-SI7EROAR.js", import.meta.url), { type: "module" }), { clips: this.clips.map((f) => ({ file: f })), outputFormat: "mp4" }).subscribe((msg) => {
      if (msg.type === "progress")
        this.store.dispatch(MergerActions.updateProgress({ progress: msg.value ?? 0 }));
      else if (msg.type === "complete" && msg.data) {
        const blob = msg.data;
        this.store.dispatch(MergerActions.processingSuccess({ outputBlob: blob, outputSizeMB: blob.size / 1048576 }));
      } else if (msg.type === "error") {
        this.store.dispatch(MergerActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Merge failed" }));
      }
    });
  }
  ngOnDestroy() {
    this.store.dispatch(MergerActions.resetState());
  }
  static \u0275fac = function MergerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MergerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MergerComponent, selectors: [["app-merger"]], decls: 17, vars: 11, consts: [["addMoreInput", ""], [1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-blue-400", "to-indigo-200"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video clips here (multiple files)", 3, "filesSelected", "multiple"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-3"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_merged", 3, "outputBlob", "outputSizeMB"], [1, "flex", "justify-between", "items-center"], [1, "text-xs", "text-white/40", "uppercase", "tracking-wider"], [1, "text-xs", "text-red-400", "hover:text-red-300", "transition-colors", 3, "click"], [1, "space-y-2", "max-h-64", "overflow-y-auto"], [1, "flex", "items-center", "gap-3", "p-2", "rounded-lg", "bg-white/5", "border", "border-white/10"], [1, "w-full", "py-2", "rounded-lg", "border", "border-dashed", "border-white/20", "text-xs", "text-white/40", "hover:text-white/60", "hover:border-white/40", "transition-all", 3, "click"], ["type", "file", "accept", "video/*", "multiple", "", 1, "hidden", 3, "change"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-blue-500", "to-indigo-500", "text-white", "hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "w-6", "h-6", "flex", "items-center", "justify-center", "rounded-full", "bg-blue-500/20", "text-blue-400", "text-xs", "font-bold"], [1, "flex-1", "min-w-0"], [1, "text-sm", "text-white", "truncate"], [1, "text-xs", "text-white/30"], [1, "text-xs", "text-red-400", "hover:text-red-300", "px-2", "py-1", "rounded-lg", "hover:bg-red-500/10", "transition-all", 3, "click"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Merging clips...", 3, "progress", "size"]], template: function MergerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 1)(1, "header", 2)(2, "h1", 3);
      \u0275\u0275text(3, " \u{1F517} Video Merger ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 4);
      \u0275\u0275text(5, "Merge multiple video clips into one seamless video");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 5)(7, "div", 6)(8, "app-file-drop-zone", 7);
      \u0275\u0275listener("filesSelected", function MergerComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFilesSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, MergerComponent_Conditional_9_Template, 18, 7, "div", 8);
      \u0275\u0275conditionalCreate(10, MergerComponent_Conditional_10_Template, 3, 3, "div", 9);
      \u0275\u0275pipe(11, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 6);
      \u0275\u0275conditionalCreate(13, MergerComponent_Conditional_13_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(14, "async");
      \u0275\u0275conditionalCreate(15, MergerComponent_Conditional_15_Template, 3, 6, "app-export-panel", 11);
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
      \u0275\u0275conditional(ctx.clips.length > 0 ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(((tmp_2_0 = \u0275\u0275pipeBind1(11, 5, ctx.state$)) == null ? null : tmp_2_0.status) === "error" ? 10 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_3_0 = \u0275\u0275pipeBind1(14, 7, ctx.state$)) == null ? null : tmp_3_0.status) === "processing" ? 13 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_4_0 = \u0275\u0275pipeBind1(16, 9, ctx.state$)) == null ? null : tmp_4_0.status) === "done" ? 15 : -1);
    }
  }, dependencies: [CommonModule, FileDropZoneComponent, ProgressRingComponent, ExportPanelComponent, AsyncPipe, DecimalPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MergerComponent, [{
    type: Component,
    args: [{
      selector: "app-merger",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-200">
          \u{1F517} Video Merger
        </h1>
        <p class="text-white/50 text-sm">Merge multiple video clips into one seamless video</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop video clips here (multiple files)" [multiple]="true" (filesSelected)="onFilesSelected($event)" />

          <!-- Clips List -->
          @if (clips.length > 0) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-xs text-white/40 uppercase tracking-wider">Clips ({{ clips.length }})</span>
                <button (click)="clearClips()" class="text-xs text-red-400 hover:text-red-300 transition-colors">Clear All</button>
              </div>

              <div class="space-y-2 max-h-64 overflow-y-auto">
                @for (clip of clips; track $index) {
                  <div class="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10">
                    <span class="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">{{ $index + 1 }}</span>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-white truncate">{{ clip.name }}</p>
                      <p class="text-xs text-white/30">{{ (clip.size / 1_048_576) | number:'1.0-1' }} MB</p>
                    </div>
                    <button (click)="removeClip($index)" class="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-all">\u2715</button>
                  </div>
                }
              </div>

              <!-- Add More -->
              <button (click)="addMoreInput.click()" class="w-full py-2 rounded-lg border border-dashed border-white/20 text-xs text-white/40 hover:text-white/60 hover:border-white/40 transition-all">
                + Add More Clips
              </button>
              <input #addMoreInput type="file" accept="video/*" multiple class="hidden" (change)="onAddMore($event)" />

              <button [disabled]="clips.length < 2 || (isLoading$ | async)" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Merging...
                } @else { \u{1F517} Merge {{ clips.length }} Clips }
              </button>
            </div>
          }

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Merging clips..." [size]="120" />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_merged" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MergerComponent, { className: "MergerComponent", filePath: "src/app/modules/video/02-merger/merger.component.ts", lineNumber: 85 });
})();
export {
  MergerComponent
};
//# sourceMappingURL=chunk-VDMTWTWQ.mjs.map
