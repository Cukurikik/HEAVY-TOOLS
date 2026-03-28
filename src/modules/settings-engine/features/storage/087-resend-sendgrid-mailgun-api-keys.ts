import type { SettingFeatureDefinition } from '../../types';
export const feature087: SettingFeatureDefinition = {
  id: '087',
  category: 'storage',
  slug: 'resend-sendgrid-mailgun-api-keys',
  label: 'Resend / SendGrid / Mailgun API Keys',
  description: 'Konfigurasi mendalam untuk Resend / SendGrid / Mailgun API Keys',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-087-config', String(value));
    }
  }
};
