import {
  toggleSidebar
} from "./chunk-ILRANHO7.js";
import {
  selectActiveRoute,
  selectSidebarCollapsed,
  selectSystem
} from "./chunk-34ZIAKJW.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-5TJA43SS.js";
import {
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet
} from "./chunk-ZI72GIQ4.js";
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
  Output,
  inject,
  output,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
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
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-3GKPD7AG.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-KWSTWQNB.js";

// src/app/layout/sidebar/sidebar.component.ts
var _c0 = (a0) => ({ exact: a0 });
var _forTrack0 = ($index, $item) => $item.route;
function SidebarComponent_For_18_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r2.badge, " ");
  }
}
function SidebarComponent_For_18_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 20);
    \u0275\u0275text(1, " expand_more ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("rotate-180", ctx_r2.expandedSections()[item_r2.route]);
  }
}
function SidebarComponent_For_18_Conditional_14_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 22)(1, "span", 27);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const child_r4 = ctx.$implicit;
    \u0275\u0275property("routerLink", child_r4.route);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(child_r4.emoji);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(child_r4.label);
  }
}
function SidebarComponent_For_18_Conditional_14_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 24)(1, "span", 27);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const child_r5 = ctx.$implicit;
    \u0275\u0275property("routerLink", child_r5.route);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(child_r5.emoji);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(child_r5.label);
  }
}
function SidebarComponent_For_18_Conditional_14_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 25)(1, "span", 27);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const child_r6 = ctx.$implicit;
    \u0275\u0275property("routerLink", child_r6.route);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(child_r6.emoji);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(child_r6.label);
  }
}
function SidebarComponent_For_18_Conditional_14_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 26)(1, "span", 27);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const child_r7 = ctx.$implicit;
    \u0275\u0275property("routerLink", child_r7.route);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(child_r7.emoji);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(child_r7.label);
  }
}
function SidebarComponent_For_18_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "p", 21);
    \u0275\u0275text(2, "Basic");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, SidebarComponent_For_18_Conditional_14_For_4_Template, 5, 3, "a", 22, _forTrack0);
    \u0275\u0275elementStart(5, "p", 23);
    \u0275\u0275text(6, "Advanced");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, SidebarComponent_For_18_Conditional_14_For_8_Template, 5, 3, "a", 24, _forTrack0);
    \u0275\u0275elementStart(9, "p", 23);
    \u0275\u0275text(10, "Pro");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(11, SidebarComponent_For_18_Conditional_14_For_12_Template, 5, 3, "a", 25, _forTrack0);
    \u0275\u0275elementStart(13, "p", 23);
    \u0275\u0275text(14, "AI Powered");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(15, SidebarComponent_For_18_Conditional_14_For_16_Template, 5, 3, "a", 26, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.getByCategory(item_r2.children, "basic"));
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.getByCategory(item_r2.children, "advanced"));
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.getByCategory(item_r2.children, "pro"));
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.getByCategory(item_r2.children, "ai"));
  }
}
function SidebarComponent_For_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "a", 14);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275listener("click", function SidebarComponent_For_18_Template_a_click_1_listener() {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(item_r2.children ? ctx_r2.toggleExpand(item_r2.route) : null);
    });
    \u0275\u0275elementStart(3, "mat-icon", 15);
    \u0275\u0275pipe(4, "async");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 16);
    \u0275\u0275pipe(7, "async");
    \u0275\u0275pipe(8, "async");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, SidebarComponent_For_18_Conditional_10_Template, 2, 1, "span", 17);
    \u0275\u0275pipe(11, "async");
    \u0275\u0275conditionalCreate(12, SidebarComponent_For_18_Conditional_12_Template, 2, 2, "mat-icon", 18);
    \u0275\u0275pipe(13, "async");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(14, SidebarComponent_For_18_Conditional_14_Template, 17, 0, "div", 19);
    \u0275\u0275pipe(15, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_13_0;
    const item_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", item_r2.children ? null : item_r2.route)("routerLinkActiveOptions", \u0275\u0275pureFunction1(28, _c0, item_r2.route === "/"))("title", \u0275\u0275pipeBind1(2, 14, ctx_r2.collapsed$) ? item_r2.label : "");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-accent-cyan", ((tmp_13_0 = \u0275\u0275pipeBind1(4, 16, ctx_r2.activeRoute$)) == null ? null : tmp_13_0.startsWith(item_r2.route)) && item_r2.route !== "/");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", item_r2.icon, " ");
    \u0275\u0275advance();
    \u0275\u0275classProp("opacity-0", \u0275\u0275pipeBind1(7, 18, ctx_r2.collapsed$))("w-0", \u0275\u0275pipeBind1(8, 20, ctx_r2.collapsed$));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", item_r2.label, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r2.badge && \u0275\u0275pipeBind1(11, 22, ctx_r2.collapsed$) === false ? 10 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(item_r2.children && \u0275\u0275pipeBind1(13, 24, ctx_r2.collapsed$) === false ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(item_r2.children && ctx_r2.expandedSections()[item_r2.route] && \u0275\u0275pipeBind1(15, 26, ctx_r2.collapsed$) === false ? 14 : -1);
  }
}
var VIDEO_CHILDREN = [
  // ── Basic ──
  { label: "Trimmer", emoji: "\u2702\uFE0F", route: "/video/trimmer", category: "basic" },
  { label: "Merger", emoji: "\u{1F517}", route: "/video/merger", category: "basic" },
  { label: "Converter", emoji: "\u{1F504}", route: "/video/converter", category: "basic" },
  { label: "Compressor", emoji: "\u{1F4E6}", route: "/video/compressor", category: "basic" },
  { label: "To GIF", emoji: "\u{1F39E}\uFE0F", route: "/video/to-gif", category: "basic" },
  // ── Advanced ──
  { label: "Stabilizer", emoji: "\u{1F91D}", route: "/video/stabilizer", category: "advanced" },
  { label: "Reverser", emoji: "\u23EA", route: "/video/reverser", category: "advanced" },
  { label: "Speed Control", emoji: "\u26A1", route: "/video/speed", category: "advanced" },
  { label: "Looper", emoji: "\u{1F501}", route: "/video/looper", category: "advanced" },
  { label: "Flip & Rotate", emoji: "\u{1F503}", route: "/video/flip-rotate", category: "advanced" },
  { label: "Crop & Resize", emoji: "\u{1F4D0}", route: "/video/crop-resize", category: "advanced" },
  { label: "Denoiser", emoji: "\u{1F9F9}", route: "/video/denoiser", category: "advanced" },
  { label: "Interpolator", emoji: "\u{1F39E}\uFE0F", route: "/video/interpolate", category: "advanced" },
  { label: "Splitter", emoji: "\u{1F52A}", route: "/video/splitter", category: "advanced" },
  { label: "PiP", emoji: "\u{1F4FA}", route: "/video/pip", category: "advanced" },
  { label: "Blur", emoji: "\u{1F32B}\uFE0F", route: "/video/blur", category: "advanced" },
  { label: "Compare", emoji: "\u2696\uFE0F", route: "/video/compare", category: "advanced" },
  { label: "Analyser", emoji: "\u{1F4CA}", route: "/video/analyser", category: "advanced" },
  // ── Pro ──
  { label: "Color Grading", emoji: "\u{1F3A8}", route: "/video/color-grading", category: "pro" },
  { label: "Subtitles", emoji: "\u{1F4AC}", route: "/video/subtitles", category: "pro" },
  { label: "Thumbnails", emoji: "\u{1F5BC}\uFE0F", route: "/video/thumbnail", category: "pro" },
  { label: "Watermark", emoji: "\u{1F4A7}", route: "/video/watermark", category: "pro" },
  { label: "Extract Audio", emoji: "\u{1F3B5}", route: "/video/extract-audio", category: "pro" },
  { label: "Replace Audio", emoji: "\u{1F50A}", route: "/video/replace-audio", category: "pro" },
  { label: "Metadata", emoji: "\u{1F4DD}", route: "/video/metadata", category: "pro" },
  { label: "Screen Recorder", emoji: "\u{1F5A5}\uFE0F", route: "/video/screen-recorder", category: "pro" },
  { label: "Transitions", emoji: "\u2728", route: "/video/transitions", category: "pro" },
  { label: "Slideshow", emoji: "\u{1F3AC}", route: "/video/slideshow", category: "pro" },
  { label: "Batch Processor", emoji: "\u2699\uFE0F", route: "/video/batch", category: "pro" },
  // ── AI ──
  { label: "AI Upscaler", emoji: "\u{1F680}", route: "/video/upscaler", category: "ai" }
];
var AUDIO_CHILDREN = [
  // Basic
  { label: "Recorder", emoji: "\u{1F399}\uFE0F", route: "/audio/recorder", category: "basic" },
  { label: "Trimmer", emoji: "\u2702\uFE0F", route: "/audio/trimmer", category: "basic" },
  { label: "Merger", emoji: "\u{1F517}", route: "/audio/merger", category: "basic" },
  { label: "Converter", emoji: "\u{1F504}", route: "/audio/converter", category: "basic" },
  { label: "Reverser", emoji: "\u23EA", route: "/audio/reverser", category: "basic" },
  { label: "Fade In/Out", emoji: "\u{1F305}", route: "/audio/fade", category: "basic" },
  { label: "Silence Remover", emoji: "\u{1F507}", route: "/audio/silence-remover", category: "basic" },
  { label: "Speed Changer", emoji: "\u26A1", route: "/audio/speed", category: "basic" },
  // Advanced
  { label: "Compressor", emoji: "\u{1F50A}", route: "/audio/compressor", category: "advanced" },
  { label: "Equalizer", emoji: "\u{1F39B}\uFE0F", route: "/audio/equalizer", category: "advanced" },
  { label: "Pitch Shifter", emoji: "\u{1F3B5}", route: "/audio/pitch-shifter", category: "advanced" },
  { label: "Time Stretch", emoji: "\u23F1\uFE0F", route: "/audio/time-stretch", category: "advanced" },
  { label: "Normalizer", emoji: "\u{1F4CF}", route: "/audio/normalizer", category: "advanced" },
  { label: "Splitter", emoji: "\u{1F52A}", route: "/audio/splitter", category: "advanced" },
  { label: "Analyser", emoji: "\u{1F4CA}", route: "/audio/analyser", category: "advanced" },
  { label: "Looper", emoji: "\u{1F501}", route: "/audio/looper", category: "advanced" },
  { label: "Channel Mixer", emoji: "\u{1F500}", route: "/audio/channel-mixer", category: "advanced" },
  { label: "Stereo Widener", emoji: "\u{1F4E1}", route: "/audio/stereo-widener", category: "advanced" },
  // Pro
  { label: "Reverb", emoji: "\u{1F3DB}\uFE0F", route: "/audio/reverb", category: "pro" },
  { label: "Noise Remover", emoji: "\u{1F9F9}", route: "/audio/noise-remover", category: "pro" },
  { label: "Metadata", emoji: "\u{1F4DD}", route: "/audio/metadata", category: "pro" },
  { label: "Batch", emoji: "\u2699\uFE0F", route: "/audio/batch", category: "pro" },
  { label: "Mixer", emoji: "\u{1F39A}\uFE0F", route: "/audio/mixer", category: "pro" },
  { label: "Limiter", emoji: "\u{1F6A7}", route: "/audio/limiter", category: "pro" },
  { label: "Voice Changer", emoji: "\u{1F3AD}", route: "/audio/voice-changer", category: "pro" },
  { label: "Visualizer", emoji: "\u{1F308}", route: "/audio/visualizer", category: "pro" },
  { label: "Watermark", emoji: "\u{1F4A7}", route: "/audio/watermark", category: "pro" },
  // AI
  { label: "Karaoke", emoji: "\u{1F3A4}", route: "/audio/karaoke", category: "ai" },
  { label: "Transcriber", emoji: "\u{1F4DC}", route: "/audio/transcriber", category: "ai" },
  { label: "Stem Splitter", emoji: "\u{1F9EC}", route: "/audio/stem-splitter", category: "ai" }
];
var PDF_CHILDREN = [
  // Basic
  { label: "Merger", emoji: "\u{1F517}", route: "/pdf/merger", category: "basic" },
  { label: "Splitter", emoji: "\u2702\uFE0F", route: "/pdf/splitter", category: "basic" },
  { label: "Compressor", emoji: "\u{1F5DC}\uFE0F", route: "/pdf/compressor", category: "basic" },
  { label: "Converter", emoji: "\u{1F504}", route: "/pdf/converter", category: "basic" },
  { label: "Page Rotator", emoji: "\u{1F504}", route: "/pdf/rotator", category: "basic" },
  { label: "Crop / Resize", emoji: "\u{1F4D0}", route: "/pdf/crop-resize", category: "basic" },
  // Advanced
  { label: "Metadata Editor", emoji: "\u{1F4CB}", route: "/pdf/metadata-editor", category: "advanced" },
  { label: "Digital Signer", emoji: "\u270D\uFE0F", route: "/pdf/digital-signer", category: "advanced" },
  { label: "Redactor", emoji: "\u2B1B", route: "/pdf/redactor", category: "advanced" },
  { label: "Annotator", emoji: "\u{1F58D}\uFE0F", route: "/pdf/annotator", category: "advanced" },
  { label: "Form Filler", emoji: "\u{1F4C4}", route: "/pdf/form-filler", category: "advanced" },
  { label: "Page Reorderer", emoji: "\u{1F4D1}", route: "/pdf/page-reorderer", category: "advanced" },
  { label: "Thumbnails", emoji: "\u{1F4F8}", route: "/pdf/thumbnail-generator", category: "advanced" },
  { label: "Compare", emoji: "\u2696\uFE0F", route: "/pdf/compare", category: "advanced" },
  { label: "Bookmark Editor", emoji: "\u{1F516}", route: "/pdf/bookmark-editor", category: "advanced" },
  { label: "Batch Processor", emoji: "\u2699\uFE0F", route: "/pdf/batch-processor", category: "advanced" },
  { label: "Flattener", emoji: "\u{1F95E}", route: "/pdf/flattener", category: "advanced" },
  { label: "Optimizer", emoji: "\u26A1", route: "/pdf/optimizer", category: "advanced" },
  { label: "Repair", emoji: "\u{1F6E0}\uFE0F", route: "/pdf/repair", category: "advanced" },
  // Pro 
  { label: "Text Extractor", emoji: "\u{1F4DD}", route: "/pdf/text-extractor", category: "pro" },
  { label: "Image Extractor", emoji: "\u{1F5BC}\uFE0F", route: "/pdf/image-extractor", category: "pro" },
  { label: "Password Protect", emoji: "\u{1F512}", route: "/pdf/password-protector", category: "pro" },
  { label: "Unlocker", emoji: "\u{1F513}", route: "/pdf/unlocker", category: "pro" },
  { label: "Watermark", emoji: "\u{1F4A7}", route: "/pdf/watermark", category: "pro" },
  { label: "To Word", emoji: "\u{1F4DD}", route: "/pdf/to-word", category: "pro" },
  { label: "To Excel", emoji: "\u{1F4CA}", route: "/pdf/to-excel", category: "pro" },
  { label: "To PPT", emoji: "\u{1F4FD}\uFE0F", route: "/pdf/to-powerpoint", category: "pro" },
  { label: "To HTML", emoji: "\u{1F310}", route: "/pdf/to-html", category: "pro" },
  { label: "To Image Batch", emoji: "\u{1F522}", route: "/pdf/to-image-batch", category: "pro" },
  // AI
  { label: "OCR", emoji: "\u{1F50D}", route: "/pdf/ocr", category: "ai" }
];
var CONVERTER_CHILDREN = [
  // Image
  { label: "Image Converter", emoji: "\u{1F5BC}\uFE0F", route: "/converter/image-converter", category: "basic" },
  { label: "Image Resizer", emoji: "\u{1F4D0}", route: "/converter/image-resizer", category: "basic" },
  { label: "Image Compressor", emoji: "\u{1F5DC}\uFE0F", route: "/converter/image-compressor", category: "basic" },
  { label: "SVG Converter", emoji: "\u{1F537}", route: "/converter/svg-converter", category: "basic" },
  { label: "ICO / Favicon", emoji: "\u{1F516}", route: "/converter/ico-converter", category: "basic" },
  { label: "GIF Converter", emoji: "\u{1F39E}\uFE0F", route: "/converter/gif-converter", category: "basic" },
  { label: "RAW Converter", emoji: "\u{1F4F7}", route: "/converter/raw-image-converter", category: "basic" },
  // Media
  { label: "Video Converter", emoji: "\u{1F3AC}", route: "/converter/video-converter", category: "advanced" },
  { label: "Audio Converter", emoji: "\u{1F3B5}", route: "/converter/audio-converter", category: "advanced" },
  { label: "Subtitle Converter", emoji: "\u{1F4AC}", route: "/converter/subtitle-converter", category: "advanced" },
  // Document
  { label: "Document Converter", emoji: "\u{1F4C4}", route: "/converter/document-converter", category: "advanced" },
  { label: "Spreadsheet", emoji: "\u{1F4D1}", route: "/converter/spreadsheet-converter", category: "advanced" },
  { label: "Font Converter", emoji: "\u{1F524}", route: "/converter/font-converter", category: "advanced" },
  { label: "Ebook Converter", emoji: "\u{1F4DA}", route: "/converter/ebook-converter", category: "advanced" },
  { label: "CAD Converter", emoji: "\u{1F4D0}", route: "/converter/cad-converter", category: "advanced" },
  // Text & Data
  { label: "JSON Converter", emoji: "\u{1F4CB}", route: "/converter/json-converter", category: "pro" },
  { label: "CSV Converter", emoji: "\u{1F4CA}", route: "/converter/csv-converter", category: "pro" },
  { label: "Markdown", emoji: "\u{1F4DD}", route: "/converter/markdown-converter", category: "pro" },
  { label: "HTML Converter", emoji: "\u{1F310}", route: "/converter/html-converter", category: "pro" },
  { label: "Base64 Encoder", emoji: "\u{1F510}", route: "/converter/base64-encoder", category: "pro" },
  { label: "Encoding", emoji: "\u{1F521}", route: "/converter/encoding-converter", category: "pro" },
  { label: "Archive", emoji: "\u{1F4E6}", route: "/converter/archive-converter", category: "pro" },
  // Utility
  { label: "Color Converter", emoji: "\u{1F3A8}", route: "/converter/color-converter", category: "ai" },
  { label: "Unit Converter", emoji: "\u{1F4CF}", route: "/converter/unit-converter", category: "ai" },
  { label: "Currency", emoji: "\u{1F4B1}", route: "/converter/currency-converter", category: "ai" },
  { label: "Timezone", emoji: "\u{1F550}", route: "/converter/timezone-converter", category: "ai" },
  { label: "Number Base", emoji: "\u{1F522}", route: "/converter/number-base-converter", category: "ai" },
  { label: "QR Generator", emoji: "\u{1F4F1}", route: "/converter/qr-generator", category: "ai" },
  { label: "Barcode Generator", emoji: "\u{1F4CA}", route: "/converter/barcode-generator", category: "ai" },
  { label: "Batch Converter", emoji: "\u2699\uFE0F", route: "/converter/batch-converter", category: "ai" }
];
var NAV_ITEMS = [
  { label: "Dashboard", icon: "grid_view", route: "/", badge: null },
  { label: "Video Engine", icon: "movie", route: "/video", badge: "30", children: VIDEO_CHILDREN },
  { label: "Audio Studio", icon: "music_note", route: "/audio", badge: "30", children: AUDIO_CHILDREN },
  { label: "PDF Tools", icon: "picture_as_pdf", route: "/pdf", badge: "30", children: PDF_CHILDREN },
  { label: "Image Matrix", icon: "image", route: "/image", badge: "10+" },
  { label: "Converter", icon: "sync", route: "/converter", badge: "30", children: CONVERTER_CHILDREN },
  { label: "Settings", icon: "settings", route: "/settings", badge: null }
];
var SidebarComponent = class _SidebarComponent {
  store = inject(Store);
  navItems = NAV_ITEMS;
  collapsed$ = this.store.select(selectSidebarCollapsed);
  activeRoute$ = this.store.select(selectActiveRoute);
  toggleCollapse = output();
  /** Track which sections are expanded */
  expandedSections = signal({}, ...ngDevMode ? [{ debugName: "expandedSections" }] : (
    /* istanbul ignore next */
    []
  ));
  onToggleCollapse() {
    this.store.dispatch(toggleSidebar());
    this.toggleCollapse.emit();
  }
  toggleExpand(route) {
    this.expandedSections.update((sections) => __spreadProps(__spreadValues({}, sections), {
      [route]: !sections[route]
    }));
  }
  getByCategory(children, category) {
    return children.filter((c) => c.category === category);
  }
  static \u0275fac = function SidebarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SidebarComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SidebarComponent, selectors: [["app-sidebar"]], outputs: { toggleCollapse: "toggleCollapse" }, decls: 28, vars: 27, consts: [[1, "h-screen", "glass-panel", "border-r", "border-white/10", "flex", "flex-col", "transition-all", "duration-400", "ease-[cubic-bezier(0.16,1,0.3,1)]"], [1, "h-16", "flex", "items-center", "justify-between", "px-4", "border-b", "border-white/10"], [1, "flex", "items-center", "gap-3", "overflow-hidden", "whitespace-nowrap"], [1, "w-8", "h-8", "rounded-lg", "bg-gradient-to-br", "from-accent-cyan", "to-accent-purple", "flex", "items-center", "justify-center", "shadow-glow"], [1, "text-white", "text-xl"], [1, "font-bold", "text-lg", "tracking-tight"], [1, "w-10", "h-10", "rounded-lg", "flex", "items-center", "justify-center", "hover:bg-white/10", "transition-colors", "text-text-secondary", "hover:text-white", "shrink-0", 3, "click"], [1, "flex-1", "py-4", "px-3", "space-y-1", "overflow-y-auto", "overflow-x-hidden", "scrollbar-thin"], [1, "p-4", "border-t", "border-white/10"], [1, "flex", "items-center", "gap-3", "px-2"], [1, "relative", "flex", "h-3", "w-3", "shrink-0"], [1, "animate-ping", "absolute", "inline-flex", "h-full", "w-full", "rounded-full", "bg-status-success", "opacity-75"], [1, "relative", "inline-flex", "rounded-full", "h-3", "w-3", "bg-status-success"], [1, "text-sm", "font-medium", "text-text-secondary", "whitespace-nowrap", "transition-opacity", "duration-300"], ["routerLinkActive", "bg-white/10 text-white shadow-[inset_4px_0_0_0_#00f5ff]", 1, "flex", "items-center", "gap-4", "px-3", "py-3", "rounded-xl", "text-text-secondary", "hover:text-white", "hover:bg-white/5", "transition-all", "duration-300", "group", "relative", "cursor-pointer", 3, "click", "routerLink", "routerLinkActiveOptions", "title"], [1, "shrink-0", "transition-transform", "duration-300", "group-hover:scale-110"], [1, "font-medium", "whitespace-nowrap", "transition-opacity", "duration-300", "flex-1"], [1, "text-[10px]", "font-bold", "px-2", "py-0.5", "rounded-full", "bg-accent-purple/20", "text-accent-cyan", "border", "border-accent-purple/30"], [1, "text-white/30", "text-sm", "transition-transform", "duration-300", 3, "rotate-180"], [1, "ml-4", "mt-1", "space-y-0.5", "border-l", "border-white/5", "pl-3", "animate-[fadeIn_0.2s_ease]"], [1, "text-white/30", "text-sm", "transition-transform", "duration-300"], [1, "text-[9px]", "uppercase", "tracking-widest", "text-white/25", "font-bold", "px-2", "pt-2", "pb-1"], ["routerLinkActive", "bg-cyan-400/10 text-cyan-400", 1, "flex", "items-center", "gap-2", "px-2", "py-1.5", "rounded-lg", "text-xs", "text-white/50", "hover:text-white", "hover:bg-white/5", "transition-all", "duration-200", 3, "routerLink"], [1, "text-[9px]", "uppercase", "tracking-widest", "text-white/25", "font-bold", "px-2", "pt-3", "pb-1"], ["routerLinkActive", "bg-violet-400/10 text-violet-400", 1, "flex", "items-center", "gap-2", "px-2", "py-1.5", "rounded-lg", "text-xs", "text-white/50", "hover:text-white", "hover:bg-white/5", "transition-all", "duration-200", 3, "routerLink"], ["routerLinkActive", "bg-amber-400/10 text-amber-400", 1, "flex", "items-center", "gap-2", "px-2", "py-1.5", "rounded-lg", "text-xs", "text-white/50", "hover:text-white", "hover:bg-white/5", "transition-all", "duration-200", 3, "routerLink"], ["routerLinkActive", "bg-emerald-400/10 text-emerald-400", 1, "flex", "items-center", "gap-2", "px-2", "py-1.5", "rounded-lg", "text-xs", "text-white/50", "hover:text-white", "hover:bg-white/5", "transition-all", "duration-200", 3, "routerLink"], [1, "text-sm"]], template: function SidebarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "aside", 0);
      \u0275\u0275pipe(1, "async");
      \u0275\u0275pipe(2, "async");
      \u0275\u0275elementStart(3, "div", 1)(4, "div", 2);
      \u0275\u0275pipe(5, "async");
      \u0275\u0275pipe(6, "async");
      \u0275\u0275elementStart(7, "div", 3)(8, "mat-icon", 4);
      \u0275\u0275text(9, "all_inclusive");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(10, "span", 5);
      \u0275\u0275text(11, "Omni-Tool");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "button", 6);
      \u0275\u0275listener("click", function SidebarComponent_Template_button_click_12_listener() {
        return ctx.onToggleCollapse();
      });
      \u0275\u0275elementStart(13, "mat-icon");
      \u0275\u0275text(14);
      \u0275\u0275pipe(15, "async");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(16, "nav", 7);
      \u0275\u0275repeaterCreate(17, SidebarComponent_For_18_Template, 16, 30, "div", null, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 8)(20, "div", 9)(21, "div", 10);
      \u0275\u0275element(22, "span", 11)(23, "span", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "span", 13);
      \u0275\u0275pipe(25, "async");
      \u0275\u0275pipe(26, "async");
      \u0275\u0275text(27, " System Online ");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("w-[260px]", \u0275\u0275pipeBind1(1, 13, ctx.collapsed$) === false)("w-[72px]", \u0275\u0275pipeBind1(2, 15, ctx.collapsed$));
      \u0275\u0275advance(4);
      \u0275\u0275classProp("opacity-0", \u0275\u0275pipeBind1(5, 17, ctx.collapsed$))("w-0", \u0275\u0275pipeBind1(6, 19, ctx.collapsed$));
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 21, ctx.collapsed$) ? "menu" : "menu_open");
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.navItems);
      \u0275\u0275advance(7);
      \u0275\u0275classProp("opacity-0", \u0275\u0275pipeBind1(25, 23, ctx.collapsed$))("w-0", \u0275\u0275pipeBind1(26, 25, ctx.collapsed$));
    }
  }, dependencies: [CommonModule, RouterModule, RouterLink, RouterLinkActive, MatIconModule, MatIcon, AsyncPipe], styles: ["\n\n.scrollbar-thin[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.scrollbar-thin[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n.scrollbar-thin[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.08);\n  border-radius: 4px;\n}\n.scrollbar-thin[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: rgba(255, 255, 255, 0.15);\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(-4px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=sidebar.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarComponent, [{
    type: Component,
    args: [{ selector: "app-sidebar", standalone: true, imports: [CommonModule, RouterModule, MatIconModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <aside class="h-screen glass-panel border-r border-white/10 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
           [class.w-[260px]]="(collapsed$ | async) === false"
           [class.w-[72px]]="collapsed$ | async">
      
      <!-- Header -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-white/10">
        <div class="flex items-center gap-3 overflow-hidden whitespace-nowrap" [class.opacity-0]="collapsed$ | async" [class.w-0]="collapsed$ | async">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center shadow-glow">
            <mat-icon class="text-white text-xl">all_inclusive</mat-icon>
          </div>
          <span class="font-bold text-lg tracking-tight">Omni-Tool</span>
        </div>
        <button class="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-text-secondary hover:text-white shrink-0"
                (click)="onToggleCollapse()">
          <mat-icon>{{ (collapsed$ | async) ? 'menu' : 'menu_open' }}</mat-icon>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        @for (item of navItems; track item.route) {
          <!-- Parent Nav Item -->
          <div>
            <a [routerLink]="item.children ? null : item.route"
               (click)="item.children ? toggleExpand(item.route) : null"
               routerLinkActive="bg-white/10 text-white shadow-[inset_4px_0_0_0_#00f5ff]"
               [routerLinkActiveOptions]="{exact: item.route === '/'}"
               class="flex items-center gap-4 px-3 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300 group relative cursor-pointer"
               [title]="(collapsed$ | async) ? item.label : ''">
              
              <mat-icon class="shrink-0 transition-transform duration-300 group-hover:scale-110"
                        [class.text-accent-cyan]="(activeRoute$ | async)?.startsWith(item.route) && item.route !== '/'">
                {{ item.icon }}
              </mat-icon>
              
              <span class="font-medium whitespace-nowrap transition-opacity duration-300 flex-1"
                    [class.opacity-0]="collapsed$ | async"
                    [class.w-0]="collapsed$ | async">
                {{ item.label }}
              </span>

              @if (item.badge && (collapsed$ | async) === false) {
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-cyan border border-accent-purple/30">
                  {{ item.badge }}
                </span>
              }

              @if (item.children && (collapsed$ | async) === false) {
                <mat-icon class="text-white/30 text-sm transition-transform duration-300"
                  [class.rotate-180]="expandedSections()[item.route]">
                  expand_more
                </mat-icon>
              }
            </a>

            <!-- Sub-navigation (expandable) -->
            @if (item.children && expandedSections()[item.route] && (collapsed$ | async) === false) {
              <div class="ml-4 mt-1 space-y-0.5 border-l border-white/5 pl-3 animate-[fadeIn_0.2s_ease]">
                
                <!-- Category: Basic -->
                <p class="text-[9px] uppercase tracking-widest text-white/25 font-bold px-2 pt-2 pb-1">Basic</p>
                @for (child of getByCategory(item.children, 'basic'); track child.route) {
                  <a [routerLink]="child.route"
                     routerLinkActive="bg-cyan-400/10 text-cyan-400"
                     class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <span class="text-sm">{{ child.emoji }}</span>
                    <span>{{ child.label }}</span>
                  </a>
                }

                <!-- Category: Advanced -->
                <p class="text-[9px] uppercase tracking-widest text-white/25 font-bold px-2 pt-3 pb-1">Advanced</p>
                @for (child of getByCategory(item.children, 'advanced'); track child.route) {
                  <a [routerLink]="child.route"
                     routerLinkActive="bg-violet-400/10 text-violet-400"
                     class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <span class="text-sm">{{ child.emoji }}</span>
                    <span>{{ child.label }}</span>
                  </a>
                }

                <!-- Category: Pro -->
                <p class="text-[9px] uppercase tracking-widest text-white/25 font-bold px-2 pt-3 pb-1">Pro</p>
                @for (child of getByCategory(item.children, 'pro'); track child.route) {
                  <a [routerLink]="child.route"
                     routerLinkActive="bg-amber-400/10 text-amber-400"
                     class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <span class="text-sm">{{ child.emoji }}</span>
                    <span>{{ child.label }}</span>
                  </a>
                }

                <!-- Category: AI -->
                <p class="text-[9px] uppercase tracking-widest text-white/25 font-bold px-2 pt-3 pb-1">AI Powered</p>
                @for (child of getByCategory(item.children, 'ai'); track child.route) {
                  <a [routerLink]="child.route"
                     routerLinkActive="bg-emerald-400/10 text-emerald-400"
                     class="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <span class="text-sm">{{ child.emoji }}</span>
                    <span>{{ child.label }}</span>
                  </a>
                }
              </div>
            }
          </div>
        }
      </nav>

      <!-- Footer Status -->
      <div class="p-4 border-t border-white/10">
        <div class="flex items-center gap-3 px-2">
          <div class="relative flex h-3 w-3 shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-status-success"></span>
          </div>
          <span class="text-sm font-medium text-text-secondary whitespace-nowrap transition-opacity duration-300"
                [class.opacity-0]="collapsed$ | async"
                [class.w-0]="collapsed$ | async">
            System Online
          </span>
        </div>
      </div>
    </aside>
  `, styles: ["/* angular:styles/component:css;eeb02cbcad6c24f4281be203df5d140cfeab562ad6bbaf080880eb934c0418f6;C:/Users/IKYY/Downloads/HEAVY-TOOLS/src/app/layout/sidebar/sidebar.component.ts */\n.scrollbar-thin::-webkit-scrollbar {\n  width: 4px;\n}\n.scrollbar-thin::-webkit-scrollbar-track {\n  background: transparent;\n}\n.scrollbar-thin::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.08);\n  border-radius: 4px;\n}\n.scrollbar-thin::-webkit-scrollbar-thumb:hover {\n  background: rgba(255, 255, 255, 0.15);\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(-4px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=sidebar.component.css.map */\n"] }]
  }], null, { toggleCollapse: [{ type: Output, args: ["toggleCollapse"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SidebarComponent, { className: "SidebarComponent", filePath: "src/app/layout/sidebar/sidebar.component.ts", lineNumber: 332 });
})();

// src/app/layout/navbar/navbar.component.ts
var NavbarComponent = class _NavbarComponent {
  store = inject(Store);
  system$ = this.store.select(selectSystem);
  static \u0275fac = function NavbarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NavbarComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NavbarComponent, selectors: [["app-navbar"]], decls: 26, vars: 11, consts: [[1, "h-16", "glass-panel", "border-b", "border-white/10", "flex", "items-center", "justify-between", "px-6", "sticky", "top-0", "z-50", "transition-all", "duration-300"], [1, "flex", "items-center", "gap-4", "flex-1", "max-w-md"], [1, "relative", "w-full", "group"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-text-muted", "group-focus-within:text-accent-cyan", "transition-colors"], ["type", "text", "placeholder", "Search tools, tasks, files...", 1, "w-full", "bg-bg-elevated/50", "border", "border-white/10", "rounded-xl", "py-2", "pl-10", "pr-4", "text-sm", "text-text-primary", "placeholder-text-muted", "focus:outline-none", "focus:border-accent-cyan/50", "focus:ring-1", "focus:ring-accent-cyan/50", "transition-all", "duration-300"], [1, "flex", "items-center", "gap-4"], [1, "hidden", "md:flex", "items-center", "gap-2", "px-3", "py-1.5", "rounded-full", "bg-white/5", "border", "border-white/10"], [1, "w-2", "h-2", "rounded-full"], [1, "text-xs", "font-medium", "text-text-secondary"], [1, "relative", "w-10", "h-10", "rounded-xl", "flex", "items-center", "justify-center", "hover:bg-white/10", "transition-colors", "text-text-secondary", "hover:text-white"], [1, "absolute", "top-2", "right-2", "w-2", "h-2", "rounded-full", "bg-accent-pink", "animate-pulse"], [1, "flex", "items-center", "gap-3", "pl-4", "border-l", "border-white/10"], [1, "w-8", "h-8", "rounded-full", "bg-gradient-to-tr", "from-accent-purple", "to-accent-cyan", "flex", "items-center", "justify-center", "text-sm", "font-bold", "shadow-glow"], [1, "hidden", "md:flex", "flex-col"], [1, "text-sm", "font-medium", "leading-none"], [1, "text-[10px]", "text-text-muted", "uppercase", "tracking-wider", "mt-1"]], template: function NavbarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 0)(1, "div", 1)(2, "div", 2)(3, "mat-icon", 3);
      \u0275\u0275text(4, "search");
      \u0275\u0275elementEnd();
      \u0275\u0275element(5, "input", 4);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 5)(7, "div", 6);
      \u0275\u0275element(8, "span", 7);
      \u0275\u0275pipe(9, "async");
      \u0275\u0275pipe(10, "async");
      \u0275\u0275elementStart(11, "span", 8);
      \u0275\u0275text(12);
      \u0275\u0275pipe(13, "async");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(14, "button", 9)(15, "mat-icon");
      \u0275\u0275text(16, "notifications");
      \u0275\u0275elementEnd();
      \u0275\u0275element(17, "span", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 11)(19, "div", 12);
      \u0275\u0275text(20, " K ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "div", 13)(22, "span", 14);
      \u0275\u0275text(23, "Kapten");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "span", 15);
      \u0275\u0275text(25, "Admin");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      let tmp_0_0;
      let tmp_1_0;
      let tmp_2_0;
      \u0275\u0275advance(8);
      \u0275\u0275classProp("bg-status-success", ((tmp_0_0 = \u0275\u0275pipeBind1(9, 5, ctx.system$)) == null ? null : tmp_0_0.networkStatus) === "online")("bg-status-error", ((tmp_1_0 = \u0275\u0275pipeBind1(10, 7, ctx.system$)) == null ? null : tmp_1_0.networkStatus) === "offline");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" ", ((tmp_2_0 = \u0275\u0275pipeBind1(13, 9, ctx.system$)) == null ? null : tmp_2_0.networkStatus) === "online" ? "Connected" : "Offline", " ");
    }
  }, dependencies: [CommonModule, MatIconModule, MatIcon, AsyncPipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavbarComponent, [{
    type: Component,
    args: [{
      selector: "app-navbar",
      standalone: true,
      imports: [CommonModule, MatIconModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <header class="h-16 glass-panel border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-50 transition-all duration-300">
      
      <!-- Search Bar -->
      <div class="flex items-center gap-4 flex-1 max-w-md">
        <div class="relative w-full group">
          <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-cyan transition-colors">search</mat-icon>
          <input type="text" placeholder="Search tools, tasks, files..." 
                 class="w-full bg-bg-elevated/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/50 transition-all duration-300">
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <!-- Status Badge -->
        <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <span class="w-2 h-2 rounded-full" 
                [class.bg-status-success]="(system$ | async)?.networkStatus === 'online'"
                [class.bg-status-error]="(system$ | async)?.networkStatus === 'offline'"></span>
          <span class="text-xs font-medium text-text-secondary">
            {{ (system$ | async)?.networkStatus === 'online' ? 'Connected' : 'Offline' }}
          </span>
        </div>

        <!-- Notifications -->
        <button class="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors text-text-secondary hover:text-white">
          <mat-icon>notifications</mat-icon>
          <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-pink animate-pulse"></span>
        </button>

        <!-- Profile -->
        <div class="flex items-center gap-3 pl-4 border-l border-white/10">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center text-sm font-bold shadow-glow">
            K
          </div>
          <div class="hidden md:flex flex-col">
            <span class="text-sm font-medium leading-none">Kapten</span>
            <span class="text-[10px] text-text-muted uppercase tracking-wider mt-1">Admin</span>
          </div>
        </div>
      </div>
    </header>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NavbarComponent, { className: "NavbarComponent", filePath: "src/app/layout/navbar/navbar.component.ts", lineNumber: 56 });
})();

// src/app/layout/shell/shell.component.ts
var ShellComponent = class _ShellComponent {
  sidebarCollapsed = signal(false, ...ngDevMode ? [{ debugName: "sidebarCollapsed" }] : (
    /* istanbul ignore next */
    []
  ));
  toggleSidebar() {
    this.sidebarCollapsed.update((v) => !v);
  }
  static \u0275fac = function ShellComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ShellComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ShellComponent, selectors: [["app-shell"]], decls: 6, vars: 0, consts: [[1, "shell-layout", "flex", "h-screen", "w-full", "overflow-hidden", "bg-bg", "text-text-primary"], [1, "z-40", 3, "toggleCollapse"], [1, "content-area", "flex-1", "flex", "flex-col", "relative", "overflow-hidden", "transition-all", "duration-400", "ease-[cubic-bezier(0.16,1,0.3,1)]"], [1, "z-30"], [1, "page-content", "flex-1", "overflow-y-auto", "overflow-x-hidden", "p-4", "md:p-8"]], template: function ShellComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "app-sidebar", 1);
      \u0275\u0275listener("toggleCollapse", function ShellComponent_Template_app_sidebar_toggleCollapse_1_listener() {
        return ctx.toggleSidebar();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "main", 2);
      \u0275\u0275element(3, "app-navbar", 3);
      \u0275\u0275elementStart(4, "div", 4);
      \u0275\u0275element(5, "router-outlet");
      \u0275\u0275elementEnd()()();
    }
  }, dependencies: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ShellComponent, [{
    type: Component,
    args: [{
      selector: "app-shell",
      standalone: true,
      imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `
    <div class="shell-layout flex h-screen w-full overflow-hidden bg-bg text-text-primary">
      <app-sidebar (toggleCollapse)="toggleSidebar()" class="z-40" />
      <main class="content-area flex-1 flex flex-col relative overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <app-navbar class="z-30" />
        <div class="page-content flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          <router-outlet />
        </div>
      </main>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ShellComponent, { className: "ShellComponent", filePath: "src/app/layout/shell/shell.component.ts", lineNumber: 24 });
})();
export {
  ShellComponent
};
//# sourceMappingURL=chunk-7OJGM7FS.js.map
