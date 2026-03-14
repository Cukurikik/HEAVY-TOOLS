import './polyfills.server.mjs';
import {
  NumberBaseConverterActions,
  selectNumberBaseConverterState
} from "./chunk-JIXIAMOH.mjs";
import {
  ConverterFormatSelectorComponent,
  ConverterProgressRingComponent
} from "./chunk-TX4ZO7XK.mjs";
import {
  Store
} from "./chunk-GPJTNT77.mjs";
import {
  AsyncPipe,
  CommonModule
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
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CX47CWGJ.mjs";
import "./chunk-UFAUNXOA.mjs";

// src/app/modules/converter/17-number-base-converter/number-base-converter.component.ts
function NumberBaseConverterComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 13);
    \u0275\u0275text(1, " Processing... ");
  }
}
function NumberBaseConverterComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F522} Convert ");
  }
}
function NumberBaseConverterComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11);
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
function NumberBaseConverterComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275element(1, "app-converter-progress-ring", 14);
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
function NumberBaseConverterComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "div", 15)(2, "label", 7);
    \u0275\u0275text(3, "Output");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 16);
    \u0275\u0275listener("click", function NumberBaseConverterComponent_Conditional_24_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onCopy());
    });
    \u0275\u0275text(5, "\u{1F4CB} Copy");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "pre", 17);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "async");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate((tmp_1_0 = \u0275\u0275pipeBind1(8, 1, ctx_r0.state$)) == null ? null : tmp_1_0.outputText);
  }
}
var OUTPUT_FORMATS = [
  { value: "binary", label: "BINARY", icon: "\u{1F4C4}" },
  { value: "octal", label: "OCTAL", icon: "\u{1F4C4}" },
  { value: "decimal", label: "DECIMAL", icon: "\u{1F4C4}" },
  { value: "hex", label: "HEX", icon: "\u{1F4C4}" },
  { value: "base32", label: "BASE32", icon: "\u{1F4C4}" },
  { value: "base64", label: "BASE64", icon: "\u{1F4C4}" }
];
var NumberBaseConverterComponent = class _NumberBaseConverterComponent {
  store = inject(Store);
  state$ = this.store.select(selectNumberBaseConverterState);
  outputFormats = OUTPUT_FORMATS;
  onInputChange(value) {
    this.store.dispatch(NumberBaseConverterActions.setInputText({ text: value }));
  }
  onCopy() {
    this.store.dispatch(NumberBaseConverterActions.copyToClipboard());
  }
  onFormatChange(format) {
    this.store.dispatch(NumberBaseConverterActions.setOutputFormat({ format }));
  }
  onProcess() {
    this.store.dispatch(NumberBaseConverterActions.startProcessing());
  }
  ngOnDestroy() {
    this.store.dispatch(NumberBaseConverterActions.resetState());
  }
  static \u0275fac = function NumberBaseConverterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NumberBaseConverterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NumberBaseConverterComponent, selectors: [["app-number-base-converter"]], decls: 26, vars: 19, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-cyan-400", "to-purple-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-3"], [1, "text-xs", "text-white/40", "uppercase", "tracking-wider", "font-semibold"], ["rows", "6", "placeholder", "Enter value to convert...", 1, "w-full", "px-3", "py-2", "text-sm", "bg-white/5", "border", "border-white/15", "rounded-xl", "text-white", "placeholder-white/20", "focus:outline-none", "focus:border-cyan-400", "resize-none", "font-mono", 3, "input"], [3, "formatChange", "formats", "selected"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-cyan-500", "to-blue-500", "text-black", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [1, "flex", "justify-center", "p-8"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Converting...", 3, "progress"], [1, "flex", "items-center", "justify-between"], [1, "text-xs", "text-cyan-400", "hover:text-cyan-300", 3, "click"], [1, "text-sm", "text-white/80", "font-mono", "whitespace-pre-wrap", "break-all", "bg-white/5", "p-3", "rounded-lg", "max-h-64", "overflow-auto"]], template: function NumberBaseConverterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F522} Number Base Converter ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Convert numbers between binary, octal, decimal, hexadecimal, and custom bases");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "div", 6)(9, "label", 7);
      \u0275\u0275text(10, "Input");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "textarea", 8);
      \u0275\u0275listener("input", function NumberBaseConverterComponent_Template_textarea_input_11_listener($event) {
        return ctx.onInputChange($event.target.value);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "app-converter-format-selector", 9);
      \u0275\u0275pipe(13, "async");
      \u0275\u0275listener("formatChange", function NumberBaseConverterComponent_Template_app_converter_format_selector_formatChange_12_listener($event) {
        return ctx.onFormatChange($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "button", 10);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275listener("click", function NumberBaseConverterComponent_Template_button_click_14_listener() {
        return ctx.onProcess();
      });
      \u0275\u0275conditionalCreate(16, NumberBaseConverterComponent_Conditional_16_Template, 2, 0);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalBranchCreate(18, NumberBaseConverterComponent_Conditional_18_Template, 1, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(19, NumberBaseConverterComponent_Conditional_19_Template, 3, 3, "div", 11);
      \u0275\u0275pipe(20, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "div", 5);
      \u0275\u0275conditionalCreate(22, NumberBaseConverterComponent_Conditional_22_Template, 3, 3, "div", 12);
      \u0275\u0275pipe(23, "async");
      \u0275\u0275conditionalCreate(24, NumberBaseConverterComponent_Conditional_24_Template, 9, 3, "div", 6);
      \u0275\u0275pipe(25, "async");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_2_0;
      let tmp_3_0;
      let tmp_4_0;
      let tmp_5_0;
      let tmp_6_0;
      \u0275\u0275advance(12);
      \u0275\u0275property("formats", ctx.outputFormats)("selected", ((tmp_1_0 = \u0275\u0275pipeBind1(13, 7, ctx.state$)) == null ? null : tmp_1_0.outputFormat) ?? "binary");
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ((tmp_2_0 = \u0275\u0275pipeBind1(15, 9, ctx.state$)) == null ? null : tmp_2_0.status) === "processing");
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_3_0 = \u0275\u0275pipeBind1(17, 11, ctx.state$)) == null ? null : tmp_3_0.status) === "processing" ? 16 : 18);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_4_0 = \u0275\u0275pipeBind1(20, 13, ctx.state$)) == null ? null : tmp_4_0.status) === "error" ? 19 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_5_0 = \u0275\u0275pipeBind1(23, 15, ctx.state$)) == null ? null : tmp_5_0.status) === "processing" ? 22 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_6_0 = \u0275\u0275pipeBind1(25, 17, ctx.state$)) == null ? null : tmp_6_0.outputText) ? 24 : -1);
    }
  }, dependencies: [CommonModule, ConverterFormatSelectorComponent, ConverterProgressRingComponent, AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NumberBaseConverterComponent, [{
    type: Component,
    args: [{
      selector: "app-number-base-converter",
      standalone: true,
      imports: [CommonModule, ConverterFormatSelectorComponent, ConverterProgressRingComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          \u{1F522} Number Base Converter
        </h1>
        <p class="text-white/50 text-sm">Convert numbers between binary, octal, decimal, hexadecimal, and custom bases</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <!-- Text input mode for utility converters -->
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <label class="text-xs text-white/40 uppercase tracking-wider font-semibold">Input</label>
            <textarea
              rows="6"
              placeholder="Enter value to convert..."
              (input)="onInputChange(($any($event.target)).value)"
              class="w-full px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 resize-none font-mono"></textarea>
          </div>

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="(state$ | async)?.outputFormat ?? 'binary'"
            (formatChange)="onFormatChange($event)" />

          <button
            [disabled]="(state$ | async)?.status === 'processing'"
            (click)="onProcess()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
            @if ((state$ | async)?.status === 'processing') {
              <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Processing...
            } @else { \u{1F522} Convert }
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
          @if ((state$ | async)?.outputText) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs text-white/40 uppercase tracking-wider font-semibold">Output</label>
                <button (click)="onCopy()" class="text-xs text-cyan-400 hover:text-cyan-300">\u{1F4CB} Copy</button>
              </div>
              <pre class="text-sm text-white/80 font-mono whitespace-pre-wrap break-all bg-white/5 p-3 rounded-lg max-h-64 overflow-auto">{{ (state$ | async)?.outputText }}</pre>
            </div>
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NumberBaseConverterComponent, { className: "NumberBaseConverterComponent", filePath: "src/app/modules/converter/17-number-base-converter/number-base-converter.component.ts", lineNumber: 90 });
})();
export {
  NumberBaseConverterComponent
};
//# sourceMappingURL=chunk-HVBUMO6L.mjs.map
