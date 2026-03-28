import type { SettingFeatureDefinition } from '../../types';
export const feature002: SettingFeatureDefinition = {
  id: '002',
  category: 'tampilan',
  slug: 'custom-css-injection-bisa-memasukkan-snippet',
  label: 'Custom CSS Injection (Bisa memasukkan snippet CSS sendiri)',
  description: 'Konfigurasi mendalam untuk Custom CSS Injection (Bisa memasukkan snippet CSS sendiri)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      let styleEl = document.getElementById('omni-custom-css');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'omni-custom-css';
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = String(value);
      localStorage.setItem('omni-custom-css', String(value));
    }
  }
};
