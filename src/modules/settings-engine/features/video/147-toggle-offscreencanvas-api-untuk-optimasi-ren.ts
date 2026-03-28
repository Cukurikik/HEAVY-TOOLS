import type { SettingFeatureDefinition } from '../../types';
export const feature147: SettingFeatureDefinition = {
  id: '147',
  category: 'video',
  slug: 'toggle-offscreencanvas-api-untuk-optimasi-ren',
  label: 'Toggle OffscreenCanvas API untuk optimasi render grafis',
  description: 'Konfigurasi mendalam untuk Toggle OffscreenCanvas API untuk optimasi render grafis',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-147');
      } else {
        document.body.classList.remove('omni-engine-active-147');
      }
      localStorage.setItem('omni-toggle-147', String(!!value));
    }
  }
};
