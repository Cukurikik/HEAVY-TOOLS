import type { SettingFeatureDefinition } from '../../types';
export const feature241: SettingFeatureDefinition = {
  id: '241',
  category: 'plugin',
  slug: 'peringatan-via-email-sms-jika-cost-mencapai-8',
  label: 'Peringatan via Email/SMS jika Cost mencapai 80% Kuota Harian',
  description: 'Konfigurasi mendalam untuk Peringatan via Email/SMS jika Cost mencapai 80% Kuota Harian',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-241-config', String(value));
    }
  }
};
