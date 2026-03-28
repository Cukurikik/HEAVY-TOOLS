import type { SettingFeatureDefinition } from '../../types';
export const feature098: SettingFeatureDefinition = {
  id: '098',
  category: 'storage',
  slug: 'serpapi-browserless-api-untuk-fitur-web-scrap',
  label: 'SerpAPI / Browserless API (Untuk fitur Web Scraping)',
  description: 'Konfigurasi mendalam untuk SerpAPI / Browserless API (Untuk fitur Web Scraping)',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-098');
      } else {
        document.body.classList.remove('omni-engine-active-098');
      }
      localStorage.setItem('omni-toggle-098', String(!!value));
    }
  }
};
