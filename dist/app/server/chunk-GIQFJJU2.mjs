import './polyfills.server.mjs';
import {
  ProgressRingComponent
} from "./chunk-IFRKZ5TO.mjs";
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
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-CX47CWGJ.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-UFAUNXOA.mjs";

// src/app/modules/video/28-batch/batch.store.ts
var init = {
  inputFile: null,
  videoMeta: null,
  files: [],
  operation: "compress",
  operationConfig: {},
  isRunning: false,
  currentIndex: 0,
  completedCount: 0,
  failedCount: 0,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var BatchActions = {
  loadFile: createAction("[Batch] Load File", props()),
  loadMetaSuccess: createAction("[Batch] Meta OK", props()),
  loadMetaFailure: createAction("[Batch] Meta Fail", props()),
  updateConfig: createAction("[Batch] Update Config", props()),
  startProcessing: createAction("[Batch] Start"),
  updateProgress: createAction("[Batch] Progress", props()),
  processingSuccess: createAction("[Batch] Success", props()),
  processingFailure: createAction("[Batch] Failure", props()),
  downloadOutput: createAction("[Batch] Download"),
  resetState: createAction("[Batch] Reset")
};
var batchFeature = createFeature({
  name: "batch",
  reducer: createReducer(init, on(BatchActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(BatchActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { videoMeta: a.meta, status: "idle" })), on(BatchActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(BatchActions.updateConfig, (s, a) => __spreadValues(__spreadValues({}, s), a.config)), on(BatchActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0, outputBlob: null })), on(BatchActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(BatchActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(BatchActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: true })), on(BatchActions.resetState, () => init))
});
var { selectBatchState, selectStatus, selectProgress, selectOutputBlob } = batchFeature;
var selectBatchCanProcess = createSelector(selectBatchState, (s) => !!s.inputFile && s.status === "idle");
var selectBatchIsLoading = createSelector(selectStatus, (s) => s === "processing" || s === "loading");

