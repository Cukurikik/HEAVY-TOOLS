import type { SettingFeatureDefinition } from '../../types';
export const feature103: SettingFeatureDefinition = {
  id: '103',
  category: 'notifikasi',
  slug: 'wordpress-rest-api-application-password-auto',
  label: 'WordPress REST API / Application Password (Auto post artikel hasil LLM ke WP)',
  description: 'Konfigurasi mendalam untuk WordPress REST API / Application Password (Auto post artikel hasil LLM ke WP)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-103-config', String(value));
    }
  }
};
