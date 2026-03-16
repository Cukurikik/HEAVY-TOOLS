// ============================================================
// FEATURE 13 — COLOR CONVERTER — Component (FULLY FUNCTIONAL)
// Route: /converter/color-converter
// Real-time color conversion between HEX, RGB, HSL, HSV, CMYK
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ColorConverterActions, selectColorConverterState } from './color-converter.store';

// ============================================================
// COLOR MATH ENGINE
// ============================================================
interface RGB { r: number; g: number; b: number; }
interface HSL { h: number; s: number; l: number; }
interface HSV { h: number; s: number; v: number; }
interface CMYK { c: number; m: number; y: number; k: number; }

/** Parse any color input string into normalized RGB */
function parseColorInput(input: string): RGB | null {
  const trimmed = input.trim().toLowerCase();

  // HEX: #RGB, #RRGGBB, RGB, RRGGBB
  const hexMatch = trimmed.match(/^#?([0-9a-f]{3,8})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    if (hex.length === 6 || hex.length === 8) {
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
      };
    }
  }

  // RGB: rgb(R, G, B) or R, G, B
  const rgbMatch = trimmed.match(/^(?:rgb\s*\(\s*)?(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*\)?$/);
  if (rgbMatch) {
    return {
      r: Math.min(255, parseInt(rgbMatch[1])),
      g: Math.min(255, parseInt(rgbMatch[2])),
      b: Math.min(255, parseInt(rgbMatch[3])),
    };
  }

  // HSL: hsl(H, S%, L%) or H, S%, L%
  const hslMatch = trimmed.match(/^(?:hsl\s*\(\s*)?(\d{1,3})\s*[,\s]\s*(\d{1,3})%?\s*[,\s]\s*(\d{1,3})%?\s*\)?$/);
  if (hslMatch) {
    const hsl: HSL = {
      h: parseInt(hslMatch[1]),
      s: parseInt(hslMatch[2]),
      l: parseInt(hslMatch[3]),
    };
    return hslToRgb(hsl);
  }

  // Named CSS colors (common subset)
  const namedColors: Record<string, string> = {
    red: '#ff0000', green: '#00ff00', blue: '#0000ff', white: '#ffffff', black: '#000000',
    yellow: '#ffff00', cyan: '#00ffff', magenta: '#ff00ff', orange: '#ffa500', pink: '#ffc0cb',
    purple: '#800080', gray: '#808080', grey: '#808080', navy: '#000080', teal: '#008080',
    maroon: '#800000', olive: '#808000', lime: '#00ff00', aqua: '#00ffff', coral: '#ff7f50',
    gold: '#ffd700', indigo: '#4b0082', violet: '#ee82ee', salmon: '#fa8072', turquoise: '#40e0d0',
  };
  if (namedColors[trimmed]) {
    return parseColorInput(namedColors[trimmed]);
  }

  return null;
}

function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360, s = hsl.s / 100, l = hsl.l / 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1/3) * 255),
  };
}

