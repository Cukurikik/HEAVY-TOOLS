import './polyfills.server.mjs';
import {
  CommonModule,
  DecimalPipe
} from "./chunk-PHM5A5ZP.mjs";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵgetCurrentView,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CX47CWGJ.mjs";

// src/app/modules/converter/shared/components/file-drop-zone/file-drop-zone.component.ts
var ConverterFileDropZoneComponent = class _ConverterFileDropZoneComponent {
  accept = "*/*";
  multiple = false;
  maxSizeMB = 500;
  label = "Drop files here or click to browse";
  filesSelected = new EventEmitter();
  validationError = new EventEmitter();
  isDragging = false;
  onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }
  onDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }
  onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(Array.from(files));
    }
  }
  onFileChange(event) {
    const input = event.target;
    if (input.files) {
      this.processFiles(Array.from(input.files));
      input.value = "";
    }
  }
  processFiles(files) {
    const maxBytes = this.maxSizeMB * 1024 * 1024;
    const valid = [];
    for (const file of files) {
      if (file.size > maxBytes) {
        this.validationError.emit(`File "${file.name}" exceeds ${this.maxSizeMB} MB limit`);
        continue;
      }
      valid.push(file);
    }
    if (valid.length > 0) {
      this.filesSelected.emit(valid);
    }
  }
  static \u0275fac = function ConverterFileDropZoneComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConverterFileDropZoneComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ConverterFileDropZoneComponent, selectors: [["app-converter-file-drop-zone"]], inputs: { accept: "accept", multiple: "multiple", maxSizeMB: "maxSizeMB", label: "label" }, outputs: { filesSelected: "filesSelected", validationError: "validationError" }, decls: 11, vars: 10, consts: [["fileInput", ""], [1, "relative", "border-2", "border-dashed", "rounded-2xl", "p-8", "text-center", "cursor-pointer", "transition-all", "duration-300", "hover:border-cyan-400/60", "hover:bg-cyan-400/5", "group", 3, "dragover", "dragleave", "drop", "click"], ["type", "file", 1, "hidden", 3, "change", "accept", "multiple"], [1, "space-y-3"], [1, "w-16", "h-16", "mx-auto", "rounded-2xl", "bg-white/5", "flex", "items-center", "justify-center", "group-hover:bg-cyan-400/10", "transition-colors", "duration-300"], [1, "text-3xl"], [1, "text-white/70", "text-sm", "font-medium"], [1, "text-white/30", "text-xs"]], template: function ConverterFileDropZoneComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275domElementStart(0, "div", 1);
      \u0275\u0275domListener("dragover", function ConverterFileDropZoneComponent_Template_div_dragover_0_listener($event) {
        return ctx.onDragOver($event);
      })("dragleave", function ConverterFileDropZoneComponent_Template_div_dragleave_0_listener($event) {
        return ctx.onDragLeave($event);
      })("drop", function ConverterFileDropZoneComponent_Template_div_drop_0_listener($event) {
        return ctx.onDrop($event);
      })("click", function ConverterFileDropZoneComponent_Template_div_click_0_listener() {
        \u0275\u0275restoreView(_r1);
        const fileInput_r2 = \u0275\u0275reference(2);
        return \u0275\u0275resetView(fileInput_r2.click());
      });
      \u0275\u0275domElementStart(1, "input", 2, 0);
      \u0275\u0275domListener("change", function ConverterFileDropZoneComponent_Template_input_change_1_listener($event) {
        return ctx.onFileChange($event);
      });
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "div", 3)(4, "div", 4)(5, "span", 5);
      \u0275\u0275text(6, "\u{1F4C1}");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(7, "p", 6);
      \u0275\u0275text(8);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(9, "p", 7);
      \u0275\u0275text(10);
      \u0275\u0275domElementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("border-cyan-400", ctx.isDragging)("bg-cyan-400/10", ctx.isDragging)("border-white/20", !ctx.isDragging);
      \u0275\u0275advance();
      \u0275\u0275domProperty("accept", ctx.accept)("multiple", ctx.multiple);
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate(ctx.label);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("Max ", ctx.maxSizeMB, " MB per file");
    }
  }, dependencies: [CommonModule], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConverterFileDropZoneComponent, [{
    type: Component,
    args: [{
      selector: "app-converter-file-drop-zone",
      standalone: true,
      imports: [CommonModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div
      class="relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
             hover:border-cyan-400/60 hover:bg-cyan-400/5 group"
      [class.border-cyan-400]="isDragging"
      [class.bg-cyan-400/10]="isDragging"
      [class.border-white/20]="!isDragging"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (click)="fileInput.click()">

      <input
        #fileInput
        type="file"
        class="hidden"
        [accept]="accept"
        [multiple]="multiple"
        (change)="onFileChange($event)" />

      <div class="space-y-3">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center
                    group-hover:bg-cyan-400/10 transition-colors duration-300">
          <span class="text-3xl">\u{1F4C1}</span>
        </div>
        <p class="text-white/70 text-sm font-medium">{{ label }}</p>
        <p class="text-white/30 text-xs">Max {{ maxSizeMB }} MB per file</p>
      </div>
    </div>
  `
    }]
  }], null, { accept: [{
    type: Input
  }], multiple: [{
    type: Input
  }], maxSizeMB: [{
    type: Input
  }], label: [{
    type: Input
  }], filesSelected: [{
    type: Output
  }], validationError: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConverterFileDropZoneComponent, { className: "ConverterFileDropZoneComponent", filePath: "src/app/modules/converter/shared/components/file-drop-zone/file-drop-zone.component.ts", lineNumber: 45 });
})();

// src/app/modules/converter/shared/components/export-panel/export-panel.component.ts
function ConverterExportPanelComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 5);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(2, 1, ctx_r0.outputSizeMB, "1.0-2"), " MB");
  }
}
var ConverterExportPanelComponent = class _ConverterExportPanelComponent {
  outputBlob = null;
  outputSizeMB = null;
  filename = "converted_file";
  disabled = false;
  download = new EventEmitter();
  onDownload() {
    if (!this.outputBlob)
      return;
    const url = URL.createObjectURL(this.outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = this.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 150);
  }
  static \u0275fac = function ConverterExportPanelComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConverterExportPanelComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ConverterExportPanelComponent, selectors: [["app-converter-export-panel"]], inputs: { outputBlob: "outputBlob", outputSizeMB: "outputSizeMB", filename: "filename", disabled: "disabled" }, outputs: { download: "download" }, decls: 10, vars: 3, consts: [[1, "p-4", "rounded-2xl", "bg-emerald-500/10", "border", "border-emerald-500/30", "space-y-3"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "gap-2"], [1, "text-emerald-400", "text-xl"], [1, "text-sm", "font-semibold", "text-emerald-400"], [1, "text-xs", "text-white/50"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-emerald-500", "to-teal-500", "text-black", "hover:shadow-lg", "hover:shadow-emerald-500/25", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"]], template: function ConverterExportPanelComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "span", 3);
      \u0275\u0275text(4, "\u2705");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(5, "span", 4);
      \u0275\u0275text(6, "Conversion Complete");
      \u0275\u0275domElementEnd()();
      \u0275\u0275conditionalCreate(7, ConverterExportPanelComponent_Conditional_7_Template, 3, 4, "span", 5);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(8, "button", 6);
      \u0275\u0275domListener("click", function ConverterExportPanelComponent_Template_button_click_8_listener() {
        return ctx.onDownload();
      });
      \u0275\u0275text(9);
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.outputSizeMB !== null ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275domProperty("disabled", ctx.disabled || !ctx.outputBlob);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" \u{1F4E5} Download ", ctx.filename, " ");
    }
  }, dependencies: [CommonModule, DecimalPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConverterExportPanelComponent, [{
    type: Component,
    args: [{
      selector: "app-converter-export-panel",
      standalone: true,
      imports: [CommonModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-emerald-400 text-xl">\u2705</span>
          <span class="text-sm font-semibold text-emerald-400">Conversion Complete</span>
        </div>
        @if (outputSizeMB !== null) {
          <span class="text-xs text-white/50">{{ outputSizeMB | number:'1.0-2' }} MB</span>
        }
      </div>
      <button
        [disabled]="disabled || !outputBlob"
        (click)="onDownload()"
        class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
               bg-gradient-to-r from-emerald-500 to-teal-500 text-black hover:shadow-lg hover:shadow-emerald-500/25
               disabled:opacity-40 disabled:cursor-not-allowed">
        \u{1F4E5} Download {{ filename }}
      </button>
    </div>
  `
    }]
  }], null, { outputBlob: [{
    type: Input
  }], outputSizeMB: [{
    type: Input
  }], filename: [{
    type: Input
  }], disabled: [{
    type: Input
  }], download: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConverterExportPanelComponent, { className: "ConverterExportPanelComponent", filePath: "src/app/modules/converter/shared/components/export-panel/export-panel.component.ts", lineNumber: 36 });
})();

export {
  ConverterFileDropZoneComponent,
  ConverterExportPanelComponent
};
//# sourceMappingURL=chunk-YU2YUYTE.mjs.map
