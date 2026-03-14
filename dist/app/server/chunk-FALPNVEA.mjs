import './polyfills.server.mjs';
import {
  ImageConverterActions,
  selectImageConverterState
} from "./chunk-ZXPU2NQO.mjs";
import {
  ConverterExportPanelComponent,
  ConverterFileDropZoneComponent
} from "./chunk-VFBLANU3.mjs";
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
  ɵɵtextInterpolate1
} from "./chunk-CX47CWGJ.mjs";
import "./chunk-UFAUNXOA.mjs";

// src/app/modules/converter/01-image-converter/image-converter.component.ts
function ImageConverterComponent_Conditional_11_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 19);
    \u0275\u0275text(1, " Converting... ");
  }
}
function ImageConverterComponent_Conditional_11_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F504} Convert Images ");
  }
}
function ImageConverterComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 12)(2, "label", 13);
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "async");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 14);
    \u0275\u0275pipe(6, "async");
    \u0275\u0275listener("input", function ImageConverterComponent_Conditional_11_Template_input_input_5_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onQualityChange(+$event.target.value));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 15)(8, "label", 16)(9, "input", 17);
    \u0275\u0275pipe(10, "async");
    \u0275\u0275listener("change", function ImageConverterComponent_Conditional_11_Template_input_change_9_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.store.dispatch(ctx_r1.actions.togglePreserveExif()));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, " Preserve EXIF ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "button", 18);
    \u0275\u0275pipe(13, "async");
    \u0275\u0275listener("click", function ImageConverterComponent_Conditional_11_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(14, ImageConverterComponent_Conditional_11_Conditional_14_Template, 2, 0);
    \u0275\u0275pipe(15, "async");
    \u0275\u0275conditionalBranchCreate(16, ImageConverterComponent_Conditional_11_Conditional_16_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Quality: ", (tmp_1_0 = \u0275\u0275pipeBind1(4, 5, ctx_r1.state$)) == null ? null : tmp_1_0.quality, "%");
    \u0275\u0275advance(2);
    \u0275\u0275property("value", ((tmp_2_0 = \u0275\u0275pipeBind1(6, 7, ctx_r1.state$)) == null ? null : tmp_2_0.quality) ?? 85);
    \u0275\u0275advance(4);
    \u0275\u0275property("checked", (tmp_3_0 = \u0275\u0275pipeBind1(10, 9, ctx_r1.state$)) == null ? null : tmp_3_0.preserveExif);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ((tmp_4_0 = \u0275\u0275pipeBind1(13, 11, ctx_r1.state$)) == null ? null : tmp_4_0.status) === "processing");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_5_0 = \u0275\u0275pipeBind1(15, 13, ctx_r1.state$)) == null ? null : tmp_5_0.status) === "processing" ? 14 : 16);
  }
}
function ImageConverterComponent_Conditional_13_Template(rf, ctx) {
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
    \u0275\u0275textInterpolate1(" \u26A0\uFE0F ", (tmp_1_0 = \u0275\u0275pipeBind1(2, 1, ctx_r1.state$)) == null ? null : tmp_1_0.errorMessage, " ");
  }
}
function ImageConverterComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-converter-progress-ring", 20);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("progress", ((tmp_1_0 = \u0275\u0275pipeBind1(2, 1, ctx_r1.state$)) == null ? null : tmp_1_0.progress) ?? 0);
  }
}
function ImageConverterComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-converter-export-panel", 11);
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
var OUTPUT_FORMATS = [
  { value: "jpeg", label: "JPEG", icon: "\u{1F5BC}\uFE0F" },
  { value: "png", label: "PNG", icon: "\u{1F3A8}" },
  { value: "webp", label: "WEBP", icon: "\u{1F310}" },
  { value: "avif", label: "AVIF", icon: "\u{1F680}", badge: "Best" },
  { value: "bmp", label: "BMP", icon: "\u{1F4CB}" },
  { value: "tiff", label: "TIFF", icon: "\u{1F4D0}" },
  { value: "gif", label: "GIF", icon: "\u{1F39E}\uFE0F" }
];
var ImageConverterComponent = class _ImageConverterComponent {
  store = inject(Store);
  state$ = this.store.select(selectImageConverterState);
  outputFormats = OUTPUT_FORMATS;
  actions = ImageConverterActions;
  onFilesSelected(files) {
    this.store.dispatch(ImageConverterActions.loadFiles({ files }));
  }
  onFormatChange(format) {
    this.store.dispatch(ImageConverterActions.setOutputFormat({ format }));
  }
  onQualityChange(quality) {
    this.store.dispatch(ImageConverterActions.setQuality({ quality }));
  }
  onProcess() {
    this.store.dispatch(ImageConverterActions.startProcessing());
  }
  ngOnDestroy() {
    this.store.dispatch(ImageConverterActions.resetState());
  }
  static \u0275fac = function ImageConverterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ImageConverterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ImageConverterComponent, selectors: [["app-image-converter"]], decls: 20, vars: 18, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-cyan-400", "to-purple-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "image/*", "label", "Drop images here or click to browse", 3, "filesSelected", "multiple", "maxSizeMB"], [3, "formatChange", "formats", "selected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [1, "flex", "justify-center", "p-8"], ["filename", "exia_image_converted", 3, "outputBlob", "outputSizeMB"], [1, "space-y-2"], [1, "text-xs", "text-white/40"], ["type", "range", "min", "1", "max", "100", 1, "w-full", "accent-cyan-400", 3, "input", "value"], [1, "flex", "gap-2"], [1, "flex", "items-center", "gap-2", "text-sm", "text-white/60", "cursor-pointer"], ["type", "checkbox", 1, "accent-cyan-400", 3, "change", "checked"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "transition-all", "duration-300", "flex", "items-center", "justify-center", "gap-2", "bg-gradient-to-r", "from-cyan-500", "to-blue-500", "text-black", "disabled:opacity-40", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin"], ["label", "Converting...", 3, "progress"]], template: function ImageConverterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F5BC}\uFE0F Image Format Converter ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Convert images between JPEG, PNG, WEBP, AVIF, BMP, TIFF, GIF formats");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-converter-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function ImageConverterComponent_Template_app_converter_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFilesSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "app-converter-format-selector", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275listener("formatChange", function ImageConverterComponent_Template_app_converter_format_selector_formatChange_9_listener($event) {
        return ctx.onFormatChange($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(11, ImageConverterComponent_Conditional_11_Template, 17, 15, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275conditionalCreate(13, ImageConverterComponent_Conditional_13_Template, 3, 3, "div", 9);
      \u0275\u0275pipe(14, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 5);
      \u0275\u0275conditionalCreate(16, ImageConverterComponent_Conditional_16_Template, 3, 3, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, ImageConverterComponent_Conditional_18_Template, 3, 6, "app-converter-export-panel", 11);
      \u0275\u0275pipe(19, "async");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_3_0;
      let tmp_4_0;
      let tmp_5_0;
      let tmp_6_0;
      let tmp_7_0;
      \u0275\u0275advance(8);
      \u0275\u0275property("multiple", true)("maxSizeMB", 50);
      \u0275\u0275advance();
      \u0275\u0275property("formats", ctx.outputFormats)("selected", ((tmp_3_0 = \u0275\u0275pipeBind1(10, 8, ctx.state$)) == null ? null : tmp_3_0.outputFormat) ?? "jpeg");
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_4_0 = \u0275\u0275pipeBind1(12, 10, ctx.state$)) == null ? null : tmp_4_0.inputFiles == null ? null : tmp_4_0.inputFiles.length) ? 11 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_5_0 = \u0275\u0275pipeBind1(14, 12, ctx.state$)) == null ? null : tmp_5_0.status) === "error" ? 13 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_6_0 = \u0275\u0275pipeBind1(17, 14, ctx.state$)) == null ? null : tmp_6_0.status) === "processing" ? 16 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_7_0 = \u0275\u0275pipeBind1(19, 16, ctx.state$)) == null ? null : tmp_7_0.status) === "done" ? 18 : -1);
    }
  }, dependencies: [CommonModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent, AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ImageConverterComponent, [{
    type: Component,
    args: [{
      selector: "app-image-converter",
      standalone: true,
      imports: [CommonModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          \u{1F5BC}\uFE0F Image Format Converter
        </h1>
        <p class="text-white/50 text-sm">Convert images between JPEG, PNG, WEBP, AVIF, BMP, TIFF, GIF formats</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-converter-file-drop-zone
            accept="image/*"
            [multiple]="true"
            [maxSizeMB]="50"
            label="Drop images here or click to browse"
            (filesSelected)="onFilesSelected($event)" />

          <app-converter-format-selector
            [formats]="outputFormats"
            [selected]="(state$ | async)?.outputFormat ?? 'jpeg'"
            (formatChange)="onFormatChange($event)" />

          @if ((state$ | async)?.inputFiles?.length) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="space-y-2">
                <label class="text-xs text-white/40">Quality: {{ (state$ | async)?.quality }}%</label>
                <input type="range" min="1" max="100" [value]="(state$ | async)?.quality ?? 85"
                  (input)="onQualityChange(+($any($event.target)).value)"
                  class="w-full accent-cyan-400" />
              </div>

              <div class="flex gap-2">
                <label class="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                  <input type="checkbox" [checked]="(state$ | async)?.preserveExif"
                    (change)="store.dispatch(actions.togglePreserveExif())"
                    class="accent-cyan-400" />
                  Preserve EXIF
                </label>
              </div>

              <button
                [disabled]="(state$ | async)?.status === 'processing'"
                (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                       bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed">
                @if ((state$ | async)?.status === 'processing') {
                  <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Converting...
                } @else { \u{1F504} Convert Images }
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
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8">
              <app-converter-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Converting..." />
            </div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-converter-export-panel
              [outputBlob]="(state$ | async)?.outputBlob ?? null"
              [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
              filename="exia_image_converted" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ImageConverterComponent, { className: "ImageConverterComponent", filePath: "src/app/modules/converter/01-image-converter/image-converter.component.ts", lineNumber: 107 });
})();
export {
  ImageConverterComponent
};
//# sourceMappingURL=chunk-FALPNVEA.mjs.map
