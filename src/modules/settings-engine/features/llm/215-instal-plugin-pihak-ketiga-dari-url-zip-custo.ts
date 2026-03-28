import type { SettingFeatureDefinition } from '../../types';
export const feature215: SettingFeatureDefinition = {
  id: '215',
  category: 'llm',
  slug: 'instal-plugin-pihak-ketiga-dari-url-zip-custo',
  label: 'Instal Plugin Pihak Ketiga dari URL `.zip` custom (Unverified Sources)',
  description: 'Konfigurasi mendalam untuk Instal Plugin Pihak Ketiga dari URL `.zip` custom (Unverified Sources)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-215-config', String(value));
    }
  }
};
