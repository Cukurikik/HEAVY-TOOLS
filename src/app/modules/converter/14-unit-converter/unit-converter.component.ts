// ============================================================
// FEATURE 14 — UNIT CONVERTER — Component (FULLY FUNCTIONAL)
// Route: /converter/unit-converter
// Complete unit conversion with 8 categories and 60+ unit types
// ============================================================
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UnitConverterActions, selectUnitConverterState } from './unit-converter.store';

// ============================================================
// UNIT CONVERSION ENGINE
// ============================================================
interface UnitDef { label: string; factor: number; offset?: number; }
interface CategoryDef { label: string; icon: string; units: Record<string, UnitDef>; }

const CATEGORIES: Record<string, CategoryDef> = {
  length: {
    label: 'Length', icon: '📏',
    units: {
      mm: { label: 'Millimeter (mm)', factor: 0.001 },
      cm: { label: 'Centimeter (cm)', factor: 0.01 },
      m:  { label: 'Meter (m)',       factor: 1 },
      km: { label: 'Kilometer (km)', factor: 1000 },
      in: { label: 'Inch (in)',      factor: 0.0254 },
      ft: { label: 'Foot (ft)',      factor: 0.3048 },
      yd: { label: 'Yard (yd)',      factor: 0.9144 },
      mi: { label: 'Mile (mi)',      factor: 1609.344 },
      nm: { label: 'Nautical Mile',  factor: 1852 },
      µm: { label: 'Micrometer (µm)',factor: 0.000001 },
    }
  },
  weight: {
    label: 'Weight', icon: '⚖️',
    units: {
      mg:  { label: 'Milligram (mg)', factor: 0.001 },
      g:   { label: 'Gram (g)',       factor: 1 },
      kg:  { label: 'Kilogram (kg)', factor: 1000 },
      t:   { label: 'Tonne (t)',     factor: 1_000_000 },
      oz:  { label: 'Ounce (oz)',    factor: 28.3495 },
      lb:  { label: 'Pound (lb)',    factor: 453.592 },
      st:  { label: 'Stone (st)',    factor: 6350.29 },
    }
  },
  temperature: {
    label: 'Temperature', icon: '🌡️',
    units: {
      c: { label: 'Celsius (°C)',    factor: 1, offset: 0 },
      f: { label: 'Fahrenheit (°F)', factor: 1, offset: 0 },
      k: { label: 'Kelvin (K)',      factor: 1, offset: 0 },
    }
  },
  area: {
    label: 'Area', icon: '📐',
    units: {
      mm2: { label: 'Square Millimeter',  factor: 0.000001 },
      cm2: { label: 'Square Centimeter',  factor: 0.0001 },
      m2:  { label: 'Square Meter',       factor: 1 },
      km2: { label: 'Square Kilometer',   factor: 1_000_000 },
      in2: { label: 'Square Inch',        factor: 0.00064516 },
      ft2: { label: 'Square Foot',        factor: 0.092903 },
      ac:  { label: 'Acre',               factor: 4046.86 },
      ha:  { label: 'Hectare',            factor: 10000 },
    }
  },
  volume: {
    label: 'Volume', icon: '🧊',
    units: {
      ml:    { label: 'Milliliter (mL)', factor: 0.001 },
      l:     { label: 'Liter (L)',       factor: 1 },
      m3:    { label: 'Cubic Meter',     factor: 1000 },
      gal:   { label: 'Gallon (US)',     factor: 3.78541 },
      qt:    { label: 'Quart (US)',      factor: 0.946353 },
      pt:    { label: 'Pint (US)',       factor: 0.473176 },
      cup:   { label: 'Cup (US)',        factor: 0.236588 },
      floz:  { label: 'Fluid Oz (US)',   factor: 0.0295735 },
      tbsp:  { label: 'Tablespoon',      factor: 0.0147868 },
      tsp:   { label: 'Teaspoon',        factor: 0.00492892 },
    }
  },
  speed: {
    label: 'Speed', icon: '💨',
    units: {
      mps:  { label: 'Meter/s (m/s)',      factor: 1 },
      kmh:  { label: 'Kilometer/h (km/h)', factor: 0.277778 },
      mph:  { label: 'Mile/h (mph)',        factor: 0.44704 },
      knot: { label: 'Knot (kn)',           factor: 0.514444 },
      fps:  { label: 'Feet/s (ft/s)',       factor: 0.3048 },
      mach: { label: 'Mach',               factor: 343 },
    }
  },
  data: {
    label: 'Data', icon: '💾',
    units: {
      bit:  { label: 'Bit',       factor: 1 },
      byte: { label: 'Byte',      factor: 8 },
      kb:   { label: 'Kilobyte',  factor: 8192 },
      mb:   { label: 'Megabyte',  factor: 8_388_608 },
      gb:   { label: 'Gigabyte',  factor: 8_589_934_592 },
      tb:   { label: 'Terabyte',  factor: 8_796_093_022_208 },
      kib:  { label: 'Kibibyte',  factor: 8192 },
      mib:  { label: 'Mebibyte',  factor: 8_388_608 },
      gib:  { label: 'Gibibyte',  factor: 8_589_934_592 },
    }
  },
  time: {
    label: 'Time', icon: '⏰',
    units: {
      ms:    { label: 'Millisecond', factor: 0.001 },
      s:     { label: 'Second',      factor: 1 },
      min:   { label: 'Minute',      factor: 60 },
      hr:    { label: 'Hour',        factor: 3600 },
      day:   { label: 'Day',         factor: 86400 },
      week:  { label: 'Week',        factor: 604800 },
      month: { label: 'Month (30d)', factor: 2_592_000 },
      year:  { label: 'Year (365d)', factor: 31_536_000 },
    }
  },
};

