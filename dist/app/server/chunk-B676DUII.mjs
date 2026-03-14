import './polyfills.server.mjs';
import {
  ToolCardComponent
} from "./chunk-4UPLWAQB.mjs";
import {
  MatIconModule
} from "./chunk-XTFUWX2R.mjs";
import "./chunk-EWZIGHTS.mjs";
import "./chunk-TXRVU6P6.mjs";
import {
  CommonModule
} from "./chunk-PHM5A5ZP.mjs";
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
} from "./chunk-CX47CWGJ.mjs";
import "./chunk-UFAUNXOA.mjs";

// src/app/modules/image-matrix/image-matrix.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function ImageMatrixComponent_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-tool-card", 5);
  }
  if (rf & 2) {
    const tool_r1 = ctx.$implicit;
    \u0275\u0275property("tool", tool_r1);
  }
}
var IMAGE_TOOLS = [
  { id: "upscale", label: "AI Upscaler", icon: "rocket_launch", category: "ai", status: "experimental" },
  { id: "heic", label: "HEIC Converter", icon: "image", category: "basic", status: "stable" },
  { id: "filter", label: "WebGL Filters", icon: "filter_b_and_w", category: "advanced", status: "stable" },
  { id: "ocr", label: "WASM OCR", icon: "document_scanner", category: "ai", status: "beta" },
  { id: "pdf", label: "PDF Engine", icon: "picture_as_pdf", category: "pro", status: "stable" },
  { id: "compress", label: "Smart Compress", icon: "compress", category: "basic", status: "stable" }
];
var ImageMatrixComponent = class _ImageMatrixComponent {
  imageTools = IMAGE_TOOLS;
  static \u0275fac = function ImageMatrixComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ImageMatrixComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ImageMatrixComponent, selectors: [["app-image-matrix"]], decls: 10, vars: 0, consts: [[1, "p-8", "space-y-8", "max-w-7xl", "mx-auto"], [1, "flex", "items-center", "justify-between", "mb-12"], [1, "text-4xl", "font-bold", "tracking-tight", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-accent-cyan", "to-status-success", "mb-2"], [1, "text-text-secondary"], [1, "grid", "grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4", "xl:grid-cols-5", "gap-6"], [3, "tool"]], template: function ImageMatrixComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "div")(3, "h1", 2);
      \u0275\u0275text(4, " Image Matrix ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 3);
      \u0275\u0275text(6, "GPU-accelerated image processing and AI vision.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(7, "section", 4);
      \u0275\u0275repeaterCreate(8, ImageMatrixComponent_For_9_Template, 1, 1, "app-tool-card", 5, _forTrack0);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275repeater(ctx.imageTools);
    }
  }, dependencies: [CommonModule, MatIconModule, ToolCardComponent], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ImageMatrixComponent, [{
    type: Component,
    args: [{
      selector: "app-image-matrix",
      standalone: true,
      imports: [CommonModule, MatIconModule, ToolCardComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="p-8 space-y-8 max-w-7xl mx-auto">
      <header class="flex items-center justify-between mb-12">
        <div>
          <h1 class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-status-success mb-2">
            Image Matrix
          </h1>
          <p class="text-text-secondary">GPU-accelerated image processing and AI vision.</p>
        </div>
      </header>

      <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        @for (tool of imageTools; track tool.id) {
          <app-tool-card [tool]="tool" />
        }
      </section>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ImageMatrixComponent, { className: "ImageMatrixComponent", filePath: "src/app/modules/image-matrix/image-matrix.component.ts", lineNumber: 39 });
})();
export {
  IMAGE_TOOLS,
  ImageMatrixComponent
};
//# sourceMappingURL=chunk-B676DUII.mjs.map
