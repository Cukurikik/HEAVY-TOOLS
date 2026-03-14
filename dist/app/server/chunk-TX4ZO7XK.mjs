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
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵgetCurrentView,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CX47CWGJ.mjs";

// src/app/modules/converter/shared/components/format-selector/format-selector.component.ts
var _forTrack0 = ($index, $item) => $item.value;
function ConverterFormatSelectorComponent_For_5_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 7);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const fmt_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", fmt_r2.badge, " ");
  }
}
function ConverterFormatSelectorComponent_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "button", 4);
    \u0275\u0275domListener("click", function ConverterFormatSelectorComponent_For_5_Template_button_click_0_listener() {
      const fmt_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onSelect(fmt_r2.value));
    });
    \u0275\u0275domElementStart(1, "span", 5);
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "span", 6);
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd();
    \u0275\u0275conditionalCreate(5, ConverterFormatSelectorComponent_For_5_Conditional_5_Template, 2, 1, "span", 7);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const fmt_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("border-cyan-400", ctx_r2.selected === fmt_r2.value)("bg-cyan-400/10", ctx_r2.selected === fmt_r2.value)("text-cyan-400", ctx_r2.selected === fmt_r2.value)("border-white/10", ctx_r2.selected !== fmt_r2.value)("bg-white/5", ctx_r2.selected !== fmt_r2.value)("text-white/70", ctx_r2.selected !== fmt_r2.value)("hover:border-white/30", ctx_r2.selected !== fmt_r2.value)("hover:bg-white/10", ctx_r2.selected !== fmt_r2.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fmt_r2.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fmt_r2.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(fmt_r2.badge ? 5 : -1);
  }
}
var ConverterFormatSelectorComponent = class _ConverterFormatSelectorComponent {
  formats = [];
  selected = "";
  formatChange = new EventEmitter();
  onSelect(value) {
    this.formatChange.emit(value);
  }
  static \u0275fac = function ConverterFormatSelectorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConverterFormatSelectorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ConverterFormatSelectorComponent, selectors: [["app-converter-format-selector"]], inputs: { formats: "formats", selected: "selected" }, outputs: { formatChange: "formatChange" }, decls: 6, vars: 0, consts: [[1, "space-y-2"], [1, "text-xs", "text-white/40", "uppercase", "tracking-wider", "font-semibold"], [1, "grid", "grid-cols-3", "sm:grid-cols-4", "md:grid-cols-5", "gap-2"], [1, "relative", "p-3", "rounded-xl", "text-center", "transition-all", "duration-200", "border", "text-sm", "font-medium", 3, "border-cyan-400", "bg-cyan-400/10", "text-cyan-400", "border-white/10", "bg-white/5", "text-white/70", "hover:border-white/30", "hover:bg-white/10"], [1, "relative", "p-3", "rounded-xl", "text-center", "transition-all", "duration-200", "border", "text-sm", "font-medium", 3, "click"], [1, "text-lg", "block", "mb-1"], [1, "text-xs", "uppercase", "font-bold", "tracking-wide"], [1, "absolute", "-top-1", "-right-1", "text-[8px]", "px-1.5", "py-0.5", "rounded-full", "bg-accent-purple/80", "text-white", "font-bold"]], template: function ConverterFormatSelectorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "label", 1);
      \u0275\u0275text(2, "Output Format");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "div", 2);
      \u0275\u0275repeaterCreate(4, ConverterFormatSelectorComponent_For_5_Template, 6, 19, "button", 3, _forTrack0);
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275repeater(ctx.formats);
    }
  }, dependencies: [CommonModule], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConverterFormatSelectorComponent, [{
    type: Component,
    args: [{
      selector: "app-converter-format-selector",
      standalone: true,
      imports: [CommonModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="space-y-2">
      <label class="text-xs text-white/40 uppercase tracking-wider font-semibold">Output Format</label>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        @for (fmt of formats; track fmt.value) {
          <button
            (click)="onSelect(fmt.value)"
            class="relative p-3 rounded-xl text-center transition-all duration-200 border text-sm font-medium"
            [class.border-cyan-400]="selected === fmt.value"
            [class.bg-cyan-400/10]="selected === fmt.value"
            [class.text-cyan-400]="selected === fmt.value"
            [class.border-white/10]="selected !== fmt.value"
            [class.bg-white/5]="selected !== fmt.value"
            [class.text-white/70]="selected !== fmt.value"
            [class.hover:border-white/30]="selected !== fmt.value"
            [class.hover:bg-white/10]="selected !== fmt.value">
            <span class="text-lg block mb-1">{{ fmt.icon }}</span>
            <span class="text-xs uppercase font-bold tracking-wide">{{ fmt.label }}</span>
            @if (fmt.badge) {
              <span class="absolute -top-1 -right-1 text-[8px] px-1.5 py-0.5 rounded-full bg-accent-purple/80 text-white font-bold">
                {{ fmt.badge }}
              </span>
            }
          </button>
        }
      </div>
    </div>
  `
    }]
  }], null, { formats: [{
    type: Input
  }], selected: [{
    type: Input
  }], formatChange: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConverterFormatSelectorComponent, { className: "ConverterFormatSelectorComponent", filePath: "src/app/modules/converter/shared/components/format-selector/format-selector.component.ts", lineNumber: 50 });
})();

// src/app/modules/converter/shared/components/progress-ring/progress-ring.component.ts
function ConverterProgressRingComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 9);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.label);
  }
}
var ConverterProgressRingComponent = class _ConverterProgressRingComponent {
  progress = 0;
  label = "";
  size = 120;
  strokeWidth = 8;
  get radius() {
    return (this.size - this.strokeWidth) / 2;
  }
  get circumference() {
    return 2 * Math.PI * this.radius;
  }
  get dashOffset() {
    return this.circumference * (1 - Math.min(100, Math.max(0, this.progress)) / 100);
  }
  static \u0275fac = function ConverterProgressRingComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConverterProgressRingComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ConverterProgressRingComponent, selectors: [["app-converter-progress-ring"]], inputs: { progress: "progress", label: "label", size: "size", strokeWidth: "strokeWidth" }, decls: 12, vars: 14, consts: [[1, "relative", "inline-flex", "items-center", "justify-center"], [1, "-rotate-90"], ["fill", "none", "stroke", "rgba(255,255,255,0.08)"], ["fill", "none", "stroke", "url(#converter-progress-gradient)", "stroke-linecap", "round", 1, "transition-[stroke-dashoffset]", "duration-300", "ease-out"], ["id", "converter-progress-gradient", "x1", "0%", "y1", "0%", "x2", "100%", "y2", "0%"], ["offset", "0%", "stop-color", "#00f5ff"], ["offset", "100%", "stop-color", "#a855f7"], [1, "absolute", "flex", "flex-col", "items-center"], [1, "text-xl", "font-bold", "text-white"], [1, "text-[10px]", "text-white/40", "mt-0.5"]], template: function ConverterProgressRingComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0);
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(1, "svg", 1);
      \u0275\u0275domElement(2, "circle", 2)(3, "circle", 3);
      \u0275\u0275domElementStart(4, "defs")(5, "linearGradient", 4);
      \u0275\u0275domElement(6, "stop", 5)(7, "stop", 6);
      \u0275\u0275domElementEnd()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275domElementStart(8, "div", 7)(9, "span", 8);
      \u0275\u0275text(10);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(11, ConverterProgressRingComponent_Conditional_11_Template, 2, 1, "span", 9);
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275attribute("width", ctx.size)("height", ctx.size);
      \u0275\u0275advance();
      \u0275\u0275attribute("cx", ctx.size / 2)("cy", ctx.size / 2)("r", ctx.radius)("stroke-width", ctx.strokeWidth);
      \u0275\u0275advance();
      \u0275\u0275attribute("cx", ctx.size / 2)("cy", ctx.size / 2)("r", ctx.radius)("stroke-width", ctx.strokeWidth)("stroke-dasharray", ctx.circumference)("stroke-dashoffset", ctx.dashOffset);
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate1("", ctx.progress, "%");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.label ? 11 : -1);
    }
  }, dependencies: [CommonModule], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConverterProgressRingComponent, [{
    type: Component,
    args: [{
      selector: "app-converter-progress-ring",
      standalone: true,
      imports: [CommonModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="relative inline-flex items-center justify-center">
      <svg [attr.width]="size" [attr.height]="size" class="-rotate-90">
        <!-- Background circle -->
        <circle
          [attr.cx]="size / 2" [attr.cy]="size / 2" [attr.r]="radius"
          fill="none" stroke="rgba(255,255,255,0.08)" [attr.stroke-width]="strokeWidth" />
        <!-- Progress circle -->
        <circle
          [attr.cx]="size / 2" [attr.cy]="size / 2" [attr.r]="radius"
          fill="none" stroke="url(#converter-progress-gradient)" [attr.stroke-width]="strokeWidth"
          stroke-linecap="round"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="dashOffset"
          class="transition-[stroke-dashoffset] duration-300 ease-out" />
        <defs>
          <linearGradient id="converter-progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#00f5ff" />
            <stop offset="100%" stop-color="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div class="absolute flex flex-col items-center">
        <span class="text-xl font-bold text-white">{{ progress }}%</span>
        @if (label) {
          <span class="text-[10px] text-white/40 mt-0.5">{{ label }}</span>
        }
      </div>
    </div>
  `
    }]
  }], null, { progress: [{
    type: Input
  }], label: [{
    type: Input
  }], size: [{
    type: Input
  }], strokeWidth: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConverterProgressRingComponent, { className: "ConverterProgressRingComponent", filePath: "src/app/modules/converter/shared/components/progress-ring/progress-ring.component.ts", lineNumber: 45 });
})();

export {
  ConverterFormatSelectorComponent,
  ConverterProgressRingComponent
};
//# sourceMappingURL=chunk-TX4ZO7XK.mjs.map
