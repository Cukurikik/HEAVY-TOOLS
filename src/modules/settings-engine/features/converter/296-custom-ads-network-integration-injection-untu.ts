import type { SettingFeatureDefinition } from '../../types';
export const feature296: SettingFeatureDefinition = {
  id: '296',
  category: 'converter',
  slug: 'custom-ads-network-integration-injection-untu',
  label: 'Custom Ads Network Integration Injection (Untuk monetisasi free-tier user lokal)',
  description: 'Konfigurasi mendalam untuk Custom Ads Network Integration Injection (Untuk monetisasi free-tier user lokal)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-296-config', String(value));
    }
  }
};
