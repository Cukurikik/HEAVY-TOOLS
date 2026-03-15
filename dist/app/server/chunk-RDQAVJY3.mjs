import './polyfills.server.mjs';
import {
  WorkerBridgeService
} from "./chunk-3HE7FIEH.mjs";
import {
  CommonModule
} from "./chunk-PHM5A5ZP.mjs";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵgetCurrentView,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CX47CWGJ.mjs";

// src/app/modules/video/shared/components/export-panel/export-panel.component.ts
function ExportPanelComponent_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "button", 10);
    \u0275\u0275domListener("click", function ExportPanelComponent_For_3_Template_button_click_0_listener() {
      const fmt_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.selectedFormat.set(fmt_r2));
    });
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const fmt_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("bg-cyan-500", ctx_r2.selectedFormat() === fmt_r2)("text-black", ctx_r2.selectedFormat() === fmt_r2)("bg-white/10", ctx_r2.selectedFormat() !== fmt_r2)("text-white/70", ctx_r2.selectedFormat() !== fmt_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(fmt_r2);
  }
}
function ExportPanelComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 6);
    \u0275\u0275text(1, "Output size: ");
    \u0275\u0275domElementStart(2, "span", 11);
    \u0275\u0275text(3);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", ctx_r2.outputSizeMB.toFixed(2), " MB");
  }
}
var ExportPanelComponent = class _ExportPanelComponent {
  outputBlob = null;
  availableFormats = ["mp4", "webm", "mov"];
  defaultFilename = "omni_output";
  outputSizeMB = null;
  download = new EventEmitter();
  bridge = inject(WorkerBridgeService);
  selectedFormat = signal("mp4", ...ngDevMode ? [{ debugName: "selectedFormat" }] : (
    /* istanbul ignore next */
    []
  ));
  customFilename = signal("", ...ngDevMode ? [{ debugName: "customFilename" }] : (
    /* istanbul ignore next */
    []
  ));
  onFilenameInput(event) {
    const val = event.target.value;
    this.customFilename.set(val);
  }
  onDownload() {
    if (!this.outputBlob)
      return;
    const config = {
      format: this.selectedFormat(),
      codec: "",
      quality: "balanced",
      filename: (this.customFilename() || this.defaultFilename) + "." + this.selectedFormat()
    };
    this.download.emit(config);
    this.bridge.downloadBlob(this.outputBlob, config.filename);
  }
  static \u0275fac = function ExportPanelComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ExportPanelComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ExportPanelComponent, selectors: [["app-export-panel"]], inputs: { outputBlob: "outputBlob", availableFormats: "availableFormats", defaultFilename: "defaultFilename", outputSizeMB: "outputSizeMB" }, outputs: { download: "download" }, decls: 13, vars: 19, consts: [[1, "flex", "flex-col", "gap-4", "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10"], [1, "flex", "flex-wrap", "gap-2"], [1, "px-3", "py-1.5", "rounded-lg", "text-xs", "font-semibold", "uppercase", "tracking-wide", "transition-all", 3, "bg-cyan-500", "text-black", "bg-white/10", "text-white/70"], [1, "flex", "items-center", "gap-2"], ["type", "text", "placeholder", "Output filename", 1, "flex-1", "px-3", "py-2", "text-sm", "bg-white/5", "border", "border-white/15", "rounded-lg", "text-white", "placeholder-white/30", "focus:outline-none", "focus:border-cyan-400", 3, "input", "value"], [1, "text-sm", "text-white/40"], [1, "text-sm", "text-white/60"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", 3, "click", "disabled"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-4", "h-4"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"], [1, "px-3", "py-1.5", "rounded-lg", "text-xs", "font-semibold", "uppercase", "tracking-wide", "transition-all", 3, "click"], [1, "text-white", "font-medium"]], template: function ExportPanelComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275repeaterCreate(2, ExportPanelComponent_For_3_Template, 2, 9, "button", 2, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(4, "div", 3)(5, "input", 4);
      \u0275\u0275domListener("input", function ExportPanelComponent_Template_input_input_5_listener($event) {
        return ctx.onFilenameInput($event);
      });
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(6, "span", 5);
      \u0275\u0275text(7);
      \u0275\u0275domElementEnd()();
      \u0275\u0275conditionalCreate(8, ExportPanelComponent_Conditional_8_Template, 4, 1, "p", 6);
      \u0275\u0275domElementStart(9, "button", 7);
      \u0275\u0275domListener("click", function ExportPanelComponent_Template_button_click_9_listener() {
        return ctx.onDownload();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(10, "svg", 8);
      \u0275\u0275domElement(11, "path", 9);
      \u0275\u0275domElementEnd();
      \u0275\u0275text(12);
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.availableFormats);
      \u0275\u0275advance(3);
      \u0275\u0275domProperty("value", ctx.customFilename() || ctx.defaultFilename);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(".", ctx.selectedFormat());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.outputSizeMB !== null ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275classProp("bg-gradient-to-r", !!ctx.outputBlob)("from-cyan-500", !!ctx.outputBlob)("to-cyan-400", !!ctx.outputBlob)("text-black", !!ctx.outputBlob)("bg-white/5", !ctx.outputBlob)("text-white/30", !ctx.outputBlob)("cursor-not-allowed", !ctx.outputBlob);
      \u0275\u0275domProperty("disabled", !ctx.outputBlob);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ctx.outputBlob ? "Download " + ctx.selectedFormat().toUpperCase() : "No output yet", " ");
    }
  }, dependencies: [CommonModule], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ExportPanelComponent, [{
    type: Component,
    args: [{
      selector: "app-export-panel",
      standalone: true,
      imports: [CommonModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="flex flex-col gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
      <div class="flex flex-wrap gap-2">
        @for (fmt of availableFormats; track fmt) {
          <button (click)="selectedFormat.set(fmt)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all"
            [class.bg-cyan-500]="selectedFormat() === fmt"
            [class.text-black]="selectedFormat() === fmt"
            [class.bg-white/10]="selectedFormat() !== fmt"
            [class.text-white/70]="selectedFormat() !== fmt">{{ fmt }}</button>
        }
      </div>
      <div class="flex items-center gap-2">
        <input type="text" [value]="customFilename() || defaultFilename"
          (input)="onFilenameInput($event)"
          placeholder="Output filename"
          class="flex-1 px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"/>
        <span class="text-sm text-white/40">.{{ selectedFormat() }}</span>
      </div>
      @if (outputSizeMB !== null) {
        <p class="text-sm text-white/60">Output size: <span class="text-white font-medium">{{ outputSizeMB.toFixed(2) }} MB</span></p>
      }
      <button [disabled]="!outputBlob" (click)="onDownload()"
        class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
        [class.bg-gradient-to-r]="!!outputBlob" [class.from-cyan-500]="!!outputBlob" [class.to-cyan-400]="!!outputBlob"
        [class.text-black]="!!outputBlob" [class.bg-white/5]="!outputBlob" [class.text-white/30]="!outputBlob"
        [class.cursor-not-allowed]="!outputBlob">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        {{ outputBlob ? 'Download ' + selectedFormat().toUpperCase() : 'No output yet' }}
      </button>
    </div>
  `
    }]
  }], null, { outputBlob: [{
    type: Input
  }], availableFormats: [{
    type: Input
  }], defaultFilename: [{
    type: Input
  }], outputSizeMB: [{
    type: Input
  }], download: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ExportPanelComponent, { className: "ExportPanelComponent", filePath: "src/app/modules/video/shared/components/export-panel/export-panel.component.ts", lineNumber: 46 });
})();

export {
  ExportPanelComponent
};
//# sourceMappingURL=chunk-RDQAVJY3.mjs.map
