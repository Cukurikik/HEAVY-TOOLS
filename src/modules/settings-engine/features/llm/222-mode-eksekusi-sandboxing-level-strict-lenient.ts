import type { SettingFeatureDefinition } from '../../types';
export const feature222: SettingFeatureDefinition = {
  id: '222',
  category: 'llm',
  slug: 'mode-eksekusi-sandboxing-level-strict-lenient',
  label: 'Mode Eksekusi Sandboxing Level (Strict, Lenient, Native)',
  description: 'Konfigurasi mendalam untuk Mode Eksekusi Sandboxing Level (Strict, Lenient, Native)',
  inputType: 'slider',
  options: {min: 0, max: 100, step: 1},
  defaultValue: 50,
  
  validate: async (value) => { return true; 
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-222-level', String(value));
      localStorage.setItem('omni-slider-222', String(value));
    }
  }
};
