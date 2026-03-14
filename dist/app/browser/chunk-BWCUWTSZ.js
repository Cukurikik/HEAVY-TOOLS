import {
  ExportPanelComponent,
  PdfDropZoneComponent,
  PdfFileSchema,
  PdfLibService,
  PdfPreviewComponent,
  ProgressRingComponent,
  WorkerBridgeService,
  external_exports
} from "./chunk-SZ7EW4HT.js";
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
  Injectable,
  inject,
  setClassMetadata,
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
  ɵɵpipeBind2,
  ɵɵproperty,
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

// src/app/modules/pdf/07-password-protector/passwordProtector.store.ts
var init = {
  inputFile: null,
  pdfMeta: null,
  status: "idle",
  progress: 0,
  outputBlob: null,
  outputSizeMB: null,
  errorCode: null,
  errorMessage: null,
  retryable: false
};
var PasswordProtectorActions = {
  loadFile: createAction("[PasswordProtector] Load File", props()),
  loadMetaSuccess: createAction("[PasswordProtector] Meta Success", props()),
  loadMetaFailure: createAction("[PasswordProtector] Meta Failure", props()),
  startProcessing: createAction("[PasswordProtector] Start Processing"),
  updateProgress: createAction("[PasswordProtector] Update Progress", props()),
  processingSuccess: createAction("[PasswordProtector] Processing Success", props()),
  processingFailure: createAction("[PasswordProtector] Processing Failure", props()),
  resetState: createAction("[PasswordProtector] Reset State")
};
var passwordProtectorFeature = createFeature({
  name: "passwordProtectorPdf",
  reducer: createReducer(init, on(PasswordProtectorActions.loadFile, (s, a) => __spreadProps(__spreadValues({}, s), { inputFile: a.file, status: "loading", outputBlob: null, errorMessage: null, progress: 0 })), on(PasswordProtectorActions.loadMetaSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { pdfMeta: a.meta, status: "idle" })), on(PasswordProtectorActions.loadMetaFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message })), on(PasswordProtectorActions.startProcessing, (s) => __spreadProps(__spreadValues({}, s), { status: "processing", progress: 0 })), on(PasswordProtectorActions.updateProgress, (s, a) => __spreadProps(__spreadValues({}, s), { progress: a.progress })), on(PasswordProtectorActions.processingSuccess, (s, a) => __spreadProps(__spreadValues({}, s), { status: "done", progress: 100, outputBlob: a.outputBlob, outputSizeMB: a.outputSizeMB })), on(PasswordProtectorActions.processingFailure, (s, a) => __spreadProps(__spreadValues({}, s), { status: "error", errorCode: a.errorCode, errorMessage: a.message, retryable: a.retryable })), on(PasswordProtectorActions.resetState, () => init))
});
var { selectPasswordProtectorPdfState, selectStatus, selectProgress, selectOutputBlob } = passwordProtectorFeature;
var selectPasswordProtectorCanProcess = createSelector(selectPasswordProtectorPdfState, (s) => !!s.inputFile && s.status === "idle");
var selectPasswordProtectorIsLoading = createSelector(selectStatus, (s) => s === "loading" || s === "processing" || s === "rendering");

