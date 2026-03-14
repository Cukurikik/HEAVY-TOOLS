import './polyfills.server.mjs';
import {
  CommonModule
} from "./chunk-PHM5A5ZP.mjs";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
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
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CX47CWGJ.mjs";

// src/app/modules/video/shared/components/file-drop-zone/file-drop-zone.component.ts
function FileDropZoneComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 3);
    \u0275\u0275domElement(1, "div", 6);
    \u0275\u0275domElementStart(2, "p", 7);
    \u0275\u0275text(3, "Validating file...");
    \u0275\u0275domElementEnd()();
  }
}
function FileDropZoneComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 4)(1, "div", 8);
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(2, "svg", 9);
    \u0275\u0275domElement(3, "path", 10);
    \u0275\u0275domElementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(4, "p", 11);
    \u0275\u0275text(5);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(6, "p", 12);
    \u0275\u0275text(7);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.selectedFileName());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.selectedFileSize());
  }
}
function FileDropZoneComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 4)(1, "div", 13);
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(2, "svg", 14);
    \u0275\u0275domElement(3, "path", 15);
    \u0275\u0275domElementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(4, "p", 16);
    \u0275\u0275text(5);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(6, "p", 12);
    \u0275\u0275text(7, "Click to try again");
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.errorMsg());
  }
}
function FileDropZoneComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 5)(1, "div", 17);
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(2, "svg", 18);
    \u0275\u0275domElement(3, "path", 19);
    \u0275\u0275domElementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(4, "div")(5, "p", 11);
    \u0275\u0275text(6);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(7, "p", 20);
    \u0275\u0275text(8);
    \u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r2.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Max ", ctx_r2.maxSizeMB >= 1024 ? (ctx_r2.maxSizeMB / 1024).toFixed(0) + "GB" : ctx_r2.maxSizeMB + "MB");
  }
}
var FileDropZoneComponent = class _FileDropZoneComponent {
  accept = "video/*";
  multiple = false;
  maxSizeMB = 2048;
  disabled = false;
  label = "Drop video file here or click to browse";
  filesSelected = new EventEmitter();
  validationError = new EventEmitter();
  isDragOver = signal(false, ...ngDevMode ? [{ debugName: "isDragOver" }] : (
    /* istanbul ignore next */
    []
  ));
  isValidating = signal(false, ...ngDevMode ? [{ debugName: "isValidating" }] : (
    /* istanbul ignore next */
    []
  ));
  hasFile = signal(false, ...ngDevMode ? [{ debugName: "hasFile" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedFileName = signal("", ...ngDevMode ? [{ debugName: "selectedFileName" }] : (
    /* istanbul ignore next */
    []
  ));
  selectedFileSize = signal("", ...ngDevMode ? [{ debugName: "selectedFileSize" }] : (
    /* istanbul ignore next */
    []
  ));
  errorMsg = signal("", ...ngDevMode ? [{ debugName: "errorMsg" }] : (
    /* istanbul ignore next */
    []
  ));
  onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }
  onDragLeave() {
    this.isDragOver.set(false);
  }
  onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
    const files = Array.from(event.dataTransfer?.files ?? []);
    if (files.length)
      this.processFiles(files);
  }
  onFileChange(event) {
    const input = event.target;
    const files = Array.from(input.files ?? []);
    if (files.length)
      this.processFiles(files);
    input.value = "";
  }
  processFiles(files) {
    this.isValidating.set(true);
    this.errorMsg.set("");
    const selected = this.multiple ? files : [files[0]];
    const maxBytes = this.maxSizeMB * 1048576;
    for (const file of selected) {
      if (file.size > maxBytes) {
        this.isValidating.set(false);
        this.errorMsg.set("File too large. Max " + (this.maxSizeMB >= 1024 ? this.maxSizeMB / 1024 + "GB" : this.maxSizeMB + "MB"));
        this.validationError.emit("FILE_TOO_LARGE");
        return;
      }
    }
    this.isValidating.set(false);
    this.hasFile.set(true);
    this.selectedFileName.set(selected.length === 1 ? selected[0].name : `${selected.length} files selected`);
    const totalMB = selected.reduce((s, f) => s + f.size, 0) / 1048576;
    this.selectedFileSize.set(`${totalMB.toFixed(2)} MB`);
    this.filesSelected.emit(selected);
  }
  static \u0275fac = function FileDropZoneComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FileDropZoneComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FileDropZoneComponent, selectors: [["app-file-drop-zone"]], inputs: { accept: "accept", multiple: "multiple", maxSizeMB: "maxSizeMB", disabled: "disabled", label: "label" }, outputs: { filesSelected: "filesSelected", validationError: "validationError" }, decls: 7, vars: 19, consts: [["fileInput", ""], [1, "relative", "flex", "flex-col", "items-center", "justify-center", "w-full", "min-h-[180px]", "rounded-2xl", "border-2", "border-dashed", "transition-all", "duration-300", "cursor-pointer", "select-none", 3, "dragover", "dragleave", "drop", "click"], ["type", "file", 1, "hidden", 3, "change", "accept", "multiple"], [1, "flex", "flex-col", "items-center", "gap-3"], [1, "flex", "flex-col", "items-center", "gap-2", "px-6", "text-center"], [1, "flex", "flex-col", "items-center", "gap-3", "px-6", "text-center", "pointer-events-none"], [1, "w-8", "h-8", "border-2", "border-cyan-400", "border-t-transparent", "rounded-full", "animate-spin"], [1, "text-sm", "text-white/60"], [1, "w-12", "h-12", "rounded-full", "bg-green-500/20", "flex", "items-center", "justify-center"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-6", "h-6", "text-green-400"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M5 13l4 4L19 7"], [1, "text-sm", "font-medium", "text-white"], [1, "text-xs", "text-white/50"], [1, "w-12", "h-12", "rounded-full", "bg-red-500/20", "flex", "items-center", "justify-center"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-6", "h-6", "text-red-400"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M6 18L18 6M6 6l12 12"], [1, "text-sm", "text-red-400"], [1, "w-14", "h-14", "rounded-full", "bg-cyan-500/10", "flex", "items-center", "justify-center", "border", "border-cyan-500/20"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-7", "h-7", "text-cyan-400"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "1.5", "d", "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"], [1, "text-xs", "text-white/40", "mt-1"]], template: function FileDropZoneComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275domElementStart(0, "div", 1);
      \u0275\u0275domListener("dragover", function FileDropZoneComponent_Template_div_dragover_0_listener($event) {
        return ctx.onDragOver($event);
      })("dragleave", function FileDropZoneComponent_Template_div_dragleave_0_listener() {
        return ctx.onDragLeave();
      })("drop", function FileDropZoneComponent_Template_div_drop_0_listener($event) {
        return ctx.onDrop($event);
      })("click", function FileDropZoneComponent_Template_div_click_0_listener() {
        \u0275\u0275restoreView(_r1);
        const fileInput_r2 = \u0275\u0275reference(2);
        return \u0275\u0275resetView(fileInput_r2.click());
      });
      \u0275\u0275domElementStart(1, "input", 2, 0);
      \u0275\u0275domListener("change", function FileDropZoneComponent_Template_input_change_1_listener($event) {
        return ctx.onFileChange($event);
      });
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(3, FileDropZoneComponent_Conditional_3_Template, 4, 0, "div", 3)(4, FileDropZoneComponent_Conditional_4_Template, 8, 2, "div", 4)(5, FileDropZoneComponent_Conditional_5_Template, 8, 1, "div", 4)(6, FileDropZoneComponent_Conditional_6_Template, 9, 2, "div", 5);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classProp("border-cyan-400", ctx.isDragOver())("bg-cyan-500/5", ctx.isDragOver())("border-red-500", ctx.errorMsg())("border-green-500", ctx.hasFile() && !ctx.errorMsg())("border-white/20", !ctx.isDragOver() && !ctx.hasFile() && !ctx.errorMsg())("bg-white/3", !ctx.isDragOver())("opacity-50", ctx.disabled)("pointer-events-none", ctx.disabled);
      \u0275\u0275advance();
      \u0275\u0275domProperty("accept", ctx.accept)("multiple", ctx.multiple);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.isValidating() ? 3 : ctx.hasFile() ? 4 : ctx.errorMsg() ? 5 : 6);
    }
  }, dependencies: [CommonModule], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FileDropZoneComponent, [{
    type: Component,
    args: [{
      selector: "app-file-drop-zone",
      standalone: true,
      imports: [CommonModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div
      class="relative flex flex-col items-center justify-center w-full min-h-[180px] rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer select-none"
      [class.border-cyan-400]="isDragOver()"
      [class.bg-cyan-500/5]="isDragOver()"
      [class.border-red-500]="errorMsg()"
      [class.border-green-500]="hasFile() && !errorMsg()"
      [class.border-white/20]="!isDragOver() && !hasFile() && !errorMsg()"
      [class.bg-white/3]="!isDragOver()"
      [class.opacity-50]="disabled"
      [class.pointer-events-none]="disabled"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
    >
      <input #fileInput type="file" [accept]="accept" [multiple]="multiple" class="hidden" (change)="onFileChange($event)" />

      @if (isValidating()) {
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm text-white/60">Validating file...</p>
        </div>
      } @else if (hasFile()) {
        <div class="flex flex-col items-center gap-2 px-6 text-center">
          <div class="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <p class="text-sm font-medium text-white">{{ selectedFileName() }}</p>
          <p class="text-xs text-white/50">{{ selectedFileSize() }}</p>
        </div>
      } @else if (errorMsg()) {
        <div class="flex flex-col items-center gap-2 px-6 text-center">
          <div class="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <p class="text-sm text-red-400">{{ errorMsg() }}</p>
          <p class="text-xs text-white/50">Click to try again</p>
        </div>
      } @else {
        <div class="flex flex-col items-center gap-3 px-6 text-center pointer-events-none">
          <div class="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <svg class="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-white">{{ label }}</p>
            <p class="text-xs text-white/40 mt-1">Max {{ maxSizeMB >= 1024 ? (maxSizeMB / 1024).toFixed(0) + 'GB' : maxSizeMB + 'MB' }}</p>
          </div>
        </div>
      }
    </div>
  `
    }]
  }], null, { accept: [{
    type: Input
  }], multiple: [{
    type: Input
  }], maxSizeMB: [{
    type: Input
  }], disabled: [{
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FileDropZoneComponent, { className: "FileDropZoneComponent", filePath: "src/app/modules/video/shared/components/file-drop-zone/file-drop-zone.component.ts", lineNumber: 70 });
})();

export {
  FileDropZoneComponent
};
//# sourceMappingURL=chunk-WUM57JDS.mjs.map
