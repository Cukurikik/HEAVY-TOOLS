import {
  selectSystem,
  selectTasks
} from "./chunk-34ZIAKJW.js";
import {
  ToolCardComponent
} from "./chunk-KWKFZG7B.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-5TJA43SS.js";
import "./chunk-ZI72GIQ4.js";
import "./chunk-DRIX56V4.js";
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
  ViewChild,
  afterNextRender,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵloadQuery,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-3GKPD7AG.js";
import "./chunk-KWSTWQNB.js";

// src/app/modules/dashboard/dashboard.component.ts
var _c0 = ["container"];
var _forTrack0 = ($index, $item) => $item.id;
function DashboardComponent_For_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-tool-card", 23);
  }
  if (rf & 2) {
    const tool_r1 = ctx.$implicit;
    \u0275\u0275property("tool", tool_r1);
  }
}
var DashboardComponent = class _DashboardComponent {
  store = inject(Store);
  container;
  system$ = this.store.select(selectSystem);
  tasks$ = this.store.select(selectTasks);
  quickTools = [
    { id: "trim", label: "Video Trimmer", icon: "content_cut", category: "basic", status: "stable" },
    { id: "convert", label: "Format Converter", icon: "sync", category: "basic", status: "stable" },
    { id: "upscale", label: "AI Upscaler", icon: "rocket_launch", category: "ai", status: "experimental" },
    { id: "denoise", label: "AI Denoiser", icon: "auto_awesome", category: "ai", status: "experimental" },
    { id: "audio-split", label: "Stem Splitter", icon: "call_split", category: "audio", status: "beta" },
    { id: "compress", label: "Compressor", icon: "compress", category: "basic", status: "stable" }
  ];
  constructor() {
    afterNextRender(async () => {
      if (!this.container)
        return;
      const el = this.container.nativeElement;
      const { animate, stagger } = await import("./chunk-OPFG544N.js");
      animate(el.querySelectorAll(".hero-section"), { opacity: [0, 1], y: [24, 0] }, { duration: 0.6, ease: "easeOut" });
      animate(el.querySelectorAll(".stat-card"), { opacity: [0, 1], scale: [0.92, 1] }, { delay: stagger(0.1, { startDelay: 0.2 }), duration: 0.5, ease: "easeOut" });
      animate(el.querySelectorAll(".tool-card-item"), { opacity: [0, 1], scale: [0.92, 1] }, { delay: stagger(0.05, { startDelay: 0.4 }), duration: 0.4, ease: "easeOut" });
    });
  }
  static \u0275fac = function DashboardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], viewQuery: function DashboardComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.container = _t.first);
    }
  }, decls: 117, vars: 82, consts: [["container", ""], [1, "p-8", "space-y-12", "max-w-7xl", "mx-auto"], [1, "hero-section", "flex", "flex-col", "md:flex-row", "items-start", "md:items-center", "justify-between", "gap-8"], [1, "space-y-4"], [1, "text-5xl", "md:text-6xl", "font-bold", "tracking-tight", "text-transparent", "bg-clip-text", "bg-gradient-to-r", "from-accent-cyan", "to-accent-purple"], [1, "text-xl", "text-text-secondary", "max-w-2xl"], [1, "glass-panel", "rounded-2xl", "p-6", "flex", "items-center", "gap-6"], [1, "text-center"], [1, "text-sm", "text-text-muted", "uppercase", "tracking-wider", "mb-1"], [1, "text-2xl", "font-mono", "text-accent-cyan"], [1, "w-px", "h-12", "bg-white/10"], [1, "text-2xl", "font-mono", "text-accent-purple"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-4", "gap-6"], [1, "stat-card", "glass-panel", "p-6", "rounded-2xl", "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-full", "bg-accent-cyan/20", "flex", "items-center", "justify-center", "text-accent-cyan"], [1, "text-3xl", "font-mono", "font-bold"], [1, "text-sm", "text-text-secondary"], [1, "w-12", "h-12", "rounded-full", "bg-status-success/20", "flex", "items-center", "justify-center", "text-status-success"], [1, "w-12", "h-12", "rounded-full", "bg-accent-purple/20", "flex", "items-center", "justify-center", "text-accent-purple"], [1, "w-12", "h-12", "rounded-full", "bg-status-warning/20", "flex", "items-center", "justify-center", "text-status-warning"], [1, "text-2xl", "font-semibold", "mb-6", "flex", "items-center", "gap-2"], [1, "text-accent-cyan"], [1, "grid", "grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4", "xl:grid-cols-6", "gap-4"], [1, "tool-card-item", 3, "tool"], [1, "glass-panel", "rounded-2xl", "p-8"], [1, "text-accent-purple"], [1, "flex", "items-center", "justify-between", "p-4", "rounded-xl", "bg-white/5", "border", "border-white/5"], [1, "text-text-secondary"], [1, "flex", "items-center", "gap-2", "text-sm", "font-medium"], [1, "w-2", "h-2", "rounded-full"]], template: function DashboardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 1, 0)(2, "section", 2)(3, "div", 3)(4, "h1", 4);
      \u0275\u0275text(5, " Omni-Tool Dashboard ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p", 5);
      \u0275\u0275text(7, " Enterprise Hybrid Suite. Local-First, Cloud-Optional. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 6)(9, "div", 7)(10, "div", 8);
      \u0275\u0275text(11, "CPU");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 9);
      \u0275\u0275text(13, "12%");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(14, "div", 10);
      \u0275\u0275elementStart(15, "div", 7)(16, "div", 8);
      \u0275\u0275text(17, "Memory");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 11);
      \u0275\u0275text(19);
      \u0275\u0275pipe(20, "async");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(21, "section", 12)(22, "div", 13)(23, "div", 14)(24, "mat-icon");
      \u0275\u0275text(25, "apps");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "div")(27, "div", 15);
      \u0275\u0275text(28, "70+");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "div", 16);
      \u0275\u0275text(30, "Total Tools");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(31, "div", 13)(32, "div", 17)(33, "mat-icon");
      \u0275\u0275text(34, "check_circle");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "div")(36, "div", 15);
      \u0275\u0275text(37);
      \u0275\u0275pipe(38, "async");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "div", 16);
      \u0275\u0275text(40, "Tasks Completed");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(41, "div", 13)(42, "div", 18)(43, "mat-icon");
      \u0275\u0275text(44, "description");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(45, "div")(46, "div", 15);
      \u0275\u0275text(47, "1,204");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "div", 16);
      \u0275\u0275text(49, "Files Processed");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(50, "div", 13)(51, "div", 19)(52, "mat-icon");
      \u0275\u0275text(53, "storage");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(54, "div")(55, "div", 15);
      \u0275\u0275text(56, "4.2 GB");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "div", 16);
      \u0275\u0275text(58, "Storage Used");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(59, "section")(60, "h2", 20)(61, "mat-icon", 21);
      \u0275\u0275text(62, "bolt");
      \u0275\u0275elementEnd();
      \u0275\u0275text(63, " Quick Access ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "div", 22);
      \u0275\u0275repeaterCreate(65, DashboardComponent_For_66_Template, 1, 1, "app-tool-card", 23, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(67, "section", 24)(68, "h2", 20)(69, "mat-icon", 25);
      \u0275\u0275text(70, "memory");
      \u0275\u0275elementEnd();
      \u0275\u0275text(71, " System Status ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(72, "div", 12)(73, "div", 26)(74, "span", 27);
      \u0275\u0275text(75, "FFmpeg Engine");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(76, "span", 28);
      \u0275\u0275pipe(77, "async");
      \u0275\u0275pipe(78, "async");
      \u0275\u0275element(79, "span", 29);
      \u0275\u0275pipe(80, "async");
      \u0275\u0275pipe(81, "async");
      \u0275\u0275text(82);
      \u0275\u0275pipe(83, "async");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(84, "div", 26)(85, "span", 27);
      \u0275\u0275text(86, "ONNX Runtime");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(87, "span", 28);
      \u0275\u0275pipe(88, "async");
      \u0275\u0275pipe(89, "async");
      \u0275\u0275element(90, "span", 29);
      \u0275\u0275pipe(91, "async");
      \u0275\u0275pipe(92, "async");
      \u0275\u0275text(93);
      \u0275\u0275pipe(94, "async");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(95, "div", 26)(96, "span", 27);
      \u0275\u0275text(97, "OPFS Storage");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(98, "span", 28);
      \u0275\u0275pipe(99, "async");
      \u0275\u0275pipe(100, "async");
      \u0275\u0275element(101, "span", 29);
      \u0275\u0275pipe(102, "async");
      \u0275\u0275pipe(103, "async");
      \u0275\u0275text(104);
      \u0275\u0275pipe(105, "async");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(106, "div", 26)(107, "span", 27);
      \u0275\u0275text(108, "Network");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(109, "span", 28);
      \u0275\u0275pipe(110, "async");
      \u0275\u0275pipe(111, "async");
      \u0275\u0275element(112, "span", 29);
      \u0275\u0275pipe(113, "async");
      \u0275\u0275pipe(114, "async");
      \u0275\u0275text(115);
      \u0275\u0275pipe(116, "async");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_2_0;
      let tmp_4_0;
      let tmp_5_0;
      let tmp_6_0;
      let tmp_7_0;
      let tmp_8_0;
      let tmp_9_0;
      let tmp_10_0;
      let tmp_11_0;
      let tmp_12_0;
      let tmp_13_0;
      let tmp_14_0;
      let tmp_15_0;
      let tmp_16_0;
      let tmp_17_0;
      let tmp_18_0;
      let tmp_19_0;
      let tmp_20_0;
      let tmp_21_0;
      let tmp_22_0;
      let tmp_23_0;
      \u0275\u0275advance(19);
      \u0275\u0275textInterpolate1("", ((tmp_1_0 = \u0275\u0275pipeBind1(20, 38, ctx.system$)) == null ? null : tmp_1_0.memoryUsage) || 0, "MB");
      \u0275\u0275advance(18);
      \u0275\u0275textInterpolate(((tmp_2_0 = \u0275\u0275pipeBind1(38, 40, ctx.tasks$)) == null ? null : tmp_2_0.totalCompleted) || 0);
      \u0275\u0275advance(28);
      \u0275\u0275repeater(ctx.quickTools);
      \u0275\u0275advance(11);
      \u0275\u0275classProp("text-status-success", (tmp_4_0 = \u0275\u0275pipeBind1(77, 42, ctx.system$)) == null ? null : tmp_4_0.ffmpegLoaded)("text-status-warning", !((tmp_5_0 = \u0275\u0275pipeBind1(78, 44, ctx.system$)) == null ? null : tmp_5_0.ffmpegLoaded));
      \u0275\u0275advance(3);
      \u0275\u0275classProp("bg-status-success", (tmp_6_0 = \u0275\u0275pipeBind1(80, 46, ctx.system$)) == null ? null : tmp_6_0.ffmpegLoaded)("bg-status-warning", !((tmp_7_0 = \u0275\u0275pipeBind1(81, 48, ctx.system$)) == null ? null : tmp_7_0.ffmpegLoaded));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ((tmp_8_0 = \u0275\u0275pipeBind1(83, 50, ctx.system$)) == null ? null : tmp_8_0.ffmpegLoaded) ? "Online" : "Standby", " ");
      \u0275\u0275advance(5);
      \u0275\u0275classProp("text-status-success", (tmp_9_0 = \u0275\u0275pipeBind1(88, 52, ctx.system$)) == null ? null : tmp_9_0.onnxLoaded)("text-status-warning", !((tmp_10_0 = \u0275\u0275pipeBind1(89, 54, ctx.system$)) == null ? null : tmp_10_0.onnxLoaded));
      \u0275\u0275advance(3);
      \u0275\u0275classProp("bg-status-success", (tmp_11_0 = \u0275\u0275pipeBind1(91, 56, ctx.system$)) == null ? null : tmp_11_0.onnxLoaded)("bg-status-warning", !((tmp_12_0 = \u0275\u0275pipeBind1(92, 58, ctx.system$)) == null ? null : tmp_12_0.onnxLoaded));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ((tmp_13_0 = \u0275\u0275pipeBind1(94, 60, ctx.system$)) == null ? null : tmp_13_0.onnxLoaded) ? "Online" : "Standby", " ");
      \u0275\u0275advance(5);
      \u0275\u0275classProp("text-status-success", (tmp_14_0 = \u0275\u0275pipeBind1(99, 62, ctx.system$)) == null ? null : tmp_14_0.opfsAvailable)("text-status-error", !((tmp_15_0 = \u0275\u0275pipeBind1(100, 64, ctx.system$)) == null ? null : tmp_15_0.opfsAvailable));
      \u0275\u0275advance(3);
      \u0275\u0275classProp("bg-status-success", (tmp_16_0 = \u0275\u0275pipeBind1(102, 66, ctx.system$)) == null ? null : tmp_16_0.opfsAvailable)("bg-status-error", !((tmp_17_0 = \u0275\u0275pipeBind1(103, 68, ctx.system$)) == null ? null : tmp_17_0.opfsAvailable));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ((tmp_18_0 = \u0275\u0275pipeBind1(105, 70, ctx.system$)) == null ? null : tmp_18_0.opfsAvailable) ? "Available" : "Unavailable", " ");
      \u0275\u0275advance(5);
      \u0275\u0275classProp("text-status-success", ((tmp_19_0 = \u0275\u0275pipeBind1(110, 72, ctx.system$)) == null ? null : tmp_19_0.networkStatus) === "online")("text-status-error", ((tmp_20_0 = \u0275\u0275pipeBind1(111, 74, ctx.system$)) == null ? null : tmp_20_0.networkStatus) === "offline");
      \u0275\u0275advance(3);
      \u0275\u0275classProp("bg-status-success", ((tmp_21_0 = \u0275\u0275pipeBind1(113, 76, ctx.system$)) == null ? null : tmp_21_0.networkStatus) === "online")("bg-status-error", ((tmp_22_0 = \u0275\u0275pipeBind1(114, 78, ctx.system$)) == null ? null : tmp_22_0.networkStatus) === "offline");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ((tmp_23_0 = \u0275\u0275pipeBind1(116, 80, ctx.system$)) == null ? null : tmp_23_0.networkStatus) === "online" ? "Connected" : "Offline", " ");
    }
  }, dependencies: [CommonModule, MatIconModule, MatIcon, ToolCardComponent, AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DashboardComponent, [{
    type: Component,
    args: [{
      selector: "app-dashboard",
      standalone: true,
      imports: [CommonModule, MatIconModule, ToolCardComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="p-8 space-y-12 max-w-7xl mx-auto" #container>
      <!-- Hero Section -->
      <section class="hero-section flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div class="space-y-4">
          <h1 class="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">
            Omni-Tool Dashboard
          </h1>
          <p class="text-xl text-text-secondary max-w-2xl">
            Enterprise Hybrid Suite. Local-First, Cloud-Optional.
          </p>
        </div>
        <div class="glass-panel rounded-2xl p-6 flex items-center gap-6">
          <div class="text-center">
            <div class="text-sm text-text-muted uppercase tracking-wider mb-1">CPU</div>
            <div class="text-2xl font-mono text-accent-cyan">12%</div>
          </div>
          <div class="w-px h-12 bg-white/10"></div>
          <div class="text-center">
            <div class="text-sm text-text-muted uppercase tracking-wider mb-1">Memory</div>
            <div class="text-2xl font-mono text-accent-purple">{{ (system$ | async)?.memoryUsage || 0 }}MB</div>
          </div>
        </div>
      </section>

      <!-- Stats Row -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="stat-card glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-accent-cyan/20 flex items-center justify-center text-accent-cyan">
            <mat-icon>apps</mat-icon>
          </div>
          <div>
            <div class="text-3xl font-mono font-bold">70+</div>
            <div class="text-sm text-text-secondary">Total Tools</div>
          </div>
        </div>
        <div class="stat-card glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-status-success/20 flex items-center justify-center text-status-success">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div>
            <div class="text-3xl font-mono font-bold">{{ (tasks$ | async)?.totalCompleted || 0 }}</div>
            <div class="text-sm text-text-secondary">Tasks Completed</div>
          </div>
        </div>
        <div class="stat-card glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple">
            <mat-icon>description</mat-icon>
          </div>
          <div>
            <div class="text-3xl font-mono font-bold">1,204</div>
            <div class="text-sm text-text-secondary">Files Processed</div>
          </div>
        </div>
        <div class="stat-card glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-status-warning/20 flex items-center justify-center text-status-warning">
            <mat-icon>storage</mat-icon>
          </div>
          <div>
            <div class="text-3xl font-mono font-bold">4.2 GB</div>
            <div class="text-sm text-text-secondary">Storage Used</div>
          </div>
        </div>
      </section>

      <!-- Quick Access Grid -->
      <section>
        <h2 class="text-2xl font-semibold mb-6 flex items-center gap-2">
          <mat-icon class="text-accent-cyan">bolt</mat-icon> Quick Access
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          @for (tool of quickTools; track tool.id) {
            <app-tool-card class="tool-card-item" [tool]="tool" />
          }
        </div>
      </section>

      <!-- System Status Panel -->
      <section class="glass-panel rounded-2xl p-8">
        <h2 class="text-2xl font-semibold mb-6 flex items-center gap-2">
          <mat-icon class="text-accent-purple">memory</mat-icon> System Status
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <span class="text-text-secondary">FFmpeg Engine</span>
            <span class="flex items-center gap-2 text-sm font-medium" [class.text-status-success]="(system$ | async)?.ffmpegLoaded" [class.text-status-warning]="!(system$ | async)?.ffmpegLoaded">
              <span class="w-2 h-2 rounded-full" [class.bg-status-success]="(system$ | async)?.ffmpegLoaded" [class.bg-status-warning]="!(system$ | async)?.ffmpegLoaded"></span>
              {{ (system$ | async)?.ffmpegLoaded ? 'Online' : 'Standby' }}
            </span>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <span class="text-text-secondary">ONNX Runtime</span>
            <span class="flex items-center gap-2 text-sm font-medium" [class.text-status-success]="(system$ | async)?.onnxLoaded" [class.text-status-warning]="!(system$ | async)?.onnxLoaded">
              <span class="w-2 h-2 rounded-full" [class.bg-status-success]="(system$ | async)?.onnxLoaded" [class.bg-status-warning]="!(system$ | async)?.onnxLoaded"></span>
              {{ (system$ | async)?.onnxLoaded ? 'Online' : 'Standby' }}
            </span>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <span class="text-text-secondary">OPFS Storage</span>
            <span class="flex items-center gap-2 text-sm font-medium" [class.text-status-success]="(system$ | async)?.opfsAvailable" [class.text-status-error]="!(system$ | async)?.opfsAvailable">
              <span class="w-2 h-2 rounded-full" [class.bg-status-success]="(system$ | async)?.opfsAvailable" [class.bg-status-error]="!(system$ | async)?.opfsAvailable"></span>
              {{ (system$ | async)?.opfsAvailable ? 'Available' : 'Unavailable' }}
            </span>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <span class="text-text-secondary">Network</span>
            <span class="flex items-center gap-2 text-sm font-medium" [class.text-status-success]="(system$ | async)?.networkStatus === 'online'" [class.text-status-error]="(system$ | async)?.networkStatus === 'offline'">
              <span class="w-2 h-2 rounded-full" [class.bg-status-success]="(system$ | async)?.networkStatus === 'online'" [class.bg-status-error]="(system$ | async)?.networkStatus === 'offline'"></span>
              {{ (system$ | async)?.networkStatus === 'online' ? 'Connected' : 'Offline' }}
            </span>
          </div>
        </div>
      </section>
    </div>
  `
    }]
  }], () => [], { container: [{
    type: ViewChild,
    args: ["container"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src/app/modules/dashboard/dashboard.component.ts", lineNumber: 129 });
})();
export {
  DashboardComponent
};
//# sourceMappingURL=chunk-NN62CZZZ.js.map
