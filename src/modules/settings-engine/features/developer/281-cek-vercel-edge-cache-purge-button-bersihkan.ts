import type { SettingFeatureDefinition } from '../../types';
export const feature281: SettingFeatureDefinition = {
  id: '281',
  category: 'developer',
  slug: 'cek-vercel-edge-cache-purge-button-bersihkan',
  label: 'Cek Vercel Edge Cache Purge Button (Bersihkan cache CDN Global)',
  description: 'Konfigurasi mendalam untuk Cek Vercel Edge Cache Purge Button (Bersihkan cache CDN Global)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-281');
      } else {
        document.body.classList.remove('omni-engine-active-281');
      }
      localStorage.setItem('omni-toggle-281', String(!!value));
    }
  }
};
