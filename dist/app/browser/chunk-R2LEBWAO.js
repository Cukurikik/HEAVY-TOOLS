import {
  VideoConverterActions,
  selectVideoConverterState
} from "./chunk-4LCNL4TP.js";
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
} from "./chunk-3GKPD7AG.js";
import "./chunk-KWSTWQNB.js";

// src/app/modules/converter/02-video-converter/video-converter.component.ts
function VideoConverterComponent_Conditional_11_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 23);
    \u0275\u0275text(1, "Converting... ");
  }
}
function VideoConverterComponent_Conditional_11_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \u{1F504} Convert Video ");
  }
}
function VideoConverterComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 12)(2, "div")(3, "label", 13);
    \u0275\u0275text(4, "CRF Quality (0-51)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 14);
    \u0275\u0275pipe(6, "async");
    \u0275\u0275listener("input", function VideoConverterComponent_Conditional_11_Template_input_input_5_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCRFChange(+$event.target.value));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 15);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "async");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div")(11, "label", 13);
    \u0275\u0275text(12, "Encoding Speed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "select", 16);
    \u0275\u0275listener("change", function VideoConverterComponent_Conditional_11_Template_select_change_13_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSpeedChange($event.target.value));
    });
    \u0275\u0275elementStart(14, "option", 17);
    \u0275\u0275text(15, "Ultrafast");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "option", 18);
    \u0275\u0275text(17, "Fast");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "option", 19);
    \u0275\u0275text(19, "Medium");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "option", 20);
    \u0275\u0275text(21, "Slow");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "option", 21);
    \u0275\u0275text(23, "Very Slow");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(24, "button", 22);
    \u0275\u0275pipe(25, "async");
    \u0275\u0275listener("click", function VideoConverterComponent_Conditional_11_Template_button_click_24_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProcess());
    });
    \u0275\u0275conditionalCreate(26, VideoConverterComponent_Conditional_11_Conditional_26_Template, 2, 0);
    \u0275\u0275pipe(27, "async");
    \u0275\u0275conditionalBranchCreate(28, VideoConverterComponent_Conditional_11_Conditional_28_Template, 1, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ((tmp_1_0 = \u0275\u0275pipeBind1(6, 4, ctx_r1.state$)) == null ? null : tmp_1_0.crf) ?? 23);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((tmp_2_0 = \u0275\u0275pipeBind1(9, 6, ctx_r1.state$)) == null ? null : tmp_2_0.crf);
    \u0275\u0275advance(16);
    \u0275\u0275property("disabled", ((tmp_3_0 = \u0275\u0275pipeBind1(25, 8, ctx_r1.state$)) == null ? null : tmp_3_0.status) === "processing");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_4_0 = \u0275\u0275pipeBind1(27, 10, ctx_r1.state$)) == null ? null : tmp_4_0.status) === "processing" ? 26 : 28);
  }
}
function VideoConverterComponent_Conditional_13_Template(rf, ctx) {
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
function VideoConverterComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "app-converter-progress-ring", 24);
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
function VideoConverterComponent_Conditional_18_Template(rf, ctx) {
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
  { value: "mp4", label: "MP4", icon: "\u{1F3AC}" },
  { value: "mkv", label: "MKV", icon: "\u{1F4E6}" },
  { value: "mov", label: "MOV", icon: "\u{1F34E}" },
  { value: "avi", label: "AVI", icon: "\u{1F4FC}" },
  { value: "webm", label: "WEBM", icon: "\u{1F310}" },
  { value: "flv", label: "FLV", icon: "\u26A1" },
  { value: "wmv", label: "WMV", icon: "\u{1FA9F}" },
  { value: "gif", label: "GIF", icon: "\u{1F39E}\uFE0F" }
];
var VideoConverterComponent = class _VideoConverterComponent {
  store = inject(Store);
  state$ = this.store.select(selectVideoConverterState);
  formats = OUTPUT_FORMATS;
  onFileSelected(files) {
    this.store.dispatch(VideoConverterActions.loadFile({ file: files[0] }));
  }
  onFormatChange(format) {
    this.store.dispatch(VideoConverterActions.setOutputFormat({ format }));
  }
  onCRFChange(crf) {
    this.store.dispatch(VideoConverterActions.setCRF({ crf }));
  }
  onSpeedChange(speed) {
    this.store.dispatch(VideoConverterActions.setEncodingSpeed({ speed }));
  }
  onProcess() {
    this.store.dispatch(VideoConverterActions.startProcessing());
  }
  ngOnDestroy() {
    this.store.dispatch(VideoConverterActions.resetState());
  }
  static \u0275fac = function VideoConverterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VideoConverterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VideoConverterComponent, selectors: [["app-video-converter"]], decls: 20, vars: 17, consts: [[1, "min-h-screen", "bg-[#0a0a0f]", "p-6", "space-y-6"], [1, "space-y-1"], [1, "text-3xl", "font-bold", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-blue-400", "to-purple-400"], [1, "text-white/50", "text-sm"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], ["accept", "video/*", "label", "Drop video file here", 3, "filesSelected", "maxSizeMB"], [3, "formatChange", "formats", "selected"], [1, "p-4", "rounded-2xl", "bg-white/5", "border", "border-white/10", "space-y-4"], [1, "p-3", "rounded-xl", "bg-red-500/10", "border", "border-red-500/30", "text-sm", "text-red-400"], [1, "flex", "justify-center", "p-8"], ["filename", "exia_video_converted", 3, "outputBlob", "outputSizeMB"], [1, "grid", "grid-cols-2", "gap-3"], [1, "text-xs", "text-white/40"], ["type", "range", "min", "0", "max", "51", 1, "w-full", "accent-blue-400", 3, "input", "value"], [1, "text-xs", "text-white/50"], [1, "w-full", "px-2", "py-1", "mt-1", "text-sm", "bg-white/5", "border", "border-white/15", "rounded-lg", "text-white", 3, "change"], ["value", "ultrafast"], ["value", "fast"], ["value", "medium", "selected", ""], ["value", "slow"], ["value", "veryslow"], [1, "w-full", "py-3", "rounded-xl", "font-semibold", "text-sm", "bg-gradient-to-r", "from-blue-500", "to-purple-500", "text-black", "disabled:opacity-40", 3, "click", "disabled"], [1, "inline-block", "w-4", "h-4", "border-2", "border-current", "border-t-transparent", "rounded-full", "animate-spin", "mr-2"], ["label", "Encoding...", 3, "progress"]], template: function VideoConverterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " \u{1F3AC} Video Format Converter ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Convert between MP4, MKV, MOV, AVI, WEBM with codec and quality controls");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "app-converter-file-drop-zone", 6);
      \u0275\u0275listener("filesSelected", function VideoConverterComponent_Template_app_converter_file_drop_zone_filesSelected_8_listener($event) {
        return ctx.onFileSelected($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "app-converter-format-selector", 7);
      \u0275\u0275pipe(10, "async");
      \u0275\u0275listener("formatChange", function VideoConverterComponent_Template_app_converter_format_selector_formatChange_9_listener($event) {
        return ctx.onFormatChange($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(11, VideoConverterComponent_Conditional_11_Template, 29, 12, "div", 8);
      \u0275\u0275pipe(12, "async");
      \u0275\u0275conditionalCreate(13, VideoConverterComponent_Conditional_13_Template, 3, 3, "div", 9);
      \u0275\u0275pipe(14, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 5);
      \u0275\u0275conditionalCreate(16, VideoConverterComponent_Conditional_16_Template, 3, 3, "div", 10);
      \u0275\u0275pipe(17, "async");
      \u0275\u0275conditionalCreate(18, VideoConverterComponent_Conditional_18_Template, 3, 6, "app-converter-export-panel", 11);
      \u0275\u0275pipe(19, "async");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_3_0;
      let tmp_4_0;
      let tmp_5_0;
      let tmp_6_0;
      \u0275\u0275advance(8);
      \u0275\u0275property("maxSizeMB", 2048);
      \u0275\u0275advance();
      \u0275\u0275property("formats", ctx.formats)("selected", ((tmp_2_0 = \u0275\u0275pipeBind1(10, 7, ctx.state$)) == null ? null : tmp_2_0.outputFormat) ?? "mp4");
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_3_0 = \u0275\u0275pipeBind1(12, 9, ctx.state$)) == null ? null : tmp_3_0.inputFile) ? 11 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_4_0 = \u0275\u0275pipeBind1(14, 11, ctx.state$)) == null ? null : tmp_4_0.status) === "error" ? 13 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_5_0 = \u0275\u0275pipeBind1(17, 13, ctx.state$)) == null ? null : tmp_5_0.status) === "processing" ? 16 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(((tmp_6_0 = \u0275\u0275pipeBind1(19, 15, ctx.state$)) == null ? null : tmp_6_0.status) === "done" ? 18 : -1);
    }
  }, dependencies: [CommonModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent, AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VideoConverterComponent, [{
    type: Component,
    args: [{
      selector: "app-video-converter",
      standalone: true,
      imports: [CommonModule, ConverterFileDropZoneComponent, ConverterFormatSelectorComponent, ConverterProgressRingComponent, ConverterExportPanelComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          \u{1F3AC} Video Format Converter
        </h1>
        <p class="text-white/50 text-sm">Convert between MP4, MKV, MOV, AVI, WEBM with codec and quality controls</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <app-converter-file-drop-zone accept="video/*" [maxSizeMB]="2048" label="Drop video file here" (filesSelected)="onFileSelected($event)" />
          <app-converter-format-selector [formats]="formats" [selected]="(state$ | async)?.outputFormat ?? 'mp4'" (formatChange)="onFormatChange($event)" />

          @if ((state$ | async)?.inputFile) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-white/40">CRF Quality (0-51)</label>
                  <input type="range" min="0" max="51" [value]="(state$ | async)?.crf ?? 23"
                    (input)="onCRFChange(+($any($event.target)).value)" class="w-full accent-blue-400" />
                  <span class="text-xs text-white/50">{{ (state$ | async)?.crf }}</span>
                </div>
                <div>
                  <label class="text-xs text-white/40">Encoding Speed</label>
                  <select (change)="onSpeedChange(($any($event.target)).value)"
                    class="w-full px-2 py-1 mt-1 text-sm bg-white/5 border border-white/15 rounded-lg text-white">
                    <option value="ultrafast">Ultrafast</option>
                    <option value="fast">Fast</option>
                    <option value="medium" selected>Medium</option>
                    <option value="slow">Slow</option>
                    <option value="veryslow">Very Slow</option>
                  </select>
                </div>
              </div>
              <button [disabled]="(state$ | async)?.status === 'processing'" (click)="onProcess()"
                class="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-black disabled:opacity-40">
                @if ((state$ | async)?.status === 'processing') {
                  <div class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>Converting...
                } @else { \u{1F504} Convert Video }
              </button>
            </div>
          }
          @if ((state$ | async)?.status === 'error') {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">\u26A0\uFE0F {{ (state$ | async)?.errorMessage }}</div>
          }
        </div>
        <div class="space-y-4">
          @if ((state$ | async)?.status === 'processing') {
            <div class="flex justify-center p-8"><app-converter-progress-ring [progress]="(state$ | async)?.progress ?? 0" label="Encoding..." /></div>
          }
          @if ((state$ | async)?.status === 'done') {
            <app-converter-export-panel [outputBlob]="(state$ | async)?.outputBlob ?? null" [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null" filename="exia_video_converted" />
          }
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VideoConverterComponent, { className: "VideoConverterComponent", filePath: "src/app/modules/converter/02-video-converter/video-converter.component.ts", lineNumber: 89 });
})();
export {
  VideoConverterComponent
};
//# sourceMappingURL=chunk-R2LEBWAO.js.map
