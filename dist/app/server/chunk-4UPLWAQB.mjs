import './polyfills.server.mjs';
import {
  MatIcon,
  MatIconModule
} from "./chunk-XTFUWX2R.mjs";
import {
  Router
} from "./chunk-EWZIGHTS.mjs";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CX47CWGJ.mjs";

// src/app/shared/components/tool-card/tool-card.component.ts
var ToolCardComponent = class _ToolCardComponent {
  router = inject(Router);
  tool = input.required(...ngDevMode ? [{ debugName: "tool" }] : (
    /* istanbul ignore next */
    []
  ));
  navigate() {
  }
  getStatusClass(status) {
    switch (status) {
      case "stable":
        return "text-status-success border-status-success/30 bg-status-success/10";
      case "beta":
        return "text-status-warning border-status-warning/30 bg-status-warning/10";
      case "experimental":
        return "text-status-info border-status-info/30 bg-status-info/10";
      default:
        return "text-text-secondary border-text-secondary/30 bg-white/5";
    }
  }
  static \u0275fac = function ToolCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ToolCardComponent, selectors: [["app-tool-card"]], inputs: { tool: [1, "tool"] }, decls: 8, vars: 5, consts: [["tabindex", "0", 1, "glass-panel", "rounded-xl", "p-6", "flex", "flex-col", "items-center", "justify-center", "gap-4", "cursor-pointer", "transition-all", "duration-300", "hover:scale-105", "hover:shadow-glow", "group", 3, "click", "keydown.enter"], [1, "w-12", "h-12", "rounded-full", "bg-white/5", "flex", "items-center", "justify-center", "group-hover:bg-accent-cyan/20", "transition-colors", "duration-300"], [1, "text-3xl", "text-text-secondary", "group-hover:text-accent-cyan", "transition-colors", "duration-300"], [1, "text-sm", "font-medium", "text-text-primary", "text-center"], [1, "text-[10px]", "uppercase", "tracking-wider", "px-2", "py-1", "rounded-full", "border"]], template: function ToolCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275listener("click", function ToolCardComponent_Template_div_click_0_listener() {
        return ctx.navigate();
      })("keydown.enter", function ToolCardComponent_Template_div_keydown_enter_0_listener() {
        return ctx.navigate();
      });
      \u0275\u0275elementStart(1, "div", 1)(2, "mat-icon", 2);
      \u0275\u0275text(3);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(4, "span", 3);
      \u0275\u0275text(5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "span", 4);
      \u0275\u0275text(7);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.tool().icon);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.tool().label);
      \u0275\u0275advance();
      \u0275\u0275classMap(ctx.getStatusClass(ctx.tool().status));
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.tool().status, " ");
    }
  }, dependencies: [MatIconModule, MatIcon], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolCardComponent, [{
    type: Component,
    args: [{
      selector: "app-tool-card",
      standalone: true,
      imports: [MatIconModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="glass-panel rounded-xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow group" 
         tabindex="0" 
         (click)="navigate()" 
         (keydown.enter)="navigate()">
      <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-cyan/20 transition-colors duration-300">
        <mat-icon class="text-3xl text-text-secondary group-hover:text-accent-cyan transition-colors duration-300">{{ tool().icon }}</mat-icon>
      </div>
      <span class="text-sm font-medium text-text-primary text-center">{{ tool().label }}</span>
      <span class="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border" 
            [class]="getStatusClass(tool().status)">
        {{ tool().status }}
      </span>
    </div>
  `
    }]
  }], null, { tool: [{ type: Input, args: [{ isSignal: true, alias: "tool", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ToolCardComponent, { className: "ToolCardComponent", filePath: "src/app/shared/components/tool-card/tool-card.component.ts", lineNumber: 34 });
})();

export {
  ToolCardComponent
};
//# sourceMappingURL=chunk-4UPLWAQB.mjs.map
