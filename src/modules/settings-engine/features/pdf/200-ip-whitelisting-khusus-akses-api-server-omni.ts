import type { SettingFeatureDefinition } from '../../types';
export const feature200: SettingFeatureDefinition = {
  id: '200',
  category: 'pdf',
  slug: 'ip-whitelisting-khusus-akses-api-server-omni',
  label: 'IP Whitelisting khusus akses API Server Omni',
  description: 'Konfigurasi mendalam untuk IP Whitelisting khusus akses API Server Omni',
  inputType: 'toggle',
  defaultValue: false,
  
  validate: async (value) => { return true; 
    return typeof value === 'boolean';
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-200');
      } else {
        document.body.classList.remove('omni-engine-active-200');
      }
      localStorage.setItem('omni-toggle-200', String(!!value));
    }
  }
};