function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function rgbToCmyk(rgb: RGB): CMYK {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function generateAllFormats(rgb: RGB): string {
  const hex = rgbToHex(rgb);
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cmyk = rgbToCmyk(rgb);

  return [
    `═══ ALL COLOR FORMATS ═══`,
    ``,
    `HEX:  ${hex.toUpperCase()}`,
    `RGB:  rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    `HSL:  hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    `HSV:  hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    `CMYK: cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
    ``,
    `═══ CSS VALUES ═══`,
    ``,
    `color: ${hex};`,
    `color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b});`,
    `color: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%);`,
    ``,
    `═══ RAW VALUES ═══`,
    ``,
    `Red: ${rgb.r} (${(rgb.r/255*100).toFixed(1)}%)`,
    `Green: ${rgb.g} (${(rgb.g/255*100).toFixed(1)}%)`,
    `Blue: ${rgb.b} (${(rgb.b/255*100).toFixed(1)}%)`,
    ``,
    `Hue: ${hsl.h}°`,
    `Saturation (HSL): ${hsl.s}%`,
    `Lightness: ${hsl.l}%`,
    `Saturation (HSV): ${hsv.s}%`,
    `Value: ${hsv.v}%`,
  ].join('\n');
}

// ============================================================
// COMPONENT
// ============================================================
@Component({
  selector: 'app-color-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          🎨 Color Converter
        </h1>
        <p class="text-white/50 text-sm">Convert colors between HEX, RGB, HSL, HSV, CMYK — real-time preview</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Input -->
        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">Input Color</span>
            <p class="text-xs text-white/30">Supports: HEX (#FF0000), RGB (255,0,0), HSL (0,100%,50%), or color names (red)</p>
            <input type="text"
              [value]="inputText()"
              (input)="onInputChange(($any($event.target)).value)"
              placeholder="#FF5733 or rgb(255,87,51) or red"
              class="w-full px-3 py-3 text-lg bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 font-mono" />
          </div>

          <!-- Native Color Picker -->
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">Color Picker</span>
            <div class="flex items-center gap-4">
              <input type="color" [value]="hexValue()"
                (input)="onInputChange(($any($event.target)).value)"
                class="w-16 h-16 rounded-lg cursor-pointer border border-white/20" />
              <span class="text-white/60 text-sm">Click to pick a color from the native color picker</span>
            </div>
          </div>

          <!-- Quick Convert Button -->
          <button (click)="onProcess()"
            [disabled]="!inputText()"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                   bg-gradient-to-r from-cyan-500 to-blue-500 text-black disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]">
            🎨 Convert Color
          </button>

          @if (errorMessage()) {
            <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              ⚠️ {{ errorMessage() }}
            </div>
          }
        </div>

        <!-- RIGHT: Output -->
        <div class="space-y-4">
          <!-- Color Preview Swatch -->
          @if (parsedRgb()) {
            <div class="rounded-2xl overflow-hidden border border-white/10">
              <div class="h-32 w-full" [style.background-color]="hexValue()"></div>
              <div class="p-4 bg-[#12121a] space-y-2">
                <div class="grid grid-cols-2 gap-2 text-sm">
                  @for (format of formatOutputs(); track format.label) {
                    <div class="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                         tabindex="0" role="button"
                         (click)="copyValue(format.value)"
                         (keydown.enter)="copyValue(format.value)">
                      <span class="text-xs text-white/40 block">{{ format.label }}</span>
                      <span class="text-white font-mono text-sm">{{ format.value }}</span>
                      <span class="text-xs text-cyan-400/60 block mt-1">Click to copy</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          <!-- Full Output Text -->
          @if (outputText()) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">All Formats</span>
                <button (click)="onCopy()" class="text-xs text-cyan-400 hover:text-cyan-300">📋 Copy All</button>
              </div>
              <pre class="text-sm text-white/80 font-mono whitespace-pre-wrap break-all bg-white/5 p-3 rounded-lg max-h-80 overflow-auto">{{ outputText() }}</pre>
            </div>
          }

          <!-- Copied Toast -->
          @if (showCopied()) {
            <div class="fixed bottom-8 right-8 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm animate-pulse">
              ✅ Copied to clipboard!
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ColorConverterComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectColorConverterState);

  // Local signals for real-time conversion
  readonly inputText = signal('');
  readonly parsedRgb = signal<RGB | null>(null);
  readonly hexValue = signal('#000000');
  readonly outputText = signal('');
  readonly errorMessage = signal<string | null>(null);
  readonly formatOutputs = signal<{label: string; value: string}[]>([]);
  readonly showCopied = signal(false);

  // ═══════════════════════════════════════════════════
  // INPUT HANDLER — Real-time conversion on every keystroke
  // ═══════════════════════════════════════════════════
  onInputChange(value: string): void {
    this.inputText.set(value);
    this.errorMessage.set(null);
    this.store.dispatch(ColorConverterActions.setInputText({ text: value }));

    if (!value.trim()) {
      this.parsedRgb.set(null);
      this.outputText.set('');
      this.formatOutputs.set([]);
      return;
    }

    const rgb = parseColorInput(value);
    if (!rgb) {
      this.errorMessage.set('Cannot parse color. Try: #FF5733, rgb(255,87,51), hsl(11,100%,50%), or "red"');
      return;
    }

    this.parsedRgb.set(rgb);
    this.hexValue.set(rgbToHex(rgb));

    // Generate all format outputs
    const hsl = rgbToHsl(rgb);
    const hsv = rgbToHsv(rgb);
    const cmyk = rgbToCmyk(rgb);

    this.formatOutputs.set([
      { label: 'HEX', value: rgbToHex(rgb).toUpperCase() },
      { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
      { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
      { label: 'HSV', value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
      { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
      { label: 'CSS', value: `color: ${rgbToHex(rgb)};` },
    ]);

    this.outputText.set(generateAllFormats(rgb));
  }

  // ═══════════════════════════════════════════════════
  // PROCESS — Same as real-time but ensures state is synced
  // ═══════════════════════════════════════════════════
  onProcess(): void {
    this.onInputChange(this.inputText());
    if (this.outputText()) {
      this.store.dispatch(ColorConverterActions.startProcessing());
      // Immediately mark as done since conversion is synchronous
      const outputBlob = new Blob([this.outputText()], { type: 'text/plain' });
      this.store.dispatch(ColorConverterActions.processingSuccess({
        outputBlob,
        outputText: this.outputText(),
        outputSizeMB: outputBlob.size / 1_048_576,
      }));
    }
  }

  // ═══════════════════════════════════════════════════
  // COPY TO CLIPBOARD
  // ═══════════════════════════════════════════════════
  async copyValue(value: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      this.showCopied.set(true);
      setTimeout(() => this.showCopied.set(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.showCopied.set(true);
      setTimeout(() => this.showCopied.set(false), 2000);
    }
  }

  onCopy(): void {
    this.copyValue(this.outputText());
  }

  ngOnDestroy(): void {
    this.store.dispatch(ColorConverterActions.resetState());
  }
}
