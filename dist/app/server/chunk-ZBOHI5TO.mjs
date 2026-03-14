import './polyfills.server.mjs';
import {
  MatIcon,
  MatIconModule
} from "./chunk-XTFUWX2R.mjs";
import "./chunk-TXRVU6P6.mjs";
import {
  CommonModule
} from "./chunk-PHM5A5ZP.mjs";
import {
  ChangeDetectionStrategy,
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-CX47CWGJ.mjs";
import "./chunk-UFAUNXOA.mjs";

// src/app/modules/settings/settings.component.ts
var SettingsComponent = class _SettingsComponent {
  static \u0275fac = function SettingsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SettingsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SettingsComponent, selectors: [["app-settings"]], decls: 50, vars: 0, consts: [[1, "p-8", "space-y-8", "max-w-4xl", "mx-auto"], [1, "mb-12"], [1, "text-4xl", "font-bold", "tracking-tight", "text-text-primary", "mb-2"], [1, "text-text-secondary"], [1, "glass-panel", "rounded-2xl", "p-8", "space-y-6"], [1, "text-2xl", "font-semibold", "flex", "items-center", "gap-2"], [1, "text-accent-cyan"], [1, "space-y-4"], [1, "flex", "items-center", "justify-between", "p-4", "rounded-xl", "bg-white/5", "border", "border-white/5"], [1, "font-medium"], [1, "text-sm", "text-text-secondary"], [1, "w-12", "h-6", "rounded-full", "bg-status-success", "relative", "transition-colors"], [1, "absolute", "right-1", "top-1", "w-4", "h-4", "rounded-full", "bg-white", "shadow-sm"], [1, "px-4", "py-2", "rounded-lg", "bg-white/10", "hover:bg-white/20", "transition-colors", "text-sm", "font-medium"], [1, "text-accent-purple"], [1, "w-12", "h-6", "rounded-full", "bg-white/20", "relative", "transition-colors"], [1, "absolute", "left-1", "top-1", "w-4", "h-4", "rounded-full", "bg-white", "shadow-sm"]], template: function SettingsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "h1", 2);
      \u0275\u0275text(3, " Settings & Governance ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, "Manage workspace, security, and hardware tuning.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "section", 4)(7, "h2", 5)(8, "mat-icon", 6);
      \u0275\u0275text(9, "security");
      \u0275\u0275elementEnd();
      \u0275\u0275text(10, " Security ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 7)(12, "div", 8)(13, "div")(14, "div", 9);
      \u0275\u0275text(15, "Network Killswitch");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "div", 10);
      \u0275\u0275text(17, "Air-Gap mode via Service Worker");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "button", 11);
      \u0275\u0275element(19, "span", 12);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 8)(21, "div")(22, "div", 9);
      \u0275\u0275text(23, "Workspace Backup");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div", 10);
      \u0275\u0275text(25, "AES-256 encrypted .OMNI snapshot");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "button", 13);
      \u0275\u0275text(27, "Backup Now");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(28, "section", 4)(29, "h2", 5)(30, "mat-icon", 14);
      \u0275\u0275text(31, "memory");
      \u0275\u0275elementEnd();
      \u0275\u0275text(32, " Hardware Tuning ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "div", 7)(34, "div", 8)(35, "div")(36, "div", 9);
      \u0275\u0275text(37, "WebGPU Acceleration");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "div", 10);
      \u0275\u0275text(39, "Use GPU for AI and Image processing");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(40, "button", 11);
      \u0275\u0275element(41, "span", 12);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(42, "div", 8)(43, "div")(44, "div", 9);
      \u0275\u0275text(45, "Thermal Throttling Monitor");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "div", 10);
      \u0275\u0275text(47, "Pause heavy tasks if device overheats");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(48, "button", 15);
      \u0275\u0275element(49, "span", 16);
      \u0275\u0275elementEnd()()()()();
    }
  }, dependencies: [CommonModule, MatIconModule, MatIcon], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SettingsComponent, [{
    type: Component,
    args: [{
      selector: "app-settings",
      standalone: true,
      imports: [CommonModule, MatIconModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="p-8 space-y-8 max-w-4xl mx-auto">
      <header class="mb-12">
        <h1 class="text-4xl font-bold tracking-tight text-text-primary mb-2">
          Settings & Governance
        </h1>
        <p class="text-text-secondary">Manage workspace, security, and hardware tuning.</p>
      </header>

      <section class="glass-panel rounded-2xl p-8 space-y-6">
        <h2 class="text-2xl font-semibold flex items-center gap-2">
          <mat-icon class="text-accent-cyan">security</mat-icon> Security
        </h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <div class="font-medium">Network Killswitch</div>
              <div class="text-sm text-text-secondary">Air-Gap mode via Service Worker</div>
            </div>
            <button class="w-12 h-6 rounded-full bg-status-success relative transition-colors">
              <span class="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></span>
            </button>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <div class="font-medium">Workspace Backup</div>
              <div class="text-sm text-text-secondary">AES-256 encrypted .OMNI snapshot</div>
            </div>
            <button class="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">Backup Now</button>
          </div>
        </div>
      </section>

      <section class="glass-panel rounded-2xl p-8 space-y-6">
        <h2 class="text-2xl font-semibold flex items-center gap-2">
          <mat-icon class="text-accent-purple">memory</mat-icon> Hardware Tuning
        </h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <div class="font-medium">WebGPU Acceleration</div>
              <div class="text-sm text-text-secondary">Use GPU for AI and Image processing</div>
            </div>
            <button class="w-12 h-6 rounded-full bg-status-success relative transition-colors">
              <span class="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></span>
            </button>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <div class="font-medium">Thermal Throttling Monitor</div>
              <div class="text-sm text-text-secondary">Pause heavy tasks if device overheats</div>
            </div>
            <button class="w-12 h-6 rounded-full bg-white/20 relative transition-colors">
              <span class="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></span>
            </button>
          </div>
        </div>
      </section>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SettingsComponent, { className: "SettingsComponent", filePath: "src/app/modules/settings/settings.component.ts", lineNumber: 71 });
})();
export {
  SettingsComponent
};
//# sourceMappingURL=chunk-ZBOHI5TO.mjs.map
