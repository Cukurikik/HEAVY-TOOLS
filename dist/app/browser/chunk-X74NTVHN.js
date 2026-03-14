import {
  CsvConverterActions,
  selectCsvConverterState
} from "./chunk-DPZZJE32.js";
import {
  ConverterExportPanelComponent,
  ConverterFileDropZoneComponent
} from "./chunk-O7EDJCHL.js";
import {
  ConverterFormatSelectorComponent,
  ConverterProgressRingComponent
} from "./chunk-VRLQR5OW.js";
import {
  Store
} from "./chunk-KGVNL5XR.js";
import {
  AsyncPipe,
  CommonModule
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
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-3GKPD7AG.js";
import "./chunk-KWSTWQNB.js";

// src/app/modules/converter/10-csv-converter/csv-converter.component.ts
function CsvConverterComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 12);
    \u0275\u0275text(1, " Processing... ");
  }
}
function CsvConverterComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F4CA} Convert ");
  }
}
function CsvConverterComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u26A0\uFE0F ", (tmp_1_0 = \u0275\u0275pipeBind1(2, 1, ctx_r0.state$)) == null ? null : tmp_1_0.errorMessage, " ");
  }
}
function CsvConverterComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-converter-progress-ring", 13);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("progress", ((tmp_1_0 = \u0275\u0275pipeBind1(2, 1, ctx_r0.state$)) == null ? null : tmp_1_0.progress) ?? 0);
  }
}
function CsvConverterComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-converter-export-panel", 11);
    \u0275\u0275pipe(1, "async");
    \u0275\u0275pipe(2, "async");
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("outputBlob", ((tmp_1_0 = \u0275\u0275pipeBind1(1, 2, ctx_r0.state$)) == null ? null : tmp_1_0.outputBlob) ?? null)("outputSizeMB", ((tmp_2_0 = \u0275\u0275pipeBind1(2, 4, ctx_r0.state$)) == null ? null : tmp_2_0.outputSizeMB) ?? null);
  }
}
var OUTPUT_FORMATS = [
  { value: "json", label: "JSON", icon: "\u{1F4C4}" },
  { value: "xlsx", label: "XLSX", icon: "\u{1F4C4}" },
  { value: "xml", label: "XML", icon: "\u{1F4C4}" },
  { value: "html", label: "HTML", icon: "\u{1F4C4}" },
  { value: "markdown", label: "MARKDOWN", icon: "\u{1F4C4}" },
  { value: "sql", label: "SQL", icon: "\u{1F4C4}" }
];
var CsvConverterComponent = class _CsvConverterComponent {
  store = inject(Store);
  state$ = this.store.select(selectCsvConverterState);
  outputFormats = OUTPUT_FORMATS;
  onFilesSelected(files) {
    this.store.dispatch(CsvConverterActions.loadFile({ file: files[0] }));
  }
  onFormatChange(format) {
    this.store.dispatch(CsvConverterActions.setOutputFormat({ format }));
  }
  onProcess() {
    this.store.dispatch(CsvConverterActions.startProcessing());
  }
  ngOnDestroy() {
    this.store.dispatch(CsvConverterActions.resetState());
  }
  static \u0275fac = function CsvConverterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CsvConverterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CsvConverterComponent, selectors: [["app-csv-converter"]], decls: 23, vars: 21, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-cyan-400", "to-purple-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", ".csv,.tsv,.txt", "label", "Drop file here or click to browse", 3, "filesSelected", "multiple", "maxSizeMB"], [3, "formatChange", "formats", "selected"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-cyan-500", "to-blue-500", "text-black", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [1, "flex", "justify-center", "p-8"], ["filename", "exia_csv_converter", 3, "outputBlob", "outputSizeMB"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Converting...", 3, "progress"]], template: function CsvConverterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F4CA} CSV Converter ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Convert CSV to JSON, Excel, XML, HTML table, Markdown, and SQL");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-converter-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function CsvConverterComponent_Template_app_converter_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFilesSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "app-converter-format-selector", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275listener("formatChange", function CsvConverterComponent_Template_app_converter_format_selector_formatChange_9_listener($event) {
        return ctx.onFormatChange($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "button", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275listener("click", function CsvConverterComponent_Template_button_click_11_listener() {
        return ctx.onProcess();
      });
      \u0275\u0275conditionalCreate(13, CsvConverterComponent_Conditional_13_Template, 2, 0);
      \u0275\u0275pipe(14, "async");
      \u0275\u0275conditionalBranchCreate(15, CsvConverterComponent_Conditional_15_Template, 1, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(16, CsvConverterComponent_Conditional_16_Template, 3, 3, "div", 9);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 5);
      \u0275\u0275conditionalCreate(19, CsvConverterComponent_Conditional_19_Template, 3, 3, "div", 10);
      \u0275\u0275pipe(20, "async");
      \u0275\u0275conditionalCreate(21, CsvConverterComponent_Conditional_21_Template, 3, 6, "app-converter-export-panel", 11);
      \u0275\u0275pipe(22, "async");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_3_0;
      let tmp_4_0;
      let tmp_5_0;
      let tmp_6_0;
      let tmp_7_0;
      let tmp_8_0;
      \u0275\u0275advance(8);
      \u0275\u0275property("multiple", false)("maxSizeMB", 100);
      \u0275\u0275advance();
      \u0275\u0275property("formats", ctx.outputFormats)("selected", ((tmp_3_0 = \u0275\u0275pipeBind1(10, 9, ctx.state$)) == null ? null : tmp_3_0.outputFormat) ?? "json");
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ((tmp_4_0 = \u0275\u0275pipeBind1(12, 11, ctx.state$)) == null ? null : tmp_4_0.status) === "processing");
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_5_0 = \u0275\u0275pipeBind1(14, 13, ctx.state$)) == null ? null : tmp_5_0.status) === "processing" ? 13 : 15);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_6_0 = \u0275\u0275pipeBind1(17, 15, ctx.state$)) == null ? null : tmp_6_0.status) === "error" ? 16 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_7_0 = \u0275\u0275pipeBind1(20, 17, ctx.state$)) == null ? null : tmp_7_0.status) === "processing" ? 19 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_8_0 = \u0275\u0275pipeBind1(22, 19, ctx.state$)) == null ? null : tmp_8_0.status) === "done" ? 21 : -1);
    }
  }, dependencies: [CommonModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent, AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CsvConverterComponent, [{
    type: Component,
    args: [{
      selector: "app-csv-converter",
      standalone: true,
      imports: [CommonModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          \u{1F4CA} CSV Converter
        </h1>
        <p class="text-white/50 text-sm">Convert CSV to JSON, Excel, XML, HTML table, Markdown, and SQL</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-converter-file-drop-zone
            accept=".csv,.tsv,.txt"
            [multiple]="false"
            [maxSizeMB]="100"
            label="Drop file here or click to browse"
            (filesSelected)="onFilesSelected($event)" />

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="(state$ | async)?.outputFormat ?? 'json'"
            (formatChange)="onFormatChange($event)" />

          <button
            [disabled]="(state$ | async)?.status === 'processing'"
            (click)="onProcess()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
            @if ((state$ | async)?.status === 'processing') {
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Processing...
            } @else { \u{1F4CA} Convert }
          </button>

          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              \u26A0\uFE0F {{ (state$ | async)?.errorMessage }}
            </div>
          }
        </div>

        <div class="space-y-4">
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-converter-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Converting..." />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-converter-export-panel
              [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              filename="exia_csv_converter" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CsvConverterComponent, { className: "CsvConverterComponent", filePath: "src/app/modules/converter/10-csv-converter/csv-converter.component.ts", lineNumber: 86 });
})();
export {
  CsvConverterComponent
};
//# sourceMappingURL=chunk-X74NTVHN.js.map
