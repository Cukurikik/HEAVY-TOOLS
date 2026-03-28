import type { SettingFeatureDefinition } from '../../types';
export const feature220: SettingFeatureDefinition = {
  id: '220',
  category: 'llm',
  slug: 'laporan-crash-plugin-auto-submit',
  label: 'Laporan Crash Plugin (Auto-Submit)',
  description: 'Konfigurasi mendalam untuk Laporan Crash Plugin (Auto-Submit)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-220');
      } else {
        document.body.classList.remove('omni-engine-active-220');
      }
      localStorage.setItem('omni-toggle-220', String(!!value));
    }
  }
};
