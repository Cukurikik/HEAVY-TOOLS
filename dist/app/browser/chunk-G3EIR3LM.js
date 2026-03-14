import {
  ToolCardComponent
} from "./chunk-KWKFZG7B.js";
import {
  MatIconModule
} from "./chunk-5TJA43SS.js";
import "./chunk-ZI72GIQ4.js";
import "./chunk-DRIX56V4.js";
import {
  CommonModule
} from "./chunk-UWT53CRV.js";
import {
  ChangeDetectionStrategy,
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext
} from "./chunk-3GKPD7AG.js";
import "./chunk-KWSTWQNB.js";

// src/app/modules/video-engine/video-engine.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function VideoEngineComponent_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-tool-card", 8);
  }
  if (rf & 2) {
    const tool_r1 = ctx.$implicit;
    \u0275\u0275property("tool", tool_r1);
  }
}
var VIDEO_TOOLS = [
  { id: "trim", label: "Video Trimmer", icon: "content_cut", category: "basic", status: "stable" },
  { id: "merge", label: "Video Merger", icon: "link", category: "basic", status: "stable" },
  { id: "convert", label: "Format Converter", icon: "sync", category: "basic", status: "stable" },
  { id: "compress", label: "Compressor", icon: "compress", category: "basic", status: "stable" },
  { id: "stabilize", label: "Stabilizer", icon: "center_focus_strong", category: "advanced", status: "stable" },
  { id: "reverse", label: "Reverse", icon: "fast_rewind", category: "advanced", status: "stable" },
  { id: "speed", label: "Speed Control", icon: "speed", category: "advanced", status: "stable" },
  { id: "loop", label: "Loop Engine", icon: "loop", category: "advanced", status: "stable" },
  { id: "flip", label: "Flip & Rotate", icon: "flip", category: "advanced", status: "stable" },
  { id: "crop", label: "Smart Crop", icon: "crop", category: "advanced", status: "stable" },
  { id: "pro-editor", label: "Pro Editor", icon: "movie_creation", category: "pro", status: "beta" },
  { id: "color", label: "Color Grading", icon: "palette", category: "pro", status: "beta" },
  { id: "subtitle", label: "Subtitle Burner", icon: "subtitles", category: "pro", status: "stable" },
  { id: "thumbnail", label: "Thumbnail Gen", icon: "image", category: "pro", status: "stable" },
  { id: "upscale", label: "AI Upscaler", icon: "rocket_launch", category: "ai", status: "experimental" },
  { id: "denoise", label: "AI Denoiser", icon: "auto_awesome", category: "ai", status: "experimental" }
];
var VideoEngineComponent = class _VideoEngineComponent {
  videoTools = VIDEO_TOOLS;
  static \u0275fac = function VideoEngineComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VideoEngineComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VideoEngineComponent, selectors: [["app-video-engine"]], decls: 19, vars: 0, consts: [[1, "p-8", "space-y-8", "max-w-7xl", "mx-auto"], [1, "flex", "items-center", "justify-between", "mb-12"], [1, "text-4xl", "font-bold", "tracking-tight", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-accent-cyan", "to-accent-purple", "mb-2"], [1, "text-text-secondary"], [1, "hidden", "md:flex", "items-center", "gap-2", "bg-white/5", "p-1", "rounded-xl", "border", "border-white/10"], [1, "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "bg-white/10", "text-white", "shadow-sm"], [1, "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "text-text-secondary", "hover:text-white", "hover:bg-white/5", "transition-colors"], [1, "grid", "grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4", "xl:grid-cols-5", "gap-6"], [3, "tool"]], template: function VideoEngineComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "div")(3, "h1", 2);
      \u0275\u0275text(4, " Video Engine ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 3);
      \u0275\u0275text(6, "WASM-powered video processing. Zero server upload required.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 4)(8, "button", 5);
      \u0275\u0275text(9, "All");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "button", 6);
      \u0275\u0275text(11, "Basic");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "button", 6);
      \u0275\u0275text(13, "Advanced");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "button", 6);
      \u0275\u0275text(15, "AI");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(16, "section", 7);
      \u0275\u0275repeaterCreate(17, VideoEngineComponent_For_18_Template, 1, 1, "app-tool-card", 8, _forTrack0);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(17);
      \u0275\u0275repeater(ctx.videoTools);
    }
  }, dependencies: [CommonModule, MatIconModule, ToolCardComponent], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VideoEngineComponent, [{
    type: Component,
    args: [{
      selector: "app-video-engine",
      standalone: true,
      imports: [CommonModule, MatIconModule, ToolCardComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="p-8 space-y-8 max-w-7xl mx-auto">
      <header class="flex items-center justify-between mb-12">
        <div>
          <h1 class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple mb-2">
            Video Engine
          </h1>
          <p class="text-text-secondary">WASM-powered video processing. Zero server upload required.</p>
        </div>
        <div class="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button class="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white shadow-sm">All</button>
          <button class="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">Basic</button>
          <button class="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">Advanced</button>
          <button class="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">AI</button>
        </div>
      </header>

      <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        @for (tool of videoTools; track tool.id) {
          <app-tool-card [tool]="tool" />
        }
      </section>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VideoEngineComponent, { className: "VideoEngineComponent", filePath: "src/app/modules/video-engine/video-engine.component.ts", lineNumber: 55 });
})();
export {
  VIDEO_TOOLS,
  VideoEngineComponent
};
//# sourceMappingURL=chunk-G3EIR3LM.js.map
