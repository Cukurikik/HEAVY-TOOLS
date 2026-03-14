import {
  CommonModule
} from "./chunk-UWT53CRV.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-3GKPD7AG.js";

// src/app/modules/video/shared/components/progress-ring/progress-ring.component.ts
function ProgressRingComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 5);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.label);
  }
}
var ProgressRingComponent = class _ProgressRingComponent {
  progress = 0;
  size = 80;
  strokeWidth = 6;
  color = "#00f5ff";
  label = "";
  get radius() {
    return (100 - this.strokeWidth * 2) / 2;
  }
  get circumference() {
    return 2 * Math.PI * this.radius;
  }
  get dashOffset() {
    return this.circumference * (1 - this.progress / 100);
  }
  static \u0275fac = function ProgressRingComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProgressRingComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProgressRingComponent, selectors: [["app-progress-ring"]], inputs: { progress: "progress", size: "size", strokeWidth: "strokeWidth", color: "color", label: "label" }, decls: 7, vars: 13, consts: [[1, "flex", "flex-col", "items-center", "gap-2"], ["viewBox", "0 0 100 100"], ["cx", "50", "cy", "50", "fill", "none", "stroke", "rgba(255,255,255,0.08)"], ["cx", "50", "cy", "50", "fill", "none", "stroke-linecap", "round", "transform", "rotate(-90 50 50)", 2, "transition", "stroke-dashoffset 0.4s ease"], ["x", "50", "y", "50", "text-anchor", "middle", "dominant-baseline", "central", "fill", "white", "font-size", "18", "font-weight", "700", "font-family", "monospace"], [1, "text-xs", "text-white/60", "text-center"]], template: function ProgressRingComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0);
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(1, "svg", 1);
      \u0275\u0275domElement(2, "circle", 2)(3, "circle", 3);
      \u0275\u0275domElementStart(4, "text", 4);
      \u0275\u0275text(5);
      \u0275\u0275domElementEnd()();
      \u0275\u0275conditionalCreate(6, ProgressRingComponent_Conditional_6_Template, 2, 1, "p", 5);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275attribute("width", ctx.size)("height", ctx.size);
      \u0275\u0275advance();
      \u0275\u0275attribute("r", ctx.radius)("stroke-width", ctx.strokeWidth);
      \u0275\u0275advance();
      \u0275\u0275styleProp("filter", "drop-shadow(0 0 6px " + ctx.color + ")");
      \u0275\u0275attribute("r", ctx.radius)("stroke", ctx.color)("stroke-width", ctx.strokeWidth)("stroke-dasharray", ctx.circumference)("stroke-dashoffset", ctx.dashOffset);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("", ctx.progress, "%");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.label ? 6 : -1);
    }
  }, dependencies: [CommonModule], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressRingComponent, [{
    type: Component,
    args: [{
      selector: "app-progress-ring",
      standalone: true,
      imports: [CommonModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="flex flex-col items-center gap-2">
      <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 100 100">
        <circle cx="50" cy="50" [attr.r]="radius" fill="none" stroke="rgba(255,255,255,0.08)" [attr.stroke-width]="strokeWidth"/>
        <circle cx="50" cy="50" [attr.r]="radius" fill="none" [attr.stroke]="color" [attr.stroke-width]="strokeWidth"
          stroke-linecap="round" [attr.stroke-dasharray]="circumference" [attr.stroke-dashoffset]="dashOffset"
          transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 0.4s ease"
          [style.filter]="'drop-shadow(0 0 6px ' + color + ')'"/>
        <text x="50" y="50" text-anchor="middle" dominant-baseline="central"
          fill="white" font-size="18" font-weight="700" font-family="monospace">{{ progress }}%</text>
      </svg>
      @if (label) { <p class="text-xs text-white/60 text-center">{{ label }}</p> }
    </div>
  `
    }]
  }], null, { progress: [{
    type: Input
  }], size: [{
    type: Input
  }], strokeWidth: [{
    type: Input
  }], color: [{
    type: Input
  }], label: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProgressRingComponent, { className: "ProgressRingComponent", filePath: "src/app/modules/video/shared/components/progress-ring/progress-ring.component.ts", lineNumber: 24 });
})();

export {
  ProgressRingComponent
};
//# sourceMappingURL=chunk-5RQOTGLT.js.map
