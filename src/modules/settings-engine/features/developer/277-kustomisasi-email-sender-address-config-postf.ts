import type { SettingFeatureDefinition } from '../../types';
export const feature277: SettingFeatureDefinition = {
  id: '277',
  category: 'developer',
  slug: 'kustomisasi-email-sender-address-config-postf',
  label: 'Kustomisasi Email Sender Address (Config Postfix / SMTP Master)',
  description: 'Konfigurasi mendalam untuk Kustomisasi Email Sender Address (Config Postfix / SMTP Master)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-277-config', String(value));
    }
  }
};