// src/app/modules/video/28-batch/batch.component.ts
var _forTrack0 = ($index, $item) => $item.name;
var _forTrack1 = ($index, $item) => $item.value;
function BatchComponent_Conditional_9_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "span", 22);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 23);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "number");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r3 = ctx.$implicit;
    const \u0275$index_32_r4 = ctx.$index;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", \u0275$index_32_r4 + 1, ". ", f_r3.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(5, 3, f_r3.size / 1048576, "1.1-1"), "MB");
  }
}
function BatchComponent_Conditional_9_For_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function BatchComponent_Conditional_9_For_15_Template_button_click_0_listener() {
      const op_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.operation = op_r6.value);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const op_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r1.operation === op_r6.value ? "p-3 rounded-xl border-2 border-cyan-400 bg-cyan-400/10 text-cyan-300 text-sm font-semibold" : "p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", op_r6.icon, " ", op_r6.label, " ");
  }
}
function BatchComponent_Conditional_9_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 12)(2, "span", 13);
    \u0275\u0275text(3, "CRF Quality");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 25);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "input", 26);
    \u0275\u0275listener("input", function BatchComponent_Conditional_9_Conditional_16_Template_input_input_6_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.batchCrf = +ctx_r1.gv($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.batchCrf);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.batchCrf);
  }
}
function BatchComponent_Conditional_9_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "p", 27);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 28);
    \u0275\u0275element(4, "div", 29);
    \u0275\u0275pipe(5, "async");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Processing ", ctx_r1.currentFile, " of ", ctx_r1.files.length, "...");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ((tmp_3_0 = \u0275\u0275pipeBind1(5, 4, ctx_r1.state$)) == null ? null : tmp_3_0.progress) ?? 0, "%");
  }
}
function BatchComponent_Conditional_9_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 30);
    \u0275\u0275text(1, " Batch Processing... ");
  }
}
function BatchComponent_Conditional_9_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u26A1 Start Batch ");
  }
}
function BatchComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 11)(2, "div", 12)(3, "span", 13);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 14);
    \u0275\u0275listener("click", function BatchComponent_Conditional_9_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.files = []);
    });
    \u0275\u0275text(6, "Clear All");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 15);
    \u0275\u0275repeaterCreate(8, BatchComponent_Conditional_9_For_9_Template, 6, 6, "div", 16, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 11)(11, "p", 17);
    \u0275\u0275text(12, "Batch Operation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 18);
    \u0275\u0275repeaterCreate(14, BatchComponent_Conditional_9_For_15_Template, 2, 4, "button", 19, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(16, BatchComponent_Conditional_9_Conditional_16_Template, 7, 2, "div", 11);
    \u0275\u0275conditionalCreate(17, BatchComponent_Conditional_9_Conditional_17_Template, 6, 6, "div", 20);
    \u0275\u0275pipe(18, "async");
    \u0275\u0275elementStart(19, "button", 21);
    \u0275\u0275pipe(20, "async");
    \u0275\u0275listener("click", function BatchComponent_Conditional_9_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(21, BatchComponent_Conditional_9_Conditional_21_Template, 2, 0);
    \u0275\u0275pipe(22, "async");
    \u0275\u0275conditionalBranchCreate(23, BatchComponent_Conditional_9_Conditional_23_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", ctx_r1.files.length, " videos queued");
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.files);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r1.operations);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.operation === "compress" ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = \u0275\u0275pipeBind1(18, 5, ctx_r1.state$)) == null ? null : tmp_5_0.status) === "processing" ? 17 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", \u0275\u0275pipeBind1(20, 7, ctx_r1.isLoading$) || ctx_r1.files.length === 0);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(22, 9, ctx_r1.isLoading$) ? 21 : 23);
  }
}
function BatchComponent_Conditional_10_Template(rf, ctx) {
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
function BatchComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "app-progress-ring", 31);
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
function BatchComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-export-panel", 10);
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
var BatchComponent = class _BatchComponent {
  store = inject(Store);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectBatchState);
  isLoading$ = this.store.select(selectBatchIsLoading);
  canProcess$ = this.store.select(selectBatchCanProcess);
  files = [];
  operation = "compress";
  batchCrf = 28;
  currentFile = 0;
  operations = [
    { value: "compress", label: "Compress", icon: "\u{1F4E6}" },
    { value: "convert_mp4", label: "to MP4", icon: "\u{1F3AC}" },
    { value: "convert_webm", label: "to WebM", icon: "\u{1F310}" },
    { value: "extract_audio", label: "Extract Audio", icon: "\u{1F3B5}" }
  ];
  gv(e) {
    return e.target.value;
  }
  onFilesSelected(newFiles) {
    this.files = [...this.files, ...newFiles];
    if (this.files.length > 0)
      this.store.dispatch(BatchActions.loadFile({ file: this.files[0] }));
  }
  onProcess() {
    this.store.dispatch(BatchActions.startProcessing());
    this.currentFile = 1;
    this.bridge.process(() => new Worker(new URL("worker-R3IS64ZN.js", import.meta.url), { type: "module" }), { files: this.files, operation: this.operation, crf: this.batchCrf }).subscribe((msg) => {
      if (msg.type === "progress") {
        this.currentFile = Math.ceil((msg.value ?? 0) / 100 * this.files.length) || 1;
        this.store.dispatch(BatchActions.updateProgress({ progress: msg.value ?? 0 }));
      } else if (msg.type === "complete" && msg.data) {
        const b = msg.data;
        this.store.dispatch(BatchActions.processingSuccess({ outputBlob: b, outputSizeMB: b.size / 1048576 }));
      } else if (msg.type === "error") {
        this.store.dispatch(BatchActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Batch failed" }));
      }
    });
  }
  ngOnDestroy() {
    this.store.dispatch(BatchActions.resetState());
  }
  static \u0275fac = function BatchComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BatchComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BatchComponent, selectors: [["app-batch"]], decls: 17, vars: 11, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-cyan-400", "to-blue-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop multiple videos", 3, "filesSelected", "multiple"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_batch", 3, "outputBlob", "outputSizeMB"], [1, "space-y-2"], [1, "flex", "justify-between", "text-sm"], [1, "text-white/60"], [1, "text-xs", "text-red-400", "hover:text-red-300", 3, "click"], [1, "max-h-40", "overflow-y-auto", "space-y-1"], [1, "flex", "items-center", "justify-between", "p-2", "rounded-lg", "bg-white/5"], [1, "text-sm", "text-white/60"], [1, "grid", "grid-cols-2", "gap-2"], [3, "class"], [1, "p-3", "rounded-xl", "bg-cyan-500/10", "border", "border-cyan-500/20"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "bg-gradient-to-r", "from-cyan-500", "to-blue-500", "text-black", "hover:shadow-[0_0_30px_rgba(0,245,255,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "text-sm", "text-white/70", "truncate"], [1, "text-xs", "text-white/40"], [3, "click"], [1, "text-cyan-400", "font-mono"], ["type", "range", "min", "18", "max", "40", 1, "w-full", "h-2", "bg-white/10", "rounded-lg", "appearance-none", "cursor-pointer", "accent-cyan-400", 3, "input", "value"], [1, "text-sm", "text-cyan-300"], [1, "w-full", "h-2", "bg-white/10", "rounded-full", "mt-2"], [1, "h-2", "bg-cyan-400", "rounded-full", "transition-all"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin", "inline-block"], ["label", "Batch...", 3, "progress", "size"]], template: function BatchComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, "\u26A1 Batch Processor");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Process multiple videos with the same operation at once");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function BatchComponent_Template_app_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFilesSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, BatchComponent_Conditional_9_Template, 24, 11, "div", 7);
      \u0275\u0275conditionalCreate(10, BatchComponent_Conditional_10_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(11, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 5);
      \u0275\u0275conditionalCreate(13, BatchComponent_Conditional_13_Template, 3, 4, "div", 9);
      \u0275\u0275pipe(14, "async");
      \u0275\u0275conditionalCreate(15, BatchComponent_Conditional_15_Template, 3, 6, "app-export-panel", 10);
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
      \u0275\u0275conditional(ctx.files.length > 0 ? 9 : -1);
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
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BatchComponent, [{
    type: Component,
    args: [{
      selector: "app-batch",
      standalone: true,
      imports: [CommonModule, FileDropZoneComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">\u26A1 Batch Processor</h1>
        <p class="text-white/50 text-sm">Process multiple videos with the same operation at once</p>
      </header>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-file-drop-zone accept="video/*" label="Drop multiple videos" [multiple]="true" (filesSelected)="onFilesSelected($event)" />

          @if (files.length > 0) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <!-- File List -->
              <div class="space-y-2">
                <div class="flex justify-between text-sm"><span class="text-white/60">{{ files.length }} videos queued</span>
                  <button (click)="files=[]" class="text-xs text-red-400 hover:text-red-300">Clear All</button>
                </div>
                <div class="max-h-40 overflow-y-auto space-y-1">
                  @for (f of files; track f.name; let i = $index) {
                    <div class="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <span class="text-sm text-white/70 truncate">{{ i + 1 }}. {{ f.name }}</span>
                      <span class="text-xs text-white/40">{{ (f.size / 1_048_576) | number:'1.1-1' }}MB</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Operation -->
              <div class="space-y-2">
                <p class="text-sm text-white/60">Batch Operation</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (op of operations; track op.value) {
                    <button (click)="operation=op.value"
                      [class]="operation===op.value ? 'p-3 rounded-xl border-2 border-cyan-400 bg-cyan-400/10 text-cyan-300 text-sm font-semibold' : 'p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'">
                      {{ op.icon }} {{ op.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Quality preset for compress -->
              @if (operation === 'compress') {
                <div class="space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-white/60">CRF Quality</span><span class="text-cyan-400 font-mono">{{ batchCrf }}</span></div>
                  <input type="range" min="18" max="40" [value]="batchCrf" (input)="batchCrf=+gv($event)" class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400" />
                </div>
              }

              <!-- Batch Progress -->
              @if ((state$ | async)?.status === 'processing') {
                <div class="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <p class="text-sm text-cyan-300">Processing {{ currentFile }} of {{ files.length }}...</p>
                  <div class="w-full h-2 bg-white/10 rounded-full mt-2">
                    <div class="h-2 bg-cyan-400 rounded-full transition-all" [style.width.%]="(state$ | async)?.progress ?? 0"></div>
                  </div>
                </div>
              }

              <button [disabled]="(isLoading$ | async) || files.length === 0" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-500 text-black hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed">
                @if (isLoading$ | async) { <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></div> Batch Processing... } @else { \u26A1 Start Batch }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') { <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div> }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.status === 'processing') { <div class="flex justify-center p-8"><app-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Batch..." [size]="120" /></div> }
          @if ((state$ | async)?.status === 'done') { <app-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" defaultFilename="omni_batch" /> }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BatchComponent, { className: "BatchComponent", filePath: "src/app/modules/video/28-batch/batch.component.ts", lineNumber: 89 });
})();
export {
  BatchComponent
};
//# sourceMappingURL=chunk-GIQFJJU2.mjs.map