/** Temperature is special — not simple factor multiplication */
function convertTemperature(value: number, from: string, to: string): number {
  // Convert to Celsius first
  let celsius: number;
  switch (from) {
    case 'f': celsius = (value - 32) * 5 / 9; break;
    case 'k': celsius = value - 273.15; break;
    default: celsius = value;
  }
  // Convert from Celsius to target
  switch (to) {
    case 'f': return celsius * 9 / 5 + 32;
    case 'k': return celsius + 273.15;
    default: return celsius;
  }
}

function convertUnit(value: number, fromUnit: string, toUnit: string, category: string): number {
  if (category === 'temperature') {
    return convertTemperature(value, fromUnit, toUnit);
  }
  const cat = CATEGORIES[category];
  if (!cat) return NaN;
  const from = cat.units[fromUnit];
  const to = cat.units[toUnit];
  if (!from || !to) return NaN;
  // Convert: value × from.factor → base unit → ÷ to.factor
  return (value * from.factor) / to.factor;
}

function formatNumber(n: number): string {
  if (Math.abs(n) < 0.0001 && n !== 0) return n.toExponential(6);
  if (Math.abs(n) >= 1_000_000) return n.toExponential(6);
  return parseFloat(n.toPrecision(10)).toString();
}

// ============================================================
// COMPONENT
// ============================================================
@Component({
  selector: 'app-unit-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0a0a0f] p-6 space-y-6">
      <header class="space-y-1">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          📏 Unit Converter
        </h1>
        <p class="text-white/50 text-sm">Convert between 60+ units across 8 categories — real-time results</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- LEFT: Category + Input -->
        <div class="space-y-4">
          <!-- Category Selector -->
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">Category</span>
            <div class="grid grid-cols-4 gap-2">
              @for (cat of categoryList; track cat.key) {
                <button (click)="selectCategory(cat.key)"
                  [class]="selectedCategory() === cat.key
                    ? 'p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-center transition-all'
                    : 'p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-center hover:bg-white/10 transition-all'">
                  <span class="text-lg block">{{ cat.icon }}</span>
                  <span class="text-[10px] block mt-1">{{ cat.label }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Value Input -->
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">Input Value</span>
            <input type="number" [value]="inputValue()"
              (input)="onValueChange(+($any($event.target)).value)"
              placeholder="Enter value..."
              class="w-full px-3 py-3 text-lg bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-400 font-mono" />
          </div>

          <!-- From Unit -->
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">From Unit</span>
            <select [value]="fromUnit()" (change)="fromUnit.set(($any($event.target)).value); doConvert()"
              class="w-full px-3 py-3 text-sm bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-cyan-400 appearance-none">
              @for (unit of currentUnits(); track unit.key) {
                <option [value]="unit.key" class="bg-[#1a1a2e]">{{ unit.label }}</option>
              }
            </select>
          </div>

          <!-- Swap Button -->
          <button (click)="swapUnits()"
            class="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all text-sm font-medium">
            🔄 Swap Units
          </button>
        </div>

        <!-- RIGHT: Results -->
        <div class="space-y-4">
          <!-- All conversions at once -->
          @if (allResults().length > 0) {
            <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <span class="text-xs text-white/40 uppercase tracking-wider font-semibold block">All Conversions</span>
              <div class="space-y-2">
                @for (result of allResults(); track result.unit) {
                  <div class="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                       (click)="copyValue(result.display)">
                    <div>
                      <span class="text-sm text-white font-mono">{{ result.display }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-white/40">{{ result.label }}</span>
                      <span class="text-xs text-cyan-400/50">📋</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Copied Toast -->
          @if (showCopied()) {
            <div class="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
              ✅ Copied to clipboard!
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class UnitConverterComponent implements OnDestroy {
  private store = inject(Store);
  state$ = this.store.select(selectUnitConverterState);

  // Local signals
  readonly selectedCategory = signal('length');
  readonly inputValue = signal(1);
  readonly fromUnit = signal('m');
  readonly showCopied = signal(false);
  readonly allResults = signal<Array<{unit: string; label: string; value: number; display: string}>>([]);

  // Derived data
  readonly categoryList = Object.entries(CATEGORIES).map(([key, cat]) => ({
    key, label: cat.label, icon: cat.icon
  }));

  readonly currentUnits = computed(() => {
    const cat = CATEGORIES[this.selectedCategory()];
    if (!cat) return [];
    return Object.entries(cat.units).map(([key, def]) => ({ key, label: def.label }));
  });

  constructor() {
    // Initial conversion
    this.doConvert();
  }

  selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
    const catDef = CATEGORIES[cat];
    if (catDef) {
      const firstUnit = Object.keys(catDef.units)[0];
      this.fromUnit.set(firstUnit);
    }
    this.doConvert();
  }

  onValueChange(value: number): void {
    this.inputValue.set(value);
    this.doConvert();
  }

  swapUnits(): void {
    // Pick the second unit and make it the source
    const results = this.allResults();
    if (results.length > 1) {
      const secondUnit = results[1].unit;
      const secondValue = results[1].value;
      this.fromUnit.set(secondUnit);
      this.inputValue.set(parseFloat(secondValue.toPrecision(8)));
      this.doConvert();
    }
  }

  // ═══════════════════════════════════════════════════
  // CORE CONVERSION LOGIC — converts to ALL units at once
  // ═══════════════════════════════════════════════════
  doConvert(): void {
    const cat = this.selectedCategory();
    const catDef = CATEGORIES[cat];
    if (!catDef) return;

    const value = this.inputValue();
    const from = this.fromUnit();

    const results: Array<{unit: string; label: string; value: number; display: string}> = [];

    for (const [unitKey, unitDef] of Object.entries(catDef.units)) {
      const converted = convertUnit(value, from, unitKey, cat);
      results.push({
        unit: unitKey,
        label: unitDef.label,
        value: converted,
        display: `${formatNumber(converted)} ${unitKey}`,
      });
    }

    this.allResults.set(results);

    // Sync with NgRx store
    const outputText = results.map(r => `${r.label}: ${r.display}`).join('\n');
    this.store.dispatch(UnitConverterActions.setInputText({ text: String(value) }));
  }

  async copyValue(value: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    this.showCopied.set(true);
    setTimeout(() => this.showCopied.set(false), 2000);
  }

  ngOnDestroy(): void {
    this.store.dispatch(UnitConverterActions.resetState());
  }
}
