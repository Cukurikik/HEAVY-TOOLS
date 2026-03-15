import {
  CommonModule
} from "./chunk-UWT53CRV.js";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵgetCurrentView,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵviewQuery
} from "./chunk-3GKPD7AG.js";

// src/app/modules/video/shared/components/video-preview/video-preview.component.ts
var _c0 = ["videoEl"];
function VideoPreviewComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 3);
    \u0275\u0275domElement(1, "div", 5);
    \u0275\u0275domElementEnd();
  }
}
function VideoPreviewComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "video", 6, 0);
    \u0275\u0275domListener("loadedmetadata", function VideoPreviewComponent_Conditional_3_Template_video_loadedmetadata_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onMetadataLoad());
    })("loadstart", function VideoPreviewComponent_Conditional_3_Template_video_loadstart_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.isLoading.set(true));
    })("canplay", function VideoPreviewComponent_Conditional_3_Template_video_canplay_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.isLoading.set(false));
    });
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275domProperty("src", ctx_r1.objectUrl(), \u0275\u0275sanitizeUrl)("controls", ctx_r1.showControls)("autoplay", ctx_r1.autoPlay);
  }
}
var VideoPreviewComponent = class _VideoPreviewComponent {
  file = null;
  currentTime = 0;
  showControls = true;
  autoPlay = false;
  durationDetected = new EventEmitter();
  metadataLoaded = new EventEmitter();
  videoEl;
  objectUrl = signal(null, ...ngDevMode ? [{ debugName: "objectUrl" }] : (
    /* istanbul ignore next */
    []
  ));
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : (
    /* istanbul ignore next */
    []
  ));
  _prevUrl = null;
  ngOnChanges(changes) {
    if (changes["file"] && this.file) {
      if (this._prevUrl)
        URL.revokeObjectURL(this._prevUrl);
      const url = URL.createObjectURL(this.file);
      this._prevUrl = url;
      this.objectUrl.set(url);
      this.isLoading.set(true);
    }
  }
  ngOnDestroy() {
    if (this._prevUrl)
      URL.revokeObjectURL(this._prevUrl);
  }
  onMetadataLoad() {
    const el = this.videoEl?.nativeElement;
    if (el)
      this.durationDetected.emit(el.duration);
    this.isLoading.set(false);
  }
  static \u0275fac = function VideoPreviewComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VideoPreviewComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VideoPreviewComponent, selectors: [["app-video-preview"]], viewQuery: function VideoPreviewComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.videoEl = _t.first);
    }
  }, inputs: { file: "file", currentTime: "currentTime", showControls: "showControls", autoPlay: "autoPlay" }, outputs: { durationDetected: "durationDetected", metadataLoaded: "metadataLoaded" }, features: [\u0275\u0275NgOnChangesFeature], decls: 4, vars: 2, consts: [["videoEl", ""], [1, "flex", "flex-col", "gap-3"], [1, "relative", "rounded-xl", "overflow-hidden", "bg-black/40", "border", "border-white/10", 2, "aspect-ratio", "16/9"], [1, "absolute", "inset-0", "flex", "items-center", "justify-center"], ["muted", "", 1, "w-full", "h-full", "object-contain", 3, "src", "controls", "autoplay"], [1, "w-8", "h-8", "border-2", "border-cyan-400", "border-t-transparent", "rounded-full", "animate-spin"], ["muted", "", 1, "w-full", "h-full", "object-contain", 3, "loadedmetadata", "loadstart", "canplay", "src", "controls", "autoplay"]], template: function VideoPreviewComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 1)(1, "div", 2);
      \u0275\u0275conditionalCreate(2, VideoPreviewComponent_Conditional_2_Template, 2, 0, "div", 3);
      \u0275\u0275conditionalCreate(3, VideoPreviewComponent_Conditional_3_Template, 2, 3, "video", 4);
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.isLoading() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.objectUrl() ? 3 : -1);
    }
  }, dependencies: [CommonModule], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VideoPreviewComponent, [{
    type: Component,
    args: [{
      selector: "app-video-preview",
      standalone: true,
      imports: [CommonModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="flex flex-col gap-3">
      <div class="relative rounded-xl overflow-hidden bg-black/40 border border-white/10" style="aspect-ratio:16/9">
        @if (isLoading()) {
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
        @if (objectUrl()) {
          <video #videoEl class="w-full h-full object-contain"
            [src]="objectUrl()" [controls]="showControls" [autoplay]="autoPlay" muted
            (loadedmetadata)="onMetadataLoad()"
            (loadstart)="isLoading.set(true)"
            (canplay)="isLoading.set(false)">
          </video>
        }
      </div>
    </div>
  `
    }]
  }], null, { file: [{
    type: Input
  }], currentTime: [{
    type: Input
  }], showControls: [{
    type: Input
  }], autoPlay: [{
    type: Input
  }], durationDetected: [{
    type: Output
  }], metadataLoaded: [{
    type: Output
  }], videoEl: [{
    type: ViewChild,
    args: ["videoEl"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VideoPreviewComponent, { className: "VideoPreviewComponent", filePath: "src/app/modules/video/shared/components/video-preview/video-preview.component.ts", lineNumber: 33 });
})();

export {
  VideoPreviewComponent
};
//# sourceMappingURL=chunk-SPI6KAK2.js.map