// src/app/modules/pdf/07-password-protector/passwordProtector.component.ts
function PasswordProtectorComponent_Conditional_9_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 18);
    \u0275\u0275text(1, " Processing... ");
  }
}
function PasswordProtectorComponent_Conditional_9_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F512} Execute ");
  }
}
function PasswordProtectorComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 12)(2, "div", 13)(3, "p", 14);
    \u0275\u0275text(4, "Pages");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 15);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 13)(8, "p", 14);
    \u0275\u0275text(9, "Size");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 16);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "button", 17);
    \u0275\u0275pipe(14, "async");
    \u0275\u0275pipe(15, "async");
    \u0275\u0275listener("click", function PasswordProtectorComponent_Conditional_9_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(16, PasswordProtectorComponent_Conditional_9_Conditional_16_Template, 2, 0);
    \u0275\u0275pipe(17, "async");
    \u0275\u0275conditionalBranchCreate(18, PasswordProtectorComponent_Conditional_9_Conditional_18_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const meta_r3 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(meta_r3.pageCount);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(12, 4, meta_r3.fileSizeMB, "1.2-2"), " MB");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !\u0275\u0275pipeBind1(14, 7, ctx_r1.canProcess$) || \u0275\u0275pipeBind1(15, 9, ctx_r1.isLoading$));
    \u0275\u0275advance(3);
    \u0275\u0275conditional(\u0275\u0275pipeBind1(17, 11, ctx_r1.isLoading$) ? 16 : 18);
  }
}
function PasswordProtectorComponent_Conditional_11_Template(rf, ctx) {
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
function PasswordProtectorComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-pdf-preview", 9);
    \u0275\u0275pipe(1, "async");
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("file", ((tmp_1_0 = \u0275\u0275pipeBind1(1, 1, ctx_r1.state$)) == null ? null : tmp_1_0.inputFile) ?? null);
  }
}
function PasswordProtectorComponent_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-pdf-progress-ring", 19);
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
function PasswordProtectorComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-pdf-export-panel", 11);
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
var PasswordProtectorComponent = class _PasswordProtectorComponent {
  store = inject(Store);
  pdfLib = inject(PdfLibService);
  bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectPasswordProtectorPdfState);
  isLoading$ = this.store.select(selectPasswordProtectorIsLoading);
  canProcess$ = this.store.select(selectPasswordProtectorCanProcess);
  async onFileSelected(files) {
    const file = files[0];
    this.store.dispatch(PasswordProtectorActions.loadFile({ file }));
    try {
      const meta = await this.pdfLib.getMetadata(file);
      this.store.dispatch(PasswordProtectorActions.loadMetaSuccess({ meta }));
    } catch {
      this.store.dispatch(PasswordProtectorActions.loadMetaFailure({ errorCode: "FILE_CORRUPTED", message: "Could not read PDF structure." }));
    }
  }
  onProcess() {
    this.store.dispatch(PasswordProtectorActions.startProcessing());
    this.state$.subscribe((state) => {
      if (!state.inputFile)
        return;
      this.bridge.process(() => new Worker(new URL("worker-NZD54V4I.js", import.meta.url), { type: "module" }), { file: state.inputFile }).subscribe({
        next: (msg) => {
          if (msg.type === "progress")
            this.store.dispatch(PasswordProtectorActions.updateProgress({ progress: msg.value ?? 0 }));
          if (msg.type === "complete" && msg.data) {
            this.store.dispatch(PasswordProtectorActions.processingSuccess({ outputBlob: msg.data, outputSizeMB: msg.data.size / 1048576 }));
          }
          if (msg.type === "error") {
            this.store.dispatch(PasswordProtectorActions.processingFailure({ errorCode: msg.errorCode ?? "UNKNOWN_ERROR", message: msg.message ?? "Failed", retryable: true }));
          }
        }
      });
    }).unsubscribe();
  }
  ngOnDestroy() {
    this.store.dispatch(PasswordProtectorActions.resetState());
  }
  static \u0275fac = function PasswordProtectorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PasswordProtectorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PasswordProtectorComponent, selectors: [["app-pdf-passwordProtector"]], decls: 21, vars: 17, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-red-400", "to-rose-400", "drop-shadow-lg"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["label", "Drop PDF file here or click", 3, "filesSelected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [3, "file"], [1, "flex", "justify-center", "p-8"], ["defaultFilename", "omni_passwordProtector.pdf", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-2", "gap-3", "text-center"], [1, "p-2", "rounded-lg", "bg-white/5"], [1, "text-xs", "text-white/40"], [1, "text-sm", "font-semibold", "text-rose-400"], [1, "text-sm", "font-semibold", "text-white"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-red-500", "to-rose-600", "text-white", "hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Modifying...", 3, "progress", "size"]], template: function PasswordProtectorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F512} Password Protect ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Encrypt PDF with AES-256.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-pdf-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function PasswordProtectorComponent_Template_app_pdf_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, PasswordProtectorComponent_Conditional_9_Template, 19, 13, "div", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275conditionalCreate(11, PasswordProtectorComponent_Conditional_11_Template, 3, 3, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5);
      \u0275\u0275conditionalCreate(14, PasswordProtectorComponent_Conditional_14_Template, 2, 3, "app-pdf-preview", 9);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275pipe(16, "async");
      \u0275\u0275conditionalCreate(17, PasswordProtectorComponent_Conditional_17_Template, 3, 4, "div", 10);
      \u0275\u0275pipe(18, "async");
      \u0275\u0275conditionalCreate(19, PasswordProtectorComponent_Conditional_19_Template, 3, 6, "app-pdf-export-panel", 11);
      \u0275\u0275pipe(20, "async");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_0_0;
      let tmp_1_0;
      let tmp_2_0;
      let tmp_3_0;
      let tmp_4_0;
      \u0275\u0275advance(9);
      \u0275\u0275conditional((tmp_0_0 = (tmp_0_0 = \u0275\u0275pipeBind1(10, 5, ctx.state$)) == null ? null : tmp_0_0.pdfMeta) ? 9 : -1, tmp_0_0);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_1_0 = \u0275\u0275pipeBind1(12, 7, ctx.state$)) == null ? null : tmp_1_0.status) === "error" ? 11 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_2_0 = \u0275\u0275pipeBind1(15, 9, ctx.state$)) == null ? null : tmp_2_0.inputFile) && ((tmp_2_0 = \u0275\u0275pipeBind1(16, 11, ctx.state$)) == null ? null : tmp_2_0.status) !== "done" ? 14 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_3_0 = \u0275\u0275pipeBind1(18, 13, ctx.state$)) == null ? null : tmp_3_0.status) === "processing" ? 17 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_4_0 = \u0275\u0275pipeBind1(20, 15, ctx.state$)) == null ? null : tmp_4_0.status) === "done" ? 19 : -1);
    }
  }, dependencies: [CommonModule, PdfDropZoneComponent, PdfPreviewComponent, ProgressRingComponent, ExportPanelComponent, AsyncPipe, DecimalPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PasswordProtectorComponent, [{
    type: Component,
    args: [{
      selector: "app-pdf-passwordProtector",
      standalone: true,
      imports: [CommonModule, PdfDropZoneComponent, PdfPreviewComponent, ProgressRingComponent, ExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400 drop-shadow-lg">
          \u{1F512} Password Protect
        </h1>
        <p class="text-white/50 text-sm">Encrypt PDF with AES-256.</p>
      </header>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <!-- LEFT COLUMN: CONTROLS -->
         <div class="space-y-4">
            <app-pdf-drop-zone (filesSelected)="onFileSelected($event)" label="Drop PDF file here or click" />
            
            @if((state$ | async)?.pdfMeta; as meta) {
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                 <div class="grid grid-cols-2 gap-3 text-center">
                    <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Pages</p><p class="text-sm font-semibold text-rose-400">{{meta.pageCount}}</p></div>
                    <div class="p-2 rounded-lg bg-white/5"><p class="text-xs text-white/40">Size</p><p class="text-sm font-semibold text-white">{{meta.fileSizeMB | number:'1.2-2'}} MB</p></div>
                 </div>
                 
                 <button
                    [disabled]="!(canProcess$ | async) || (isLoading$ | async)"
                    (click)="onProcess()"
                    class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    @if (isLoading$ | async) {
                      <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    } @else { \u{1F512} Execute }
                  </button>
              </div>
            }
            
            @if ((state$ | async)?.status === 'error') {
               <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                  \u26A0\uFE0F {{ (state$ | async)?.errorMessage }}
               </div>
            }
         </div>
         
         <!-- RIGHT COLUMN: PREVIEW/OUTPUT -->
         <div class="space-y-4">
            @if ((state$ | async)?.inputFile && (state$ | async)?.status !== 'done') {
                <app-pdf-preview [file]="(state$ | async)?.inputFile ?? null" />
            }
            @if ((state$ | async)?.status === 'processing') {
                <div class="flex justify-center p-8">
                  <app-pdf-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Modifying..." [size]="120" />
                </div>
            }
            @if ((state$ | async)?.status === 'done') {
                <app-pdf-export-panel 
                  [outputBlob]="(state$ | async)?.outputBlob ?? null" 
                  [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" 
                  defaultFilename="omni_passwordProtector.pdf" 
                />
            }
         </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PasswordProtectorComponent, { className: "PasswordProtectorComponent", filePath: "src/app/modules/pdf/07-password-protector/passwordprotector.component.ts", lineNumber: 82 });
})();

// src/app/modules/pdf/07-password-protector/passwordProtector.service.ts
var PasswordProtectorService = class _PasswordProtectorService {
  prepareConfig() {
    return {};
  }
  static \u0275fac = function PasswordProtectorService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PasswordProtectorService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PasswordProtectorService, factory: _PasswordProtectorService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PasswordProtectorService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/modules/pdf/07-password-protector/passwordProtector.schema.ts
var PasswordProtectorSchema = external_exports.object({
  inputFile: PdfFileSchema
});
export {
  PasswordProtectorActions,
  PasswordProtectorComponent,
  PasswordProtectorSchema,
  PasswordProtectorService,
  passwordProtectorFeature,
  selectOutputBlob,
  selectPasswordProtectorCanProcess,
  selectPasswordProtectorIsLoading,
  selectPasswordProtectorPdfState,
  selectProgress,
  selectStatus
};
//# sourceMappingURL=chunk-BWCUWTSZ.js.map
