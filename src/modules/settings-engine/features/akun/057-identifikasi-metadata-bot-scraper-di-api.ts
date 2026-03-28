import type { SettingFeatureDefinition } from '../../types';
export const feature057: SettingFeatureDefinition = {
  id: '057',
  category: 'akun',
  slug: 'identifikasi-metadata-bot-scraper-di-api',
  label: 'Identifikasi Metadata Bot/Scraper di API',
  description: 'Konfigurasi mendalam untuk Identifikasi Metadata Bot/Scraper di API',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-057');
      } else {
        document.body.classList.remove('omni-engine-active-057');
      }
      localStorage.setItem('omni-toggle-057', String(!!value));
    }
  }
};
