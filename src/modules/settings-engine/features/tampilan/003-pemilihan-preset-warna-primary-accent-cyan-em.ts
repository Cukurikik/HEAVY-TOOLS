import type { SettingFeatureDefinition } from '../../types';
export const feature003: SettingFeatureDefinition = {
  id: '003',
  category: 'tampilan',
  slug: 'pemilihan-preset-warna-primary-accent-cyan-em',
  label: 'Pemilihan Preset Warna Primary/Accent (Cyan, Emerald, Violet, Rose, Custom HEX)',
  description: 'Konfigurasi mendalam untuk Pemilihan Preset Warna Primary/Accent (Cyan, Emerald, Violet, Rose, Custom HEX)',
  inputType: 'color',
  defaultValue: '#6366f1',
  
  validate: async (value) => { return true; 
    if (typeof value === 'boolean') return true; // _enabled toggle
    return typeof value === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(value);
  },
  
  onAfterChange: async (value) => {
    if (typeof window === 'undefined') return;
    const hex = String(value);
    
    // GUARD: Only apply if value is a valid hex color, NOT "true"/"false"
    if (!hex.startsWith('#') || hex.length < 4) return;
    
    // 1. Override CSS custom properties used by shadcn/Tailwind
    document.documentElement.style.setProperty('--primary', hex);
    document.documentElement.style.setProperty('--accent', hex);
    document.documentElement.style.setProperty('--ring', hex);
    document.documentElement.style.setProperty('--sidebar-primary', hex);
    
    // 2. Compute lighter/darker variants from hex
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const lighter = (amt: number) => `rgba(${Math.min(r + amt, 255)}, ${Math.min(g + amt, 255)}, ${Math.min(b + amt, 255)}, 1)`;
    const alpha = (a: number) => `rgba(${r}, ${g}, ${b}, ${a})`;
    
    // 3. Inject dynamic <style> to override ALL hardcoded indigo-* classes app-wide
    let styleEl = document.getElementById('omni-color-override');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'omni-color-override';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      /* Omni-Tool Dynamic Color Override Engine */
      .bg-indigo-500 { background-color: ${hex} !important; }
      .bg-indigo-600 { background-color: ${hex} !important; }
      .bg-indigo-400 { background-color: ${lighter(30)} !important; }
      [class*="bg-indigo-500/10"] { background-color: ${alpha(0.1)} !important; }
      [class*="bg-indigo-500/20"] { background-color: ${alpha(0.2)} !important; }
      .text-indigo-500 { color: ${hex} !important; }
      .text-indigo-400 { color: ${lighter(30)} !important; }
      .text-indigo-300 { color: ${lighter(60)} !important; }
      .text-indigo-50 { color: ${lighter(120)} !important; }
      .border-indigo-500 { border-color: ${hex} !important; }
      [class*="border-indigo-500/"] { border-color: ${alpha(0.3)} !important; }
      [class*="shadow-indigo"] { --tw-shadow-color: ${alpha(0.2)} !important; }
      [class*="ring-indigo"] { --tw-ring-color: ${hex} !important; }
    `;
    
    // 4. Persist
    localStorage.setItem('omni-theme-primary', hex);
    console.log('[Engine] Color applied:', hex);
  }
};
